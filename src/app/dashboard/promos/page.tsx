import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import type { Profile, Category, Promo, Product } from "@/types";
import { PromosClient } from "@/components/dashboard/promos-client";

export default async function PromosPage() {
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

    // Fetch promos, categories, and products
    const [promosRes, categoriesRes, productsRes] = await Promise.all([
        supabase.from("promos").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("categories").select("*").eq("user_id", user.id).order("position"),
        supabase.from("products").select("id, title, price, image_url").eq("user_id", user.id).eq("is_active", true),
    ]);

    return (
        <PromosClient
            seller={seller}
            promos={(promosRes.data as Promo[]) || []}
            categories={(categoriesRes.data as Category[]) || []}
            products={(productsRes.data as Pick<Product, "id" | "title" | "price" | "image_url">[]) || []}
        />
    );
}
