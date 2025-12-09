"use client";

import React from "react";
import { Box, Palette, RotateCcw } from "lucide-react";
import type { ElementStyleOverride } from "@/types";
import { Label } from "@/components/ui/label";

// ---------- PROPS ----------

interface ContainerToolbarProps {
    elementId: string;
    elementLabel: string;
    currentStyles: ElementStyleOverride;
    onSave: (styles: ElementStyleOverride) => void;
    onReset: () => void;
    onClose: () => void;
}

// ---------- CONSTANTS ----------

const BORDER_RADIUS_OPTIONS = [
    { value: "0px", label: "Carré" },
    { value: "8px", label: "Léger" },
    { value: "16px", label: "Moyen" },
    { value: "24px", label: "Arrondi" },
];

const PADDING_OPTIONS = [
    { value: "16px", label: "Petit" },
    { value: "24px", label: "Normal" },
    { value: "32px", label: "Moyen" },
    { value: "48px", label: "Grand" },
    { value: "64px", label: "Très grand" },
];

const SHADOW_OPTIONS = [
    { value: "none", label: "Aucune" },
    { value: "0 4px 24px rgba(0,0,0,0.08)", label: "Subtile" },
    { value: "0 8px 40px rgba(0,0,0,0.12)", label: "Moyenne" },
];

// ---------- COMPONENT ----------

export function ContainerToolbar({
    elementId,
    elementLabel,
    currentStyles,
    onSave,
    onReset,
    onClose,
}: ContainerToolbarProps) {
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
                    <Box className="w-4 h-4 text-indigo-600" />
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

            {/* Background Color */}
            <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs">
                    <Palette className="w-3 h-3" />
                    Couleur de fond
                </Label>
                <div className="flex gap-2">
                    <input
                        type="color"
                        value={styles.backgroundColor || "#ffffff"}
                        onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer border-2 border-slate-200"
                    />
                    <input
                        type="text"
                        value={styles.backgroundColor || ""}
                        onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                        placeholder="#ffffff"
                        className="flex-1 border rounded-lg px-3 text-sm"
                    />
                </div>
            </div>

            {/* Padding */}
            <div className="space-y-2">
                <Label className="text-xs">📏 Espacement interne</Label>
                <div className="flex flex-wrap gap-1">
                    {PADDING_OPTIONS.map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => updateStyle("padding", value)}
                            className={`
                                px-2 py-1.5 text-xs rounded transition-all
                                ${styles.padding === value
                                    ? "bg-indigo-600 text-white"
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
                                flex-1 py-1.5 text-xs rounded transition-all
                                ${styles.borderRadius === value
                                    ? "bg-indigo-600 text-white"
                                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                                }
                            `}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Shadow */}
            <div className="space-y-2">
                <Label className="text-xs">✨ Ombre</Label>
                <div className="flex gap-1">
                    {SHADOW_OPTIONS.map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => updateStyle("boxShadow", value)}
                            className={`
                                flex-1 py-1.5 text-xs rounded transition-all
                                ${styles.boxShadow === value
                                    ? "bg-indigo-600 text-white"
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
                <p className="text-[10px] text-slate-400 mb-2">Aperçu section</p>
                <div
                    className="h-20 flex items-center justify-center text-xs text-slate-400"
                    style={{
                        backgroundColor: styles.backgroundColor || "#f8fafc",
                        borderRadius: styles.borderRadius,
                        padding: styles.padding ? `calc(${styles.padding} / 2)` : "16px",
                        boxShadow: styles.boxShadow,
                    }}
                >
                    Contenu de section
                </div>
            </div>
        </div>
    );
}
