"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { StoreWithRole } from "@/types";

interface StoreCardProps {
    store: StoreWithRole;
    gradient: string;
}

export function StoreCard({ store, gradient }: StoreCardProps) {
    const [isSelecting, setIsSelecting] = useState(false);

    const handleClick = (e: React.MouseEvent) => {
        if (isSelecting) {
            e.preventDefault();
            return;
        }
        setIsSelecting(true);
        // Let the <a> tag navigate naturally — we just show the loading state
    };

    return (
        <a
            href={`/api/select-store?store=${store.id}`}
            onClick={handleClick}
            className={`group relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-300 border border-zinc-100 cursor-pointer ${isSelecting
                    ? "opacity-70 scale-[0.98] pointer-events-none"
                    : "hover:shadow-xl hover:-translate-y-1 active:scale-[0.97]"
                }`}
        >
            {/* Loading overlay */}
            {isSelecting && (
                <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                    <div className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-full shadow-xl">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm font-bold">Chargement...</span>
                    </div>
                </div>
            )}

            {/* Abstract Cover */}
            <div className={`h-20 sm:h-36 w-full bg-gradient-to-br ${gradient} opacity-60 group-hover:opacity-90 transition-opacity duration-500`} />

            {/* Arrow indicator on hover */}
            <div className="absolute top-5 right-5">
                <div className="w-9 h-9 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-900"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </div>
            </div>

            {/* Store Initial Badge */}
            <div className="absolute top-14 sm:top-28 left-4 sm:left-7 w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white p-0.5 sm:p-1 shadow-lg shadow-zinc-200/50 border border-zinc-100">
                <div className="w-full h-full rounded-lg sm:rounded-xl bg-zinc-900 flex items-center justify-center text-white font-serif text-base sm:text-xl italic">
                    {isSelecting ? (
                        <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                    ) : (
                        store.name.charAt(0)
                    )}
                </div>
            </div>

            <div className="pt-6 sm:pt-10 p-4 sm:p-7 pb-4 sm:pb-8">
                <h3 className="font-bold text-lg text-zinc-900 mb-1 tracking-tight">{store.name}</h3>
                <p className="text-zinc-400 text-xs font-bold tracking-widest uppercase">/{store.slug}</p>

                <div className="mt-5 flex items-center gap-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        En ligne
                    </div>
                    <span className="text-zinc-200">•</span>
                    <span>{store.role === 'owner' ? 'Propriétaire' : 'Membre'}</span>
                </div>
            </div>
        </a>
    );
}
