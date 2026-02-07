"use client";

import { useDashboard } from "@/contexts/DashboardContext";
import { StatsClient } from "@/components/dashboard/stats-client";

export default function StatsPage() {
    const { store, orders, products } = useDashboard();

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
                seller={store as any}
                orders={orders}
                products={products.map(p => ({ id: p.id, title: p.title, price: p.price, image_url: p.image_url }))}
            />
        </div>
    );
}
