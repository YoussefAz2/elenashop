import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import type { Store } from "@/types";

/**
 * Get the current store for dashboard pages.
 * Uses cookie if available, otherwise fetches from membership.
 * 
 * IMPORTANT: This function reads the store but does NOT modify cookies.
 * Cookie is set by /api/select-store route handler.
 */
export async function getCurrentStore(): Promise<Store> {
    const supabase = await createClient();
    const cookieStore = await cookies();

    // Check authentication first
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        redirect("/login");
    }

    // Try to get store from cookie
    const currentStoreId = cookieStore.get("current_store_id")?.value;

    if (currentStoreId) {
        const { data: store } = await supabase
            .from("stores")
            .select("*")
            .eq("id", currentStoreId)
            .single();

        if (store) {
            return store as Store;
        }
    }

    // Cookie invalid or missing - fetch from membership
    const { data: membership } = await supabase
        .from("store_members")
        .select("store_id, stores(*)")
        .eq("user_id", user.id)
        .limit(1)
        .single();

    if (membership?.stores) {
        // Return the store - it will work for this request
        // The layout or a client component should set the cookie properly
        return membership.stores as unknown as Store;
    }

    // User has no stores - go to onboarding
    redirect("/onboarding");
}
