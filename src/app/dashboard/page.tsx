import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import type { Order, Store } from "@/types";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export default async function DashboardPage() {
    const supabase = await createClient();

    // Check authentication
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        redirect("/login");
    }

    // Get user's store memberships first
    const { data: storeMemberships, error: membershipError } = await supabase
        .from("store_members")
        .select("store_id, role")
        .eq("user_id", user.id);

    // If no memberships at all, redirect to onboarding
    if (membershipError || !storeMemberships || storeMemberships.length === 0) {
        redirect("/onboarding");
    }

    // Get all store IDs
    const storeIds = storeMemberships.map((m) => m.store_id);

    // Fetch stores separately to avoid join issues
    const { data: storesData, error: storesError } = await supabase
        .from("stores")
        .select("*")
        .in("id", storeIds);

    // If we have memberships but can't load stores, show error page instead of redirect loop
    if (storesError || !storesData || storesData.length === 0) {
        // Don't redirect - this would cause a loop. Show an error state instead.
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center p-8">
                    <h1 className="text-2xl font-bold text-slate-900 mb-4">
                        Erreur de chargement
                    </h1>
                    <p className="text-slate-600 mb-4">
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
    const cookieStore = await cookies();
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
                <div className="text-center p-8">
                    <h1 className="text-2xl font-bold text-slate-900 mb-4">
                        Aucune boutique trouvée
                    </h1>
                    <p className="text-slate-600 mb-4">
                        Créez votre première boutique pour commencer.
                    </p>
                    <a
                        href="/onboarding"
                        className="inline-block px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                    >
                        Créer une boutique
                    </a>
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

    return (
        <DashboardClient
            currentStore={currentStore}
            currentRole={currentRole}
            stores={userStores}
            orders={allOrders}
            stats={{
                totalOrders: allOrders.length,
                todayOrders: todayOrders.length,
                totalRevenue,
                todayRevenue,
            }}
        />
    );
}
