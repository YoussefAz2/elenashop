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
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                        Bonjour, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">{currentStore.name}</span> <span className="animate-wave inline-block origin-[70%_70%]">👋</span>
                    </h1>
                    <p className="text-slate-500 mt-2 text-lg font-medium">
                        Voici ce qui se passe dans votre boutique aujourd'hui.
                    </p>
                </div>
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-md rounded-full border border-white/50 text-sm font-semibold text-slate-600 shadow-sm">
                    <span className="text-emerald-500">🗓️</span>
                    {currentDate.replace(".", "")}
                </div>
            </div>

            {/* Metric Cards - Glassmorphism */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="group relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-xl shadow-slate-200/50 p-6 hover:scale-[1.02] transition-all duration-300">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                        <DollarSign className="h-24 w-24 text-emerald-600" />
                    </div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <div className="inline-flex p-3 rounded-xl bg-emerald-100/50 text-emerald-600 mb-4 shadow-sm">
                                <DollarSign className="h-6 w-6" />
                            </div>
                            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Chiffre d'affaires</p>
                            <div className="mt-2 flex items-baseline gap-2">
                                <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
                                    {totalRevenue.toFixed(0)}
                                </span>
                                <span className="text-xl font-medium text-slate-400">TND</span>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-sm text-emerald-600 font-medium bg-emerald-50/50 w-fit px-2 py-1 rounded-lg">
                            <span>+12.5%</span>
                            <span className="text-emerald-600/60">vs mois dernier</span>
                        </div>
                    </div>
                </div>

                <div className="group relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-xl shadow-slate-200/50 p-6 hover:scale-[1.02] transition-all duration-300">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                        <ShoppingBag className="h-24 w-24 text-blue-600" />
                    </div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <div className="inline-flex p-3 rounded-xl bg-blue-100/50 text-blue-600 mb-4 shadow-sm">
                                <ShoppingBag className="h-6 w-6" />
                            </div>
                            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Commandes</p>
                            <div className="mt-2 flex items-baseline gap-2">
                                <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
                                    {monthOrders.length}
                                </span>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-sm text-blue-600 font-medium bg-blue-50/50 w-fit px-2 py-1 rounded-lg">
                            <span>+5</span>
                            <span className="text-blue-600/60">nouvelles</span>
                        </div>
                    </div>
                </div>

                <div className="group relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-xl shadow-slate-200/50 p-6 hover:scale-[1.02] transition-all duration-300">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                        <Package className="h-24 w-24 text-purple-600" />
                    </div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <div className="inline-flex p-3 rounded-xl bg-purple-100/50 text-purple-600 mb-4 shadow-sm">
                                <Package className="h-6 w-6" />
                            </div>
                            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Produits actifs</p>
                            <div className="mt-2 flex items-baseline gap-2">
                                <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
                                    {productCount}
                                </span>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-sm text-purple-600 font-medium bg-purple-50/50 w-fit px-2 py-1 rounded-lg">
                            <span>Stock maintenu</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions & Recent Orders Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Actions */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-xl shadow-slate-200/50 p-6">
                        <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
                            Actions rapides
                        </h2>
                        <div className="space-y-3">
                            <Link
                                href="/dashboard/products"
                                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-all duration-200 group"
                            >
                                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg group-hover:scale-110 transition-transform">
                                    <Plus className="h-5 w-5" />
                                </div>
                                <span className="font-medium text-slate-700">Nouveau produit</span>
                            </Link>

                            <Link
                                href="/dashboard/settings"
                                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-all duration-200 group"
                            >
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                                    <Truck className="h-5 w-5" />
                                </div>
                                <span className="font-medium text-slate-700">Livraison</span>
                            </Link>

                            <a
                                href={`/${currentStore.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-all duration-200 group"
                            >
                                <div className="p-2 bg-violet-100 text-violet-600 rounded-lg group-hover:scale-110 transition-transform">
                                    <ExternalLink className="h-5 w-5" />
                                </div>
                                <span className="font-medium text-slate-700">Voir la boutique</span>
                            </a>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-200">
                        <h3 className="font-bold text-lg mb-2">Besoin d'aide ?</h3>
                        <p className="text-indigo-100 text-sm mb-4">Notre équipe est là pour vous aider à configurer votre boutique.</p>
                        <button className="w-full py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-sm font-semibold transition-colors">
                            Contacter le support
                        </button>
                    </div>
                </div>

                {/* Orders List */}
                <div className="lg:col-span-2 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-100/50 flex items-center justify-between bg-white/40">
                        <h2 className="font-bold text-slate-900 flex items-center gap-2">
                            <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                            Dernières commandes
                        </h2>
                        <Link href="/dashboard/orders" className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold hover:underline">
                            Voir tout →
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
                            <div className="divide-y divide-slate-100/50">
                                {recentOrders.map((order) => (
                                    <div key={order.id} className="p-4 hover:bg-white/60 transition-colors group">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center border border-white shadow-sm font-bold text-slate-600">
                                                    {order.customer_name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{order.customer_name}</p>
                                                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                                        <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-medium">#{order.id.slice(0, 5)}</span>
                                                        <span>• {new Date(order.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-slate-900 text-lg">{Number(order.total_price).toFixed(0)} TND</p>
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(order.status).replace('bg-', 'bg-opacity-20 bg-').replace('text-', 'text-')}`}>
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
