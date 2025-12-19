"use client";

import { useState } from "react";
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
    Menu,
    X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

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

interface MobileNavProps {
    storeName: string;
    storeSlug: string;
}

export function MobileNav({ storeName, storeSlug }: MobileNavProps) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === "/dashboard") {
            return pathname === "/dashboard";
        }
        return pathname.startsWith(href);
    };

    return (
        <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200">
            <div className="flex items-center justify-between px-4 h-14">
                {/* Logo / Store Name */}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                        {storeName.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-slate-900">{storeName}</span>
                </div>

                {/* Burger Menu */}
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <Menu className="h-5 w-5 text-slate-600" />
                        </button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[280px] p-0">
                        <SheetHeader className="p-4 border-b border-slate-100">
                            <SheetTitle className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                                    {storeName.charAt(0).toUpperCase()}
                                </div>
                                <div className="text-left">
                                    <p className="font-semibold text-slate-900">{storeName}</p>
                                    <p className="text-xs text-slate-400 font-normal">/{storeSlug}</p>
                                </div>
                            </SheetTitle>
                        </SheetHeader>

                        {/* Navigation */}
                        <nav className="flex-1 p-3 space-y-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
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
                        <div className="p-3 border-t border-slate-100 space-y-2 mt-auto">
                            <Link
                                href="/dashboard/editor"
                                onClick={() => setIsOpen(false)}
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
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}
