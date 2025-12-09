"use client";

import React from "react";
import { Type, Palette, AlignLeft, AlignCenter, AlignRight, RotateCcw } from "lucide-react";
import type { ElementStyleOverride } from "@/types";
import { Label } from "@/components/ui/label";

// ---------- PROPS ----------

interface TextToolbarProps {
    elementId: string;
    elementLabel: string;
    currentStyles: ElementStyleOverride;
    onSave: (styles: ElementStyleOverride) => void;
    onReset: () => void;
    onClose: () => void;
}

// ---------- CONSTANTS ----------

const FONT_SIZES = [
    { value: "0.75rem", label: "XS" },
    { value: "0.875rem", label: "S" },
    { value: "1rem", label: "M" },
    { value: "1.25rem", label: "L" },
    { value: "1.5rem", label: "XL" },
    { value: "2rem", label: "2XL" },
    { value: "2.5rem", label: "3XL" },
    { value: "3rem", label: "4XL" },
    { value: "4rem", label: "5XL" },
];

const FONT_WEIGHTS = [
    { value: "300", label: "Light" },
    { value: "400", label: "Normal" },
    { value: "500", label: "Medium" },
    { value: "600", label: "Semi" },
    { value: "700", label: "Bold" },
    { value: "800", label: "Extra" },
];

// ---------- COMPONENT ----------

export function TextToolbar({
    elementId,
    elementLabel,
    currentStyles,
    onSave,
    onReset,
    onClose,
}: TextToolbarProps) {
    // Immediate save on every change - no local state needed
    const updateStyle = <K extends keyof ElementStyleOverride>(
        key: K,
        value: ElementStyleOverride[K]
    ) => {
        const newStyles = { ...currentStyles, [key]: value };
        onSave(newStyles);
    };

    // Use currentStyles directly for rendering
    const styles = currentStyles;

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b">
                <div className="flex items-center gap-2">
                    <Type className="w-4 h-4 text-blue-600" />
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

            {/* Color */}
            <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs">
                    <Palette className="w-3 h-3" />
                    Couleur
                </Label>
                <div className="flex gap-2">
                    <input
                        type="color"
                        value={styles.color || "#000000"}
                        onChange={(e) => updateStyle("color", e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer border-2 border-slate-200"
                    />
                    <input
                        type="text"
                        value={styles.color || ""}
                        onChange={(e) => updateStyle("color", e.target.value)}
                        placeholder="#000000"
                        className="flex-1 border rounded-lg px-3 text-sm"
                    />
                </div>
            </div>

            {/* Font Size */}
            <div className="space-y-2">
                <Label className="text-xs">📏 Taille</Label>
                <div className="flex flex-wrap gap-1">
                    {FONT_SIZES.map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => updateStyle("fontSize", value)}
                            className={`
                                px-2 py-1 text-xs rounded transition-all
                                ${styles.fontSize === value
                                    ? "bg-blue-600 text-white"
                                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                                }
                            `}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Font Weight */}
            <div className="space-y-2">
                <Label className="text-xs">💪 Épaisseur</Label>
                <div className="flex flex-wrap gap-1">
                    {FONT_WEIGHTS.map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => updateStyle("fontWeight", value)}
                            className={`
                                px-2 py-1 text-xs rounded transition-all
                                ${styles.fontWeight === value
                                    ? "bg-blue-600 text-white"
                                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                                }
                            `}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Alignment (placeholder for text-align) */}
            <div className="space-y-2">
                <Label className="text-xs">📐 Alignement</Label>
                <div className="flex gap-1">
                    {[
                        { icon: AlignLeft, value: "left" },
                        { icon: AlignCenter, value: "center" },
                        { icon: AlignRight, value: "right" },
                    ].map(({ icon: Icon, value }) => (
                        <button
                            key={value}
                            onClick={() => {/* TODO: Add textAlign to overrides */ }}
                            className="p-2 rounded bg-slate-100 hover:bg-slate-200 transition-colors"
                        >
                            <Icon className="w-4 h-4" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Preview */}
            <div className="p-3 bg-slate-50 rounded-lg mt-4">
                <p className="text-[10px] text-slate-400 mb-1">Aperçu</p>
                <div
                    className="p-2 bg-white rounded border"
                    style={{
                        color: styles.color,
                        fontSize: styles.fontSize,
                        fontWeight: styles.fontWeight,
                    }}
                >
                    Texte d&apos;exemple
                </div>
            </div>
        </div>
    );
}
