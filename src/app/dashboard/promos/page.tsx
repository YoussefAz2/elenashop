"use client";

import { useDashboard } from "@/contexts/DashboardContext";
import { PromosClient } from "@/components/dashboard/promos-client";

export default function PromosPage() {
    const { store, promos, categories, products } = useDashboard();

    // Filter only active products for promo selection
    const activeProducts = products.filter(p => p.is_active);

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
                seller={store as any}
                promos={promos}
                categories={categories}
                products={activeProducts.map(p => ({ id: p.id, title: p.title, price: p.price, image_url: p.image_url }))}
            />
        </div>
    );
}
