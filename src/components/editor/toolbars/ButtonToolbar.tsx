"use client";

import React, { useState, useEffect } from "react";
import { Square, Palette, RotateCcw, Sun, Moon } from "lucide-react";
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

const RADIUS_OPTIONS = [
    { value: "0px", label: "Carré" },
    { value: "4px", label: "Léger" },
    { value: "8px", label: "Moyen" },
    { value: "16px", label: "Arrondi" },
    { value: "9999px", label: "Pill" },
];

const SHADOW_OPTIONS = [
    { value: "none", label: "Aucune" },
    { value: "0 2px 8px rgba(0,0,0,0.1)", label: "Douce" },
    { value: "0 8px 24px rgba(0,0,0,0.2)", label: "Forte" },
];

const PADDING_OPTIONS = [
    { value: "compact", px: "8px 16px", label: "Compact" },
    { value: "normal", px: "12px 24px", label: "Normal" },
    { value: "airy", px: "16px 32px", label: "Aéré" },
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
    const [styles, setStyles] = useState<ElementStyleOverride>(currentStyles);

    useEffect(() => {
        setStyles(currentStyles);
    }, [currentStyles]);

    const updateStyle = <K extends keyof ElementStyleOverride>(
        key: K,
        value: ElementStyleOverride[K]
    ) => {
        const newStyles = { ...styles, [key]: value };
        setStyles(newStyles);
        onSave(newStyles);
    };

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

            {/* Background Color */}
            <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs">
                    <Palette className="w-3 h-3" />
                    Couleur de fond
                </Label>
                <div className="flex gap-2">
                    <input
                        type="color"
                        value={styles.backgroundColor || "#3b82f6"}
                        onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer border-2 border-slate-200"
                    />
                    <input
                        type="text"
                        value={styles.backgroundColor || ""}
                        onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                        placeholder="#3b82f6"
                        className="flex-1 border rounded-lg px-3 text-sm"
                    />
                </div>
            </div>

            {/* Text Color */}
            <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs">
                    <Sun className="w-3 h-3" />
                    Couleur du texte
                </Label>
                <div className="flex gap-2">
                    <button
                        onClick={() => updateStyle("color", "#ffffff")}
                        className={`flex-1 py-2 rounded-lg border flex items-center justify-center gap-1 ${styles.color === "#ffffff" ? "border-blue-500 bg-blue-50" : ""
                            }`}
                    >
                        <Sun className="w-3 h-3" />
                        <span className="text-xs">Blanc</span>
                    </button>
                    <button
                        onClick={() => updateStyle("color", "#1a1a1a")}
                        className={`flex-1 py-2 rounded-lg border flex items-center justify-center gap-1 ${styles.color === "#1a1a1a" ? "border-blue-500 bg-blue-50" : ""
                            }`}
                    >
                        <Moon className="w-3 h-3" />
                        <span className="text-xs">Noir</span>
                    </button>
                </div>
            </div>

            {/* Border Radius */}
            <div className="space-y-2">
                <Label className="text-xs">📐 Arrondis</Label>
                <div className="flex flex-wrap gap-1">
                    {RADIUS_OPTIONS.map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => {/* TODO: Add borderRadius to overrides */ }}
                            className="px-3 py-1 text-xs rounded bg-slate-100 hover:bg-slate-200 transition-colors"
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
                            onClick={() => {/* TODO: Add boxShadow to overrides */ }}
                            className="flex-1 py-2 text-xs rounded bg-slate-100 hover:bg-slate-200 transition-colors"
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Preview */}
            <div className="p-3 bg-slate-50 rounded-lg mt-4">
                <p className="text-[10px] text-slate-400 mb-2">Aperçu</p>
                <button
                    className="w-full py-2 px-4 rounded-lg font-medium text-sm transition-all"
                    style={{
                        backgroundColor: styles.backgroundColor || "#3b82f6",
                        color: styles.color || "#ffffff",
                    }}
                >
                    Bouton exemple
                </button>
            </div>
        </div>
    );
}
