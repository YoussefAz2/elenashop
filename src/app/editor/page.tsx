import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import type { Store, Product, Page } from "@/types";
import { DEFAULT_THEME_CONFIG } from "@/types";
import { EditorClient } from "@/components/dashboard/editor/EditorClient";
import Link from "next/link";

export default async function EditorPage() {
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
                    <p className="text-zinc-500 mb-8 font-medium">
                        Impossible de charger votre boutique pour le moment.
                    </p>
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
    const themeConfig = currentStore.theme_config || DEFAULT_THEME_CONFIG;

    // Fetch products and pages in parallel
    const [productsRes, pagesRes, categoriesRes] = await Promise.all([
        supabase
            .from("products")
            .select("*")
            .eq("store_id", currentStore.id)
            .eq("is_active", true)
            .order("created_at", { ascending: false }),
        supabase
            .from("pages")
            .select("*")
            .eq("store_id", currentStore.id)
            .order("created_at", { ascending: false }),
        supabase
            .from("categories")
            .select("*")
            .eq("store_id", currentStore.id)
            .order("position", { ascending: true }),
    ]);

    return (
        <EditorClient
            seller={currentStore}
            themeConfig={themeConfig}
            products={(productsRes.data as Product[]) || []}
            pages={(pagesRes.data as Page[]) || []}
        />
    );
}
