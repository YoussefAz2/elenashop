import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getCurrentStore } from "@/utils/get-current-store";

// Enable static generation with revalidation for faster subsequent loads
export const revalidate = 30; // Revalidate every 30 seconds

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Use cached function - no duplicate calls if pages also call it
    const store = await getCurrentStore();

    return (
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
    );
}
