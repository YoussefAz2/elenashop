import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import type { Store, Category, Promo, Product } from "@/types";
import { PromosClient } from "@/components/dashboard/promos-client";
import Link from "next/link";

// Cache for smoother navigation
export const revalidate = 60;

export default async function PromosPage() {
    const supabase = await createClient();
    const cookieStore = await cookies();

    // Check authentication
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

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
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
                <div className="text-center p-8 bg-white rounded-3xl shadow-2xl shadow-zinc-200/50 max-w-md border border-zinc-100">
                    <h1 className="text-3xl font-serif font-bold italic text-zinc-900 mb-4">
                        Boutique introuvable
                    </h1>
                    <Link
                        href="/dashboard"
                        className="inline-block px-8 py-3 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-900/20"
                    >
                        Retour au dashboard
                    </Link>
                </div>
            </div>
        );
    }

    const currentStore = store as Store;

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
