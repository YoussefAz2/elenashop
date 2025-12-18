// Store management utilities for multi-store architecture

import { createClient } from "@/utils/supabase/client";
import type { Store, StoreMember, StoreWithRole, ThemeConfig } from "@/types";

// ============================================
// STORE QUERIES
// ============================================

/**
 * Get all stores the current user is a member of
 */
export async function getUserStores(): Promise<StoreWithRole[]> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
        .from("store_members")
        .select(`
            role,
            stores:store_id (
                id,
                slug,
                name,
                theme_config,
                subscription_status,
                created_at,
                updated_at
            )
        `)
        .eq("user_id", user.id);

    if (error || !data) return [];

    return data.map((item) => ({
        ...(item.stores as unknown as Store),
        role: item.role as StoreWithRole["role"],
    }));
}

/**
 * Get a single store by slug
 */
export async function getStoreBySlug(slug: string): Promise<Store | null> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("stores")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error || !data) return null;
    return data as Store;
}

/**
 * Get a single store by ID
 */
export async function getStoreById(storeId: string): Promise<Store | null> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("stores")
        .select("*")
        .eq("id", storeId)
        .single();

    if (error || !data) return null;
    return data as Store;
}

/**
 * Check if a slug is available
 */
export async function isSlugAvailable(slug: string): Promise<boolean> {
    const supabase = createClient();

    const { data } = await supabase
        .from("stores")
        .select("id")
        .eq("slug", slug)
        .single();

    return !data;
}

// ============================================
// STORE MUTATIONS
// ============================================

interface CreateStoreParams {
    slug: string;
    name: string;
    themeConfig: ThemeConfig;
}

/**
 * Create a new store and add current user as owner
 */
export async function createStore({ slug, name, themeConfig }: CreateStoreParams): Promise<Store | null> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("User not authenticated");

    // Create the store
    const { data: store, error: storeError } = await supabase
        .from("stores")
        .insert({
            slug: slug.toLowerCase(),
            name,
            theme_config: themeConfig,
        })
        .select()
        .single();

    if (storeError || !store) {
        console.error("Error creating store:", storeError);
        throw new Error(storeError?.message || "Failed to create store");
    }

    // Add user as owner
    const { error: memberError } = await supabase
        .from("store_members")
        .insert({
            user_id: user.id,
            store_id: store.id,
            role: "owner",
        });

    if (memberError) {
        console.error("Error adding owner:", memberError);
        // Rollback store creation
        await supabase.from("stores").delete().eq("id", store.id);
        throw new Error("Failed to set store owner");
    }

    return store as Store;
}

/**
 * Update store theme config
 */
export async function updateStoreTheme(storeId: string, themeConfig: ThemeConfig): Promise<boolean> {
    const supabase = createClient();

    const { error } = await supabase
        .from("stores")
        .update({
            theme_config: themeConfig,
            updated_at: new Date().toISOString(),
        })
        .eq("id", storeId);

    if (error) {
        console.error("Error updating theme:", error);
        return false;
    }

    return true;
}

/**
 * Update store name
 */
export async function updateStoreName(storeId: string, name: string): Promise<boolean> {
    const supabase = createClient();

    const { error } = await supabase
        .from("stores")
        .update({
            name,
            updated_at: new Date().toISOString(),
        })
        .eq("id", storeId);

    if (error) {
        console.error("Error updating name:", error);
        return false;
    }

    return true;
}

// ============================================
// STORE MEMBERS
// ============================================

/**
 * Get all members of a store
 */
export async function getStoreMembers(storeId: string): Promise<StoreMember[]> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("store_members")
        .select("*")
        .eq("store_id", storeId);

    if (error || !data) return [];
    return data as StoreMember[];
}

/**
 * Check if user has access to a store
 */
export async function hasStoreAccess(storeId: string): Promise<boolean> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return false;

    const { data } = await supabase
        .from("store_members")
        .select("id")
        .eq("store_id", storeId)
        .eq("user_id", user.id)
        .single();

    return !!data;
}

/**
 * Get user's role in a store
 */
export async function getUserStoreRole(storeId: string): Promise<StoreWithRole["role"] | null> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data } = await supabase
        .from("store_members")
        .select("role")
        .eq("store_id", storeId)
        .eq("user_id", user.id)
        .single();

    return data?.role as StoreWithRole["role"] | null;
}

// ============================================
// LOCAL STORAGE HELPERS
// ============================================

const CURRENT_STORE_KEY = "elena_current_store_id";

/**
 * Get the currently selected store ID from localStorage
 */
export function getCurrentStoreId(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(CURRENT_STORE_KEY);
}

/**
 * Set the currently selected store ID in localStorage
 */
export function setCurrentStoreId(storeId: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(CURRENT_STORE_KEY, storeId);
}

/**
 * Clear the current store selection
 */
export function clearCurrentStoreId(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(CURRENT_STORE_KEY);
}
