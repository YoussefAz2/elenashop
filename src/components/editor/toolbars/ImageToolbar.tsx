"use client";

import React from "react";
import {
    Image, RotateCcw, Square, Circle, RectangleHorizontal
} from "lucide-react";
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

const WIDTH_OPTIONS = [
    { value: "100%", label: "100%" },
    { value: "75%", label: "75%" },
    { value: "50%", label: "50%" },
    { value: "300px", label: "300px" },
    { value: "400px", label: "400px" },
    { value: "500px", label: "500px" },
];

const ASPECT_RATIO_OPTIONS = [
    { value: "auto", label: "Original" },
    { value: "1/1", label: "1:1" },
    { value: "4/3", label: "4:3" },
    { value: "16/9", label: "16:9" },
    { value: "3/2", label: "3:2" },
    { value: "2/3", label: "Portrait" },
];

const OBJECT_FIT_OPTIONS = [
    { value: "cover", label: "Cover", desc: "Remplir" },
    { value: "contain", label: "Contain", desc: "Entier" },
    { value: "fill", label: "Fill", desc: "Étirer" },
];

const BORDER_RADIUS_OPTIONS = [
    { value: "0px", label: "Carré", icon: Square },
    { value: "8px", label: "8px" },
    { value: "16px", label: "16px" },
    { value: "24px", label: "24px" },
    { value: "50%", label: "Cercle", icon: Circle },
];

const OPACITY_OPTIONS = [
    { value: 1, label: "100%" },
    { value: 0.8, label: "80%" },
    { value: 0.6, label: "60%" },
    { value: 0.4, label: "40%" },
    { value: 0.2, label: "20%" },
];

const FILTER_OPTIONS = [
    { value: "none", label: "Aucun" },
    { value: "grayscale(100%)", label: "N&B" },
    { value: "sepia(100%)", label: "Sépia" },
    { value: "blur(2px)", label: "Flou léger" },
    { value: "blur(5px)", label: "Flou fort" },
    { value: "brightness(1.2)", label: "Lumineux" },
    { value: "contrast(1.3)", label: "Contraste" },
    { value: "saturate(1.5)", label: "Saturé" },
];

const BORDER_WIDTH_OPTIONS = [
    { value: "0px", label: "0" },
    { value: "1px", label: "1" },
    { value: "2px", label: "2" },
    { value: "4px", label: "4" },
    { value: "6px", label: "6" },
    { value: "8px", label: "8" },
];

const SHADOW_OPTIONS = [
    { value: "none", label: "Aucune" },
    { value: "0 4px 6px rgba(0,0,0,0.1)", label: "Subtile" },
    { value: "0 10px 25px rgba(0,0,0,0.15)", label: "Moyenne" },
    { value: "0 20px 40px rgba(0,0,0,0.2)", label: "Forte" },
    { value: "0 25px 50px rgba(0,0,0,0.25)", label: "Flottante" },
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
                    <Image className="w-4 h-4 text-emerald-600" />
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

            {/* ========== DIMENSIONS ========== */}
            <div className="space-y-3 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">📐 Dimensions</p>

                {/* Width */}
                <div className="space-y-1">
                    <Label className="text-xs text-slate-500">Largeur</Label>
                    <div className="flex flex-wrap gap-1">
                        {WIDTH_OPTIONS.map(({ value, label }) => (
                            <button
                                key={value}
                                onClick={() => updateStyle("width", value)}
                                className={`
                                    px-2 py-1 text-xs rounded transition-all
                                    ${styles.width === value
                                        ? "bg-emerald-600 text-white"
                                        : "bg-white hover:bg-slate-100 text-slate-700 border"
                                    }
                                `}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Aspect Ratio */}
                <div className="space-y-1">
                    <Label className="text-xs text-slate-500">Ratio</Label>
                    <div className="flex flex-wrap gap-1">
                        {ASPECT_RATIO_OPTIONS.map(({ value, label }) => (
                            <button
                                key={value}
                                onClick={() => {
                                    // Store aspect ratio as a custom property
                                    const el = document.querySelector(`[data-editable-id="${elementId}"] img`) as HTMLImageElement;
                                    if (el) {
                                        el.style.aspectRatio = value;
                                    }
                                }}
                                className="px-2 py-1 text-xs rounded transition-all bg-white hover:bg-slate-100 text-slate-700 border"
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ========== REMPLISSAGE ========== */}
            <div className="space-y-3 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">🖼️ Remplissage</p>

                <div className="flex gap-1">
                    {OBJECT_FIT_OPTIONS.map(({ value, label, desc }) => (
                        <button
                            key={value}
                            onClick={() => updateStyle("objectFit", value as ElementStyleOverride["objectFit"])}
                            className={`
                                flex-1 py-2 text-xs rounded transition-all flex flex-col items-center gap-0.5
                                ${styles.objectFit === value
                                    ? "bg-emerald-600 text-white"
                                    : "bg-white hover:bg-slate-100 text-slate-700 border"
                                }
                            `}
                        >
                            <span className="font-medium">{label}</span>
                            <span className="text-[10px] opacity-70">{desc}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* ========== FORME ========== */}
            <div className="space-y-3 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">🔲 Forme</p>

                <div className="space-y-1">
                    <Label className="text-xs text-slate-500">Arrondis</Label>
                    <div className="flex gap-1">
                        {BORDER_RADIUS_OPTIONS.map(({ value, label }) => (
                            <button
                                key={value}
                                onClick={() => updateStyle("borderRadius", value)}
                                className={`
                                    flex-1 py-1.5 text-xs rounded transition-all
                                    ${styles.borderRadius === value
                                        ? "bg-emerald-600 text-white"
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

            {/* ========== EFFETS ========== */}
            <div className="space-y-3 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">✨ Effets</p>

                {/* Opacity */}
                <div className="space-y-1">
                    <Label className="text-xs text-slate-500">Opacité</Label>
                    <div className="flex gap-1">
                        {OPACITY_OPTIONS.map(({ value, label }) => (
                            <button
                                key={value}
                                onClick={() => updateStyle("opacity", value)}
                                className={`
                                    flex-1 py-1.5 text-xs rounded transition-all
                                    ${styles.opacity === value
                                        ? "bg-emerald-600 text-white"
                                        : "bg-white hover:bg-slate-100 text-slate-700 border"
                                    }
                                `}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Filters */}
                <div className="space-y-1">
                    <Label className="text-xs text-slate-500">Filtre</Label>
                    <div className="grid grid-cols-4 gap-1">
                        {FILTER_OPTIONS.map(({ value, label }) => (
                            <button
                                key={value}
                                onClick={() => updateStyle("filter", value)}
                                className={`
                                    py-1.5 text-xs rounded transition-all
                                    ${styles.filter === value
                                        ? "bg-emerald-600 text-white"
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

            {/* ========== BORDURES ========== */}
            <div className="space-y-3 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">🖼️ Bordure</p>

                <div className="grid grid-cols-2 gap-2">
                    {/* Border Width */}
                    <div className="space-y-1">
                        <Label className="text-xs text-slate-500">Épaisseur</Label>
                        <select
                            value={styles.borderWidth || "0px"}
                            onChange={(e) => {
                                updateStyle("borderWidth", e.target.value);
                                if (e.target.value !== "0px" && !styles.borderStyle) {
                                    updateStyle("borderStyle", "solid");
                                }
                            }}
                            className="w-full border rounded px-2 py-1.5 text-sm bg-white"
                        >
                            {BORDER_WIDTH_OPTIONS.map(({ value, label }) => (
                                <option key={value} value={value}>{label}px</option>
                            ))}
                        </select>
                    </div>

                    {/* Border Color */}
                    <div className="space-y-1">
                        <Label className="text-xs text-slate-500">Couleur</Label>
                        <div className="relative">
                            <div
                                className="w-full h-8 rounded border-2 border-slate-200 cursor-pointer"
                                style={{ backgroundColor: styles.borderColor || "#e5e7eb" }}
                            />
                            <input
                                type="color"
                                value={styles.borderColor || "#e5e7eb"}
                                onChange={(e) => updateStyle("borderColor", e.target.value)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                    </div>
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
                                    ? "bg-emerald-600 text-white"
                                    : "bg-white hover:bg-slate-100 text-slate-700 border"
                                }
                            `}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ========== PREVIEW ========== */}
            <div className="p-3 bg-slate-100 rounded-lg">
                <p className="text-[10px] text-slate-400 mb-2">Aperçu</p>
                <div className="flex justify-center">
                    <div
                        className="w-32 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs"
                        style={{
                            borderRadius: styles.borderRadius || "0px",
                            opacity: styles.opacity ?? 1,
                            filter: styles.filter || "none",
                            borderWidth: styles.borderWidth || "0px",
                            borderStyle: styles.borderWidth && styles.borderWidth !== "0px" ? "solid" : "none",
                            borderColor: styles.borderColor || "#e5e7eb",
                            boxShadow: styles.boxShadow || "none",
                            objectFit: styles.objectFit || "cover",
                        }}
                    >
                        Image
                    </div>
                </div>
            </div>
        </div>
    );
}
