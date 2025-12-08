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
            className="fixed bottom-4 left-4 z-40 flex items-center gap-2 bg-white/95 backdrop-blur-sm border border-slate-200 shadow-lg rounded-full px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-emerald-600 hover:border-emerald-200 hover:shadow-xl transition-all group"
        >
            <div className="flex items-center justify-center h-5 w-5 bg-emerald-600 rounded-full group-hover:scale-110 transition-transform">
                <Store className="h-2.5 w-2.5 text-white" />
            </div>
            <span className="font-semibold text-emerald-600">ElenaShop</span>
        </a>
    );
}
