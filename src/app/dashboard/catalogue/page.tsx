import { createClient } from "@/utils/supabase/server";
import type { Product, Category } from "@/types";
import { CatalogueClient } from "@/components/dashboard/catalogue-client";
import { getCurrentStore } from "@/utils/get-current-store";

// Cache for smoother navigation
export const revalidate = 60;

export default async function CataloguePage() {
    const currentStore = await getCurrentStore();
    const supabase = await createClient();

    // Fetch products and categories for this store
    const [productsRes, categoriesRes] = await Promise.all([
        supabase.from("products").select("*").eq("store_id", currentStore.id).order("created_at", { ascending: false }),
        supabase.from("categories").select("*").eq("store_id", currentStore.id).order("position"),
    ]);

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header - Editorial Premium */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 pb-8">
                <div>
                    <h1 className="text-4xl font-serif font-bold italic tracking-tight text-zinc-900 leading-tight">
                        Catalogue
                    </h1>
                    <p className="text-zinc-500 mt-2 text-lg font-medium">
                        Gérez votre inventaire et vos collections.
                    </p>
                </div>
            </div>

            <CatalogueClient
                seller={currentStore as any}
                products={(productsRes.data as Product[]) || []}
                categories={(categoriesRes.data as Category[]) || []}
            />
        </div>
    );
}
