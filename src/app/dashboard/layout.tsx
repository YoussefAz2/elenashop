import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getCurrentStore } from "@/utils/get-current-store";
import { createClient } from "@/utils/supabase/server";
import { DashboardProvider } from "@/contexts/DashboardContext";
import type { Order, Product, Category, Lead, Promo } from "@/types";

// Disable caching for dashboard - we want fresh data on initial load
export const dynamic = "force-dynamic";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Get store (cached per-request)
    const store = await getCurrentStore();
    const supabase = await createClient();

    // Fetch ALL dashboard data in parallel for instant client-side navigation
    const [ordersRes, productsRes, categoriesRes, leadsRes, promosRes] = await Promise.all([
        supabase.from("orders").select("*").eq("store_id", store.id).order("created_at", { ascending: false }),
        supabase.from("products").select("*").eq("store_id", store.id).order("created_at", { ascending: false }),
        supabase.from("categories").select("*").eq("store_id", store.id).order("position"),
        supabase.from("leads").select("*").eq("store_id", store.id).order("created_at", { ascending: false }),
        supabase.from("promos").select("*").eq("store_id", store.id).order("created_at", { ascending: false }),
    ]);

    const initialData = {
        store,
        orders: (ordersRes.data as Order[]) || [],
        products: (productsRes.data as Product[]) || [],
        categories: (categoriesRes.data as Category[]) || [],
        leads: (leadsRes.data as Lead[]) || [],
        promos: (promosRes.data as Promo[]) || [],
    };

    return (
        <DashboardProvider initialData={initialData}>
            <div className="min-h-screen bg-slate-50/50 relative overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900">
                {/* Spotlight Effect - Ultra Subtle */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-50/30 via-transparent to-transparent blur-[100px] opacity-60"></div>
                </div>

                {/* Desktop Sidebar */}
                <Sidebar storeName={store.name} storeSlug={store.slug} />

                {/* Mobile Navigation */}
                <MobileNav storeName={store.name} storeSlug={store.slug} />

                {/* Main Content */}
                <main className="lg:pl-[260px] pt-14 lg:pt-0 min-h-screen relative z-10">
                    <DashboardShell>
                        {children}
                    </DashboardShell>
                </main>
            </div>
        </DashboardProvider>
    );
}
