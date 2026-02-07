import { createClient } from "@/utils/supabase/server";
import { getCurrentStore } from "@/utils/get-current-store";
import type { Order } from "@/types";
import { BarChart3, TrendingUp, DollarSign, ShoppingBag } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StatsPage() {
    const store = await getCurrentStore();
    const supabase = await createClient();

    const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("store_id", store.id)
        .order("created_at", { ascending: false });

    const orders = (data as Order[]) || [];

    // Calculate stats
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_price), 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="border-b border-zinc-100 pb-8">
                <h1 className="text-4xl font-serif font-bold italic tracking-tight text-zinc-900 leading-tight">Statistiques</h1>
                <p className="text-zinc-500 mt-2 text-lg font-medium">Analysez les performances de votre boutique.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl border border-zinc-100 p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                            <DollarSign className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-sm text-zinc-500 font-medium">Revenus totaux</p>
                            <p className="text-2xl font-black text-zinc-900">{totalRevenue.toFixed(0)} TND</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-zinc-100 p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                            <ShoppingBag className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-sm text-zinc-500 font-medium">Commandes</p>
                            <p className="text-2xl font-black text-zinc-900">{totalOrders}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-zinc-100 p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                            <TrendingUp className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-zinc-500 font-medium">Panier moyen</p>
                            <p className="text-2xl font-black text-zinc-900">{averageOrderValue.toFixed(0)} TND</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Coming Soon */}
            <div className="bg-white rounded-3xl border border-zinc-100 p-12 text-center">
                <div className="w-20 h-20 bg-zinc-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-zinc-100">
                    <BarChart3 className="h-10 w-10 text-zinc-300" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-2">Plus de statistiques à venir</h3>
                <p className="text-zinc-500 max-w-md mx-auto">
                    Des graphiques et analyses détaillées seront bientôt disponibles.
                </p>
            </div>
        </div>
    );
}
