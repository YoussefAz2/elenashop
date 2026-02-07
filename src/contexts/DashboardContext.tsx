"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useTransition } from "react";
import { createClient } from "@/utils/supabase/client";
import type { Store, Order, Product, Category, Lead, Promo } from "@/types";

interface DashboardData {
    store: Store;
    orders: Order[];
    products: Product[];
    categories: Category[];
    leads: Lead[];
    promos: Promo[];
}

interface DashboardContextType extends DashboardData {
    isLoading: boolean;
    isRefreshing: boolean;
    lastRefresh: Date;
    refresh: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

interface DashboardProviderProps {
    children: React.ReactNode;
    initialData: DashboardData;
}

export function DashboardProvider({ children, initialData }: DashboardProviderProps) {
    const [data, setData] = useState<DashboardData>(initialData);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastRefresh, setLastRefresh] = useState(new Date());

    const supabase = createClient();

    const refresh = useCallback(async () => {
        if (isRefreshing) return;

        setIsRefreshing(true);

        try {
            const storeId = data.store.id;

            // Fetch all data in parallel
            const [ordersRes, productsRes, categoriesRes, leadsRes, promosRes] = await Promise.all([
                supabase.from("orders").select("*").eq("store_id", storeId).order("created_at", { ascending: false }),
                supabase.from("products").select("*").eq("store_id", storeId).order("created_at", { ascending: false }),
                supabase.from("categories").select("*").eq("store_id", storeId).order("position"),
                supabase.from("leads").select("*").eq("store_id", storeId).order("created_at", { ascending: false }),
                supabase.from("promos").select("*").eq("store_id", storeId).order("created_at", { ascending: false }),
            ]);

            setData(prev => ({
                ...prev,
                orders: (ordersRes.data as Order[]) || prev.orders,
                products: (productsRes.data as Product[]) || prev.products,
                categories: (categoriesRes.data as Category[]) || prev.categories,
                leads: (leadsRes.data as Lead[]) || prev.leads,
                promos: (promosRes.data as Promo[]) || prev.promos,
            }));

            setLastRefresh(new Date());
        } catch (error) {
            console.error("Failed to refresh dashboard data:", error);
        } finally {
            setIsRefreshing(false);
        }
    }, [data.store.id, isRefreshing, supabase]);

    // Auto-refresh every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            refresh();
        }, 30000);

        return () => clearInterval(interval);
    }, [refresh]);

    // Refresh on window focus (user comes back to tab)
    useEffect(() => {
        const handleFocus = () => {
            const timeSinceLastRefresh = Date.now() - lastRefresh.getTime();
            // Only refresh if more than 10 seconds since last refresh
            if (timeSinceLastRefresh > 10000) {
                refresh();
            }
        };

        window.addEventListener("focus", handleFocus);
        return () => window.removeEventListener("focus", handleFocus);
    }, [refresh, lastRefresh]);

    return (
        <DashboardContext.Provider
            value={{
                ...data,
                isLoading,
                isRefreshing,
                lastRefresh,
                refresh,
            }}
        >
            {children}
        </DashboardContext.Provider>
    );
}

export function useDashboard() {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error("useDashboard must be used within a DashboardProvider");
    }
    return context;
}

// Convenience hooks for specific data
export function useStore() {
    return useDashboard().store;
}

export function useOrders() {
    return useDashboard().orders;
}

export function useProducts() {
    return useDashboard().products;
}

export function useCategories() {
    return useDashboard().categories;
}

export function useLeads() {
    return useDashboard().leads;
}

export function usePromos() {
    return useDashboard().promos;
}
