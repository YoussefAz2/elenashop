"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
    ArrowLeft,
    TrendingUp,
    TrendingDown,
    ShoppingBag,
    DollarSign,
    Users,
    Package,
    MapPin,
    Calendar,
    CheckCircle,
    Clock,
    Truck,
    XCircle,
    BarChart3,
} from "lucide-react";
import type { Profile, Order, Product } from "@/types";

interface StatsClientProps {
    seller: Profile;
    orders: Order[];
    products: Pick<Product, "id" | "title" | "price" | "image_url">[];
}

type Period = "7d" | "30d" | "90d" | "all";

export function StatsClient({ seller, orders, products }: StatsClientProps) {
    const [period, setPeriod] = useState<Period>("30d");

    // Filter orders by period
    const filteredOrders = useMemo(() => {
        if (period === "all") return orders;

        const now = new Date();
        const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
        const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

        return orders.filter(order => new Date(order.created_at) >= cutoff);
    }, [orders, period]);

    // Calculate stats
    const stats = useMemo(() => {
        const totalRevenue = filteredOrders
            .filter(o => o.status !== "cancelled")
            .reduce((sum, o) => sum + Number(o.total_price), 0);

        const totalOrders = filteredOrders.length;
        const deliveredOrders = filteredOrders.filter(o => o.status === "delivered").length;
        const cancelledOrders = filteredOrders.filter(o => o.status === "cancelled").length;
        const pendingOrders = filteredOrders.filter(o => ["new", "confirmed", "shipped"].includes(o.status)).length;

        const uniqueCustomers = new Set(filteredOrders.map(o => o.customer_phone)).size;
        const averageOrderValue = totalOrders > 0 ? totalRevenue / (totalOrders - cancelledOrders || 1) : 0;
        const conversionRate = totalOrders > 0 ? ((deliveredOrders / totalOrders) * 100) : 0;

        return {
            totalRevenue,
            totalOrders,
            deliveredOrders,
            cancelledOrders,
            pendingOrders,
            uniqueCustomers,
            averageOrderValue,
            conversionRate,
        };
    }, [filteredOrders]);

    // Orders by status
    const ordersByStatus = useMemo(() => {
        const counts = { new: 0, confirmed: 0, shipped: 0, delivered: 0, cancelled: 0 };
        filteredOrders.forEach(order => {
            counts[order.status]++;
        });
        return counts;
    }, [filteredOrders]);

    // Orders by governorate (top 5)
    const ordersByRegion = useMemo(() => {
        const counts: Record<string, number> = {};
        filteredOrders.forEach(order => {
            const gov = order.customer_governorate || "Non spécifié";
            counts[gov] = (counts[gov] || 0) + 1;
        });
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
    }, [filteredOrders]);

    // Top products (by order frequency)
    const topProducts = useMemo(() => {
        const counts: Record<string, { title: string; count: number; revenue: number }> = {};
        filteredOrders.forEach(order => {
            const details = order.product_details as { title: string; price: number } | null;
            if (details) {
                const key = details.title;
                if (!counts[key]) {
                    counts[key] = { title: details.title, count: 0, revenue: 0 };
                }
                counts[key].count++;
                counts[key].revenue += details.price;
            }
        });
        return Object.values(counts)
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    }, [filteredOrders]);

    // Revenue by day (last 7 days for chart)
    const revenueByDay = useMemo(() => {
        const days: { date: string; revenue: number; orders: number }[] = [];
        const now = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split("T")[0];

            const dayOrders = orders.filter(o => {
                const orderDate = new Date(o.created_at).toISOString().split("T")[0];
                return orderDate === dateStr && o.status !== "cancelled";
            });

            days.push({
                date: date.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric" }),
                revenue: dayOrders.reduce((sum, o) => sum + Number(o.total_price), 0),
                orders: dayOrders.length,
            });
        }
        return days;
    }, [orders]);

    const maxRevenue = Math.max(...revenueByDay.map(d => d.revenue), 1);

    const periodLabels: Record<Period, string> = {
        "7d": "7 jours",
        "30d": "30 jours",
        "90d": "3 mois",
        "all": "Tout",
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
                <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/dashboard"
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5 text-slate-600" />
                        </Link>
                        <div>
                            <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                Statistiques
                            </h1>
                            <p className="text-xs text-slate-500">{seller.store_name}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                        {(["7d", "30d", "90d", "all"] as Period[]).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${period === p
                                        ? "bg-white text-slate-900 shadow-sm"
                                        : "text-slate-500 hover:text-slate-700"
                                    }`}
                            >
                                {periodLabels[p]}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-4xl px-4 py-6 space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 border-0">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <DollarSign className="h-8 w-8 text-emerald-100" />
                                <TrendingUp className="h-4 w-4 text-emerald-200" />
                            </div>
                            <p className="mt-3 text-2xl font-bold text-white">
                                {stats.totalRevenue.toFixed(0)} <span className="text-sm font-normal text-emerald-100">TND</span>
                            </p>
                            <p className="text-xs text-emerald-100">Chiffre d'affaires</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <ShoppingBag className="h-8 w-8 text-blue-100" />
                                <Package className="h-4 w-4 text-blue-200" />
                            </div>
                            <p className="mt-3 text-2xl font-bold text-white">{stats.totalOrders}</p>
                            <p className="text-xs text-blue-100">Commandes</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <Users className="h-8 w-8 text-purple-100" />
                                <TrendingUp className="h-4 w-4 text-purple-200" />
                            </div>
                            <p className="mt-3 text-2xl font-bold text-white">{stats.uniqueCustomers}</p>
                            <p className="text-xs text-purple-100">Clients uniques</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-amber-500 to-amber-600 border-0">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <BarChart3 className="h-8 w-8 text-amber-100" />
                                <TrendingUp className="h-4 w-4 text-amber-200" />
                            </div>
                            <p className="mt-3 text-2xl font-bold text-white">
                                {stats.averageOrderValue.toFixed(0)} <span className="text-sm font-normal text-amber-100">TND</span>
                            </p>
                            <p className="text-xs text-amber-100">Panier moyen</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Revenue Chart */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-slate-900">Revenus (7 derniers jours)</h3>
                            <Calendar className="h-4 w-4 text-slate-400" />
                        </div>
                        <div className="space-y-3">
                            {revenueByDay.map((day, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <span className="w-16 text-xs text-slate-500">{day.date}</span>
                                    <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-500"
                                            style={{ width: `${(day.revenue / maxRevenue) * 100}%` }}
                                        />
                                    </div>
                                    <span className="w-20 text-xs font-medium text-slate-700 text-right">
                                        {day.revenue.toFixed(0)} TND
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-4">
                    {/* Orders by Status */}
                    <Card>
                        <CardContent className="p-4">
                            <h3 className="font-semibold text-slate-900 mb-4">Statut des commandes</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-blue-500" />
                                        <span className="text-sm text-slate-700">Nouvelles</span>
                                    </div>
                                    <span className="font-semibold text-blue-600">{ordersByStatus.new}</span>
                                </div>
                                <div className="flex items-center justify-between p-2 bg-emerald-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                                        <span className="text-sm text-slate-700">Confirmées</span>
                                    </div>
                                    <span className="font-semibold text-emerald-600">{ordersByStatus.confirmed}</span>
                                </div>
                                <div className="flex items-center justify-between p-2 bg-amber-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Truck className="h-4 w-4 text-amber-500" />
                                        <span className="text-sm text-slate-700">Expédiées</span>
                                    </div>
                                    <span className="font-semibold text-amber-600">{ordersByStatus.shipped}</span>
                                </div>
                                <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Package className="h-4 w-4 text-green-500" />
                                        <span className="text-sm text-slate-700">Livrées</span>
                                    </div>
                                    <span className="font-semibold text-green-600">{ordersByStatus.delivered}</span>
                                </div>
                                <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <XCircle className="h-4 w-4 text-red-500" />
                                        <span className="text-sm text-slate-700">Annulées</span>
                                    </div>
                                    <span className="font-semibold text-red-600">{ordersByStatus.cancelled}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top Regions */}
                    <Card>
                        <CardContent className="p-4">
                            <h3 className="font-semibold text-slate-900 mb-4">Top régions</h3>
                            {ordersByRegion.length > 0 ? (
                                <div className="space-y-3">
                                    {ordersByRegion.map(([region, count], idx) => (
                                        <div key={region} className="flex items-center gap-3">
                                            <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${idx === 0 ? "bg-amber-100 text-amber-700" :
                                                    idx === 1 ? "bg-slate-200 text-slate-600" :
                                                        idx === 2 ? "bg-orange-100 text-orange-700" :
                                                            "bg-slate-100 text-slate-500"
                                                }`}>
                                                {idx + 1}
                                            </span>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-3 w-3 text-slate-400" />
                                                    <span className="text-sm text-slate-700">{region}</span>
                                                </div>
                                            </div>
                                            <span className="text-sm font-semibold text-slate-600">
                                                {count} cmd{count > 1 ? "s" : ""}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-400 text-center py-4">
                                    Aucune donnée disponible
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Top Products */}
                <Card>
                    <CardContent className="p-4">
                        <h3 className="font-semibold text-slate-900 mb-4">Produits les plus vendus</h3>
                        {topProducts.length > 0 ? (
                            <div className="space-y-3">
                                {topProducts.map((product, idx) => (
                                    <div key={product.title} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                                        <span className={`w-7 h-7 flex items-center justify-center rounded-lg text-sm font-bold ${idx === 0 ? "bg-amber-400 text-white" :
                                                idx === 1 ? "bg-slate-300 text-slate-700" :
                                                    idx === 2 ? "bg-orange-300 text-orange-800" :
                                                        "bg-slate-200 text-slate-500"
                                            }`}>
                                            {idx + 1}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-700 truncate">{product.title}</p>
                                            <p className="text-xs text-slate-400">{product.count} vente{product.count > 1 ? "s" : ""}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-emerald-600">{product.revenue.toFixed(0)} TND</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400 text-center py-8">
                                Aucune vente pour cette période
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Summary Stats */}
                <Card className="bg-slate-900">
                    <CardContent className="p-4">
                        <h3 className="font-semibold text-white mb-4">Résumé</h3>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="text-2xl font-bold text-emerald-400">{stats.conversionRate.toFixed(0)}%</p>
                                <p className="text-xs text-slate-400">Taux de livraison</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-blue-400">{stats.pendingOrders}</p>
                                <p className="text-xs text-slate-400">En cours</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-red-400">{stats.cancelledOrders}</p>
                                <p className="text-xs text-slate-400">Annulées</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
