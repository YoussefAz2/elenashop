import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import type { Profile, Product, Category } from "@/types";
import { ProductsWrapper } from "@/components/dashboard/products-wrapper";

export default async function ProductsPage() {
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

    // Fetch products and categories
    const [productsRes, categoriesRes] = await Promise.all([
        supabase.from("products").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("categories").select("*").eq("user_id", user.id).order("position"),
    ]);

    return (
        <ProductsWrapper
            seller={seller}
            products={(productsRes.data as Product[]) || []}
            categories={(categoriesRes.data as Category[]) || []}
        />
    );
}
