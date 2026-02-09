import { createClient } from "@/utils/supabase/server";
import { getCurrentStore } from "@/utils/get-current-store";
import type { Order } from "@/types";
import Link from "next/link";
import {
    ShoppingBag,
    Clock,
    CheckCircle,
    Truck,
    Package,
    XCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
    const store = await getCurrentStore();
    const supabase = await createClient();

    const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("store_id", store.id)
        .order("created_at", { ascending: false });

    const orders = (data as Order[]) || [];

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

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "new": return Clock;
            case "confirmed": return CheckCircle;
            case "shipped": return Truck;
            case "delivered": return Package;
            case "cancelled": return XCircle;
            default: return Clock;
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="border-b border-zinc-100 pb-8">
                <h1 className="text-2xl sm:text-4xl font-serif font-bold italic tracking-tight text-zinc-900 leading-tight">Commandes</h1>
                <p className="text-zinc-500 mt-1 sm:mt-2 text-sm sm:text-lg font-medium">Suivez et gérez l&apos;activité de votre boutique.</p>
            </div>

            {/* Orders List */}
            {orders.length === 0 ? (
                <div className="bg-white rounded-3xl border border-zinc-100 p-12 text-center">
                    <div className="w-20 h-20 bg-zinc-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-zinc-100">
                        <ShoppingBag className="h-10 w-10 text-zinc-300" />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 mb-2">Aucune commande pour le moment</h3>
                    <p className="text-zinc-500 max-w-md mx-auto mb-8">
                        Partagez le lien de votre boutique pour recevoir vos premières commandes.
                    </p>
                    <a
                        href={`/${store.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-colors"
                    >
                        <ShoppingBag className="h-4 w-4" />
                        Voir ma boutique
                    </a>
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-zinc-100 overflow-hidden divide-y divide-zinc-50">
                    {orders.map((order) => {
                        const StatusIcon = getStatusIcon(order.status);
                        return (
                            <div key={order.id} className="p-4 sm:p-6 hover:bg-zinc-50/50 transition-colors">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div className="flex items-center gap-3 sm:gap-5">
                                        <div className="w-10 h-10 sm:w-14 sm:h-14 bg-zinc-100 rounded-xl sm:rounded-2xl flex items-center justify-center font-bold text-base sm:text-xl text-zinc-600 shrink-0">
                                            {order.customer_name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-zinc-900 text-base sm:text-lg truncate">{order.customer_name}</p>
                                            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-zinc-400 mt-0.5 sm:mt-1">
                                                <span className="font-mono bg-zinc-100 px-1.5 sm:px-2 py-0.5 rounded text-zinc-500 text-xs">
                                                    #{order.id.slice(0, 8)}
                                                </span>
                                                <span>•</span>
                                                <span>{new Date(order.created_at).toLocaleDateString("fr-FR", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 pl-13 sm:pl-0">
                                        <div>
                                            <p className="font-black text-zinc-900 text-base sm:text-xl">
                                                {Number(order.total_price).toFixed(0)} <span className="text-xs sm:text-sm text-zinc-400 font-bold">TND</span>
                                            </p>
                                        </div>
                                        <span className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold ${getStatusColor(order.status)} border shrink-0`}>
                                            <StatusIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                            {getStatusLabel(order.status)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
