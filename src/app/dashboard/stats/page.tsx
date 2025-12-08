import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import type { Profile, Order, Product } from "@/types";
import { StatsClient } from "@/components/dashboard/stats-client";

export default async function StatsPage() {
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

    // Fetch all orders for this seller
    const { data: orders } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    // Fetch products for top products stats
    const { data: products } = await supabase
        .from("products")
        .select("id, title, price, image_url")
        .eq("user_id", user.id);

    return (
        <StatsClient
            seller={seller}
            orders={(orders as Order[]) || []}
            products={(products as Pick<Product, "id" | "title" | "price" | "image_url">[]) || []}
        />
    );
}
