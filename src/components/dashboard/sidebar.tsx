"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
    label: string;
    href: string;
    icon: React.ElementType;
}

const navItems: NavItem[] = [
    { label: "Vue d'ensemble", href: "/dashboard", icon: LayoutDashboard },
    { label: "Commandes", href: "/dashboard/orders", icon: ShoppingBag },
    { label: "Produits", href: "/dashboard/products", icon: Package },
    { label: "Catégories", href: "/dashboard/categories", icon: FolderOpen },
    { label: "Promotions", href: "/dashboard/promos", icon: Tag },
    { label: "Clients", href: "/dashboard/leads", icon: Users },
    { label: "Stats", href: "/dashboard/stats", icon: BarChart3 },
    { label: "Réglages", href: "/dashboard/settings", icon: Settings },
];

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
        <aside className="hidden lg:flex flex-col w-[260px] h-screen bg-white/80 backdrop-blur-xl border-r border-slate-200/50 fixed left-0 top-0 z-40">
            {/* Store Header */}
            <div className="p-5">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-slate-200 ring-2 ring-white">
                        {storeName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 truncate tracking-tight">{storeName}</p>
                        <p className="text-xs text-slate-400 truncate font-medium">/{storeSlug}</p>
                    </div>
                </div>

                {/* HERO CTA BUTTON */}
                <Link
                    href="/dashboard/editor"
                    className="group relative flex items-center justify-center gap-2 w-full p-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-lg shadow-indigo-200 transition-all duration-200 hover:shadow-xl hover:shadow-indigo-300 hover:-translate-y-0.5"
                >
                    <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Sparkles className="h-4 w-4 text-indigo-100" />
                    <span>Éditeur Magic</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 pb-4 space-y-1 overflow-y-auto">
                <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-2">Menu</p>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group relative",
                                active
                                    ? "bg-slate-50 text-slate-900 shadow-sm ring-1 ring-slate-200"
                                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50/50"
                            )}
                        >
                            <Icon className={cn(
                                "h-5 w-5 transition-colors duration-200",
                                active ? "text-violet-600" : "text-slate-400 group-hover:text-slate-600"
                            )} />
                            {item.label}
                            {active && (
                                <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-violet-600 shadow-sm" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer Actions */}
            <div className="p-4 border-t border-slate-100/50 bg-slate-50/30">
                <a
                    href={`/${storeSlug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-white transition-all duration-200 border border-transparent hover:border-slate-200/50"
                >
                    <div className="flex items-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Voir la boutique
                    </div>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </a>
            </div>
        </aside>
    );
}
