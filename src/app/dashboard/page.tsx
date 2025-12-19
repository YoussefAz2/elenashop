import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import type { Order, Store, StoreWithRole } from "@/types";
import Link from "next/link";
import {
    DollarSign,
    ShoppingBag,
    Eye,
    Plus,
    Truck,
    ExternalLink,
    Package,
    Clock,
    CheckCircle,
    XCircle,
} from "lucide-react";

interface PageProps {
    searchParams: Promise<{ store?: string }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
    const supabase = await createClient();
    const cookieStore = await cookies();
    const params = await searchParams;

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        redirect("/login");
    }

    // Handle store selection from query param (set cookie)
    const storeFromParam = params.store;
    if (storeFromParam) {
        cookieStore.set("current_store_id", storeFromParam, { path: "/", maxAge: 31536000 });
    }

    // Try to get store from cookie or query param
    const cookieStoreId = storeFromParam || cookieStore.get("current_store_id")?.value;

    let currentStore: Store | null = null;
    let allStores: StoreWithRole[] = [];

    // Try direct store load if we have a cookie
    if (cookieStoreId) {
        try {
            const { data } = await supabase
                .from("stores")
                .select("*")
                .eq("id", cookieStoreId)
                .single();

            if (data) {
                currentStore = data as Store;
                allStores = [{ ...currentStore, role: "owner" as const }];
            }
        } catch (e) {
            console.error("Direct store load failed:", e);
        }
    }

    // If no store from cookie, try membership query
    if (!currentStore) {
        try {
            const { data: memberships } = await supabase
                .from("store_members")
                .select("store_id, role")
                .eq("user_id", user.id);

            if (memberships && memberships.length > 0) {
                const storeIds = memberships.map(m => m.store_id);

                const { data: stores } = await supabase
                    .from("stores")
                    .select("*")
                    .in("id", storeIds);

                if (stores && stores.length > 0) {
                    allStores = stores.map(store => {
                        const membership = memberships.find(m => m.store_id === store.id);
                        const role = (membership?.role || "owner") as "owner" | "admin" | "editor";
                        return { ...store, role };
                    }) as StoreWithRole[];

                    currentStore = allStores[0] as Store;
                }
            }
        } catch (e) {
            console.error("Membership query failed:", e);
        }
    }

    // Multiple stores and no preference saved - show selection page
    if (allStores.length > 1 && !cookieStoreId) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <div className="w-full max-w-2xl">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                            <span className="text-3xl">🏪</span>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">
                            Choisissez une boutique
                        </h1>
                        <p className="text-slate-600">
                            Vous avez accès à {allStores.length} boutiques
                        </p>
                    </div>

                    <div className="grid gap-4">
                        {allStores.map((store) => (
                            <a
                                key={store.id}
                                href={`/dashboard?store=${store.id}`}
                                className="block p-6 bg-white rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                                        {store.name.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-slate-900">{store.name}</h3>
                                        <p className="text-slate-500 text-sm">/{store.slug}</p>
                                    </div>
                                    <div className="text-emerald-600">→</div>
                                </div>
                            </a>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <Link href="/onboarding" className="text-emerald-600 hover:text-emerald-700 font-medium">
                            + Créer une nouvelle boutique
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // No store found - show helpful page
    if (!currentStore) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <div className="text-center p-8 bg-white rounded-xl border border-slate-200 max-w-md">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-6">
                        <span className="text-3xl">🏪</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-4">Bienvenue !</h1>
                    <p className="text-slate-600 mb-6">Créez votre première boutique pour commencer.</p>
                    <Link
                        href="/onboarding"
                        className="inline-block px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                        Créer ma boutique
                    </Link>
                </div>
            </div>
        );
    }

    // Fetch orders and products count
    const [ordersRes, productsRes] = await Promise.all([
        supabase
            .from("orders")
            .select("*")
            .eq("store_id", currentStore.id)
            .order("created_at", { ascending: false }),
        supabase
            .from("products")
            .select("id")
            .eq("store_id", currentStore.id)
            .eq("is_active", true),
    ]);

    const allOrders = (ordersRes.data as Order[]) || [];
    const productCount = productsRes.data?.length || 0;

    // Calculate stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const monthOrders = allOrders.filter(order => new Date(order.created_at) >= thisMonth);
    const totalRevenue = monthOrders.reduce((sum, order) => sum + Number(order.total_price), 0);
    const recentOrders = allOrders.slice(0, 5);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "new": return "bg-blue-100 text-blue-700";
            case "confirmed": return "bg-amber-100 text-amber-700";
            case "shipped": return "bg-purple-100 text-purple-700";
            case "delivered": return "bg-emerald-100 text-emerald-700";
            case "cancelled": return "bg-red-100 text-red-700";
            default: return "bg-slate-100 text-slate-700";
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
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header - Clean & Bold */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 leading-tight font-display">
                        Bonjour, {currentStore.name}
                    </h1>
                    <p className="text-slate-500 mt-2 text-lg font-medium">
                        Aperçu de vos performances aujourd'hui.
                    </p>
                </div>
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 text-sm font-semibold text-slate-600 shadow-sm">
                    <span className="text-slate-400">🗓️</span>
                    {currentDate.replace(".", "")}
                </div>
            </div>

            {/* Metric Cards - Solid Premium Look */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="group bg-white rounded-2xl border border-slate-200 p-6 hover:border-slate-300 transition-all duration-300 shadow-sm hover:shadow-md">
                    <div className="flex flex-col h-full justify-between">
                        <div className="flex items-start justify-between mb-8">
                            <div>
                                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Chiffre d'affaires</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-bold text-slate-900 tracking-tight">
                                        {totalRevenue.toFixed(0)}
                                    </span>
                                    <span className="text-xl font-medium text-slate-400">TND</span>
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-50 text-slate-900 border border-slate-100">
                                <DollarSign className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100/50">+12.5%</span>
                            <span className="text-slate-400">vs mois dernier</span>
                        </div>
                    </div>
                </div>

                <div className="group bg-white rounded-2xl border border-slate-200 p-6 hover:border-slate-300 transition-all duration-300 shadow-sm hover:shadow-md">
                    <div className="flex flex-col h-full justify-between">
                        <div className="flex items-start justify-between mb-8">
                            <div>
                                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Commandes</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-bold text-slate-900 tracking-tight">
                                        {monthOrders.length}
                                    </span>
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-50 text-slate-900 border border-slate-100">
                                <ShoppingBag className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100/50">+5</span>
                            <span className="text-slate-400">nouvelles</span>
                        </div>
                    </div>
                </div>

                <div className="group bg-white rounded-2xl border border-slate-200 p-6 hover:border-slate-300 transition-all duration-300 shadow-sm hover:shadow-md">
                    <div className="flex flex-col h-full justify-between">
                        <div className="flex items-start justify-between mb-8">
                            <div>
                                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Produits actifs</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-bold text-slate-900 tracking-tight">
                                        {productCount}
                                    </span>
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-50 text-slate-900 border border-slate-100">
                                <Package className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">Stock maintenu</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions & Recent Orders Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Actions */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        <h2 className="font-bold text-slate-900 mb-6 text-lg">
                            Actions rapides
                        </h2>
                        <div className="space-y-3">
                            <Link
                                href="/dashboard/products"
                                className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-all duration-200 group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white text-slate-900 rounded-lg shadow-sm border border-slate-100">
                                        <Plus className="h-4 w-4" />
                                    </div>
                                    <span className="font-semibold text-slate-700">Nouveau produit</span>
                                </div>
                                <span className="text-slate-400 group-hover:text-slate-600">→</span>
                            </Link>

                            <Link
                                href="/dashboard/settings"
                                className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-all duration-200 group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white text-slate-900 rounded-lg shadow-sm border border-slate-100">
                                        <Truck className="h-4 w-4" />
                                    </div>
                                    <span className="font-semibold text-slate-700">Livraison</span>
                                </div>
                                <span className="text-slate-400 group-hover:text-slate-600">→</span>
                            </Link>

                            <a
                                href={`/${currentStore.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-all duration-200 group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white text-slate-900 rounded-lg shadow-sm border border-slate-100">
                                        <ExternalLink className="h-4 w-4" />
                                    </div>
                                    <span className="font-semibold text-slate-700">Voir la boutique</span>
                                </div>
                                <span className="text-slate-400 group-hover:text-slate-600">→</span>
                            </a>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl shadow-slate-200">
                        <h3 className="font-bold text-lg mb-2">Besoin d'aide ?</h3>
                        <p className="text-slate-400 text-sm mb-6">Notre équipe est là pour vous aider à configurer votre boutique.</p>
                        <button className="w-full py-3 bg-white text-slate-900 hover:bg-slate-50 rounded-xl text-sm font-bold transition-colors">
                            Contacter le support
                        </button>
                    </div>
                </div>

                {/* Orders List */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h2 className="font-bold text-slate-900 text-lg">
                            Dernières commandes
                        </h2>
                        <Link href="/dashboard/orders" className="text-sm text-slate-500 hover:text-slate-900 font-semibold hover:underline">
                            Voir tout
                        </Link>
                    </div>

                    <div className="flex-1 overflow-auto">
                        {recentOrders.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                    <ShoppingBag className="h-8 w-8 text-slate-300" />
                                </div>
                                <h3 className="font-medium text-slate-900 mb-1">Aucune commande</h3>
                                <p className="text-sm text-slate-500">Les commandes apparaîtront ici</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {recentOrders.map((order) => (
                                    <div key={order.id} className="p-4 hover:bg-slate-50 transition-colors group">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200 font-bold text-slate-600">
                                                    {order.customer_name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{order.customer_name}</p>
                                                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                                        <span className="font-mono text-slate-400">#{order.id.slice(0, 5)}</span>
                                                        <span>• {new Date(order.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-slate-900 text-lg">{Number(order.total_price).toFixed(0)} TND</p>
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide border ${getStatusColor(order.status).replace('bg-', 'bg-opacity-10 bg-').replace('text-', 'text-').replace('bg-opacity-20', 'bg-opacity-10')} border-opacity-20`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full bg-current`} />
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
