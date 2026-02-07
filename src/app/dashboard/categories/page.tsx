import { createClient } from "@/utils/supabase/server";
import type { Category } from "@/types";
import { CategoriesClient } from "@/components/dashboard/categories-client";
import { getCurrentStore } from "@/utils/get-current-store";

// Enable ISR for faster navigation
export const revalidate = 30;

export default async function CategoriesPage() {
    const currentStore = await getCurrentStore();
    const supabase = await createClient();

    // Fetch categories for this store
    const { data: categories } = await supabase
        .from("categories")
        .select("*")
        .eq("store_id", currentStore.id)
        .order("position", { ascending: true });

    return (
        <CategoriesClient
            seller={currentStore as any}
            categories={(categories as Category[]) || []}
        />
    );
}
