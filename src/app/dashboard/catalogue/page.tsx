import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import type { Store, Product, Category } from "@/types";
import { CatalogueClient } from "@/components/dashboard/catalogue-client";

export default async function CataloguePage() {
    const supabase = await createClient();
    const cookieStore = await cookies();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        redirect("/login");
    }

    // Get current store from cookie
    const currentStoreId = cookieStore.get("current_store_id")?.value;

    if (!currentStoreId) {
        redirect("/dashboard");
    }

    // Fetch store
    const { data: store, error: storeError } = await supabase
        .from("stores")
        .select("*")
        .eq("id", currentStoreId)
        .single();

    if (storeError || !store) {
        redirect("/dashboard");
    }

    const currentStore = store as Store;

    // Fetch products and categories for this store
    const [productsRes, categoriesRes] = await Promise.all([
        supabase.from("products").select("*").eq("store_id", currentStore.id).order("created_at", { ascending: false }),
        supabase.from("categories").select("*").eq("store_id", currentStore.id).order("position"),
    ]);

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header - Clean & Bold */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 leading-tight font-display">
                        Catalogue
                    </h1>
                    <p className="text-slate-500 mt-2 text-lg font-medium">
                        Gérez vos produits et catégories.
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
