"use client";

import { useDashboard } from "@/contexts/DashboardContext";
import { ProductsClient } from "@/components/dashboard/products-client";

export default function ProductsPage() {
    const { store, products, categories } = useDashboard();

    return (
        <ProductsClient
            seller={store as any}
            products={products}
            categories={categories}
        />
    );
}
