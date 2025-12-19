import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import type { Store } from "@/types";
import { Sidebar } from "@/components/dashboard/sidebar";
import { MobileNav } from "@/components/dashboard/mobile-nav";

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

    // If no store in cookie, try to get first store from membership
    if (!store) {
        const { data: membership } = await supabase
            .from("store_members")
            .select("store_id, stores(*)")
            .eq("user_id", user.id)
            .limit(1)
            .single();

        if (membership?.stores) {
            store = membership.stores as unknown as Store;
        }
    }

    // Default values if no store found
    const storeName = store?.name || "Ma Boutique";
    const storeSlug = store?.slug || "";

    return (
        <div className="min-h-screen bg-[#FDFDFD] relative overflow-hidden">
            {/* Subtle Premium Background - No noisy AI gradients */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-50/50 via-transparent to-transparent opacity-50 pointer-events-none" />
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.015] pointer-events-none mix-blend-multiply" />

            {/* Desktop Sidebar */}
            <Sidebar storeName={storeName} storeSlug={storeSlug} />

            {/* Mobile Navigation */}
            <MobileNav storeName={storeName} storeSlug={storeSlug} />

            {/* Main Content */}
            <main className="lg:pl-[260px] pt-14 lg:pt-0 min-h-screen relative z-10">
                <div className="p-4 lg:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
