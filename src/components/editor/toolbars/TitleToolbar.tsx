"use client";

import React from "react";
import { Type, Palette, AlignLeft, AlignCenter, AlignRight, RotateCcw, CaseSensitive } from "lucide-react";
import type { ElementStyleOverride } from "@/types";
import { Label } from "@/components/ui/label";

// ---------- PROPS ----------

interface TitleToolbarProps {
    elementId: string;
    elementLabel: string;
    currentStyles: ElementStyleOverride;
    onSave: (styles: ElementStyleOverride) => void;
    onReset: () => void;
    onClose: () => void;
}

// ---------- CONSTANTS ----------

const FONT_SIZES = [
    { value: "1.5rem", label: "S" },
    { value: "2rem", label: "M" },
    { value: "2.5rem", label: "L" },
    { value: "3rem", label: "XL" },
    { value: "3.5rem", label: "2XL" },
    { value: "4rem", label: "3XL" },
    { value: "5rem", label: "4XL" },
];

const FONT_WEIGHTS = [
    { value: "300", label: "Light" },
    { value: "400", label: "Normal" },
    { value: "500", label: "Medium" },
    { value: "600", label: "Semi" },
    { value: "700", label: "Bold" },
    { value: "800", label: "Extra" },
];

const TEXT_TRANSFORMS = [
    { value: "none", label: "Normal" },
    { value: "uppercase", label: "MAJUSCULES" },
    { value: "capitalize", label: "Capitalize" },
];

const LETTER_SPACINGS = [
    { value: "normal", label: "Normal" },
    { value: "0.05em", label: "Léger" },
    { value: "0.1em", label: "Large" },
    { value: "0.2em", label: "Très large" },
];

const FONT_FAMILIES = [
    { value: "inherit", label: "Par défaut" },
    { value: "'Inter', sans-serif", label: "Inter" },
    { value: "'Playfair Display', serif", label: "Playfair" },
    { value: "'Montserrat', sans-serif", label: "Montserrat" },
    { value: "'Roboto', sans-serif", label: "Roboto" },
    { value: "'Poppins', sans-serif", label: "Poppins" },
    { value: "'Cormorant Garamond', serif", label: "Cormorant" },
    { value: "'Oswald', sans-serif", label: "Oswald" },
];

// ---------- COMPONENT ----------

export function TitleToolbar({
    elementId,
    elementLabel,
    currentStyles,
    onSave,
    onReset,
    onClose,
}: TitleToolbarProps) {
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

            {/* Font Family */}
            <div className="space-y-2">
                <Label className="text-xs">🔤 Police</Label>
                <select
                    value={styles.fontFamily || "inherit"}
                    onChange={(e) => updateStyle("fontFamily", e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                >
                    {FONT_FAMILIES.map(({ value, label }) => (
                        <option key={value} value={value} style={{ fontFamily: value }}>
                            {label}
                        </option>
                    ))}
                </select>
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

            {/* Text Transform */}
            <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs">
                    <CaseSensitive className="w-3 h-3" />
                    Casse
                </Label>
                <div className="flex gap-1">
                    {TEXT_TRANSFORMS.map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => updateStyle("textTransform", value as ElementStyleOverride["textTransform"])}
                            className={`
                                flex-1 py-1.5 text-xs rounded transition-all
                                ${styles.textTransform === value
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

            {/* Letter Spacing */}
            <div className="space-y-2">
                <Label className="text-xs">↔️ Espacement lettres</Label>
                <div className="flex gap-1">
                    {LETTER_SPACINGS.map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => updateStyle("letterSpacing", value)}
                            className={`
                                flex-1 py-1.5 text-xs rounded transition-all
                                ${styles.letterSpacing === value
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
                                    ? "bg-blue-600 text-white"
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
                    className="p-2 bg-white rounded border overflow-hidden"
                    style={{
                        color: styles.color,
                        fontSize: styles.fontSize ? `min(${styles.fontSize}, 1.5rem)` : "1.5rem",
                        fontWeight: styles.fontWeight,
                        textAlign: styles.textAlign,
                        textTransform: styles.textTransform,
                        letterSpacing: styles.letterSpacing,
                    }}
                >
                    Titre d&apos;exemple
                </div>
            </div>
        </div>
    );
}
