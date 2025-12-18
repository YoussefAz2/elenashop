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

    // Get user's stores
    const { data: storeMemberships } = await supabase
        .from("store_members")
        .select(`
            role,
            stores:store_id (
                id,
                slug,
                name,
                theme_config,
                subscription_status,
                created_at,
                updated_at
            )
        `)
        .eq("user_id", user.id);

    if (!storeMemberships || storeMemberships.length === 0) {
        // No stores, redirect to onboarding
        redirect("/onboarding");
    }

    // Filter out any memberships where stores is null
    const validMemberships = storeMemberships.filter(
        (m) => m.stores !== null && m.stores !== undefined
    );

    if (validMemberships.length === 0) {
        // No valid stores, redirect to onboarding
        redirect("/onboarding");
    }

    // Get current store from cookie or use first store
    const cookieStore = await cookies();
    const currentStoreId = cookieStore.get("current_store_id")?.value;

    // Find current store or default to first
    let currentStore: Store | null = null;
    let currentRole = "owner";

    for (const membership of validMemberships) {
        const store = membership.stores as unknown as Store;
        if (store && currentStoreId && store.id === currentStoreId) {
            currentStore = store;
            currentRole = membership.role;
            break;
        }
    }

    // Default to first store if no matching store found
    if (!currentStore) {
        const firstMembership = validMemberships[0];
        currentStore = firstMembership.stores as unknown as Store;
        currentRole = firstMembership.role;
    }

    // Final safety check
    if (!currentStore || !currentStore.id) {
        redirect("/onboarding");
    }

    // Build list of all user stores with roles
    const userStores = validMemberships.map((m) => ({
        ...(m.stores as unknown as Store),
        role: m.role,
    }));

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
