import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getCurrentStore } from "@/utils/get-current-store";
import type { Order, Product } from "@/types";
import Link from "next/link";
import {
    DollarSign,
    ShoppingBag,
    Eye,
    Plus,
    Truck,
    ExternalLink,
    Package,
    ArrowUpRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const store = await getCurrentStore();
    const supabase = await createClient();

    // Fetch orders and products (optimized queries)
    const [ordersRes, productsRes] = await Promise.all([
        supabase
            .from("orders")
            .select("id, customer_name, customer_phone, customer_address, items, total, status, created_at")
            .eq("store_id", store.id)
            .order("created_at", { ascending: false })
            .limit(50), // Only fetch recent 50 orders for dashboard
        supabase
            .from("products")
            .select("id, is_active")
            .eq("store_id", store.id)
            .eq("is_active", true),
    ])

    const orders = (ordersRes.data as unknown as Order[]) || [];
    const productCount = productsRes.data?.length || 0;

    // Calculate stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const thisMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);
    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59);

    const thisMonthOrders = orders.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate >= thisMonthStart && orderDate <= thisMonthEnd;
    });

    const lastMonthOrders = orders.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate >= lastMonthStart && orderDate <= lastMonthEnd;
    });

    const thisMonthRevenue = thisMonthOrders.reduce((sum, order) => sum + Number(order.total_price), 0);
    const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => sum + Number(order.total_price), 0);

    let revenueChange: number | null = null;
    if (lastMonthRevenue > 0) {
        revenueChange = ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
    }

    let orderCountChange: number | null = null;
    if (lastMonthOrders.length > 0) {
        orderCountChange = ((thisMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length) * 100;
    }

    const recentOrders = orders.slice(0, 5);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "new": return "bg-blue-50 text-blue-700 border-blue-100";
            case "confirmed": return "bg-indigo-50 text-indigo-700 border-indigo-100";
            case "shipped": return "bg-purple-50 text-purple-700 border-purple-100";
            case "delivered": return "bg-emerald-50 text-emerald-700 border-emerald-100";
            case "cancelled": return "bg-red-50 text-red-700 border-red-100";
            default: return "bg-slate-50 text-slate-700 border-slate-100";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "new": return "Nouvelle";
            case "confirmed": return "Confirmée";
            case "shipped": return "Expédiée";
            case "delivered": return "Livrée";
            case "cancelled": return "Annulée";
            default: return status;
        }
    };

    const currentDate = new Date().toLocaleDateString("fr-FR", {
        weekday: "short",
        day: "numeric",
        month: "short",
    });

    return (
        <div className="max-w-[1600px] mx-auto space-y-10 p-4 lg:p-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-tight">
                        Vue d&apos;ensemble
                    </h1>
                    <p className="text-slate-500 mt-2 text-lg font-medium">
                        Voici ce qui se passe sur <span className="text-indigo-600 font-bold">{store.name}</span> aujourd&apos;hui.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 px-6 py-3 bg-white rounded-2xl border border-slate-100 text-sm font-bold text-slate-600 shadow-sm">
                        <span className="text-indigo-500">🗓️</span>
                        <span className="capitalize">{currentDate}</span>
                    </div>
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="group bg-white rounded-[2rem] p-8 border border-white/40 shadow-xl shadow-slate-200/40 hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <DollarSign className="w-32 h-32 text-indigo-600 transform rotate-12 translate-x-8 -translate-y-8" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Revenus (Mensuel)</p>
                        <div className="flex items-baseline gap-2 mb-4">
                            <span className="text-5xl font-black text-slate-900 tracking-tight">
                                {thisMonthRevenue.toFixed(0)}
                            </span>
                            <span className="text-2xl font-bold text-slate-300">TND</span>
                        </div>
                        {revenueChange !== null ? (
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold border ${revenueChange >= 0
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                : 'bg-red-50 text-red-700 border-red-100'
                                }`}>
                                <ArrowUpRight className={`h-3 w-3 ${revenueChange < 0 ? 'rotate-90' : ''}`} />
                                {revenueChange >= 0 ? '+' : ''}{revenueChange.toFixed(0)}% vs mois dernier
                            </div>
                        ) : (
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-50 text-slate-500 text-xs font-bold border border-slate-100">
                                Ce mois
                            </div>
                        )}
                    </div>
                </div>

                <div className="group bg-white rounded-[2rem] p-8 border border-white/40 shadow-xl shadow-slate-200/40 hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Commandes</p>
                        <div className="flex items-baseline gap-2 mb-4">
                            <span className="text-5xl font-black text-slate-900 tracking-tight">
                                {thisMonthOrders.length}
                            </span>
                            <span className="text-lg font-bold text-slate-300">commandes</span>
                        </div>
                        {orderCountChange !== null ? (
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold border ${orderCountChange >= 0
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                : 'bg-red-50 text-red-700 border-red-100'
                                }`}>
                                <ShoppingBag className="h-3 w-3" />
                                {orderCountChange >= 0 ? '+' : ''}{orderCountChange.toFixed(0)}% vs mois dernier
                            </div>
                        ) : (
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-50 text-slate-500 text-xs font-bold border border-slate-100">
                                Ce mois-ci
                            </div>
                        )}
                    </div>
                </div>

                <div className="group bg-white rounded-[2rem] p-8 border border-white/40 shadow-xl shadow-slate-200/40 hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Produits Actifs</p>
                        <div className="flex items-baseline gap-2 mb-4">
                            <span className="text-5xl font-black text-slate-900 tracking-tight">
                                {productCount}
                            </span>
                            <span className="text-lg font-bold text-slate-300">produits</span>
                        </div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-50 text-slate-600 text-xs font-bold border border-slate-100">
                            <Package className="h-3 w-3" />
                            En ligne
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions & Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                        <h2 className="font-bold text-slate-900 mb-6 text-lg tracking-tight">
                            Actions rapides
                        </h2>
                        <div className="space-y-3">
                            <Link
                                href="/dashboard/products"
                                className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-md hover:shadow-indigo-500/5 border border-transparent hover:border-indigo-100 transition-all duration-200 group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-white text-indigo-600 rounded-xl shadow-sm border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                        <Plus className="h-5 w-5" />
                                    </div>
                                    <span className="font-bold text-slate-700 group-hover:text-indigo-900">Nouveau produit</span>
                                </div>
                            </Link>

                            <Link
                                href="/dashboard/settings"
                                className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-md hover:shadow-indigo-500/5 border border-transparent hover:border-indigo-100 transition-all duration-200 group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-white text-slate-600 rounded-xl shadow-sm border border-slate-100 group-hover:text-indigo-600 transition-colors">
                                        <Truck className="h-5 w-5" />
                                    </div>
                                    <span className="font-bold text-slate-700 group-hover:text-indigo-900">Livraison</span>
                                </div>
                            </Link>

                            <Link
                                href="/editor"
                                className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-200 group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-xl">
                                        <Eye className="h-4 w-4" />
                                    </div>
                                    <span className="font-bold">Éditeur Visuel</span>
                                </div>
                                <ArrowUpRight className="h-5 w-5 opacity-50 group-hover:opacity-100" />
                            </Link>

                            <a
                                href={`/${store.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-md hover:shadow-indigo-500/5 border border-transparent hover:border-indigo-100 transition-all duration-200 group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-white text-slate-600 rounded-xl shadow-sm border border-slate-100">
                                        <ExternalLink className="h-5 w-5" />
                                    </div>
                                    <span className="font-bold text-slate-700">Voir ma boutique</span>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                        <div>
                            <h2 className="font-bold text-slate-900 text-xl tracking-tight">
                                Dernières commandes
                            </h2>
                            <p className="text-slate-400 text-sm font-medium mt-1">Vos ventes récentes</p>
                        </div>
                        <Link href="/dashboard/orders" className="px-4 py-2 rounded-xl text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors">
                            Voir tout
                        </Link>
                    </div>

                    <div className="flex-1 overflow-auto bg-slate-50/30 min-h-[400px]">
                        {recentOrders.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-12 text-center h-full">
                                <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center mb-6">
                                    <ShoppingBag className="h-8 w-8 text-slate-300" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">Aucune commande</h3>
                                <p className="text-slate-500 max-w-xs mx-auto">Vos commandes apparaîtront ici dès que vous ferez votre première vente.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {recentOrders.map((order) => (
                                    <div key={order.id} className="p-5 hover:bg-white transition-all hover:shadow-sm group border-l-4 border-transparent hover:border-indigo-500">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-slate-100 font-bold text-lg text-slate-600 shadow-sm">
                                                    {order.customer_name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 text-lg">{order.customer_name}</p>
                                                    <div className="flex items-center gap-3 text-xs text-slate-400 font-medium mt-1">
                                                        <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">#{order.id.slice(0, 5)}</span>
                                                        <span>• {new Date(order.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black text-slate-900 text-lg">{Number(order.total_price).toFixed(0)} <span className="text-sm text-slate-400 font-bold">TND</span></p>
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 mt-1 rounded-full text-xs font-bold ${getStatusColor(order.status)} border`}>
                                                    {getStatusLabel(order.status)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
