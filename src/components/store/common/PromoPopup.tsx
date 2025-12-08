"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { PromoPopupConfig } from "@/types";

interface PromoPopupProps {
    config: PromoPopupConfig;
    storeId: string;
    primaryColor?: string;
}

export function PromoPopup({ config, storeId, primaryColor = "#18181b" }: PromoPopupProps) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!config.enabled) return;

        // Show popup immediately after mount
        const timer = setTimeout(() => setIsOpen(true), 300);
        return () => clearTimeout(timer);
    }, [config.enabled]);

    const handleClose = () => {
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div
                className="relative w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-300"
                style={{ backgroundColor: "#fff" }}
            >
                <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                    <X className="w-4 h-4 text-slate-600" />
                </button>

                <div className="text-center">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{config.title || "🎉 Offre Spéciale !"}</h3>
                    <p className="text-slate-600 mb-6">{config.message || "Profitez de notre offre !"}</p>
                    <a
                        href={config.buttonUrl || "#products"}
                        onClick={handleClose}
                        className="inline-block px-6 py-3 rounded-xl text-white font-medium transition-transform hover:scale-105"
                        style={{ backgroundColor: primaryColor }}
                    >
                        {config.buttonText || "J'en profite"}
                    </a>
                </div>
            </div>
        </div>
    );
}


