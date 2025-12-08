"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    MessageCircle,
    MapPin,
    Clock,
    Phone,
    Copy,
    ChevronDown,
    ChevronUp,
    Check,
    Truck,
    Package,
    XCircle,
    MoreHorizontal,
    Trash2,
    Loader2,
    Printer,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShippingLabel } from "./ShippingLabel";
import type { Order, OrderStatus } from "@/types";

interface OrderCardProps {
    order: Order;
    storeName: string;
    onStatusChange?: (orderId: string, newStatus: OrderStatus) => void;
    onDelete?: (orderId: string) => void;
}

const STATUS_FLOW: OrderStatus[] = ["new", "confirmed", "shipped", "delivered"];

export function OrderCard({ order, storeName, onStatusChange, onDelete }: OrderCardProps) {
    const [expanded, setExpanded] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showLabel, setShowLabel] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const productDetails = order.product_details as {
        title: string;
        price: number;
        quantity?: number;
    } | null;

    const getRelativeTime = (date: string) => {
        const now = new Date();
        const orderDate = new Date(date);
        const diffMs = now.getTime() - orderDate.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "À l'instant";
        if (diffMins < 60) return `Il y a ${diffMins}min`;
        if (diffHours < 24) return `Il y a ${diffHours}h`;
        if (diffDays < 7) return `Il y a ${diffDays}j`;
        return orderDate.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
    };

    const cleanPhone = order.customer_phone.replace(/[\s+]/g, "");

    const getWhatsAppMessage = () => {
        switch (order.status) {
            case "new":
                return `Bonjour ${order.customer_name}, merci pour votre commande sur ${storeName}. Total : ${order.total_price} TND. On confirme ?`;
            case "confirmed":
                return `Bonjour ${order.customer_name}, votre commande de ${order.total_price} TND est confirmée ! On prépare l'expédition.`;
            case "shipped":
                return `Bonjour ${order.customer_name}, bonne nouvelle ! Votre commande a été expédiée.`;
            default:
                return `Bonjour ${order.customer_name}, concernant votre commande sur ${storeName}...`;
        }
    };

    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(getWhatsAppMessage())}`;
    const callUrl = `tel:${order.customer_phone}`;

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            new: "bg-blue-100 text-blue-700 border-blue-200",
            confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
            shipped: "bg-amber-100 text-amber-700 border-amber-200",
            delivered: "bg-green-100 text-green-700 border-green-200",
            cancelled: "bg-red-100 text-red-700 border-red-200",
        };
        return colors[status] || "bg-slate-100 text-slate-700 border-slate-200";
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            new: "Nouvelle",
            confirmed: "Confirmée",
            shipped: "Expédiée",
            delivered: "Livrée",
            cancelled: "Annulée",
        };
        return labels[status] || status;
    };

    const getNextStatus = (): OrderStatus | null => {
        if (order.status === "cancelled" || order.status === "delivered") return null;
        const currentIndex = STATUS_FLOW.indexOf(order.status as OrderStatus);
        if (currentIndex === -1 || currentIndex >= STATUS_FLOW.length - 1) return null;
        return STATUS_FLOW[currentIndex + 1];
    };

    const getNextStatusButton = () => {
        const nextStatus = getNextStatus();
        if (!nextStatus) return null;

        const config: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
            confirmed: { label: "Confirmer", icon: <Check className="h-3.5 w-3.5" />, color: "bg-emerald-500 hover:bg-emerald-600" },
            shipped: { label: "Expédier", icon: <Truck className="h-3.5 w-3.5" />, color: "bg-amber-500 hover:bg-amber-600" },
            delivered: { label: "Livrée", icon: <Package className="h-3.5 w-3.5" />, color: "bg-green-500 hover:bg-green-600" },
        };
        return config[nextStatus];
    };

    const handleStatusChange = async (newStatus: OrderStatus) => {
        setIsUpdating(true);
        try {
            const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", order.id);
            if (error) throw error;
            if (onStatusChange) onStatusChange(order.id, newStatus);
            router.refresh();
        } catch (err) {
            console.error("Erreur de mise à jour:", err);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Supprimer cette commande définitivement ?")) return;
        setIsUpdating(true);
        try {
            const { error } = await supabase.from("orders").delete().eq("id", order.id);
            if (error) throw error;
            if (onDelete) onDelete(order.id);
            router.refresh();
        } catch (err) {
            console.error("Erreur de suppression:", err);
        } finally {
            setIsUpdating(false);
        }
    };

    const copyPhone = async () => {
        try {
            await navigator.clipboard.writeText(order.customer_phone);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Erreur de copie:", err);
        }
    };

    const nextStatusButton = getNextStatusButton();

    return (
        <>
            <Card className={`border shadow-sm overflow-hidden transition-all ${order.status === "cancelled" ? "opacity-60" : ""}`}>
                <CardContent className="p-0">
                    {/* Header */}
                    <div className="flex items-start justify-between p-4 pb-3">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-semibold text-slate-900 truncate">{order.customer_name}</h3>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${getStatusColor(order.status)}`}>
                                    {getStatusLabel(order.status)}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                                <div className="flex items-center gap-1 text-sm text-slate-500">
                                    <MapPin className="h-3 w-3" />
                                    <span className="truncate">{order.customer_city || order.customer_governorate}</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-slate-400">
                                    <Clock className="h-3 w-3" />
                                    {getRelativeTime(order.created_at)}
                                </div>
                            </div>
                        </div>

                        {/* Actions Menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={copyPhone}>
                                    {copied ? <Check className="h-4 w-4 mr-2 text-green-500" /> : <Copy className="h-4 w-4 mr-2" />}
                                    {copied ? "Copié !" : "Copier téléphone"}
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <a href={callUrl}>
                                        <Phone className="h-4 w-4 mr-2" />
                                        Appeler
                                    </a>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setShowLabel(true)}>
                                    <Printer className="h-4 w-4 mr-2" />
                                    Imprimer étiquette
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {order.status !== "cancelled" && (
                                    <DropdownMenuItem onClick={() => handleStatusChange("cancelled")} className="text-amber-600">
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Annuler la commande
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Supprimer
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Product */}
                    {productDetails && (
                        <div className="px-4 py-2 bg-slate-50 border-y border-slate-100">
                            <p className="text-sm text-slate-600 truncate">
                                {productDetails.quantity && productDetails.quantity > 1 && <span className="font-medium">{productDetails.quantity}x </span>}
                                {productDetails.title}
                            </p>
                        </div>
                    )}

                    {/* Expandable Details */}
                    {expanded && (
                        <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <Phone className="h-3.5 w-3.5 text-slate-400" />
                                <span className="text-slate-600">{order.customer_phone}</span>
                                <button onClick={copyPhone} className="text-xs text-blue-500 hover:text-blue-600">
                                    {copied ? "Copié !" : "Copier"}
                                </button>
                            </div>
                            <div className="flex items-start gap-2">
                                <MapPin className="h-3.5 w-3.5 text-slate-400 mt-0.5" />
                                <div className="text-slate-600">
                                    <p>{order.customer_governorate}</p>
                                    {order.customer_city && <p>{order.customer_city}</p>}
                                    {order.customer_address && <p className="text-slate-500">{order.customer_address}</p>}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                <Clock className="h-3 w-3" />
                                {new Date(order.created_at).toLocaleString("fr-FR", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between p-4 pt-3">
                        <div className="flex items-center gap-2">
                            <p className="text-2xl font-bold text-emerald-600">
                                {order.total_price} <span className="text-base font-medium">TND</span>
                            </p>
                            <button onClick={() => setExpanded(!expanded)} className="p-1 text-slate-400 hover:text-slate-600">
                                {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            {nextStatusButton && order.status !== "cancelled" && (
                                <Button
                                    onClick={() => handleStatusChange(getNextStatus()!)}
                                    className={`${nextStatusButton.color} text-white rounded-full px-4 text-sm`}
                                    size="sm"
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? (
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    ) : (
                                        <>
                                            {nextStatusButton.icon}
                                            <span className="ml-1.5">{nextStatusButton.label}</span>
                                        </>
                                    )}
                                </Button>
                            )}
                            <Button asChild size="sm" className="bg-green-500 hover:bg-green-600 text-white rounded-full px-4">
                                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                                    <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
                                    <span className="hidden sm:inline">WhatsApp</span>
                                </a>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Shipping Label Modal */}
            {showLabel && (
                <ShippingLabel
                    order={order}
                    storeName={storeName}
                    onClose={() => setShowLabel(false)}
                />
            )}
        </>
    );
}
