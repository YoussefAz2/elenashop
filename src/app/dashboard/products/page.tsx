import { createClient } from "@/utils/supabase/server";
import { getCurrentStore } from "@/utils/get-current-store";
import { ProductsClient } from "@/components/dashboard/products-client";
import type { Product, Category } from "@/types";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
    const store = await getCurrentStore();
    const supabase = await createClient();

    const [productsRes, categoriesRes] = await Promise.all([
        supabase.from("products").select("*").eq("store_id", store.id).order("created_at", { ascending: false }),
        supabase.from("categories").select("*").eq("store_id", store.id).order("position"),
    ]);

    const products = (productsRes.data as Product[]) || [];
    const categories = (categoriesRes.data as Category[]) || [];

    return <ProductsClient products={products} categories={categories} storeId={store.id} />;
}
