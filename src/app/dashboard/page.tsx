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

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Vue d'ensemble</h1>
                <p className="text-slate-500">Bienvenue sur votre tableau de bord</p>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                            <DollarSign className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Chiffre d'affaires</p>
                            <p className="text-2xl font-bold text-slate-900">{totalRevenue.toFixed(0)} TND</p>
                            <p className="text-xs text-slate-400">Ce mois-ci</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <ShoppingBag className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Commandes</p>
                            <p className="text-2xl font-bold text-slate-900">{monthOrders.length}</p>
                            <p className="text-xs text-slate-400">Ce mois-ci</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <Package className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Produits actifs</p>
                            <p className="text-2xl font-bold text-slate-900">{productCount}</p>
                            <p className="text-xs text-slate-400">En vente</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="font-semibold text-slate-900 mb-4">Actions rapides</h2>
                <div className="flex flex-wrap gap-3">
                    <Link
                        href="/dashboard/products"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                    >
                        <Plus className="h-4 w-4" />
                        Nouveau produit
                    </Link>
                    <Link
                        href="/dashboard/settings"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                    >
                        <Truck className="h-4 w-4" />
                        Configurer livraison
                    </Link>
                    <a
                        href={`/${currentStore.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                    >
                        <ExternalLink className="h-4 w-4" />
                        Voir ma boutique
                    </a>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl border border-slate-200">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="font-semibold text-slate-900">Dernières commandes</h2>
                    <Link href="/dashboard/orders" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                        Voir tout →
                    </Link>
                </div>

                {recentOrders.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShoppingBag className="h-8 w-8 text-slate-300" />
                        </div>
                        <h3 className="font-medium text-slate-900 mb-1">Aucune commande</h3>
                        <p className="text-sm text-slate-500">Les commandes apparaîtront ici</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {recentOrders.map((order) => (
                            <div key={order.id} className="p-4 hover:bg-slate-50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-medium text-slate-600">
                                                {order.customer_name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">{order.customer_name}</p>
                                            <p className="text-sm text-slate-500">{order.customer_phone}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-slate-900">{Number(order.total_price).toFixed(0)} TND</p>
                                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
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
    );
}
