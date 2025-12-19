import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import type { Order, Store } from "@/types";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import Link from "next/link";

interface PageProps {
    searchParams: Promise<{ from?: string; tab?: string; newStore?: string }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
    const supabase = await createClient();
    const params = await searchParams;
    const cookieStore = await cookies();

    // Check authentication
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        redirect("/login");
    }

    // If coming from new store creation, try to load store directly from cookie first
    const isNewStore = params.newStore === "true";
    const cookieStoreId = cookieStore.get("current_store_id")?.value;

    // Get user's store memberships
    const { data: storeMemberships, error: membershipError } = await supabase
        .from("store_members")
        .select("store_id, role")
        .eq("user_id", user.id);

    // If new store and we have a cookie, try direct load even if membership query fails
    if (isNewStore && cookieStoreId) {
        const { data: directStore } = await supabase
            .from("stores")
            .select("*")
            .eq("id", cookieStoreId)
            .single();

        if (directStore) {
            // Store loaded successfully, continue with this store
            const currentStore = directStore as Store;
            const userStores = [{ ...currentStore, role: "owner" as const }];

            // Fetch orders for this store
            const { data: orders } = await supabase
                .from("orders")
                .select("*")
                .eq("store_id", currentStore.id)
                .order("created_at", { ascending: false });

            const allOrders = (orders as Order[]) || [];
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayOrders = allOrders.filter((order) => new Date(order.created_at) >= today);

            const stats = {
                totalOrders: allOrders.length,
                todayOrders: todayOrders.length,
                totalRevenue: allOrders.reduce((sum, order) => sum + Number(order.total_price), 0),
                todayRevenue: todayOrders.reduce((sum, order) => sum + Number(order.total_price), 0),
            };

            return (
                <DashboardClient
                    currentStore={currentStore}
                    currentRole="owner"
                    stores={userStores}
                    orders={allOrders}
                    stats={stats}
                />
            );
        }
    }

    // If no memberships - redirect to onboarding with loop protection
    if (membershipError || !storeMemberships || storeMemberships.length === 0) {
        if (params.from === "onboarding" || isNewStore) {
            // We came from onboarding, don't redirect back - show a helpful page
            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
                    <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-6">
                            <span className="text-3xl">⚠️</span>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-4">
                            Problème de chargement
                        </h1>
                        <p className="text-slate-600 mb-6">
                            Impossible de charger vos boutiques. Cela peut être un problème temporaire.
                        </p>
                        <div className="flex flex-col gap-3">
                            <Link
                                href="/dashboard"
                                className="inline-block px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                            >
                                Réessayer
                            </Link>
                            <Link
                                href="/onboarding"
                                className="inline-block px-6 py-3 bg-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-300 transition-colors"
                            >
                                Créer une boutique
                            </Link>
                        </div>
                    </div>
                </div>
            );
        }
        // Normal redirect to onboarding with source tracking
        redirect("/onboarding?from=dashboard");
    }

    // Get all store IDs
    const storeIds = storeMemberships.map((m) => m.store_id);

    // Fetch stores separately to avoid join issues
    const { data: storesData, error: storesError } = await supabase
        .from("stores")
        .select("*")
        .in("id", storeIds);

    // If we have memberships but can't load stores, show error page
    if (storesError || !storesData || storesData.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-6">
                        <span className="text-3xl">⚠️</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-4">
                        Erreur de chargement
                    </h1>
                    <p className="text-slate-600 mb-6">
                        Impossible de charger vos boutiques. Veuillez réessayer.
                    </p>
                    <a
                        href="/dashboard"
                        className="inline-block px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                    >
                        Réessayer
                    </a>
                </div>
            </div>
        );
    }

    // Build stores with roles
    const validMemberships = storeMemberships.map((m) => {
        const store = storesData.find((s) => s.id === m.store_id);
        return store ? { ...store, role: m.role as "owner" | "admin" | "editor" } : null;
    }).filter((s) => s !== null) as (Store & { role: "owner" | "admin" | "editor" })[];

    // Get current store from cookie or use first store
    const currentStoreId = cookieStore.get("current_store_id")?.value;

    // Find current store or default to first
    let currentStore: Store | null = null;
    let currentRole = "owner";

    for (const membership of validMemberships) {
        if (currentStoreId && membership.id === currentStoreId) {
            currentStore = membership as Store;
            currentRole = membership.role;
            break;
        }
    }

    // Default to first store if no matching store found
    if (!currentStore && validMemberships.length > 0) {
        const firstMembership = validMemberships[0];
        currentStore = firstMembership as Store;
        currentRole = firstMembership.role;
    }

    // Final safety check - show error instead of redirect loop
    if (!currentStore || !currentStore.id) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-6">
                        <span className="text-3xl">🏪</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-4">
                        Aucune boutique trouvée
                    </h1>
                    <p className="text-slate-600 mb-6">
                        Créez votre première boutique pour commencer.
                    </p>
                    <Link
                        href="/onboarding"
                        className="inline-block px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                    >
                        Créer une boutique
                    </Link>
                </div>
            </div>
        );
    }

    // Build list of all user stores with roles
    const userStores = validMemberships;

    // Fetch orders for this store
    const { data: orders } = await supabase
        .from("orders")
        .select("*")
        .eq("store_id", currentStore.id)
        .order("created_at", { ascending: false });

    const allOrders = (orders as Order[]) || [];

    // Calculate stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = allOrders.filter((order) => {
        const orderDate = new Date(order.created_at);
        return orderDate >= today;
    });

    const totalRevenue = allOrders.reduce(
        (sum, order) => sum + Number(order.total_price),
        0
    );
    const todayRevenue = todayOrders.reduce(
        (sum, order) => sum + Number(order.total_price),
        0
    );

    const stats = {
        totalOrders: allOrders.length,
        todayOrders: todayOrders.length,
        totalRevenue,
        todayRevenue,
    };

    return (
        <DashboardClient
            currentStore={currentStore}
            currentRole={currentRole}
            stores={userStores}
            orders={allOrders}
            stats={stats}
        />
    );
}
