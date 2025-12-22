"use client";

import React from "react";
import {
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Italic, Underline, Strikethrough, FileText, RotateCcw
} from "lucide-react";
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

const FONT_FAMILIES = [
    { value: "inherit", label: "Par défaut", category: "default" },
    // Sans-Serif
    { value: "'Inter', sans-serif", label: "Inter", category: "sans" },
    { value: "'Poppins', sans-serif", label: "Poppins", category: "sans" },
    { value: "'Montserrat', sans-serif", label: "Montserrat", category: "sans" },
    { value: "'Roboto', sans-serif", label: "Roboto", category: "sans" },
    { value: "'Open Sans', sans-serif", label: "Open Sans", category: "sans" },
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
    { value: "100", label: "Thin" },
    { value: "200", label: "ExtraLight" },
    { value: "300", label: "Light" },
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
    { value: "2rem", label: "32" },
];

const LINE_HEIGHTS = [
    { value: "1", label: "1.0" },
    { value: "1.2", label: "1.2" },
    { value: "1.4", label: "1.4" },
    { value: "1.6", label: "1.6" },
    { value: "1.8", label: "1.8" },
    { value: "2", label: "2.0" },
];

const LETTER_SPACINGS = [
    { value: "-0.05em", label: "-5%" },
    { value: "0", label: "0" },
    { value: "0.05em", label: "+5%" },
    { value: "0.1em", label: "+10%" },
    { value: "0.2em", label: "+20%" },
    { value: "0.3em", label: "+30%" },
];

const OPACITY_OPTIONS = [
    { value: 1, label: "100%" },
    { value: 0.8, label: "80%" },
    { value: 0.6, label: "60%" },
    { value: 0.4, label: "40%" },
    { value: 0.2, label: "20%" },
];

const TEXT_SHADOW_PRESETS = [
    { value: "none", label: "Aucune" },
    { value: "1px 1px 2px rgba(0,0,0,0.3)", label: "Subtile" },
    { value: "2px 2px 4px rgba(0,0,0,0.4)", label: "Douce" },
    { value: "3px 3px 6px rgba(0,0,0,0.5)", label: "Moyenne" },
    { value: "4px 4px 8px rgba(0,0,0,0.6)", label: "Forte" },
    { value: "0 0 8px currentColor, 0 0 12px currentColor", label: "Glow" },
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
                    <FileText className="w-4 h-4 text-green-600" />
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

            {/* ========== POLICE ========== */}
            <div className="space-y-3 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">🔤 Police</p>

                {/* Font Family */}
                <div className="space-y-1">
                    <Label className="text-xs text-slate-500">Famille</Label>
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

                {/* Font Weight */}
                <div className="space-y-1">
                    <Label className="text-xs text-slate-500">Graisse</Label>
                    <select
                        value={styles.fontWeight || "400"}
                        onChange={(e) => updateStyle("fontWeight", e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                    >
                        {FONT_WEIGHTS.map(({ value, label }) => (
                            <option key={value} value={value}>{value} - {label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* ========== TAILLE ========== */}
            <div className="space-y-3 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">📏 Taille</p>

                <div className="space-y-1">
                    <Label className="text-xs text-slate-500">Taille du texte</Label>
                    <div className="flex flex-wrap gap-1">
                        {FONT_SIZES.map(({ value, label }) => (
                            <button
                                key={value}
                                onClick={() => updateStyle("fontSize", value)}
                                className={`
                                    px-2 py-1 text-xs rounded transition-all
                                    ${styles.fontSize === value
                                        ? "bg-green-600 text-white"
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

            {/* ========== COULEUR ========== */}
            <div className="space-y-3 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">🎨 Couleur</p>

                {/* Color Picker */}
                <div className="space-y-1">
                    <Label className="text-xs text-slate-500">Couleur du texte</Label>
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
                </div>

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
                                        ? "bg-green-600 text-white"
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

            {/* ========== ESPACEMENT ========== */}
            <div className="space-y-3 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">↔️ Espacement</p>

                {/* Line Height */}
                <div className="space-y-1">
                    <Label className="text-xs text-slate-500">Hauteur de ligne</Label>
                    <div className="flex gap-1">
                        {LINE_HEIGHTS.map(({ value, label }) => (
                            <button
                                key={value}
                                onClick={() => updateStyle("lineHeight", value)}
                                className={`
                                    flex-1 py-1.5 text-xs rounded transition-all
                                    ${styles.lineHeight === value
                                        ? "bg-green-600 text-white"
                                        : "bg-white hover:bg-slate-100 text-slate-700 border"
                                    }
                                `}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Letter Spacing */}
                <div className="space-y-1">
                    <Label className="text-xs text-slate-500">Espacement lettres</Label>
                    <div className="flex gap-1">
                        {LETTER_SPACINGS.map(({ value, label }) => (
                            <button
                                key={value}
                                onClick={() => updateStyle("letterSpacing", value)}
                                className={`
                                    flex-1 py-1.5 text-xs rounded transition-all
                                    ${styles.letterSpacing === value
                                        ? "bg-green-600 text-white"
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

            {/* ========== ALIGNEMENT ========== */}
            <div className="space-y-3 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">📐 Alignement</p>

                <div className="flex gap-1">
                    {[
                        { icon: AlignLeft, value: "left" as const, label: "Gauche" },
                        { icon: AlignCenter, value: "center" as const, label: "Centre" },
                        { icon: AlignRight, value: "right" as const, label: "Droite" },
                        { icon: AlignJustify, value: "justify" as const, label: "Justifié" },
                    ].map(({ icon: Icon, value, label }) => (
                        <button
                            key={value}
                            onClick={() => updateStyle("textAlign", value)}
                            className={`
                                flex-1 p-2 rounded transition-colors flex items-center justify-center gap-1
                                ${styles.textAlign === value
                                    ? "bg-green-600 text-white"
                                    : "bg-white hover:bg-slate-100 text-slate-700 border"
                                }
                            `}
                            title={label}
                        >
                            <Icon className="w-4 h-4" />
                        </button>
                    ))}
                </div>
            </div>

            {/* ========== STYLE ========== */}
            <div className="space-y-3 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">✨ Style</p>

                {/* Text Styles (Italic, Underline, Strikethrough) */}
                <div className="space-y-1">
                    <Label className="text-xs text-slate-500">Décoration</Label>
                    <div className="flex gap-1">
                        <button
                            onClick={() => updateStyle("fontStyle", styles.fontStyle === "italic" ? "normal" : "italic")}
                            className={`
                                flex-1 p-2 rounded transition-colors flex items-center justify-center gap-1
                                ${styles.fontStyle === "italic"
                                    ? "bg-green-600 text-white"
                                    : "bg-white hover:bg-slate-100 text-slate-700 border"
                                }
                            `}
                            title="Italique"
                        >
                            <Italic className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => updateStyle("textDecoration", styles.textDecoration === "underline" ? "none" : "underline")}
                            className={`
                                flex-1 p-2 rounded transition-colors flex items-center justify-center gap-1
                                ${styles.textDecoration === "underline"
                                    ? "bg-green-600 text-white"
                                    : "bg-white hover:bg-slate-100 text-slate-700 border"
                                }
                            `}
                            title="Souligné"
                        >
                            <Underline className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => updateStyle("textDecoration", styles.textDecoration === "line-through" ? "none" : "line-through")}
                            className={`
                                flex-1 p-2 rounded transition-colors flex items-center justify-center gap-1
                                ${styles.textDecoration === "line-through"
                                    ? "bg-green-600 text-white"
                                    : "bg-white hover:bg-slate-100 text-slate-700 border"
                                }
                            `}
                            title="Barré"
                        >
                            <Strikethrough className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Text Transform */}
                <div className="space-y-1">
                    <Label className="text-xs text-slate-500">Casse</Label>
                    <div className="flex gap-1">
                        {[
                            { value: "none" as const, label: "Normal" },
                            { value: "uppercase" as const, label: "MAJUSCULES" },
                            { value: "capitalize" as const, label: "Capitalize" },
                            { value: "lowercase" as const, label: "minuscules" },
                        ].map(({ value, label }) => (
                            <button
                                key={value}
                                onClick={() => updateStyle("textTransform", value)}
                                className={`
                                    flex-1 py-1.5 text-xs rounded transition-all
                                    ${styles.textTransform === value
                                        ? "bg-green-600 text-white"
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

                <div className="space-y-1">
                    <Label className="text-xs text-slate-500">Ombre portée</Label>
                    <div className="grid grid-cols-3 gap-1">
                        {TEXT_SHADOW_PRESETS.map(({ value, label }) => (
                            <button
                                key={value}
                                onClick={() => updateStyle("textShadow", value)}
                                className={`
                                    py-1.5 text-xs rounded transition-all
                                    ${styles.textShadow === value
                                        ? "bg-green-600 text-white"
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

            {/* ========== PREVIEW ========== */}
            <div className="p-3 bg-slate-100 rounded-lg">
                <p className="text-[10px] text-slate-400 mb-2">Aperçu</p>
                <div
                    className="p-3 bg-white rounded border overflow-hidden"
                    style={{
                        color: styles.color || "#000000",
                        fontSize: styles.fontSize || "1rem",
                        fontWeight: styles.fontWeight || "400",
                        fontFamily: styles.fontFamily || "inherit",
                        textAlign: styles.textAlign || "left",
                        lineHeight: styles.lineHeight || "1.6",
                        letterSpacing: styles.letterSpacing || "0",
                        textTransform: styles.textTransform || "none",
                        fontStyle: styles.fontStyle || "normal",
                        textDecoration: styles.textDecoration || "none",
                        textShadow: styles.textShadow || "none",
                        opacity: styles.opacity ?? 1,
                    }}
                >
                    Ceci est un paragraphe d&apos;exemple pour visualiser les styles appliqués.
                </div>
            </div>
        </div>
    );
}
