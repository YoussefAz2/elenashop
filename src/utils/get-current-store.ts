import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import type { Store } from "@/types";
import { cache } from "react";

/**
 * Get the current store for dashboard pages.
 * Uses React.cache for request-level memoization - only one DB call per request.
 * 
 * IMPORTANT: This function reads the store but does NOT modify cookies.
 * Cookie is set by /api/select-store route handler.
 */
export const getCurrentStore = cache(async (): Promise<Store> => {
    const supabase = await createClient();
    const cookieStore = await cookies();

    // Use getSession() instead of getUser() — reads JWT locally (~0ms)
    // Middleware already called getUser() and validated auth
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
        redirect("/login");
    }

    const user = session.user;

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
        return membership.stores as unknown as Store;
    }

    // User has no stores - go to onboarding
    redirect("/onboarding");
});

/**
 * Get authenticated user - cached per request
 */
export const getAuthenticatedUser = cache(async () => {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session?.user) {
        redirect("/login");
    }

    return session.user;
});
