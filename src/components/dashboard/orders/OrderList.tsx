"use client";

import { useState, useMemo } from "react";
import { ShoppingBag, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Order, StatusFilter } from "@/types";
import { OrderCard } from "./OrderCard";

interface OrderListProps {
    orders: Order[];
    storeName: string;
}

const STATUS_FILTERS: { value: StatusFilter; label: string; color: string }[] = [
    { value: "all", label: "Toutes", color: "bg-slate-100 text-slate-700" },
    { value: "new", label: "Nouvelles", color: "bg-blue-100 text-blue-700" },
    { value: "confirmed", label: "Confirmées", color: "bg-emerald-100 text-emerald-700" },
    { value: "shipped", label: "Expédiées", color: "bg-amber-100 text-amber-700" },
    { value: "delivered", label: "Livrées", color: "bg-green-100 text-green-700" },
    { value: "cancelled", label: "Annulées", color: "bg-red-100 text-red-700" },
];

export function OrderList({ orders: initialOrders, storeName }: OrderListProps) {
    const [orders, setOrders] = useState(initialOrders);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Filter orders
    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            // Status filter
            if (statusFilter !== "all" && order.status !== statusFilter) {
                return false;
            }
            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesName = order.customer_name.toLowerCase().includes(query);
                const matchesPhone = order.customer_phone.includes(query);
                const matchesCity = order.customer_city?.toLowerCase().includes(query);
                const matchesGov = order.customer_governorate.toLowerCase().includes(query);
                const productDetails = order.product_details as { title: string } | null;
                const matchesProduct = productDetails?.title.toLowerCase().includes(query);

                if (!matchesName && !matchesPhone && !matchesCity && !matchesGov && !matchesProduct) {
                    return false;
                }
            }
            return true;
        });
    }, [orders, statusFilter, searchQuery]);

    // Count by status
    const statusCounts = useMemo(() => {
        const counts: Record<StatusFilter, number> = {
            all: orders.length,
            new: 0,
            confirmed: 0,
            shipped: 0,
            delivered: 0,
            cancelled: 0,
        };
        orders.forEach((order) => {
            counts[order.status as StatusFilter]++;
        });
        return counts;
    }, [orders]);

    const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
        setOrders((prev) =>
            prev.map((order) =>
                order.id === orderId ? { ...order, status: newStatus } : order
            )
        );
    };

    const handleDelete = (orderId: string) => {
        setOrders((prev) => prev.filter((order) => order.id !== orderId));
    };

    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <ShoppingBag className="h-12 w-12 text-slate-300 mb-4" />
                <p className="text-slate-500">Aucune commande pour le moment</p>
                <p className="text-sm text-slate-400 mt-1">
                    Partagez votre boutique pour recevoir des commandes
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                    placeholder="Rechercher par nom, téléphone, produit..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-11 bg-white"
                />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
                {STATUS_FILTERS.map((filter) => (
                    <button
                        key={filter.value}
                        onClick={() => setStatusFilter(filter.value)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${statusFilter === filter.value
                            ? `${filter.color} ring-2 ring-offset-1 ring-slate-300`
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                            }`}
                    >
                        {filter.label}
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${statusFilter === filter.value
                            ? "bg-white/50"
                            : "bg-slate-200"
                            }`}>
                            {statusCounts[filter.value]}
                        </span>
                    </button>
                ))}
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Filter className="h-10 w-10 text-slate-300 mb-3" />
                    <p className="text-slate-500">Aucune commande trouvée</p>
                    <p className="text-sm text-slate-400 mt-1">
                        Essayez de modifier vos filtres
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredOrders.map((order) => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            storeName={storeName}
                            onStatusChange={handleStatusChange}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
