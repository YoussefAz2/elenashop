"use client";

import React from "react";
import { Image as ImageIcon, RotateCcw } from "lucide-react";
import type { ElementStyleOverride } from "@/types";
import { Label } from "@/components/ui/label";

// ---------- PROPS ----------

interface ImageToolbarProps {
    elementId: string;
    elementLabel: string;
    currentStyles: ElementStyleOverride;
    onSave: (styles: ElementStyleOverride) => void;
    onReset: () => void;
    onClose: () => void;
}

// ---------- CONSTANTS ----------

const OPACITY_OPTIONS = [
    { value: 1, label: "100%" },
    { value: 0.75, label: "75%" },
    { value: 0.5, label: "50%" },
    { value: 0.25, label: "25%" },
];

const FILTER_OPTIONS = [
    { value: "none", label: "Normal" },
    { value: "grayscale(100%)", label: "N&B" },
    { value: "sepia(50%)", label: "Sépia" },
    { value: "brightness(1.1) contrast(1.1)", label: "Vif" },
    { value: "saturate(1.5)", label: "Saturé" },
];

const BORDER_RADIUS_OPTIONS = [
    { value: "0px", label: "Carré" },
    { value: "8px", label: "Léger" },
    { value: "16px", label: "Moyen" },
    { value: "9999px", label: "Rond" },
];

// ---------- COMPONENT ----------

export function ImageToolbar({
    elementId,
    elementLabel,
    currentStyles,
    onSave,
    onReset,
    onClose,
}: ImageToolbarProps) {
    const updateStyle = <K extends keyof ElementStyleOverride>(
        key: K,
        value: ElementStyleOverride[K]
    ) => {
        onSave({ [key]: value } as ElementStyleOverride);
    };

    const styles = currentStyles;

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b">
                <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-sm">{elementLabel}</span>
                </div>
                <button
                    onClick={onReset}
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-500 transition-colors"
                >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                </button>
            </div>

            {/* Opacity */}
            <div className="space-y-2">
                <Label className="text-xs">🌗 Opacité</Label>
                <div className="flex gap-1">
                    {OPACITY_OPTIONS.map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => updateStyle("opacity", value)}
                            className={`
                                flex-1 py-2 text-xs rounded transition-all
                                ${styles.opacity === value
                                    ? "bg-green-600 text-white"
                                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                                }
                            `}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Filters */}
            <div className="space-y-2">
                <Label className="text-xs">🎨 Filtres</Label>
                <div className="grid grid-cols-3 gap-1">
                    {FILTER_OPTIONS.map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => updateStyle("filter", value)}
                            className={`
                                py-2 text-xs rounded transition-all
                                ${styles.filter === value
                                    ? "bg-green-600 text-white"
                                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                                }
                            `}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Border Radius */}
            <div className="space-y-2">
                <Label className="text-xs">📐 Arrondis</Label>
                <div className="flex gap-1">
                    {BORDER_RADIUS_OPTIONS.map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => updateStyle("borderRadius", value)}
                            className={`
                                flex-1 py-2 text-xs rounded transition-all
                                ${styles.borderRadius === value
                                    ? "bg-green-600 text-white"
                                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                                }
                            `}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Preview */}
            <div className="p-3 bg-slate-100 rounded-lg mt-4">
                <p className="text-[10px] text-slate-400 mb-2">Aperçu</p>
                <div
                    className="h-16 bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-xs text-white font-medium"
                    style={{
                        opacity: styles.opacity ?? 1,
                        filter: styles.filter || "none",
                        borderRadius: styles.borderRadius || "0px",
                    }}
                >
                    Image
                </div>
            </div>
        </div>
    );
}
