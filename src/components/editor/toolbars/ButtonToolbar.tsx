"use client";

import React from "react";
import {
    Square, Palette, RotateCcw,
    ChevronLeft, ChevronRight
} from "lucide-react";
import type { ElementStyleOverride } from "@/types";
import { Label } from "@/components/ui/label";

// ---------- PROPS ----------

interface ButtonToolbarProps {
    elementId: string;
    elementLabel: string;
    currentStyles: ElementStyleOverride;
    onSave: (styles: ElementStyleOverride) => void;
    onReset: () => void;
    onClose: () => void;
}

// ---------- CONSTANTS ----------

const FONT_FAMILIES = [
    { value: "inherit", label: "Par défaut", category: "default" },
    // Sans-Serif
    { value: "'Inter', sans-serif", label: "Inter", category: "sans" },
    { value: "'Poppins', sans-serif", label: "Poppins", category: "sans" },
    { value: "'Montserrat', sans-serif", label: "Montserrat", category: "sans" },
    { value: "'Roboto', sans-serif", label: "Roboto", category: "sans" },
    { value: "'Open Sans', sans-serif", label: "Open Sans", category: "sans" },
    { value: "'Oswald', sans-serif", label: "Oswald", category: "sans" },
    // Serif
    { value: "'Playfair Display', serif", label: "Playfair", category: "serif" },
    { value: "'Cormorant Garamond', serif", label: "Cormorant", category: "serif" },
    { value: "'Lora', serif", label: "Lora", category: "serif" },
    { value: "'Merriweather', serif", label: "Merriweather", category: "serif" },
    // Mono
    { value: "'JetBrains Mono', monospace", label: "JetBrains", category: "mono" },
    { value: "'Fira Code', monospace", label: "Fira Code", category: "mono" },
    // Handwritten
    { value: "'Dancing Script', cursive", label: "Dancing Script", category: "hand" },
    { value: "'Pacifico', cursive", label: "Pacifico", category: "hand" },
];

const FONT_WEIGHTS = [
    { value: "400", label: "Regular" },
    { value: "500", label: "Medium" },
    { value: "600", label: "SemiBold" },
    { value: "700", label: "Bold" },
    { value: "800", label: "ExtraBold" },
    { value: "900", label: "Black" },
];

const FONT_SIZES = [
    { value: "0.75rem", label: "12" },
    { value: "0.875rem", label: "14" },
    { value: "1rem", label: "16" },
    { value: "1.125rem", label: "18" },
    { value: "1.25rem", label: "20" },
    { value: "1.5rem", label: "24" },
];

const PADDING_Y_OPTIONS = [
    { value: "8px", label: "8" },
    { value: "12px", label: "12" },
    { value: "16px", label: "16" },
    { value: "20px", label: "20" },
];

const PADDING_X_OPTIONS = [
    { value: "16px", label: "16" },
    { value: "24px", label: "24" },
    { value: "32px", label: "32" },
    { value: "48px", label: "48" },
];

const BORDER_WIDTH_OPTIONS = [
    { value: "0px", label: "0" },
    { value: "1px", label: "1" },
    { value: "2px", label: "2" },
    { value: "3px", label: "3" },
    { value: "4px", label: "4" },
    { value: "6px", label: "6" },
    { value: "8px", label: "8" },
    { value: "10px", label: "10" },
    { value: "12px", label: "12" },
];

const BORDER_RADIUS_OPTIONS = [
    { value: "0px", label: "0" },
    { value: "4px", label: "4" },
    { value: "8px", label: "8" },
    { value: "12px", label: "12" },
    { value: "16px", label: "16" },
    { value: "9999px", label: "Pill" },
];

const SHADOW_OPTIONS = [
    { value: "none", label: "Aucune" },
    { value: "0 2px 4px rgba(0,0,0,0.1)", label: "Subtile" },
    { value: "0 4px 12px rgba(0,0,0,0.15)", label: "Moyenne" },
    { value: "0 8px 24px rgba(0,0,0,0.2)", label: "Forte" },
    { value: "inset 0 2px 4px rgba(0,0,0,0.1)", label: "Interne" },
];

// ---------- COMPONENT ----------

export function ButtonToolbar({
    elementId,
    elementLabel,
    currentStyles,
    onSave,
    onReset,
    onClose,
}: ButtonToolbarProps) {
    const updateStyle = <K extends keyof ElementStyleOverride>(
        key: K,
        value: ElementStyleOverride[K]
    ) => {
        onSave({ [key]: value } as ElementStyleOverride);
    };

    const styles = currentStyles;

    // Compute padding from paddingX/Y or fallback to padding
    const currentPaddingY = styles.paddingY || "12px";
    const currentPaddingX = styles.paddingX || "24px";

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b">
                <div className="flex items-center gap-2">
                    <Square className="w-4 h-4 text-purple-600" />
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

                {/* Padding */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                        <Label className="text-xs text-slate-500">Padding V</Label>
                        <div className="flex gap-1">
                            {PADDING_Y_OPTIONS.map(({ value, label }) => (
                                <button
                                    key={value}
                                    onClick={() => updateStyle("paddingY", value)}
                                    className={`
                                        flex-1 py-1 text-xs rounded transition-all
                                        ${currentPaddingY === value
                                            ? "bg-purple-600 text-white"
                                            : "bg-white hover:bg-slate-100 text-slate-700 border"
                                        }
                                    `}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs text-slate-500">Padding H</Label>
                        <div className="flex gap-1">
                            {PADDING_X_OPTIONS.map(({ value, label }) => (
                                <button
                                    key={value}
                                    onClick={() => updateStyle("paddingX", value)}
                                    className={`
                                        flex-1 py-1 text-xs rounded transition-all
                                        ${currentPaddingX === value
                                            ? "bg-purple-600 text-white"
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
            </div>

            {/* ========== TYPOGRAPHIE ========== */}
            <div className="space-y-3 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">🔤 Typographie</p>

                {/* Font Family */}
                <div className="space-y-1">
                    <Label className="text-xs text-slate-500">Police</Label>
                    <select
                        value={styles.fontFamily || "inherit"}
                        onChange={(e) => updateStyle("fontFamily", e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                    >
                        <optgroup label="Par défaut">
                            <option value="inherit">Par défaut</option>
                        </optgroup>
                        <optgroup label="Sans-Serif">
                            {FONT_FAMILIES.filter(f => f.category === "sans").map(({ value, label }) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </optgroup>
                        <optgroup label="Serif">
                            {FONT_FAMILIES.filter(f => f.category === "serif").map(({ value, label }) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </optgroup>
                        <optgroup label="Monospace">
                            {FONT_FAMILIES.filter(f => f.category === "mono").map(({ value, label }) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </optgroup>
                        <optgroup label="Handwritten">
                            {FONT_FAMILIES.filter(f => f.category === "hand").map(({ value, label }) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </optgroup>
                    </select>
                </div>

                {/* Font Size & Weight */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                        <Label className="text-xs text-slate-500">Taille</Label>
                        <select
                            value={styles.fontSize || "1rem"}
                            onChange={(e) => updateStyle("fontSize", e.target.value)}
                            className="w-full border rounded px-2 py-1.5 text-sm bg-white"
                        >
                            {FONT_SIZES.map(({ value, label }) => (
                                <option key={value} value={value}>{label}px</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs text-slate-500">Graisse</Label>
                        <select
                            value={styles.fontWeight || "600"}
                            onChange={(e) => updateStyle("fontWeight", e.target.value)}
                            className="w-full border rounded px-2 py-1.5 text-sm bg-white"
                        >
                            {FONT_WEIGHTS.map(({ value, label }) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Text Transform */}
                <div className="space-y-1">
                    <Label className="text-xs text-slate-500">Casse</Label>
                    <div className="flex gap-1">
                        {[
                            { value: "none", label: "Normal" },
                            { value: "uppercase", label: "MAJUSCULES" },
                        ].map(({ value, label }) => (
                            <button
                                key={value}
                                onClick={() => updateStyle("textTransform", value as ElementStyleOverride["textTransform"])}
                                className={`
                                    flex-1 py-1.5 text-xs rounded transition-all
                                    ${styles.textTransform === value
                                        ? "bg-purple-600 text-white"
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

            {/* ========== COULEURS NORMALES ========== */}
            <div className="space-y-3 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">🎨 Couleurs</p>

                <div className="grid grid-cols-3 gap-2">
                    {/* Background */}
                    <div className="space-y-1">
                        <Label className="text-xs text-slate-500">Fond</Label>
                        <div className="relative">
                            <div
                                className="w-full h-8 rounded border-2 border-slate-200 cursor-pointer"
                                style={{ backgroundColor: styles.backgroundColor || "#3b82f6" }}
                            />
                            <input
                                type="color"
                                value={styles.backgroundColor || "#3b82f6"}
                                onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                    </div>
                    {/* Text */}
                    <div className="space-y-1">
                        <Label className="text-xs text-slate-500">Texte</Label>
                        <div className="relative">
                            <div
                                className="w-full h-8 rounded border-2 border-slate-200 cursor-pointer"
                                style={{ backgroundColor: styles.color || "#ffffff" }}
                            />
                            <input
                                type="color"
                                value={styles.color || "#ffffff"}
                                onChange={(e) => updateStyle("color", e.target.value)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                    </div>
                    {/* Border */}
                    <div className="space-y-1">
                        <Label className="text-xs text-slate-500">Bordure</Label>
                        <div className="relative">
                            <div
                                className="w-full h-8 rounded border-2 border-slate-200 cursor-pointer"
                                style={{ backgroundColor: styles.borderColor || "#3b82f6" }}
                            />
                            <input
                                type="color"
                                value={styles.borderColor || "#3b82f6"}
                                onChange={(e) => updateStyle("borderColor", e.target.value)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ========== COULEURS SURVOL ========== */}
            <div className="space-y-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">✨ Survol (Hover)</p>

                <div className="grid grid-cols-2 gap-2">
                    {/* Hover Background */}
                    <div className="space-y-1">
                        <Label className="text-xs text-slate-500">Fond survol</Label>
                        <div className="relative">
                            <div
                                className="w-full h-8 rounded border-2 border-slate-200 cursor-pointer"
                                style={{ backgroundColor: styles.hoverBackgroundColor || "#2563eb" }}
                            />
                            <input
                                type="color"
                                value={styles.hoverBackgroundColor || "#2563eb"}
                                onChange={(e) => updateStyle("hoverBackgroundColor", e.target.value)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                    </div>
                    {/* Hover Text */}
                    <div className="space-y-1">
                        <Label className="text-xs text-slate-500">Texte survol</Label>
                        <div className="relative">
                            <div
                                className="w-full h-8 rounded border-2 border-slate-200 cursor-pointer"
                                style={{ backgroundColor: styles.hoverColor || "#ffffff" }}
                            />
                            <input
                                type="color"
                                value={styles.hoverColor || "#ffffff"}
                                onChange={(e) => updateStyle("hoverColor", e.target.value)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ========== BORDURES ========== */}
            <div className="space-y-3 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">🖼️ Bordures</p>

                {/* Border Style & Width */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                        <Label className="text-xs text-slate-500">Style</Label>
                        <select
                            value={styles.borderStyle || "none"}
                            onChange={(e) => updateStyle("borderStyle", e.target.value as ElementStyleOverride["borderStyle"])}
                            className="w-full border rounded px-2 py-1.5 text-sm bg-white"
                        >
                            <option value="none">Aucune</option>
                            <option value="solid">Solide</option>
                            <option value="double">Double</option>
                            <option value="dashed">Tirets</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs text-slate-500">Épaisseur</Label>
                        <select
                            value={styles.borderWidth || "0px"}
                            onChange={(e) => updateStyle("borderWidth", e.target.value)}
                            className="w-full border rounded px-2 py-1.5 text-sm bg-white"
                        >
                            {BORDER_WIDTH_OPTIONS.map(({ value, label }) => (
                                <option key={value} value={value}>{label}px</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Border Radius */}
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
                                        ? "bg-purple-600 text-white"
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
                                    ? "bg-purple-600 text-white"
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
                    <button
                        className="transition-all font-medium"
                        style={{
                            width: styles.width || "auto",
                            padding: `${currentPaddingY} ${currentPaddingX}`,
                            fontFamily: styles.fontFamily || "inherit",
                            fontSize: styles.fontSize || "1rem",
                            fontWeight: styles.fontWeight || "600",
                            textTransform: styles.textTransform || "none",
                            backgroundColor: styles.backgroundColor || "#3b82f6",
                            color: styles.color || "#ffffff",
                            borderRadius: styles.borderRadius || "8px",
                            borderStyle: styles.borderStyle || "none",
                            borderWidth: styles.borderWidth || "0px",
                            borderColor: styles.borderColor || "#3b82f6",
                            boxShadow: styles.boxShadow || "none",
                        }}
                    >
                        Bouton exemple
                    </button>
                </div>
            </div>
        </div>
    );
}
