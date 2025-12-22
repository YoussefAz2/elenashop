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
        <div className="space-y-6">
            {/* Period Selector */}
            <div className="flex justify-end">
                <div className="flex items-center gap-1 bg-zinc-100/50 rounded-2xl p-1.5 border border-zinc-200/50">
                    {(["7d", "30d", "90d", "all"] as Period[]).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${period === p
                                ? "bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200"
                                : "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100"
                                }`}
                        >
                            {periodLabels[p]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Key Metrics - Solid Premium Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-3xl border border-zinc-100 p-6 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-2xl bg-zinc-50 text-zinc-900 border border-zinc-100">
                            <DollarSign className="h-5 w-5" />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2">Chiffre d&apos;affaires</p>
                        <p className="text-3xl font-serif font-bold italic text-zinc-900">
                            {stats.totalRevenue.toFixed(0)} <span className="text-lg font-sans font-normal text-zinc-400 not-italic">TND</span>
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-zinc-100 p-6 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-2xl bg-zinc-50 text-zinc-900 border border-zinc-100">
                            <ShoppingBag className="h-5 w-5" />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2">Commandes</p>
                        <p className="text-3xl font-serif font-bold italic text-zinc-900">{stats.totalOrders}</p>
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-zinc-100 p-6 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-2xl bg-zinc-50 text-zinc-900 border border-zinc-100">
                            <Users className="h-5 w-5" />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2">Clients uniques</p>
                        <p className="text-3xl font-serif font-bold italic text-zinc-900">{stats.uniqueCustomers}</p>
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-zinc-100 p-6 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-2xl bg-zinc-50 text-zinc-900 border border-zinc-100">
                            <BarChart3 className="h-5 w-5" />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2">Panier moyen</p>
                        <p className="text-3xl font-serif font-bold italic text-zinc-900">
                            {stats.averageOrderValue.toFixed(0)} <span className="text-lg font-sans font-normal text-zinc-400 not-italic">TND</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Revenue Chart */}
            <Card className="rounded-3xl border-zinc-100 overflow-hidden shadow-sm">
                <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-serif font-bold italic text-xl text-zinc-900">Revenus (7 derniers jours)</h3>
                        <div className="p-2 bg-zinc-50 rounded-xl">
                            <Calendar className="h-4 w-4 text-zinc-400" />
                        </div>
                    </div>
                    <div className="space-y-5">
                        {revenueByDay.map((day, idx) => (
                            <div key={idx} className="flex items-center gap-4">
                                <span className="w-16 text-xs font-bold text-zinc-400 uppercase tracking-wide">{day.date}</span>
                                <div className="flex-1 h-3 bg-zinc-50 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-zinc-900 rounded-full transition-all duration-700 ease-out"
                                        style={{ width: `${(day.revenue / maxRevenue) * 100}%` }}
                                    />
                                </div>
                                <span className="w-24 text-sm font-serif font-bold italic text-zinc-900 text-right">
                                    {day.revenue.toFixed(0)} <span className="font-sans text-xs font-normal not-italic text-zinc-400">TND</span>
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Orders by Status */}
                <Card className="rounded-3xl border-zinc-100 overflow-hidden shadow-sm">
                    <CardContent className="p-8">
                        <h3 className="font-serif font-bold italic text-xl text-zinc-900 mb-6">Statut des commandes</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <Clock className="h-4 w-4 text-blue-600" />
                                    <span className="text-sm font-bold text-blue-900">Nouvelles</span>
                                </div>
                                <span className="font-serif font-bold italic text-blue-700 text-lg">{ordersByStatus.new}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-amber-50/50 border border-amber-100 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="h-4 w-4 text-amber-600" />
                                    <span className="text-sm font-bold text-amber-900">Confirmées</span>
                                </div>
                                <span className="font-serif font-bold italic text-amber-700 text-lg">{ordersByStatus.confirmed}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-violet-50/50 border border-violet-100 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <Truck className="h-4 w-4 text-violet-600" />
                                    <span className="text-sm font-bold text-violet-900">Expédiées</span>
                                </div>
                                <span className="font-serif font-bold italic text-violet-700 text-lg">{ordersByStatus.shipped}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <Package className="h-4 w-4 text-emerald-600" />
                                    <span className="text-sm font-bold text-emerald-900">Livrées</span>
                                </div>
                                <span className="font-serif font-bold italic text-emerald-700 text-lg">{ordersByStatus.delivered}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-red-50/50 border border-red-100 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <XCircle className="h-4 w-4 text-red-600" />
                                    <span className="text-sm font-bold text-red-900">Annulées</span>
                                </div>
                                <span className="font-serif font-bold italic text-red-700 text-lg">{ordersByStatus.cancelled}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Top Regions */}
                <Card className="rounded-3xl border-zinc-100 overflow-hidden shadow-sm">
                    <CardContent className="p-8">
                        <h3 className="font-serif font-bold italic text-xl text-zinc-900 mb-6">Top régions</h3>
                        {ordersByRegion.length > 0 ? (
                            <div className="space-y-4">
                                {ordersByRegion.map(([region, count], idx) => (
                                    <div key={region} className="flex items-center gap-4 group">
                                        <span className={`w-8 h-8 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${idx === 0 ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/20" :
                                            idx === 1 ? "bg-zinc-100 text-zinc-600" :
                                                "bg-zinc-50 text-zinc-400"
                                            }`}>
                                            {idx + 1}
                                        </span>
                                        <div className="flex-1 p-3 rounded-2xl bg-zinc-50 group-hover:bg-zinc-100 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                                                    <span className="text-sm font-bold text-zinc-700">{region}</span>
                                                </div>
                                                <span className="text-sm font-serif font-bold italic text-zinc-900">
                                                    {count} cmd{count > 1 ? "s" : ""}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="w-16 h-16 rounded-full bg-zinc-50 flex items-center justify-center mb-3">
                                    <MapPin className="h-6 w-6 text-zinc-300" />
                                </div>
                                <p className="text-sm text-zinc-400 font-medium">
                                    Aucune donnée géographique disponible
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Top Products */}
            <Card className="rounded-3xl border-zinc-100 overflow-hidden shadow-sm">
                <CardContent className="p-8">
                    <h3 className="font-serif font-bold italic text-xl text-zinc-900 mb-6">Produits les plus vendus</h3>
                    {topProducts.length > 0 ? (
                        <div className="space-y-4">
                            {topProducts.map((product, idx) => (
                                <div key={product.title} className="flex items-center gap-4 p-4 bg-white border border-zinc-100 rounded-2xl hover:border-zinc-200 hover:shadow-sm transition-all group">
                                    <span className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold ${idx === 0 ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/20" :
                                        idx === 1 ? "bg-zinc-100 text-zinc-600" :
                                            "bg-zinc-50 text-zinc-400"
                                        }`}>
                                        {idx + 1}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-base font-bold text-zinc-900 truncate">{product.title}</p>
                                        <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">{product.count} vente{product.count > 1 ? "s" : ""}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-serif font-bold italic text-zinc-900">{product.revenue.toFixed(0)} <span className="text-xs font-sans font-normal text-zinc-400 not-italic">TND</span></p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-16 h-16 rounded-full bg-zinc-50 flex items-center justify-center mb-3">
                                <ShoppingBag className="h-6 w-6 text-zinc-300" />
                            </div>
                            <p className="text-sm text-zinc-400 font-medium">
                                Aucune vente pour cette période
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Summary Stats */}
            <div className="bg-zinc-900 rounded-3xl p-8 text-white shadow-xl shadow-zinc-900/10">
                <h3 className="font-serif font-bold italic text-xl mb-8">Résumé global</h3>
                <div className="grid grid-cols-3 gap-8 text-center divide-x divide-white/10">
                    <div>
                        <p className="text-4xl font-serif font-bold italic text-white mb-2">{stats.conversionRate.toFixed(0)}%</p>
                        <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Taux de livraison</p>
                    </div>
                    <div>
                        <p className="text-4xl font-serif font-bold italic text-white mb-2">{stats.pendingOrders}</p>
                        <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">En cours</p>
                    </div>
                    <div>
                        <p className="text-4xl font-serif font-bold italic text-white/50 mb-2">{stats.cancelledOrders}</p>
                        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Annulées</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
