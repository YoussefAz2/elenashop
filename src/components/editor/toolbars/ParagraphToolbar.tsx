"use client";

import React from "react";
import { AlignLeft, Palette, AlignCenter, AlignRight, RotateCcw } from "lucide-react";
import type { ElementStyleOverride } from "@/types";
import { Label } from "@/components/ui/label";

// ---------- PROPS ----------

interface ParagraphToolbarProps {
    elementId: string;
    elementLabel: string;
    currentStyles: ElementStyleOverride;
    onSave: (styles: ElementStyleOverride) => void;
    onReset: () => void;
    onClose: () => void;
}

// ---------- CONSTANTS ----------

const FONT_SIZES = [
    { value: "0.875rem", label: "XS" },
    { value: "1rem", label: "S" },
    { value: "1.125rem", label: "M" },
    { value: "1.25rem", label: "L" },
    { value: "1.5rem", label: "XL" },
];

const LINE_HEIGHTS = [
    { value: "1.4", label: "Serré" },
    { value: "1.6", label: "Normal" },
    { value: "1.8", label: "Aéré" },
    { value: "2", label: "Très aéré" },
];

const OPACITY_OPTIONS = [
    { value: 1, label: "100%" },
    { value: 0.8, label: "80%" },
    { value: 0.6, label: "60%" },
    { value: 0.5, label: "50%" },
];

// ---------- COMPONENT ----------

export function ParagraphToolbar({
    elementId,
    elementLabel,
    currentStyles,
    onSave,
    onReset,
    onClose,
}: ParagraphToolbarProps) {
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
                    <AlignLeft className="w-4 h-4 text-green-600" />
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
                        value={styles.color || "#333333"}
                        onChange={(e) => updateStyle("color", e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer border-2 border-slate-200"
                    />
                    <input
                        type="text"
                        value={styles.color || ""}
                        onChange={(e) => updateStyle("color", e.target.value)}
                        placeholder="#333333"
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
                                px-3 py-1.5 text-xs rounded transition-all
                                ${styles.fontSize === value
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

            {/* Line Height */}
            <div className="space-y-2">
                <Label className="text-xs">📄 Interligne</Label>
                <div className="flex gap-1">
                    {LINE_HEIGHTS.map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => updateStyle("lineHeight", value)}
                            className={`
                                flex-1 py-1.5 text-xs rounded transition-all
                                ${styles.lineHeight === value
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

            {/* Opacity */}
            <div className="space-y-2">
                <Label className="text-xs">🌗 Opacité</Label>
                <div className="flex gap-1">
                    {OPACITY_OPTIONS.map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => updateStyle("opacity", value)}
                            className={`
                                flex-1 py-1.5 text-xs rounded transition-all
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

            {/* Alignment */}
            <div className="space-y-2">
                <Label className="text-xs">📐 Alignement</Label>
                <div className="flex gap-1">
                    {[
                        { icon: AlignLeft, value: "left" as const },
                        { icon: AlignCenter, value: "center" as const },
                        { icon: AlignRight, value: "right" as const },
                    ].map(({ icon: Icon, value }) => (
                        <button
                            key={value}
                            onClick={() => updateStyle("textAlign", value)}
                            className={`
                                p-2 rounded transition-colors
                                ${styles.textAlign === value
                                    ? "bg-green-600 text-white"
                                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                                }
                            `}
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
                    className="p-2 bg-white rounded border text-sm"
                    style={{
                        color: styles.color,
                        fontSize: styles.fontSize,
                        lineHeight: styles.lineHeight,
                        textAlign: styles.textAlign,
                        opacity: styles.opacity,
                    }}
                >
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.
                </div>
            </div>
        </div>
    );
}
