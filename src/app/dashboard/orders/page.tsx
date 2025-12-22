import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import type { Store, Order } from "@/types";
import Link from "next/link";
import {
    ShoppingBag,
    Phone,
    MapPin,
    Clock,
    CheckCircle,
    Truck,
    XCircle,
    Package,
} from "lucide-react";

// Cache for smoother navigation
export const revalidate = 60;

export default async function OrdersPage() {
    const supabase = await createClient();
    const cookieStore = await cookies();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        redirect("/login");
    }

    // Get current store from cookie
    const currentStoreId = cookieStore.get("current_store_id")?.value;

    if (!currentStoreId) {
        redirect("/dashboard");
    }

    // Fetch store
    const { data: store, error: storeError } = await supabase
        .from("stores")
        .select("*")
        .eq("id", currentStoreId)
        .single();

    if (storeError || !store) {
        redirect("/dashboard");
    }

    const currentStore = store as Store;

    // Fetch orders
    const { data: orders } = await supabase
        .from("orders")
        .select("*")
        .eq("store_id", currentStore.id)
        .order("created_at", { ascending: false });

    const allOrders = (orders as Order[]) || [];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "new": return <Clock className="h-3.5 w-3.5" />;
            case "confirmed": return <CheckCircle className="h-3.5 w-3.5" />;
            case "shipped": return <Truck className="h-3.5 w-3.5" />;
            case "delivered": return <Package className="h-3.5 w-3.5" />;
            case "cancelled": return <XCircle className="h-3.5 w-3.5" />;
            default: return <Clock className="h-3.5 w-3.5" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "new": return "bg-blue-50 text-blue-700 border-blue-100";
            case "confirmed": return "bg-amber-50 text-amber-700 border-amber-100";
            case "shipped": return "bg-violet-50 text-violet-700 border-violet-100";
            case "delivered": return "bg-emerald-50 text-emerald-700 border-emerald-100";
            case "cancelled": return "bg-red-50 text-red-700 border-red-100";
            default: return "bg-zinc-50 text-zinc-700 border-zinc-100";
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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const currentDate = new Date().toLocaleDateString("fr-FR", {
        weekday: "short",
        day: "numeric",
        month: "short",
    });

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 pb-8">
                <div>
                    <h1 className="text-4xl font-serif font-bold italic tracking-tight text-zinc-900 leading-tight">
                        Commandes
                    </h1>
                    <p className="text-zinc-500 mt-2 text-lg font-medium">
                        Suivez et gérez l&apos;activité de votre boutique.
                    </p>
                </div>
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-zinc-200 text-sm font-bold text-zinc-600 shadow-sm">
                    <Clock className="h-4 w-4 text-zinc-400" />
                    {currentDate.replace(".", "")}
                </div>
            </div>

            {/* Orders List */}
            {allOrders.length === 0 ? (
                <div className="bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-zinc-200 p-16 text-center">
                    <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <ShoppingBag className="h-8 w-8 text-zinc-300" />
                    </div>
                    <h3 className="font-serif font-bold text-xl text-zinc-900 mb-2 italic">Aucune commande pour le moment</h3>
                    <p className="text-zinc-500 mb-8 max-w-sm mx-auto">
                        Partagez le lien de votre boutique pour recevoir vos premières commandes.
                    </p>
                    <a
                        href={`/${currentStore.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-all font-bold shadow-lg shadow-zinc-900/20"
                    >
                        <ShoppingBag className="h-4 w-4" />
                        Voir ma boutique
                    </a>
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-zinc-100 overflow-hidden shadow-sm">
                    <div className="divide-y divide-zinc-50">
                        {allOrders.map((order) => (
                            <div key={order.id} className="p-5 hover:bg-zinc-50/80 transition-all group cursor-default">
                                <div className="flex items-start justify-between gap-6">
                                    <div className="flex items-start gap-5 flex-1">
                                        {/* Avatar */}
                                        <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center flex-shrink-0 border border-zinc-100 shadow-sm group-hover:scale-105 transition-transform">
                                            <span className="text-lg font-serif font-bold italic text-zinc-600">
                                                {order.customer_name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0 pt-0.5">
                                            <div className="flex items-center gap-3 mb-2">
                                                <p className="font-bold text-zinc-900 text-lg">{order.customer_name}</p>
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider border ${getStatusColor(order.status)}`}>
                                                    {getStatusIcon(order.status)}
                                                    {getStatusLabel(order.status)}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-zinc-500 font-medium">
                                                <span className="flex items-center gap-1.5">
                                                    <Phone className="h-3.5 w-3.5 text-zinc-400" />
                                                    {order.customer_phone}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                                                    {order.customer_governorate}
                                                </span>
                                            </div>

                                            {order.product_details && (
                                                <div className="mt-3 flex items-center gap-2 text-sm text-zinc-600">
                                                    <div className="w-1 h-1 rounded-full bg-zinc-300" />
                                                    <span className="font-medium">{(order.product_details as { title?: string }).title || "Produit"}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action/Price */}
                                    <div className="text-right flex-shrink-0">
                                        <p className="font-serif font-bold italic text-2xl text-zinc-900 mb-1">
                                            {Number(order.total_price).toFixed(0)} <span className="text-sm font-sans font-normal text-zinc-400 not-italic">TND</span>
                                        </p>
                                        <p className="text-xs font-medium text-zinc-400">{formatDate(order.created_at)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
