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
            case "new": return <Clock className="h-4 w-4" />;
            case "confirmed": return <CheckCircle className="h-4 w-4" />;
            case "shipped": return <Truck className="h-4 w-4" />;
            case "delivered": return <Package className="h-4 w-4" />;
            case "cancelled": return <XCircle className="h-4 w-4" />;
            default: return <Clock className="h-4 w-4" />;
        }
    };

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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Commandes</h1>
                    <p className="text-slate-500">{allOrders.length} commande{allOrders.length !== 1 ? "s" : ""}</p>
                </div>
            </div>

            {/* Orders List */}
            {allOrders.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingBag className="h-8 w-8 text-slate-300" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">Aucune commande</h3>
                    <p className="text-slate-500 mb-6">Les commandes de vos clients apparaîtront ici</p>
                    <a
                        href={`/${currentStore.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                    >
                        Voir ma boutique
                    </a>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="divide-y divide-slate-100">
                        {allOrders.map((order) => (
                            <div key={order.id} className="p-4 hover:bg-slate-50 transition-colors">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-sm font-medium text-slate-600">
                                                {order.customer_name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-semibold text-slate-900">{order.customer_name}</p>
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                    {getStatusIcon(order.status)}
                                                    {getStatusLabel(order.status)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                                <span className="flex items-center gap-1">
                                                    <Phone className="h-3 w-3" />
                                                    {order.customer_phone}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" />
                                                    {order.customer_governorate}
                                                </span>
                                            </div>
                                            {order.product_details && (
                                                <p className="text-sm text-slate-600 mt-1">
                                                    {(order.product_details as { title?: string }).title || "Produit"}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="font-bold text-slate-900">{Number(order.total_price).toFixed(0)} TND</p>
                                        <p className="text-xs text-slate-400">{formatDate(order.created_at)}</p>
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
