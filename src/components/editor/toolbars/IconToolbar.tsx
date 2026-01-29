"use client";

import React from "react";
import { Sparkles, RotateCcw } from "lucide-react";
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

// ---------- CONSTANTS ----------

const SIZE_OPTIONS = [
    { value: "16px", label: "16" },
    { value: "20px", label: "20" },
    { value: "24px", label: "24" },
    { value: "32px", label: "32" },
    { value: "40px", label: "40" },
    { value: "48px", label: "48" },
    { value: "64px", label: "64" },
];

const OPACITY_OPTIONS = [
    { value: 1, label: "100%" },
    { value: 0.8, label: "80%" },
    { value: 0.6, label: "60%" },
    { value: 0.4, label: "40%" },
    { value: 0.2, label: "20%" },
];

const PRESET_COLORS = [
    "#000000", "#374151", "#6b7280", "#9ca3af",
    "#ef4444", "#f97316", "#eab308", "#22c55e",
    "#3b82f6", "#6366f1", "#8b5cf6", "#ec4899",
];

const STROKE_WIDTH_OPTIONS = [
    { value: "1", label: "Fin" },
    { value: "1.5", label: "Normal" },
    { value: "2", label: "Moyen" },
    { value: "2.5", label: "Épais" },
    { value: "3", label: "Gras" },
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
                    <Sparkles className="w-4 h-4 text-violet-600" />
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

            {/* ========== COULEUR ========== */}
            <div className="space-y-3 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">🎨 Couleur</p>

                {/* Color Picker */}
                <div className="flex gap-2 items-center">
                    <div className="relative">
                        <div
                            className="w-10 h-10 rounded-lg border-2 border-slate-200 cursor-pointer"
                            style={{ backgroundColor: styles.color || "#000000" }}
                        />
                        <input
                            type="color"
                            value={styles.color || "#000000"}
                            onChange={(e) => updateStyle("color", e.target.value)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                    <input
                        type="text"
                        value={styles.color || ""}
                        onChange={(e) => updateStyle("color", e.target.value)}
                        placeholder="#000000"
                        className="flex-1 border rounded-lg px-3 py-2 text-sm bg-white"
                    />
                </div>

                {/* Preset Colors */}
                <div className="flex flex-wrap gap-1">
                    {PRESET_COLORS.map((color) => (
                        <button
                            key={color}
                            onClick={() => updateStyle("color", color)}
                            className={`w-6 h-6 rounded-md border-2 transition-all ${styles.color === color ? "border-violet-500 scale-110" : "border-transparent hover:scale-105"
                                }`}
                            style={{ backgroundColor: color }}
                        />
                    ))}
                </div>
            </div>

            {/* ========== TAILLE ========== */}
            <div className="space-y-3 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">📏 Taille</p>

                <div className="flex flex-wrap gap-1">
                    {SIZE_OPTIONS.map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => updateStyle("fontSize", value)}
                            className={`
                                px-3 py-1.5 text-xs rounded transition-all
                                ${styles.fontSize === value
                                    ? "bg-violet-600 text-white"
                                    : "bg-white hover:bg-slate-100 text-slate-700 border"
                                }
                            `}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ========== TRAIT ========== */}
            <div className="space-y-3 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">✏️ Épaisseur trait</p>

                <div className="flex gap-1">
                    {STROKE_WIDTH_OPTIONS.map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => {
                                const el = document.querySelector(`[data-editable-id="${elementId}"] svg`) as SVGElement;
                                if (el) el.style.strokeWidth = value;
                            }}
                            className="flex-1 py-1.5 text-xs rounded transition-all bg-white hover:bg-slate-100 text-slate-700 border"
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ========== OPACITE ========== */}
            <div className="space-y-3 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">👁️ Opacité</p>

                <div className="flex gap-1">
                    {OPACITY_OPTIONS.map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => updateStyle("opacity", value)}
                            className={`
                                flex-1 py-1.5 text-xs rounded transition-all
                                ${styles.opacity === value
                                    ? "bg-violet-600 text-white"
                                    : "bg-white hover:bg-slate-100 text-slate-700 border"
                                }
                            `}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ========== ROTATION ========== */}
            <div className="space-y-3 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">🔄 Rotation</p>

                <div className="flex gap-1">
                    {["0deg", "45deg", "90deg", "180deg", "-45deg", "-90deg"].map((value) => (
                        <button
                            key={value}
                            onClick={() => {
                                const el = document.querySelector(`[data-editable-id="${elementId}"]`) as HTMLElement;
                                if (el) el.style.transform = `rotate(${value})`;
                            }}
                            className="flex-1 py-1.5 text-xs rounded transition-all bg-white hover:bg-slate-100 text-slate-700 border"
                        >
                            {value.replace("deg", "°")}
                        </button>
                    ))}
                </div>
            </div>

            {/* ========== PREVIEW ========== */}
            <div className="p-3 bg-slate-100 rounded-lg">
                <p className="text-[10px] text-slate-400 mb-2">Aperçu</p>
                <div className="flex justify-center py-4">
                    <Sparkles
                        style={{
                            color: styles.color || "#000000",
                            width: styles.fontSize || "24px",
                            height: styles.fontSize || "24px",
                            opacity: styles.opacity ?? 1,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
