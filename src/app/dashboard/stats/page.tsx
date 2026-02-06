import { createClient } from "@/utils/supabase/server";
import type { Order, Product } from "@/types";
import { StatsClient } from "@/components/dashboard/stats-client";
import { getCurrentStore } from "@/utils/get-current-store";

// Cache for smoother navigation
export const revalidate = 60;

export default async function StatsPage() {
    const currentStore = await getCurrentStore();
    const supabase = await createClient();

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
