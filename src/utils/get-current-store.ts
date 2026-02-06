import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import type { Store } from "@/types";

/**
 * Get the current store for dashboard pages.
 * Tries cookie first, then falls back to membership lookup.
 * Returns the store or redirects to appropriate page.
 */
export async function getCurrentStore(): Promise<Store> {
    const supabase = await createClient();
    const cookieStore = await cookies();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        redirect("/login");
    }

    // Try to get store from cookie first
    const currentStoreId = cookieStore.get("current_store_id")?.value;

    if (currentStoreId) {
        const { data: store, error } = await supabase
            .from("stores")
            .select("*")
            .eq("id", currentStoreId)
            .single();

        if (!error && store) {
            return store as Store;
        }
    }

    // Fallback: get first store from membership
    const { data: membership } = await supabase
        .from("store_members")
        .select("store_id, stores(*)")
        .eq("user_id", user.id)
        .limit(1)
        .single();

    if (membership?.stores) {
        const store = membership.stores as unknown as Store;

        // Set the cookie for future requests
        cookieStore.set("current_store_id", store.id, {
            path: "/",
            maxAge: 31536000, // 1 year
            httpOnly: true,
            sameSite: "lax"
        });

        return store;
    }

    // No store found - redirect to onboarding
    redirect("/onboarding");
}
