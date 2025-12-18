"use client";

import { Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { TemplateId } from "@/types";

interface TemplateCardProps {
    id: TemplateId;
    name: string;
    description: string;
    preview: string;
    features: string[];
    isSelected: boolean;
    isRecommended: boolean;
    onSelect: () => void;
}

export function TemplateCard({
    name,
    description,
    preview,
    features,
    isSelected,
    isRecommended,
    onSelect,
}: TemplateCardProps) {
    return (
        <motion.button
            type="button"
            onClick={onSelect}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className={`relative w-full text-left rounded-2xl border-2 overflow-hidden transition-all duration-300 ${isSelected
                    ? "border-emerald-500 shadow-lg shadow-emerald-500/20"
                    : "border-slate-200 hover:border-slate-300"
                }`}
        >
            {/* Recommended Badge */}
            {isRecommended && (
                <div className="absolute top-3 right-3 z-10">
                    <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        <Sparkles className="h-3 w-3" />
                        Recommandé
                    </div>
                </div>
            )}

            {/* Selected Checkmark */}
            {isSelected && (
                <div className="absolute top-3 left-3 z-10">
                    <div className="flex items-center justify-center h-6 w-6 bg-emerald-500 rounded-full">
                        <Check className="h-4 w-4 text-white" />
                    </div>
                </div>
            )}

            {/* Preview Gradient */}
            <div className={`h-28 bg-gradient-to-br ${preview} relative`}>
                {/* Decorative Elements */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex gap-2">
                        <div className="w-8 h-8 bg-white/20 rounded-lg backdrop-blur-sm"></div>
                        <div className="w-8 h-8 bg-white/20 rounded-lg backdrop-blur-sm"></div>
                        <div className="w-8 h-8 bg-white/20 rounded-lg backdrop-blur-sm"></div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className={`p-4 ${isSelected ? "bg-emerald-50/50" : "bg-white"}`}>
                <h3 className="font-bold text-lg text-slate-900 mb-1">{name}</h3>
                <p className="text-sm text-slate-500 mb-3">{description}</p>

                {/* Features */}
                <div className="flex flex-wrap gap-1.5">
                    {features.map((feature) => (
                        <span
                            key={feature}
                            className={`text-xs px-2 py-1 rounded-full ${isSelected
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                        >
                            {feature}
                        </span>
                    ))}
                </div>
            </div>
        </motion.button>
    );
}
