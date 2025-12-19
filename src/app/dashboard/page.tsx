import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import type { Order, Store, StoreWithRole } from "@/types";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import Link from "next/link";

interface PageProps {
    searchParams: Promise<{ store?: string }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
    const supabase = await createClient();
    const cookieStore = await cookies();
    const params = await searchParams;

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        redirect("/login");
    }

    // Handle store selection from query param (set cookie)
    const storeFromParam = params.store;
    if (storeFromParam) {
        cookieStore.set("current_store_id", storeFromParam, { path: "/", maxAge: 31536000 });
    }

    // Try to get store from cookie or query param
    const cookieStoreId = storeFromParam || cookieStore.get("current_store_id")?.value;

    let currentStore: Store | null = null;
    let allStores: StoreWithRole[] = [];

    // Try direct store load if we have a cookie
    if (cookieStoreId) {
        try {
            const { data } = await supabase
                .from("stores")
                .select("*")
                .eq("id", cookieStoreId)
                .single();

            if (data) {
                currentStore = data as Store;
                allStores = [{ ...currentStore, role: "owner" as const }];
            }
        } catch (e) {
            console.error("Direct store load failed:", e);
        }
    }

    // If no store from cookie, try membership query
    if (!currentStore) {
        try {
            const { data: memberships } = await supabase
                .from("store_members")
                .select("store_id, role")
                .eq("user_id", user.id);

            if (memberships && memberships.length > 0) {
                const storeIds = memberships.map(m => m.store_id);

                const { data: stores } = await supabase
                    .from("stores")
                    .select("*")
                    .in("id", storeIds);

                if (stores && stores.length > 0) {
                    allStores = stores.map(store => {
                        const membership = memberships.find(m => m.store_id === store.id);
                        const role = (membership?.role || "owner") as "owner" | "admin" | "editor";
                        return { ...store, role };
                    }) as StoreWithRole[];

                    currentStore = allStores[0] as Store;
                }
            }
        } catch (e) {
            console.error("Membership query failed:", e);
        }
    }

    // Multiple stores and no preference saved - show selection page
    if (allStores.length > 1 && !cookieStoreId) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-12">
                <div className="w-full max-w-2xl">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                            <span className="text-3xl">🏪</span>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">
                            Choisissez une boutique
                        </h1>
                        <p className="text-slate-600">
                            Vous avez accès à {allStores.length} boutiques
                        </p>
                    </div>

                    <div className="grid gap-4">
                        {allStores.map((store) => (
                            <a
                                key={store.id}
                                href={`/dashboard?store=${store.id}`}
                                className="block p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-slate-100"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                        <span className="text-xl">🏪</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-900 text-lg">
                                            {store.name}
                                        </h3>
                                        <p className="text-slate-500 text-sm">
                                            {store.slug}.elenashop.vercel.app • {store.role === "owner" ? "Propriétaire" : store.role}
                                        </p>
                                    </div>
                                    <div className="text-emerald-600">
                                        →
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <Link
                            href="/onboarding"
                            className="text-emerald-600 hover:text-emerald-700 font-medium"
                        >
                            + Créer une nouvelle boutique
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // No store found - show helpful page
    if (!currentStore) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
                <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-6">
                        <span className="text-3xl">🏪</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-4">
                        Bienvenue !
                    </h1>
                    <p className="text-slate-600 mb-6">
                        Créez votre première boutique pour commencer.
                    </p>
                    <Link
                        href="/onboarding"
                        className="inline-block px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                        Créer ma boutique
                    </Link>
                </div>
            </div>
        );
    }

    // Fetch orders
    let allOrders: Order[] = [];
    try {
        const { data: orders } = await supabase
            .from("orders")
            .select("*")
            .eq("store_id", currentStore.id)
            .order("created_at", { ascending: false });

        allOrders = (orders as Order[]) || [];
    } catch (e) {
        console.error("Orders query failed:", e);
    }

    // Calculate stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = allOrders.filter(order => new Date(order.created_at) >= today);

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
            stores={allStores}
            orders={allOrders}
            stats={stats}
        />
    );
}
