import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import type { Order, Store } from "@/types";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import Link from "next/link";

export default async function DashboardPage() {
    const supabase = await createClient();
    const cookieStore = await cookies();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        redirect("/login");
    }

    // Try to get store from cookie first (for new store flow)
    const cookieStoreId = cookieStore.get("current_store_id")?.value;

    let currentStore: Store | null = null;
    let allStores: (Store & { role: string })[] = [];

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
                allStores = [{ ...currentStore, role: "owner" }];
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
                        return { ...store, role: membership?.role || "owner" };
                    }) as (Store & { role: string })[];

                    currentStore = allStores[0] as Store;
                }
            }
        } catch (e) {
            console.error("Membership query failed:", e);
        }
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
