import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import type { Profile, Order } from "@/types";
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

    // Fetch seller profile
    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (!profile) {
        redirect("/login");
    }

    const seller = profile as Profile;

    // Fetch orders for this seller
    const { data: orders } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
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
            seller={seller}
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
