import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import type { Profile, Product, Page } from "@/types";
import { DEFAULT_THEME_CONFIG } from "@/types";
import { EditorClient } from "@/components/dashboard/editor/EditorClient";

export default async function EditorPage() {
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
    const themeConfig = seller.theme_config || DEFAULT_THEME_CONFIG;

    // Fetch products
    const { data: products } = await supabase
        .from("products")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

    // Fetch pages
    const { data: pages } = await supabase
        .from("pages")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    return (
        <EditorClient
            seller={seller}
            themeConfig={themeConfig}
            products={(products as Product[]) || []}
            pages={(pages as Page[]) || []}
        />
    );
}
