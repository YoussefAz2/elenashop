"use client";

import { useDashboard } from "@/contexts/DashboardContext";
import { CatalogueClient } from "@/components/dashboard/catalogue-client";

export default function CataloguePage() {
    const { store, products, categories } = useDashboard();

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
                seller={store as any}
                products={products}
                categories={categories}
            />
        </div>
    );
}
