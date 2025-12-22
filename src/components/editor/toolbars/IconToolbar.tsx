"use client";

import React from "react";
import { Sparkles, Palette, RotateCcw } from "lucide-react";
import type { ElementStyleOverride } from "@/types";
import { Label } from "@/components/ui/label";

// ---------- PROPS ----------

interface IconToolbarProps {
    elementId: string;
    elementLabel: string;
    currentStyles: ElementStyleOverride;
    onSave: (styles: ElementStyleOverride) => void;
    onReset: () => void;
    onClose: () => void;
}

// ---------- COLOR PRESETS ----------

const COLOR_PRESETS = [
    { value: "#18181b", label: "Noir" },
    { value: "#ffffff", label: "Blanc" },
    { value: "#ef4444", label: "Rouge" },
    { value: "#f97316", label: "Orange" },
    { value: "#eab308", label: "Jaune" },
    { value: "#22c55e", label: "Vert" },
    { value: "#3b82f6", label: "Bleu" },
    { value: "#8b5cf6", label: "Violet" },
    { value: "#ec4899", label: "Rose" },
];

// ---------- COMPONENT ----------

export function IconToolbar({
    elementId,
    elementLabel,
    currentStyles,
    onSave,
    onReset,
    onClose,
}: IconToolbarProps) {
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
                    <Sparkles className="w-4 h-4 text-pink-600" />
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

            {/* Icon Color */}
            <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs">
                    <Palette className="w-3 h-3" />
                    Couleur de l'icône
                </Label>
                <div className="flex gap-2 items-center">
                    <div className="relative">
                        <div
                            className="w-10 h-10 rounded-lg border-2 border-slate-200 cursor-pointer"
                            style={{ backgroundColor: styles.iconColor || styles.color || "#18181b" }}
                        />
                        <input
                            type="color"
                            value={styles.iconColor || styles.color || "#18181b"}
                            onChange={(e) => updateStyle("iconColor", e.target.value)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                    <input
                        type="text"
                        value={styles.iconColor || styles.color || ""}
                        onChange={(e) => updateStyle("iconColor", e.target.value)}
                        placeholder="#18181b"
                        className="flex-1 border rounded-lg px-3 py-2 text-sm"
                    />
                </div>
            </div>

            {/* Quick Color Presets */}
            <div className="space-y-2">
                <Label className="text-xs">🎨 Couleurs rapides</Label>
                <div className="flex flex-wrap gap-2">
                    {COLOR_PRESETS.map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => updateStyle("iconColor", value)}
                            className={`
                                w-8 h-8 rounded-lg border-2 transition-all hover:scale-110
                                ${(styles.iconColor || styles.color) === value
                                    ? "border-pink-500 ring-2 ring-pink-200"
                                    : "border-slate-200"
                                }
                            `}
                            style={{ backgroundColor: value }}
                            title={label}
                        />
                    ))}
                </div>
            </div>

            {/* Icon Size */}
            <div className="space-y-2">
                <Label className="text-xs">📏 Taille</Label>
                <div className="flex gap-1">
                    {[
                        { value: "0.875rem", label: "S" },
                        { value: "1rem", label: "M" },
                        { value: "1.25rem", label: "L" },
                        { value: "1.5rem", label: "XL" },
                        { value: "2rem", label: "2XL" },
                    ].map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => updateStyle("fontSize", value)}
                            className={`
                                flex-1 py-1.5 text-xs rounded transition-all
                                ${styles.fontSize === value
                                    ? "bg-pink-600 text-white"
                                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                                }
                            `}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Opacity */}
            <div className="space-y-2">
                <Label className="text-xs">🌗 Opacité</Label>
                <div className="flex gap-1">
                    {[
                        { value: 1, label: "100%" },
                        { value: 0.75, label: "75%" },
                        { value: 0.5, label: "50%" },
                        { value: 0.25, label: "25%" },
                    ].map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => updateStyle("opacity", value)}
                            className={`
                                flex-1 py-1.5 text-xs rounded transition-all
                                ${styles.opacity === value
                                    ? "bg-pink-600 text-white"
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
            <div className="p-4 bg-slate-100 rounded-lg mt-4 flex items-center justify-center">
                <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${styles.iconColor || styles.color || "#18181b"}20` }}
                >
                    <Sparkles
                        className="w-6 h-6"
                        style={{ color: styles.iconColor || styles.color || "#18181b" }}
                    />
                </div>
            </div>
        </div>
    );
}
