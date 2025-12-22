"use client";

import React from "react";
import { LayoutGrid, Palette, RotateCcw } from "lucide-react";
import type { ElementStyleOverride } from "@/types";
import { Label } from "@/components/ui/label";

// ---------- PROPS ----------

interface ProductCardToolbarProps {
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
    { value: "12px", label: "Moyen" },
    { value: "16px", label: "Arrondi" },
    { value: "24px", label: "Très arrondi" },
];

const SHADOW_OPTIONS = [
    { value: "none", label: "Aucune" },
    { value: "0 2px 8px rgba(0,0,0,0.08)", label: "Subtile" },
    { value: "0 4px 16px rgba(0,0,0,0.1)", label: "Moyenne" },
    { value: "0 8px 32px rgba(0,0,0,0.15)", label: "Forte" },
];

const PADDING_OPTIONS = [
    { value: "8px", label: "Compact" },
    { value: "12px", label: "Normal" },
    { value: "16px", label: "Aéré" },
    { value: "24px", label: "Spacieux" },
];

// ---------- COMPONENT ----------

export function ProductCardToolbar({
    elementId,
    elementLabel,
    currentStyles,
    onSave,
    onReset,
    onClose,
}: ProductCardToolbarProps) {
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
                    <LayoutGrid className="w-4 h-4 text-orange-600" />
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
                    Fond de carte
                </Label>
                <div className="flex gap-2 items-center">
                    <div className="relative">
                        <div
                            className="w-10 h-10 rounded-lg border-2 border-slate-200 cursor-pointer"
                            style={{ backgroundColor: styles.backgroundColor || "#ffffff" }}
                        />
                        <input
                            type="color"
                            value={styles.backgroundColor || "#ffffff"}
                            onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                    <input
                        type="text"
                        value={styles.backgroundColor || ""}
                        onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                        placeholder="#ffffff"
                        className="flex-1 border rounded-lg px-3 py-2 text-sm"
                    />
                </div>
            </div>

            {/* Border Radius */}
            <div className="space-y-2">
                <Label className="text-xs">📐 Arrondis</Label>
                <div className="flex flex-wrap gap-1">
                    {BORDER_RADIUS_OPTIONS.map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => updateStyle("borderRadius", value)}
                            className={`
                                px-2 py-1.5 text-xs rounded transition-all
                                ${styles.borderRadius === value
                                    ? "bg-orange-600 text-white"
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
                <div className="flex flex-wrap gap-1">
                    {SHADOW_OPTIONS.map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => updateStyle("boxShadow", value)}
                            className={`
                                px-3 py-1.5 text-xs rounded transition-all
                                ${styles.boxShadow === value
                                    ? "bg-orange-600 text-white"
                                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                                }
                            `}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Padding */}
            <div className="space-y-2">
                <Label className="text-xs">📏 Espacement interne</Label>
                <div className="flex gap-1">
                    {PADDING_OPTIONS.map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => updateStyle("padding", value)}
                            className={`
                                flex-1 py-1.5 text-xs rounded transition-all
                                ${styles.padding === value
                                    ? "bg-orange-600 text-white"
                                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                                }
                            `}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Separator - Info Box Section */}
            <div className="border-t pt-4 mt-4">
                <Label className="text-xs font-medium text-slate-600 mb-3 block">📦 Zone d'infos (titre, prix)</Label>
            </div>

            {/* Info Box Background Color */}
            <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs">
                    <Palette className="w-3 h-3" />
                    Fond zone d'infos
                </Label>
                <div className="flex gap-2 items-center">
                    <div className="relative">
                        <div
                            className="w-10 h-10 rounded-lg border-2 border-slate-200 cursor-pointer"
                            style={{ backgroundColor: styles.infoBoxBackgroundColor || "#1e1e1e" }}
                        />
                        <input
                            type="color"
                            value={styles.infoBoxBackgroundColor || "#1e1e1e"}
                            onChange={(e) => updateStyle("infoBoxBackgroundColor", e.target.value)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                    <input
                        type="text"
                        value={styles.infoBoxBackgroundColor || ""}
                        onChange={(e) => updateStyle("infoBoxBackgroundColor", e.target.value)}
                        placeholder="#1e1e1e"
                        className="flex-1 border rounded-lg px-3 py-2 text-sm"
                    />
                </div>
            </div>

            {/* Info Box Padding */}
            <div className="space-y-2">
                <Label className="text-xs">📏 Espacement zone d'infos</Label>
                <div className="flex gap-1">
                    {PADDING_OPTIONS.map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => updateStyle("infoBoxPadding", value)}
                            className={`
                                flex-1 py-1.5 text-xs rounded transition-all
                                ${styles.infoBoxPadding === value
                                    ? "bg-orange-600 text-white"
                                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                                }
                            `}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Info Box Full Width Toggle */}
            <div className="space-y-2">
                <Label className="text-xs">📐 Mode pleine largeur</Label>
                <div className="flex gap-2">
                    <button
                        onClick={() => updateStyle("infoBoxFullWidth", false)}
                        className={`
                            flex-1 py-2 text-xs rounded transition-all
                            ${!styles.infoBoxFullWidth
                                ? "bg-orange-600 text-white"
                                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                            }
                        `}
                    >
                        Suit l'image
                    </button>
                    <button
                        onClick={() => updateStyle("infoBoxFullWidth", true)}
                        className={`
                            flex-1 py-2 text-xs rounded transition-all
                            ${styles.infoBoxFullWidth
                                ? "bg-orange-600 text-white"
                                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                            }
                        `}
                    >
                        Pleine largeur
                    </button>
                </div>
                <p className="text-[10px] text-slate-400">Pleine largeur = la zone d'infos couvre toute la carte</p>
            </div>

            {/* Separator */}
            <div className="border-t pt-4 mt-4">
                <Label className="text-xs font-medium text-slate-600 mb-3 block">🎨 Couleurs du texte</Label>
            </div>

            {/* Title Color */}
            <div className="space-y-2">
                <Label className="text-xs">Couleur du titre</Label>
                <div className="flex gap-2 items-center">
                    <div className="relative">
                        <div
                            className="w-10 h-8 rounded border border-slate-200 cursor-pointer"
                            style={{ backgroundColor: styles.titleColor || "#1e293b" }}
                        />
                        <input
                            type="color"
                            value={styles.titleColor || "#1e293b"}
                            onChange={(e) => updateStyle("titleColor", e.target.value)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                    <input
                        type="text"
                        value={styles.titleColor || ""}
                        onChange={(e) => updateStyle("titleColor", e.target.value)}
                        placeholder="#1e293b"
                        className="flex-1 border rounded px-2 py-1 text-xs"
                    />
                </div>
            </div>

            {/* Description Color */}
            <div className="space-y-2">
                <Label className="text-xs">Couleur de la description</Label>
                <div className="flex gap-2 items-center">
                    <div className="relative">
                        <div
                            className="w-10 h-8 rounded border border-slate-200 cursor-pointer"
                            style={{ backgroundColor: styles.descriptionColor || "#64748b" }}
                        />
                        <input
                            type="color"
                            value={styles.descriptionColor || "#64748b"}
                            onChange={(e) => updateStyle("descriptionColor", e.target.value)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                    <input
                        type="text"
                        value={styles.descriptionColor || ""}
                        onChange={(e) => updateStyle("descriptionColor", e.target.value)}
                        placeholder="#64748b"
                        className="flex-1 border rounded px-2 py-1 text-xs"
                    />
                </div>
            </div>

            {/* Price Color */}
            <div className="space-y-2">
                <Label className="text-xs">Couleur du prix</Label>
                <div className="flex gap-2 items-center">
                    <div className="relative">
                        <div
                            className="w-10 h-8 rounded border border-slate-200 cursor-pointer"
                            style={{ backgroundColor: styles.priceColor || "#ea580c" }}
                        />
                        <input
                            type="color"
                            value={styles.priceColor || "#ea580c"}
                            onChange={(e) => updateStyle("priceColor", e.target.value)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                    <input
                        type="text"
                        value={styles.priceColor || ""}
                        onChange={(e) => updateStyle("priceColor", e.target.value)}
                        placeholder="#ea580c"
                        className="flex-1 border rounded px-2 py-1 text-xs"
                    />
                </div>
            </div>

            {/* Separator - Button Section */}
            <div className="border-t pt-4 mt-4">
                <Label className="text-xs font-medium text-slate-600 mb-3 block">🔘 Bouton "Commander"</Label>
            </div>

            {/* Button Background Color */}
            <div className="space-y-2">
                <Label className="text-xs">Couleur du bouton</Label>
                <div className="flex gap-2 items-center">
                    <div className="relative">
                        <div
                            className="w-10 h-8 rounded border border-slate-200 cursor-pointer"
                            style={{ backgroundColor: styles.buttonBgColor || "#8b5cf6" }}
                        />
                        <input
                            type="color"
                            value={styles.buttonBgColor || "#8b5cf6"}
                            onChange={(e) => updateStyle("buttonBgColor", e.target.value)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                    <input
                        type="text"
                        value={styles.buttonBgColor || ""}
                        onChange={(e) => updateStyle("buttonBgColor", e.target.value)}
                        placeholder="#8b5cf6"
                        className="flex-1 border rounded px-2 py-1 text-xs"
                    />
                </div>
            </div>

            {/* Button Text Color */}
            <div className="space-y-2">
                <Label className="text-xs">Couleur texte bouton</Label>
                <div className="flex gap-2 items-center">
                    <div className="relative">
                        <div
                            className="w-10 h-8 rounded border border-slate-200 cursor-pointer"
                            style={{ backgroundColor: styles.buttonTextColor || "#ffffff" }}
                        />
                        <input
                            type="color"
                            value={styles.buttonTextColor || "#ffffff"}
                            onChange={(e) => updateStyle("buttonTextColor", e.target.value)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                    <input
                        type="text"
                        value={styles.buttonTextColor || ""}
                        onChange={(e) => updateStyle("buttonTextColor", e.target.value)}
                        placeholder="#ffffff"
                        className="flex-1 border rounded px-2 py-1 text-xs"
                    />
                </div>
            </div>

            {/* Preview */}
            <div className="p-3 bg-slate-100 rounded-lg mt-4">
                <p className="text-[10px] text-slate-400 mb-2">Aperçu carte</p>
                <div
                    className="bg-white"
                    style={{
                        backgroundColor: styles.backgroundColor,
                        borderRadius: styles.borderRadius || "8px",
                        boxShadow: styles.boxShadow,
                        padding: styles.padding || "12px",
                    }}
                >
                    <div className="w-full h-16 bg-slate-200 rounded mb-2" />
                    <div className="text-sm font-medium" style={{ color: styles.titleColor || "#1e293b" }}>Produit exemple</div>
                    <div className="text-xs mt-1" style={{ color: styles.descriptionColor || "#64748b" }}>Description courte</div>
                    <div className="text-lg font-bold mt-2" style={{ color: styles.priceColor || "#ea580c" }}>29.99 TND</div>
                    <div
                        className="mt-3 text-center py-2 text-sm font-medium rounded"
                        style={{
                            backgroundColor: styles.buttonBgColor || "#8b5cf6",
                            color: styles.buttonTextColor || "#ffffff"
                        }}
                    >
                        COMMANDER
                    </div>
                </div>
            </div>
        </div>
    );
}

