"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Store, Plus, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getUserStores, getCurrentStoreId, setCurrentStoreId } from "@/lib/stores";
import type { StoreWithRole } from "@/types";

interface StoreSelectorProps {
    onStoreChange?: (storeId: string) => void;
}

export function StoreSelector({ onStoreChange }: StoreSelectorProps) {
    const [stores, setStores] = useState<StoreWithRole[]>([]);
    const [currentStore, setCurrentStore] = useState<StoreWithRole | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Load stores on mount
    useEffect(() => {
        async function loadStores() {
            setIsLoading(true);
            const userStores = await getUserStores();
            setStores(userStores);

            // Get current store from localStorage or use first store
            const savedStoreId = getCurrentStoreId();
            const saved = userStores.find(s => s.id === savedStoreId);
            const activeStore = saved || userStores[0] || null;

            setCurrentStore(activeStore);
            if (activeStore) {
                setCurrentStoreId(activeStore.id);
            }
            setIsLoading(false);
        }
        loadStores();
    }, []);

    const handleSelectStore = (store: StoreWithRole) => {
        setCurrentStore(store);
        setCurrentStoreId(store.id);
        setIsOpen(false);
        onStoreChange?.(store.id);
    };

    if (isLoading) {
        return (
            <div className="h-10 w-48 bg-slate-100 animate-pulse rounded-lg" />
        );
    }

    if (!currentStore) {
        return null;
    }

    return (
        <div className="relative">
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
            >
                <div className="flex items-center justify-center h-7 w-7 rounded-md bg-emerald-100 text-emerald-600">
                    <Store className="h-4 w-4" />
                </div>
                <div className="text-left">
                    <p className="text-sm font-semibold text-slate-800 leading-none">
                        {currentStore.name}
                    </p>
                    <p className="text-xs text-slate-500 leading-none mt-0.5">
                        {currentStore.role === "owner" ? "Propriétaire" : currentStore.role}
                    </p>
                </div>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Menu */}
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden"
                        >
                            <div className="p-2">
                                <p className="text-xs font-medium text-slate-400 uppercase px-2 py-1">
                                    Vos boutiques
                                </p>

                                {stores.map((store) => (
                                    <button
                                        key={store.id}
                                        onClick={() => handleSelectStore(store)}
                                        className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${store.id === currentStore.id
                                                ? "bg-emerald-50 text-emerald-700"
                                                : "hover:bg-slate-50 text-slate-700"
                                            }`}
                                    >
                                        <div className={`flex items-center justify-center h-8 w-8 rounded-md ${store.id === currentStore.id
                                                ? "bg-emerald-100"
                                                : "bg-slate-100"
                                            }`}>
                                            <Store className="h-4 w-4" />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p className="text-sm font-medium">{store.name}</p>
                                            <p className="text-xs text-slate-500">
                                                /{store.slug}
                                            </p>
                                        </div>
                                        {store.id === currentStore.id && (
                                            <Check className="h-4 w-4 text-emerald-600" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Create New Store */}
                            <div className="border-t border-slate-100 p-2">
                                <a
                                    href="/onboarding"
                                    className="flex items-center gap-3 p-2 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex items-center justify-center h-8 w-8 rounded-md bg-slate-100 border-2 border-dashed border-slate-300">
                                        <Plus className="h-4 w-4" />
                                    </div>
                                    <span className="text-sm font-medium">
                                        Créer une nouvelle boutique
                                    </span>
                                </a>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

// Hook to get current store ID for queries
export function useCurrentStoreId(): string | null {
    const [storeId, setStoreId] = useState<string | null>(null);

    useEffect(() => {
        setStoreId(getCurrentStoreId());
    }, []);

    return storeId;
}
