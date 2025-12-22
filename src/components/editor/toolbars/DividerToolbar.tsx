"use client";

import React from "react";
import { Minus, Palette, RotateCcw, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
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

const HEIGHT_OPTIONS = [
    { value: "1px", label: "Fin" },
    { value: "2px", label: "Normal" },
    { value: "4px", label: "Épais" },
    { value: "8px", label: "Très épais" },
];

const OPACITY_OPTIONS = [
    { value: "0.1", label: "10%" },
    { value: "0.3", label: "30%" },
    { value: "0.5", label: "50%" },
    { value: "1", label: "100%" },
];

const WIDTH_OPTIONS = [
    { value: "100%", label: "Pleine" },
    { value: "80%", label: "80%" },
    { value: "60%", label: "60%" },
    { value: "40%", label: "40%" },
];

const ALIGN_OPTIONS = [
    { value: "left", label: "Gauche", icon: AlignLeft },
    { value: "center", label: "Centre", icon: AlignCenter },
    { value: "right", label: "Droite", icon: AlignRight },
] as const;

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

    // Custom height for divider
    const dividerHeight = styles.borderWidth || "1px";
    const dividerOpacity = styles.opacity?.toString() || "1";
    const dividerWidth = styles.width || "100%";
    const dividerAlign = styles.dividerAlign || "center";

    // Calculate margin for alignment preview
    const getAlignStyle = (): React.CSSProperties => {
        if (dividerWidth === "100%") return {};
        switch (dividerAlign) {
            case "left": return { marginRight: "auto", marginLeft: 0 };
            case "right": return { marginLeft: "auto", marginRight: 0 };
            default: return { marginLeft: "auto", marginRight: "auto" };
        }
    };

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

            {/* Color */}
            <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs">
                    <Palette className="w-3 h-3" />
                    Couleur
                </Label>
                <div className="flex gap-2 items-center">
                    <div className="relative">
                        <div
                            className="w-10 h-10 rounded-lg border-2 border-slate-200 cursor-pointer"
                            style={{ backgroundColor: styles.backgroundColor || "#8b5cf6" }}
                        />
                        <input
                            type="color"
                            value={styles.backgroundColor || "#8b5cf6"}
                            onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                    <input
                        type="text"
                        value={styles.backgroundColor || ""}
                        onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                        placeholder="#8b5cf6"
                        className="flex-1 border rounded-lg px-3 py-2 text-sm"
                    />
                </div>
            </div>

            {/* Height */}
            <div className="space-y-2">
                <Label className="text-xs">📏 Épaisseur</Label>
                <div className="flex gap-1">
                    {HEIGHT_OPTIONS.map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => updateStyle("borderWidth", value)}
                            className={`
                                flex-1 py-2 text-xs rounded transition-all
                                ${dividerHeight === value
                                    ? "bg-slate-800 text-white"
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
                    {OPACITY_OPTIONS.map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => updateStyle("opacity", parseFloat(value))}
                            className={`
                                flex-1 py-2 text-xs rounded transition-all
                                ${dividerOpacity === value
                                    ? "bg-slate-800 text-white"
                                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                                }
                            `}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Width */}
            <div className="space-y-2">
                <Label className="text-xs">↔️ Largeur</Label>
                <div className="flex gap-1">
                    {WIDTH_OPTIONS.map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => updateStyle("width", value)}
                            className={`
                                flex-1 py-2 text-xs rounded transition-all
                                ${dividerWidth === value
                                    ? "bg-slate-800 text-white"
                                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                                }
                            `}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Alignment */}
            <div className="space-y-2">
                <Label className="text-xs">📍 Position</Label>
                <div className="flex gap-1">
                    {ALIGN_OPTIONS.map(({ value, label, icon: Icon }) => (
                        <button
                            key={value}
                            onClick={() => updateStyle("dividerAlign", value)}
                            className={`
                                flex-1 py-2 text-xs rounded transition-all flex items-center justify-center gap-1
                                ${dividerAlign === value
                                    ? "bg-slate-800 text-white"
                                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                                }
                            `}
                        >
                            <Icon className="w-3 h-3" />
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Preview */}
            <div className="p-4 bg-slate-100 rounded-lg mt-4">
                <p className="text-[10px] text-slate-400 mb-3">Aperçu</p>
                <div
                    style={{
                        backgroundColor: styles.backgroundColor || "#8b5cf6",
                        height: dividerHeight,
                        width: dividerWidth,
                        opacity: parseFloat(dividerOpacity),
                        borderRadius: "2px",
                        ...getAlignStyle(),
                    }}
                />
            </div>
        </div>
    );
}
