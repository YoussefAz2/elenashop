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
        <div className="min-h-screen bg-slate-50/50 relative overflow-hidden">
            {/* Mesh Gradients Background */}
            <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-400/10 blur-[120px] pointer-events-none" />
            <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-400/10 blur-[120px] pointer-events-none" />
            <div className="fixed top-[20%] right-[20%] w-[30%] h-[30%] rounded-full bg-blue-400/10 blur-[100px] pointer-events-none" />

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
