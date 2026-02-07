import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import type { Store } from "@/types";
import { Sidebar } from "@/components/dashboard/sidebar";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
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

    let store: Store | null = null;

    if (currentStoreId) {
        const { data } = await supabase
            .from("stores")
            .select("*")
            .eq("id", currentStoreId)
            .single();
        store = data as Store | null;
    }

    // If no store in cookie (or cookie invalid), get first store from membership
    if (!store) {
        const { data: membership } = await supabase
            .from("store_members")
            .select("store_id, stores(*)")
            .eq("user_id", user.id)
            .limit(1)
            .single();

        if (membership?.stores) {
            store = membership.stores as unknown as Store;
            // Note: Cookie will be set when user navigates through /stores or /api/select-store
            // For now, we just use the store directly - it works for this request
        }
    }

    // If no store at all, redirect to onboarding
    if (!store) {
        redirect("/onboarding");
    }

    const storeName = store.name;
    const storeSlug = store.slug;

    return (
        <div className="min-h-screen bg-slate-50/50 relative overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {/* Spotlight Effect - Ultra Subtle */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-50/30 via-transparent to-transparent blur-[100px] opacity-60"></div>
            </div>

            {/* Desktop Sidebar */}
            <Sidebar storeName={storeName} storeSlug={storeSlug} />

            {/* Mobile Navigation */}
            <MobileNav storeName={storeName} storeSlug={storeSlug} />

            {/* Main Content */}
            <main className="lg:pl-[260px] pt-14 lg:pt-0 min-h-screen relative z-10">
                <DashboardShell>
                    {children}
                </DashboardShell>
            </main>
        </div>
    );
}
