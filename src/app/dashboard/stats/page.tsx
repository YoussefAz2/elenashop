import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import type { Store, Order, Product } from "@/types";
import { StatsClient } from "@/components/dashboard/stats-client";
import Link from "next/link";

// Cache for smoother navigation
export const revalidate = 60;

export default async function StatsPage() {
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

    // Fetch all orders for this store
    const { data: orders } = await supabase
        .from("orders")
        .select("*")
        .eq("store_id", currentStore.id)
        .order("created_at", { ascending: false });

    // Fetch products for top products stats
    const { data: products } = await supabase
        .from("products")
        .select("id, title, price, image_url")
        .eq("store_id", currentStore.id);

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header - Editorial Premium */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 pb-8">
                <div>
                    <h1 className="text-4xl font-serif font-bold italic tracking-tight text-zinc-900 leading-tight">
                        Statistiques
                    </h1>
                    <p className="text-zinc-500 mt-2 text-lg font-medium">
                        Analysez les performances de votre activité.
                    </p>
                </div>
            </div>

            <StatsClient
                seller={currentStore as any}
                orders={(orders as Order[]) || []}
                products={(products as Pick<Product, "id" | "title" | "price" | "image_url">[]) || []}
            />
        </div>
    );
}
