"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    FolderOpen,
    Users,
    BarChart3,
    Settings,
    ExternalLink,
    Palette,
    Tag,
    Sparkles,
    LogOut,
    Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";

interface NavItem {
    label: string;
    href: string;
    icon: React.ElementType;
}

const navItems: NavItem[] = [
    { label: "Vue d'ensemble", href: "/dashboard", icon: LayoutDashboard },
    { label: "Commandes", href: "/dashboard/orders", icon: ShoppingBag },
    { label: "Catalogue", href: "/dashboard/catalogue", icon: Package },
    { label: "Promotions", href: "/dashboard/promos", icon: Tag },
    { label: "Clients", href: "/dashboard/leads", icon: Users },
    { label: "Stats", href: "/dashboard/stats", icon: BarChart3 },
    { label: "Réglages", href: "/dashboard/settings", icon: Settings },
];

function LogoutButton() {
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        // Clear cookies
        document.cookie = "current_store_id=; path=/; max-age=0";
        router.push("/login");
        router.refresh();
    };

    return (
        <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
        >
            <LogOut className="h-4 w-4" />
            Se déconnecter
        </button>
    );
}

function StoreSwitcher({ storeName }: { storeName: string }) {
    const router = useRouter();
    const [isSwitching, setIsSwitching] = useState(false);

    const handleSwitch = async () => {
        setIsSwitching(true);
        try {
            // Clear the store cookie
            await fetch("/api/clear-store");
            // Use router.push for instant client-side navigation
            router.push("/stores");
            router.refresh();
        } catch (error) {
            console.error("Failed to switch store:", error);
            setIsSwitching(false);
        }
    };

    return (
        <button
            onClick={handleSwitch}
            disabled={isSwitching}
            className={`group flex items-center gap-2.5 p-3 -mx-2 rounded-xl hover:bg-zinc-50 transition-all duration-300 mb-6 border border-transparent hover:border-zinc-100 w-full text-left disabled:cursor-not-allowed ${isSwitching ? 'opacity-70 scale-95' : 'opacity-100 scale-100'
                }`}
        >
            <div className="w-9 h-9 rounded-xl bg-zinc-900 flex items-center justify-center text-white font-serif font-bold text-base italic shrink-0">
                {isSwitching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    storeName.charAt(0).toUpperCase()
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-bold text-zinc-900 truncate tracking-tight text-sm">{storeName}</p>
                <p className="text-[9px] text-zinc-400 font-medium uppercase tracking-normal">
                    {isSwitching ? "Chargement..." : "Changer de boutique"}
                </p>
            </div>
            {!isSwitching && (
                <div className="shrink-0 text-zinc-300 group-hover:text-zinc-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m7 15 5 5 5-5" /><path d="m7 9 5-5 5 5" />
                    </svg>
                </div>
            )}
        </button>
    );
}

interface SidebarProps {
    storeName: string;
    storeSlug: string;
}

export function Sidebar({ storeName, storeSlug }: SidebarProps) {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === "/dashboard") {
            return pathname === "/dashboard";
        }
        return pathname.startsWith(href);
    };

    return (
        <aside className="hidden lg:flex flex-col w-[260px] h-screen bg-white/80 backdrop-blur-xl border-r border-zinc-100 fixed left-0 top-0 z-40">
            {/* Store Header */}
            <div className="p-8 pb-4">
                {/* Store Switcher Button */}
                <StoreSwitcher storeName={storeName} />

                {/* HERO CTA BUTTON */}
                <Link
                    href="/editor"
                    className="group relative flex items-center justify-center gap-2 w-full p-3 rounded-xl bg-zinc-900 text-white font-medium shadow-xl shadow-zinc-200/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] overflow-hidden border border-zinc-800"
                >
                    <Sparkles className="h-4 w-4 text-amber-200" />
                    <span className="tracking-wide text-sm">Éditeur</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-6 space-y-2 overflow-y-auto mt-4">
                <p className="px-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Navigation</p>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-2 py-3 text-sm font-medium transition-all duration-300 group relative",
                                active
                                    ? "text-zinc-900"
                                    : "text-zinc-400 hover:text-zinc-700"
                            )}
                        >
                            {/* Active Indicator Line */}
                            {active && (
                                <div className="absolute left-[-24px] top-1/2 -translate-y-1/2 w-1 h-6 bg-zinc-900 rounded-r-full" />
                            )}

                            <Icon className={cn(
                                "h-[18px] w-[18px] transition-colors duration-200",
                                active ? "text-zinc-900 stroke-[2.5px]" : "text-zinc-400 group-hover:text-zinc-600"
                            )} />
                            <span className={cn("tracking-tight", active && "font-bold")}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer Actions */}
            <div className="p-6 border-t border-zinc-100 space-y-1">
                <a
                    href={`/${storeSlug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-2 py-3 text-xs font-bold text-zinc-500 hover:text-zinc-900 transition-all duration-200 uppercase tracking-wider"
                >
                    <div className="flex items-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Voir la boutique
                    </div>
                </a>
                <LogoutButton />
            </div>
        </aside>
    );
}

