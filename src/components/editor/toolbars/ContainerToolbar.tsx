"use client";

import React, { useState } from "react";
import {
    Box, RotateCcw,
    AlignVerticalJustifyStart, AlignVerticalJustifyCenter, AlignVerticalJustifyEnd,
    AlignHorizontalJustifyStart, AlignHorizontalJustifyCenter, AlignHorizontalJustifyEnd,
    AlignHorizontalSpaceBetween
} from "lucide-react";
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

const MIN_HEIGHT_OPTIONS = [
    { value: "auto", label: "Auto" },
    { value: "300px", label: "300px" },
    { value: "400px", label: "400px" },
    { value: "500px", label: "500px" },
    { value: "100vh", label: "Plein écran" },
    { value: "80vh", label: "80%" },
    { value: "50vh", label: "50%" },
];

const WIDTH_OPTIONS = [
    { value: "100%", label: "Large" },
    { value: "1280px", label: "Boxed XL" },
    { value: "1024px", label: "Boxed L" },
    { value: "768px", label: "Boxed M" },
];

const GRADIENT_DIRECTIONS = [
    { value: "to bottom", label: "↓" },
    { value: "to top", label: "↑" },
    { value: "to right", label: "→" },
    { value: "to left", label: "←" },
    { value: "to bottom right", label: "↘" },
    { value: "to bottom left", label: "↙" },
];

const BG_SIZE_OPTIONS = [
    { value: "cover", label: "Cover" },
    { value: "contain", label: "Contain" },
    { value: "auto", label: "Auto" },
];

const BG_POSITION_OPTIONS = [
    { value: "center", label: "Centre" },
    { value: "top", label: "Haut" },
    { value: "bottom", label: "Bas" },
    { value: "left", label: "Gauche" },
    { value: "right", label: "Droite" },
];

const PADDING_OPTIONS = [
    { value: "0", label: "0" },
    { value: "16px", label: "16" },
    { value: "24px", label: "24" },
    { value: "32px", label: "32" },
    { value: "48px", label: "48" },
    { value: "64px", label: "64" },
    { value: "80px", label: "80" },
    { value: "100px", label: "100" },
];

const BORDER_RADIUS_OPTIONS = [
    { value: "0px", label: "0" },
    { value: "8px", label: "8" },
    { value: "16px", label: "16" },
    { value: "24px", label: "24" },
    { value: "32px", label: "32" },
];

const OVERLAY_OPACITY_OPTIONS = [
    { value: 0, label: "0%" },
    { value: 0.2, label: "20%" },
    { value: 0.4, label: "40%" },
    { value: 0.5, label: "50%" },
    { value: 0.6, label: "60%" },
    { value: 0.8, label: "80%" },
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
    const [bgMode, setBgMode] = useState<"color" | "gradient" | "image">("color");
    const [gradientStart, setGradientStart] = useState("#667eea");
    const [gradientEnd, setGradientEnd] = useState("#764ba2");
    const [gradientDirection, setGradientDirection] = useState("to bottom");
    const [overlayColor, setOverlayColor] = useState("#000000");
    const [overlayOpacity, setOverlayOpacity] = useState(0);

    const updateStyle = <K extends keyof ElementStyleOverride>(
        key: K,
        value: ElementStyleOverride[K]
    ) => {
        onSave({ [key]: value } as ElementStyleOverride);
    };

    const applyGradient = () => {
        const gradient = `linear-gradient(${gradientDirection}, ${gradientStart} 0%, ${gradientEnd} 100%)`;
        updateStyle("backgroundImage", gradient);
    };

    const styles = currentStyles;

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b">
                <div className="flex items-center gap-2">
                    <Box className="w-4 h-4 text-orange-600" />
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

                {/* Min Height */}
                <div className="space-y-1">
                    <Label className="text-xs text-slate-500">Hauteur Min</Label>
                    <div className="flex flex-wrap gap-1">
                        {MIN_HEIGHT_OPTIONS.map(({ value, label }) => (
                            <button
                                key={value}
                                onClick={() => {
                                    const el = document.querySelector(`[data-editable-id="${elementId}"]`) as HTMLElement;
                                    if (el) el.style.minHeight = value;
                                }}
                                className="px-2 py-1 text-xs rounded transition-all bg-white hover:bg-slate-100 text-slate-700 border"
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Width */}
                <div className="space-y-1">
                    <Label className="text-xs text-slate-500">Largeur Contenu</Label>
                    <div className="flex gap-1">
                        {WIDTH_OPTIONS.map(({ value, label }) => (
                            <button
                                key={value}
                                onClick={() => updateStyle("width", value)}
                                className={`
                                    flex-1 py-1.5 text-xs rounded transition-all
                                    ${styles.width === value
                                        ? "bg-orange-600 text-white"
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

            {/* ========== ARRIERE-PLAN ========== */}
            <div className="space-y-3 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">🎨 Arrière-plan</p>

                {/* Mode selector */}
                <div className="flex gap-1">
                    {[
                        { value: "color", label: "Couleur" },
                        { value: "gradient", label: "Dégradé" },
                        { value: "image", label: "Image" },
                    ].map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => setBgMode(value as typeof bgMode)}
                            className={`
                                flex-1 py-1.5 text-xs rounded transition-all
                                ${bgMode === value
                                    ? "bg-orange-600 text-white"
                                    : "bg-white hover:bg-slate-100 text-slate-700 border"
                                }
                            `}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Color Mode */}
                {bgMode === "color" && (
                    <div className="space-y-1">
                        <Label className="text-xs text-slate-500">Couleur de fond</Label>
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
                                className="flex-1 border rounded-lg px-3 py-2 text-sm bg-white"
                            />
                        </div>
                    </div>
                )}

                {/* Gradient Mode */}
                {bgMode === "gradient" && (
                    <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <Label className="text-xs text-slate-500">Début</Label>
                                <div className="relative">
                                    <div
                                        className="w-full h-8 rounded border-2 border-slate-200 cursor-pointer"
                                        style={{ backgroundColor: gradientStart }}
                                    />
                                    <input
                                        type="color"
                                        value={gradientStart}
                                        onChange={(e) => setGradientStart(e.target.value)}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-slate-500">Fin</Label>
                                <div className="relative">
                                    <div
                                        className="w-full h-8 rounded border-2 border-slate-200 cursor-pointer"
                                        style={{ backgroundColor: gradientEnd }}
                                    />
                                    <input
                                        type="color"
                                        value={gradientEnd}
                                        onChange={(e) => setGradientEnd(e.target.value)}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-slate-500">Direction</Label>
                            <div className="flex gap-1">
                                {GRADIENT_DIRECTIONS.map(({ value, label }) => (
                                    <button
                                        key={value}
                                        onClick={() => setGradientDirection(value)}
                                        className={`
                                            flex-1 py-1.5 text-sm rounded transition-all
                                            ${gradientDirection === value
                                                ? "bg-orange-600 text-white"
                                                : "bg-white hover:bg-slate-100 text-slate-700 border"
                                            }
                                        `}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={applyGradient}
                            className="w-full py-2 text-xs bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                        >
                            Appliquer le dégradé
                        </button>
                    </div>
                )}

                {/* Image Mode */}
                {bgMode === "image" && (
                    <div className="space-y-2">
                        <div className="space-y-1">
                            <Label className="text-xs text-slate-500">URL Image</Label>
                            <input
                                type="text"
                                placeholder="https://..."
                                onChange={(e) => updateStyle("backgroundImage", `url(${e.target.value})`)}
                                className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <Label className="text-xs text-slate-500">Taille</Label>
                                <div className="flex gap-1">
                                    {BG_SIZE_OPTIONS.map(({ value, label }) => (
                                        <button
                                            key={value}
                                            onClick={() => {
                                                const el = document.querySelector(`[data-editable-id="${elementId}"]`) as HTMLElement;
                                                if (el) el.style.backgroundSize = value;
                                            }}
                                            className="flex-1 py-1 text-xs rounded bg-white hover:bg-slate-100 text-slate-700 border"
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-slate-500">Position</Label>
                                <select
                                    onChange={(e) => {
                                        const el = document.querySelector(`[data-editable-id="${elementId}"]`) as HTMLElement;
                                        if (el) el.style.backgroundPosition = e.target.value;
                                    }}
                                    className="w-full border rounded px-2 py-1 text-xs bg-white"
                                >
                                    {BG_POSITION_OPTIONS.map(({ value, label }) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <label className="flex items-center gap-2 text-xs text-slate-600">
                            <input
                                type="checkbox"
                                onChange={(e) => {
                                    const el = document.querySelector(`[data-editable-id="${elementId}"]`) as HTMLElement;
                                    if (el) el.style.backgroundAttachment = e.target.checked ? "fixed" : "scroll";
                                }}
                                className="rounded"
                            />
                            Effet Parallaxe (Fixe)
                        </label>
                    </div>
                )}
            </div>

            {/* ========== OVERLAY ========== */}
            <div className="space-y-3 p-3 bg-gradient-to-r from-slate-50 to-zinc-50 rounded-lg">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">🌫️ Overlay</p>

                <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                        <Label className="text-xs text-slate-500">Couleur</Label>
                        <div className="relative">
                            <div
                                className="w-full h-8 rounded border-2 border-slate-200 cursor-pointer"
                                style={{ backgroundColor: overlayColor }}
                            />
                            <input
                                type="color"
                                value={overlayColor}
                                onChange={(e) => setOverlayColor(e.target.value)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs text-slate-500">Opacité</Label>
                        <select
                            value={overlayOpacity}
                            onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                            className="w-full border rounded px-2 py-1.5 text-sm bg-white"
                        >
                            {OVERLAY_OPACITY_OPTIONS.map(({ value, label }) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <p className="text-[10px] text-slate-400">Note: L&apos;overlay nécessite un pseudo-élément CSS (implémentation avancée)</p>
            </div>

            {/* ========== ESPACEMENT ========== */}
            <div className="space-y-3 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">↔️ Espacement</p>

                {/* Padding */}
                <div className="space-y-1">
                    <Label className="text-xs text-slate-500">Padding (Interne)</Label>
                    <div className="flex flex-wrap gap-1">
                        {PADDING_OPTIONS.map(({ value, label }) => (
                            <button
                                key={value}
                                onClick={() => updateStyle("padding", value)}
                                className={`
                                    px-2 py-1 text-xs rounded transition-all
                                    ${styles.padding === value
                                        ? "bg-orange-600 text-white"
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
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">🖼️ Bordures</p>

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
                                        ? "bg-orange-600 text-white"
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

            {/* ========== ALIGNEMENT FLEX ========== */}
            <div className="space-y-3 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">📐 Alignement</p>

                {/* Align Items (Vertical) */}
                <div className="space-y-1">
                    <Label className="text-xs text-slate-500">Vertical</Label>
                    <div className="flex gap-1">
                        {[
                            { value: "flex-start", label: "Haut", icon: AlignVerticalJustifyStart },
                            { value: "center", label: "Milieu", icon: AlignVerticalJustifyCenter },
                            { value: "flex-end", label: "Bas", icon: AlignVerticalJustifyEnd },
                        ].map(({ value, label, icon: Icon }) => (
                            <button
                                key={value}
                                onClick={() => {
                                    updateStyle("display", "flex");
                                    updateStyle("alignItems", value as ElementStyleOverride["alignItems"]);
                                }}
                                className={`
                                    flex-1 p-2 rounded transition-colors flex items-center justify-center gap-1
                                    ${styles.alignItems === value
                                        ? "bg-orange-600 text-white"
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

                {/* Justify Content (Horizontal) */}
                <div className="space-y-1">
                    <Label className="text-xs text-slate-500">Horizontal</Label>
                    <div className="flex gap-1">
                        {[
                            { value: "flex-start", label: "Gauche", icon: AlignHorizontalJustifyStart },
                            { value: "center", label: "Centre", icon: AlignHorizontalJustifyCenter },
                            { value: "flex-end", label: "Droite", icon: AlignHorizontalJustifyEnd },
                            { value: "space-between", label: "Espacé", icon: AlignHorizontalSpaceBetween },
                        ].map(({ value, label, icon: Icon }) => (
                            <button
                                key={value}
                                onClick={() => {
                                    updateStyle("display", "flex");
                                    updateStyle("justifyContent", value as ElementStyleOverride["justifyContent"]);
                                }}
                                className={`
                                    flex-1 p-2 rounded transition-colors flex items-center justify-center gap-1
                                    ${styles.justifyContent === value
                                        ? "bg-orange-600 text-white"
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

                {/* Flex Direction */}
                <div className="space-y-1">
                    <Label className="text-xs text-slate-500">Direction</Label>
                    <div className="flex gap-1">
                        {[
                            { value: "row", label: "Horizontal" },
                            { value: "column", label: "Vertical" },
                        ].map(({ value, label }) => (
                            <button
                                key={value}
                                onClick={() => {
                                    updateStyle("display", "flex");
                                    updateStyle("flexDirection", value as ElementStyleOverride["flexDirection"]);
                                }}
                                className={`
                                    flex-1 py-1.5 text-xs rounded transition-all
                                    ${styles.flexDirection === value
                                        ? "bg-orange-600 text-white"
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
                    className="h-20 rounded-lg flex items-center justify-center text-xs text-slate-500"
                    style={{
                        backgroundColor: styles.backgroundColor || "#f1f5f9",
                        backgroundImage: styles.backgroundImage || "none",
                        borderRadius: styles.borderRadius || "8px",
                        padding: styles.padding || "16px",
                    }}
                >
                    Container
                </div>
            </div>
        </div>
    );
}
