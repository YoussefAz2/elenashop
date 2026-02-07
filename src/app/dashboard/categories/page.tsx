"use client";

import { useDashboard } from "@/contexts/DashboardContext";
import { CategoriesClient } from "@/components/dashboard/categories-client";

export default function CategoriesPage() {
    const { store, categories } = useDashboard();

    return (
        <CategoriesClient
            seller={store as any}
            categories={categories}
        />
    );
}
