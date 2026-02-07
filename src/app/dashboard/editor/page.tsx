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
            <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
                <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
                    <h1 className="text-2xl font-bold text-slate-900 mb-4">
                        Boutique introuvable
                    </h1>
                    <p className="text-slate-600 mb-6">
                        Impossible de charger votre boutique.
                    </p>
                    <Link
                        href="/dashboard"
                        className="inline-block px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                        Retour au dashboard
                    </Link>
                </div>
            </div>
        );
    }

    const currentStore = store as Store;
    const themeConfig = currentStore.theme_config || DEFAULT_THEME_CONFIG;

    // Fetch products for this store (only needed columns)
    const { data: products } = await supabase
        .from("products")
        .select("id, title, description, price, image_url, is_active, stock, created_at")
        .eq("store_id", currentStore.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(100); // Reasonable limit

    // Fetch pages for this store (only needed columns)
    const { data: pages } = await supabase
        .from("pages")
        .select("id, title, slug, content, is_published, created_at")
        .eq("store_id", currentStore.id)
        .order("created_at", { ascending: false });

    return (
        <EditorClient
            seller={currentStore}
            themeConfig={themeConfig}
            products={(products as Product[]) || []}
            pages={(pages as Page[]) || []}
        />
    );
}
