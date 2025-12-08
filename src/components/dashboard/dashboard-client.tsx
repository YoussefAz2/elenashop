"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    ShoppingBag,
    Package,
    Settings,
    Store,
    TrendingUp,
    Calendar,
    ChevronRight,
    Users,
    Wand2,
    FolderOpen,
    Gift,
    BarChart3,
    LogOut,
} from "lucide-react";
import type { Profile, Order } from "@/types";
import { OrderList } from "./orders";

interface DashboardStats {
    totalOrders: number;
    todayOrders: number;
    totalRevenue: number;
    todayRevenue: number;
}

interface DashboardClientProps {
    seller: Profile;
    orders: Order[];
    stats: DashboardStats;
}

type Tab = "orders" | "stats" | "products" | "categories" | "promos" | "leads" | "editor" | "settings";

export function DashboardClient({
    seller,
    orders,
    stats,
}: DashboardClientProps) {
    const [activeTab, setActiveTab] = useState<Tab>("orders");
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
                <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
                    <div className="flex items-center gap-3">
                        {seller.avatar_url ? (
                            <img
                                src={seller.avatar_url}
                                alt={seller.store_name}
                                className="h-10 w-10 rounded-full object-cover"
                            />
                        ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                                <Store className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        )}
                        <div>
                            <h1 className="text-base font-bold text-slate-900 dark:text-slate-100">
                                {seller.store_name}
                            </h1>
                            <p className="text-xs text-slate-500">Dashboard</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <a
                            href={`/${seller.store_name}`}
                            className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                        >
                            Voir ma boutique
                            <ChevronRight className="h-4 w-4" />
                        </a>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLogout}
                            className="text-slate-500 hover:text-red-600 hover:bg-red-50"
                        >
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Stats Cards */}
            <div className="mx-auto max-w-4xl px-4 py-6">
                <div className="grid grid-cols-2 gap-3">
                    <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-500 to-emerald-600">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 text-emerald-100">
                                <Calendar className="h-4 w-4" />
                                <span className="text-xs font-medium">Aujourd&apos;hui</span>
                            </div>
                            <p className="mt-2 text-2xl font-bold text-white">
                                {stats.todayOrders}
                            </p>
                            <p className="text-xs text-emerald-100">commandes</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm bg-gradient-to-br from-slate-700 to-slate-800">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 text-slate-300">
                                <TrendingUp className="h-4 w-4" />
                                <span className="text-xs font-medium">Chiffre total</span>
                            </div>
                            <p className="mt-2 text-2xl font-bold text-white">
                                {stats.totalRevenue.toLocaleString()}
                            </p>
                            <p className="text-xs text-slate-300">TND</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="mx-auto max-w-4xl px-4">
                <div className="flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
                    <TabButton
                        active={activeTab === "orders"}
                        onClick={() => setActiveTab("orders")}
                        icon={<ShoppingBag className="h-4 w-4" />}
                        label="Commandes"
                    />
                    <TabButton
                        active={activeTab === "stats"}
                        onClick={() => setActiveTab("stats")}
                        icon={<BarChart3 className="h-4 w-4" />}
                        label="Stats"
                    />
                    <TabButton
                        active={activeTab === "products"}
                        onClick={() => setActiveTab("products")}
                        icon={<Package className="h-4 w-4" />}
                        label="Produits"
                    />
                    <TabButton
                        active={activeTab === "categories"}
                        onClick={() => setActiveTab("categories")}
                        icon={<FolderOpen className="h-4 w-4" />}
                        label="Catégories"
                    />
                    <TabButton
                        active={activeTab === "promos"}
                        onClick={() => setActiveTab("promos")}
                        icon={<Gift className="h-4 w-4" />}
                        label="Promos"
                    />
                    <TabButton
                        active={activeTab === "leads"}
                        onClick={() => setActiveTab("leads")}
                        icon={<Users className="h-4 w-4" />}
                        label="Abandons"
                    />
                    <TabButton
                        active={activeTab === "editor"}
                        onClick={() => setActiveTab("editor")}
                        icon={<Wand2 className="h-4 w-4" />}
                        label="Éditeur"
                    />
                    <TabButton
                        active={activeTab === "settings"}
                        onClick={() => setActiveTab("settings")}
                        icon={<Settings className="h-4 w-4" />}
                        label="Réglages"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="mx-auto max-w-4xl px-4 py-6">
                {activeTab === "orders" && (
                    <OrderList orders={orders} storeName={seller.store_name} />
                )}
                {activeTab === "stats" && (
                    <TabContent
                        icon={<BarChart3 className="h-12 w-12 text-purple-400 mb-4" />}
                        title="Statistiques & Analyses"
                        subtitle="Suivez vos performances de vente"
                        href="/dashboard/stats"
                        buttonText="Voir les statistiques"
                        buttonColor="bg-purple-600 hover:bg-purple-700"
                    />
                )}
                {activeTab === "products" && (
                    <TabContent
                        icon={<Package className="h-12 w-12 text-slate-300 mb-4" />}
                        title="Gérez vos produits"
                        href="/dashboard/products"
                        buttonText="Gérer mes produits"
                        buttonColor="bg-emerald-600 hover:bg-emerald-700"
                    />
                )}
                {activeTab === "categories" && (
                    <TabContent
                        icon={<FolderOpen className="h-12 w-12 text-blue-400 mb-4" />}
                        title="Catégories"
                        subtitle="Organisez vos produits par catégorie"
                        href="/dashboard/categories"
                        buttonText="Gérer les catégories"
                        buttonColor="bg-blue-600 hover:bg-blue-700"
                    />
                )}
                {activeTab === "promos" && (
                    <TabContent
                        icon={<Gift className="h-12 w-12 text-rose-400 mb-4" />}
                        title="Promotions"
                        subtitle="Créez des offres pour vos clients"
                        href="/dashboard/promos"
                        buttonText="Gérer les promos"
                        buttonColor="bg-rose-600 hover:bg-rose-700"
                    />
                )}
                {activeTab === "leads" && (
                    <TabContent
                        icon={<Users className="h-12 w-12 text-amber-400 mb-4" />}
                        title="Paniers Abandonnés"
                        subtitle="Récupérez vos clients potentiels"
                        href="/dashboard/leads"
                        buttonText="Voir les abandons"
                        buttonColor="bg-amber-500 hover:bg-amber-600"
                    />
                )}
                {activeTab === "editor" && (
                    <TabContent
                        icon={<Wand2 className="h-12 w-12 text-purple-400 mb-4" />}
                        title="Éditeur visuel"
                        subtitle="Personnalisez votre site en temps réel"
                        href="/dashboard/editor"
                        buttonText="Ouvrir l'éditeur"
                        buttonColor="bg-purple-600 hover:bg-purple-700"
                    />
                )}
                {activeTab === "settings" && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <Settings className="h-12 w-12 text-slate-300 mb-4" />
                        <p className="text-slate-500">Paramètres de la boutique</p>
                        <p className="text-sm text-slate-400 mt-1">Bientôt disponible</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function TabButton({
    active,
    onClick,
    icon,
    label,
}: {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
}) {
    return (
        <button
            onClick={onClick}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${active
                ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
                }`}
        >
            {icon}
            <span className="hidden sm:inline">{label}</span>
        </button>
    );
}

function TabContent({
    icon,
    title,
    subtitle,
    href,
    buttonText,
    buttonColor,
}: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    href: string;
    buttonText: string;
    buttonColor: string;
}) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            {icon}
            <p className="text-slate-500">{title}</p>
            {subtitle && (
                <p className="text-sm text-slate-400 mt-1 mb-4">{subtitle}</p>
            )}
            <a
                href={href}
                className={`mt-4 inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium text-white transition-colors ${buttonColor}`}
            >
                {buttonText}
            </a>
        </div>
    );
}
