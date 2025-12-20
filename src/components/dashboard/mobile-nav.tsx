"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
    Tag,
    LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
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
    { label: "Catalogue", href: "/dashboard/catalogue", icon: Package },
    { label: "Promotions", href: "/dashboard/promos", icon: Tag },
    { label: "Clients", href: "/dashboard/leads", icon: Users },
    { label: "Stats", href: "/dashboard/stats", icon: BarChart3 },
    { label: "Réglages", href: "/dashboard/settings", icon: Settings },
];

function MobileLogoutButton({ onLogout }: { onLogout: () => void }) {
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        onLogout();
        await supabase.auth.signOut();
        document.cookie = "current_store_id=; path=/; max-age=0";
        router.push("/login");
        router.refresh();
    };

    return (
        <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-red-500 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
        >
            <LogOut className="h-4 w-4" />
            Se déconnecter
        </button>
    );
}

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
                    <SheetContent side="left" className="w-[300px] p-0 border-r border-slate-200/60 bg-white/90 backdrop-blur-xl">
                        <SheetHeader className="p-5 border-b border-slate-100/50">
                            <SheetTitle className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                    {storeName.charAt(0).toUpperCase()}
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-slate-900">{storeName}</p>
                                    <p className="text-xs text-slate-400 font-medium">/{storeSlug}</p>
                                </div>
                            </SheetTitle>

                            {/* Mobile Hero Button */}
                            <div className="mt-6">
                                <Link
                                    href="/editor"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center justify-center gap-2 w-full p-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-lg shadow-indigo-200"
                                >
                                    <Palette className="h-4 w-4" />
                                    <span>Éditeur Magic</span>
                                </Link>
                            </div>
                        </SheetHeader>

                        {/* Navigation */}
                        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                            <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Menu</p>
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-150",
                                            active
                                                ? "bg-slate-50 text-slate-900 shadow-sm ring-1 ring-slate-200"
                                                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                        )}
                                    >
                                        <Icon className={cn("h-5 w-5", active ? "text-violet-600" : "text-slate-400")} />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Footer Actions */}
                        <div className="p-4 border-t border-slate-100/50 bg-slate-50/30 mt-auto space-y-2">
                            <a
                                href={`/${storeSlug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-white transition-all duration-200"
                            >
                                <div className="flex items-center gap-2">
                                    <ExternalLink className="h-4 w-4" />
                                    Voir la boutique
                                </div>
                                <span>→</span>
                            </a>
                            <MobileLogoutButton onLogout={() => setIsOpen(false)} />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}
