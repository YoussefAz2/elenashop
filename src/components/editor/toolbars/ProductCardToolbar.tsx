"use client";

import React from "react";
import { Package, RotateCcw } from "lucide-react";
import type { ElementStyleOverride } from "@/types";
import { Label } from "@/components/ui/label";

// ---------- PROPS ----------

interface ProductCardToolbarProps {
    elementId: string;
    elementLabel: string;
    currentStyles: ElementStyleOverride;
    onSave: (styles: ElementStyleOverride) => void;
    onReset: () => void;
    onClose: () => void;
}

// ---------- CONSTANTS ----------

const BORDER_RADIUS_OPTIONS = [
    { value: "0px", label: "0" },
    { value: "8px", label: "8" },
    { value: "12px", label: "12" },
    { value: "16px", label: "16" },
    { value: "24px", label: "24" },
];

const PADDING_OPTIONS = [
    { value: "0", label: "0" },
    { value: "8px", label: "8" },
    { value: "12px", label: "12" },
    { value: "16px", label: "16" },
    { value: "24px", label: "24" },
];

const SHADOW_OPTIONS = [
    { value: "none", label: "Aucune" },
    { value: "0 1px 3px rgba(0,0,0,0.1)", label: "XS" },
    { value: "0 4px 6px rgba(0,0,0,0.1)", label: "SM" },
    { value: "0 10px 15px rgba(0,0,0,0.1)", label: "MD" },
    { value: "0 20px 25px rgba(0,0,0,0.1)", label: "LG" },
    { value: "0 25px 50px rgba(0,0,0,0.15)", label: "XL" },
];

const BORDER_WIDTH_OPTIONS = [
    { value: "0px", label: "0" },
    { value: "1px", label: "1" },
    { value: "2px", label: "2" },
    { value: "3px", label: "3" },
];

const GAP_OPTIONS = [
    { value: "8px", label: "8" },
    { value: "12px", label: "12" },
    { value: "16px", label: "16" },
    { value: "24px", label: "24" },
    { value: "32px", label: "32" },
];

// ---------- COMPONENT ----------

export function ProductCardToolbar({
    elementId,
    elementLabel,
    currentStyles,
    onSave,
    onReset,
    onClose,
}: ProductCardToolbarProps) {
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
                    <Package className="w-4 h-4 text-pink-600" />
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

            {/* ========== COULEURS ========== */}
            <div className="space-y-3 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">🎨 Couleurs</p>

                {/* Background Color */}
                <div className="space-y-1">
                    <Label className="text-xs text-slate-500">Fond</Label>
                    <div className="flex gap-2 items-center">
                        <div className="relative">
                            <div
                                className="w-8 h-8 rounded-lg border-2 border-slate-200 cursor-pointer"
                                style={{ backgroundColor: styles.backgroundColor || "#ffffff" }}
                            />
                            <input
                                type="color"
                                value={styles.backgroundColor || "#ffffff"}
                                onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                        <input
                            type="text"
                            value={styles.backgroundColor || ""}
                            onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                            placeholder="#ffffff"
                            className="flex-1 border rounded-lg px-3 py-1.5 text-sm bg-white"
                        />
                    </div>
                </div>

                {/* Border Color */}
                <div className="space-y-1">
                    <Label className="text-xs text-slate-500">Bordure</Label>
                    <div className="flex gap-2 items-center">
                        <div className="relative">
                            <div
                                className="w-8 h-8 rounded-lg border-2 border-slate-200 cursor-pointer"
                                style={{ backgroundColor: styles.borderColor || "#e5e7eb" }}
                            />
                            <input
                                type="color"
                                value={styles.borderColor || "#e5e7eb"}
                                onChange={(e) => updateStyle("borderColor", e.target.value)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                        <input
                            type="text"
                            value={styles.borderColor || ""}
                            onChange={(e) => updateStyle("borderColor", e.target.value)}
                            placeholder="#e5e7eb"
                            className="flex-1 border rounded-lg px-3 py-1.5 text-sm bg-white"
                        />
                    </div>
                </div>
            </div>

            {/* ========== ARRONDIS ========== */}
            <div className="space-y-3 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">🔲 Arrondis</p>

                <div className="flex gap-1">
                    {BORDER_RADIUS_OPTIONS.map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => updateStyle("borderRadius", value)}
                            className={`
                                flex-1 py-1.5 text-xs rounded transition-all
                                ${styles.borderRadius === value
                                    ? "bg-pink-600 text-white"
                                    : "bg-white hover:bg-slate-100 text-slate-700 border"
                                }
                            `}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ========== BORDURE ========== */}
            <div className="space-y-3 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">🖼️ Bordure</p>

                <div className="flex gap-1">
                    {BORDER_WIDTH_OPTIONS.map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => {
                                updateStyle("borderWidth", value);
                                if (value !== "0px") {
                                    updateStyle("borderStyle", "solid");
                                }
                            }}
                            className={`
                                flex-1 py-1.5 text-xs rounded transition-all
                                ${styles.borderWidth === value
                                    ? "bg-pink-600 text-white"
                                    : "bg-white hover:bg-slate-100 text-slate-700 border"
                                }
                            `}
                        >
                            {label}px
                        </button>
                    ))}
                </div>
            </div>

            {/* ========== OMBRE ========== */}
            <div className="space-y-3 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">🌑 Ombre</p>

                <div className="flex flex-wrap gap-1">
                    {SHADOW_OPTIONS.map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => updateStyle("boxShadow", value)}
                            className={`
                                px-3 py-1.5 text-xs rounded transition-all
                                ${styles.boxShadow === value
                                    ? "bg-pink-600 text-white"
                                    : "bg-white hover:bg-slate-100 text-slate-700 border"
                                }
                            `}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ========== ESPACEMENT ========== */}
            <div className="space-y-3 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">↔️ Espacement</p>

                {/* Padding */}
                <div className="space-y-1">
                    <Label className="text-xs text-slate-500">Padding interne</Label>
                    <div className="flex gap-1">
                        {PADDING_OPTIONS.map(({ value, label }) => (
                            <button
                                key={value}
                                onClick={() => updateStyle("padding", value)}
                                className={`
                                    flex-1 py-1.5 text-xs rounded transition-all
                                    ${styles.padding === value
                                        ? "bg-pink-600 text-white"
                                        : "bg-white hover:bg-slate-100 text-slate-700 border"
                                    }
                                `}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Gap */}
                <div className="space-y-1">
                    <Label className="text-xs text-slate-500">Écart entre cartes</Label>
                    <div className="flex gap-1">
                        {GAP_OPTIONS.map(({ value, label }) => (
                            <button
                                key={value}
                                onClick={() => updateStyle("gap", value)}
                                className={`
                                    flex-1 py-1.5 text-xs rounded transition-all
                                    ${styles.gap === value
                                        ? "bg-pink-600 text-white"
                                        : "bg-white hover:bg-slate-100 text-slate-700 border"
                                    }
                                `}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ========== PREVIEW ========== */}
            <div className="p-3 bg-slate-100 rounded-lg">
                <p className="text-[10px] text-slate-400 mb-2">Aperçu</p>
                <div className="flex justify-center">
                    <div
                        className="w-24 p-2 text-center text-xs text-slate-500"
                        style={{
                            backgroundColor: styles.backgroundColor || "#ffffff",
                            borderRadius: styles.borderRadius || "8px",
                            borderWidth: styles.borderWidth || "1px",
                            borderStyle: "solid",
                            borderColor: styles.borderColor || "#e5e7eb",
                            boxShadow: styles.boxShadow || "0 1px 3px rgba(0,0,0,0.1)",
                            padding: styles.padding || "12px",
                        }}
                    >
                        <div className="w-full h-12 bg-slate-200 rounded mb-2" />
                        Produit
                    </div>
                </div>
            </div>
        </div>
    );
}
