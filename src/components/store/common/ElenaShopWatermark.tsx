"use client";

import { Store } from "lucide-react";

interface ElenaShopWatermarkProps {
    isPro?: boolean;
}

export function ElenaShopWatermark({ isPro = false }: ElenaShopWatermarkProps) {
    // Don't show for Pro users
    if (isPro) return null;

    return (
        <a
            href="https://elenashop.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-white/95 backdrop-blur-sm border border-slate-200 shadow-lg rounded-full px-4 py-2 text-sm font-medium text-slate-700 hover:text-emerald-600 hover:border-emerald-200 hover:shadow-xl transition-all group"
        >
            <div className="flex items-center justify-center h-6 w-6 bg-emerald-600 rounded-full group-hover:scale-110 transition-transform">
                <Store className="h-3 w-3 text-white" />
            </div>
            <span className="hidden sm:inline">Créé avec</span>
            <span className="font-bold text-emerald-600">ElenaShop</span>
        </a>
    );
}
