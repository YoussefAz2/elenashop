import { createClient } from "@/utils/supabase/server";
import type { Product, Category } from "@/types";
import { ProductsClient } from "@/components/dashboard/products-client";
import { getCurrentStore } from "@/utils/get-current-store";

// Enable ISR for faster navigation
export const revalidate = 30;

export default async function ProductsPage() {
    const currentStore = await getCurrentStore();
    const supabase = await createClient();

    // Fetch products and categories for this store
    const [productsRes, categoriesRes] = await Promise.all([
        supabase.from("products").select("*").eq("store_id", currentStore.id).order("created_at", { ascending: false }),
        supabase.from("categories").select("*").eq("store_id", currentStore.id).order("position"),
    ]);

    return (
        <ProductsClient
            seller={currentStore as any}
            products={(productsRes.data as Product[]) || []}
            categories={(categoriesRes.data as Category[]) || []}
        />
    );
}
