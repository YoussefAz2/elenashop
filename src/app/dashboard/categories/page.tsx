import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import type { Profile, Category } from "@/types";
import { CategoriesClient } from "@/components/dashboard/categories-client";

export default async function CategoriesPage() {
    const supabase = await createClient();

    // Check authentication
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        redirect("/login");
    }

    // Fetch seller profile
    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (!profile) {
        redirect("/login");
    }

    const seller = profile as Profile;

    // Fetch categories for this seller
    const { data: categories } = await supabase
        .from("categories")
        .select("*")
        .eq("user_id", user.id)
        .order("position", { ascending: true });

    return (
        <CategoriesClient
            seller={seller}
            categories={(categories as Category[]) || []}
        />
    );
}
