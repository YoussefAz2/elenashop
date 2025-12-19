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
        <aside className="hidden lg:flex flex-col w-[250px] h-screen bg-white border-r border-slate-200 fixed left-0 top-0">
            {/* Store Header */}
            <div className="p-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                        {storeName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 truncate">{storeName}</p>
                        <p className="text-xs text-slate-400 truncate">/{storeSlug}</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                                active
                                    ? "bg-slate-100 text-emerald-600"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            <Icon className={cn("h-5 w-5", active ? "text-emerald-600" : "text-slate-400")} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer Actions */}
            <div className="p-3 border-t border-slate-100 space-y-2">
                <Link
                    href="/dashboard/editor"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-150"
                >
                    <Palette className="h-5 w-5 text-slate-400" />
                    Éditeur de boutique
                </Link>
                <a
                    href={`/${storeSlug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all duration-150"
                >
                    <ExternalLink className="h-5 w-5 text-slate-400" />
                    Voir ma boutique
                </a>
            </div>
        </aside>
    );
}
