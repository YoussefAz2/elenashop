import { createClient } from "@/utils/supabase/server";
import type { Category, Promo, Product } from "@/types";
import { PromosClient } from "@/components/dashboard/promos-client";
import { getCurrentStore } from "@/utils/get-current-store";

// Cache for smoother navigation
export const revalidate = 60;

export default async function PromosPage() {
    const currentStore = await getCurrentStore();
    const supabase = await createClient();

    // Fetch promos, categories, and products for this store
    const [promosRes, categoriesRes, productsRes] = await Promise.all([
        supabase.from("promos").select("*").eq("store_id", currentStore.id).order("created_at", { ascending: false }),
        supabase.from("categories").select("*").eq("store_id", currentStore.id).order("position"),
        supabase.from("products").select("id, title, price, image_url").eq("store_id", currentStore.id).eq("is_active", true),
    ]);

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header - Editorial Premium */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 pb-8">
                <div>
                    <h1 className="text-4xl font-serif font-bold italic tracking-tight text-zinc-900 leading-tight">
                        Promotions
                    </h1>
                    <p className="text-zinc-500 mt-2 text-lg font-medium">
                        Boostez vos ventes avec des offres exclusives.
                    </p>
                </div>
            </div>

            <PromosClient
                seller={currentStore as any}
                promos={(promosRes.data as Promo[]) || []}
                categories={(categoriesRes.data as Category[]) || []}
                products={(productsRes.data as Pick<Product, "id" | "title" | "price" | "image_url">[]) || []}
            />
        </div>
    );
}
