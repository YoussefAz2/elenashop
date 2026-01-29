"use client";

import React from "react";
import { Minus, RotateCcw } from "lucide-react";
import type { ElementStyleOverride } from "@/types";
import { Label } from "@/components/ui/label";

// ---------- PROPS ----------

interface DividerToolbarProps {
    elementId: string;
    elementLabel: string;
    currentStyles: ElementStyleOverride;
    onSave: (styles: ElementStyleOverride) => void;
    onReset: () => void;
    onClose: () => void;
}

// ---------- CONSTANTS ----------

const THICKNESS_OPTIONS = [
    { value: "1px", label: "1" },
    { value: "2px", label: "2" },
    { value: "3px", label: "3" },
    { value: "4px", label: "4" },
    { value: "6px", label: "6" },
    { value: "8px", label: "8" },
];

const WIDTH_OPTIONS = [
    { value: "100%", label: "100%" },
    { value: "80%", label: "80%" },
    { value: "60%", label: "60%" },
    { value: "40%", label: "40%" },
    { value: "200px", label: "200px" },
    { value: "100px", label: "100px" },
];

const STYLE_OPTIONS = [
    { value: "solid", label: "Solide" },
    { value: "dashed", label: "Tirets" },
    { value: "dotted", label: "Points" },
    { value: "double", label: "Double" },
];

const MARGIN_OPTIONS = [
    { value: "8px 0", label: "8" },
    { value: "16px 0", label: "16" },
    { value: "24px 0", label: "24" },
    { value: "32px 0", label: "32" },
    { value: "48px 0", label: "48" },
    { value: "64px 0", label: "64" },
];

const OPACITY_OPTIONS = [
    { value: 1, label: "100%" },
    { value: 0.8, label: "80%" },
    { value: 0.6, label: "60%" },
    { value: 0.4, label: "40%" },
    { value: 0.2, label: "20%" },
];

// ---------- COMPONENT ----------

export function DividerToolbar({
    elementId,
    elementLabel,
    currentStyles,
    onSave,
    onReset,
    onClose,
}: DividerToolbarProps) {
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
                    <Minus className="w-4 h-4 text-slate-600" />
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

                <div className="flex gap-2 items-center">
                    <div className="relative">
                        <div
                            className="w-10 h-10 rounded-lg border-2 border-slate-200 cursor-pointer"
                            style={{ backgroundColor: styles.borderColor || styles.backgroundColor || "#e5e7eb" }}
                        />
                        <input
                            type="color"
                            value={styles.borderColor || styles.backgroundColor || "#e5e7eb"}
                            onChange={(e) => {
                                updateStyle("borderColor", e.target.value);
                                updateStyle("backgroundColor", e.target.value);
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                    <input
                        type="text"
                        value={styles.borderColor || styles.backgroundColor || ""}
                        onChange={(e) => {
                            updateStyle("borderColor", e.target.value);
                            updateStyle("backgroundColor", e.target.value);
                        }}
                        placeholder="#e5e7eb"
                        className="flex-1 border rounded-lg px-3 py-2 text-sm bg-white"
                    />
                </div>
            </div>

            {/* ========== DIMENSIONS ========== */}
            <div className="space-y-3 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">📐 Dimensions</p>

                {/* Thickness */}
                <div className="space-y-1">
                    <Label className="text-xs text-slate-500">Épaisseur</Label>
                    <div className="flex gap-1">
                        {THICKNESS_OPTIONS.map(({ value, label }) => (
                            <button
                                key={value}
                                onClick={() => updateStyle("height", value)}
                                className={`
                                    flex-1 py-1.5 text-xs rounded transition-all
                                    ${styles.height === value
                                        ? "bg-slate-700 text-white"
                                        : "bg-white hover:bg-slate-100 text-slate-700 border"
                                    }
                                `}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

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
                                        ? "bg-slate-700 text-white"
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

            {/* ========== STYLE ========== */}
            <div className="space-y-3 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">✨ Style</p>

                <div className="space-y-1">
                    <Label className="text-xs text-slate-500">Type de ligne</Label>
                    <div className="flex gap-1">
                        {STYLE_OPTIONS.map(({ value, label }) => (
                            <button
                                key={value}
                                onClick={() => updateStyle("borderStyle", value as ElementStyleOverride["borderStyle"])}
                                className={`
                                    flex-1 py-1.5 text-xs rounded transition-all
                                    ${styles.borderStyle === value
                                        ? "bg-slate-700 text-white"
                                        : "bg-white hover:bg-slate-100 text-slate-700 border"
                                    }
                                `}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Border Radius */}
                <div className="space-y-1">
                    <Label className="text-xs text-slate-500">Arrondis</Label>
                    <div className="flex gap-1">
                        {["0px", "2px", "4px", "9999px"].map((value) => (
                            <button
                                key={value}
                                onClick={() => updateStyle("borderRadius", value)}
                                className={`
                                    flex-1 py-1.5 text-xs rounded transition-all
                                    ${styles.borderRadius === value
                                        ? "bg-slate-700 text-white"
                                        : "bg-white hover:bg-slate-100 text-slate-700 border"
                                    }
                                `}
                            >
                                {value === "9999px" ? "Pill" : value}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ========== ESPACEMENT ========== */}
            <div className="space-y-3 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">↔️ Espacement</p>

                <div className="space-y-1">
                    <Label className="text-xs text-slate-500">Marge verticale</Label>
                    <div className="flex flex-wrap gap-1">
                        {MARGIN_OPTIONS.map(({ value, label }) => (
                            <button
                                key={value}
                                onClick={() => updateStyle("margin", value)}
                                className={`
                                    px-2 py-1 text-xs rounded transition-all
                                    ${styles.margin === value
                                        ? "bg-slate-700 text-white"
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
                                    ? "bg-slate-700 text-white"
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
                <div className="flex justify-center py-4">
                    <div
                        style={{
                            width: styles.width || "100%",
                            height: styles.height || "2px",
                            backgroundColor: styles.backgroundColor || "#e5e7eb",
                            borderRadius: styles.borderRadius || "0px",
                            opacity: styles.opacity ?? 1,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
