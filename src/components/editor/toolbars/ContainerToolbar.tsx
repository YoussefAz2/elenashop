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

const PADDING_OPTIONS = [
    { value: "16px", label: "Petit" },
    { value: "24px", label: "Normal" },
    { value: "32px", label: "Moyen" },
    { value: "48px", label: "Grand" },
    { value: "64px", label: "Très grand" },
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

            {/* Text Color */}
            <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs">
                    🎨 Couleur du texte
                </Label>
                <div className="flex gap-2 items-center">
                    <div className="relative">
                        <div
                            className="w-10 h-10 rounded-lg border-2 border-slate-200 cursor-pointer"
                            style={{ backgroundColor: styles.color || "#18181b" }}
                        />
                        <input
                            type="color"
                            value={styles.color || "#18181b"}
                            onChange={(e) => updateStyle("color", e.target.value)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                    <input
                        type="text"
                        value={styles.color || ""}
                        onChange={(e) => updateStyle("color", e.target.value)}
                        placeholder="#18181b"
                        className="flex-1 border rounded-lg px-3 py-2 text-sm"
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
                <div className="flex flex-wrap gap-1">
                    {[
                        { value: "0px", label: "Carré" },
                        { value: "8px", label: "Léger" },
                        { value: "16px", label: "Moyen" },
                        { value: "24px", label: "Arrondi" },
                        { value: "32px", label: "Très arrondi" },
                    ].map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => updateStyle("borderRadius", value)}
                            className={`
                                px-2 py-1.5 text-xs rounded transition-all
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

            {/* Box Shadow */}
            <div className="space-y-2">
                <Label className="text-xs">✨ Ombre</Label>
                <div className="flex gap-1">
                    {[
                        { value: "none", label: "Aucune" },
                        { value: "0 4px 12px rgba(0,0,0,0.08)", label: "Subtile" },
                        { value: "0 8px 24px rgba(0,0,0,0.12)", label: "Moyenne" },
                        { value: "0 12px 40px rgba(0,0,0,0.18)", label: "Forte" },
                    ].map(({ value, label }) => (
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

            {/* Border */}
            <div className="space-y-2">
                <Label className="text-xs">🖼️ Bordure</Label>
                <div className="flex gap-1 mb-2">
                    {[
                        { value: "none", label: "Aucune" },
                        { value: "solid", label: "Solide" },
                        { value: "dashed", label: "Tirets" },
                    ].map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => updateStyle("borderStyle", value as ElementStyleOverride["borderStyle"])}
                            className={`
                                flex-1 py-1.5 text-xs rounded transition-all
                                ${styles.borderStyle === value
                                    ? "bg-indigo-600 text-white"
                                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                                }
                            `}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                {styles.borderStyle && styles.borderStyle !== "none" && (
                    <div className="flex gap-2 items-center">
                        <select
                            value={styles.borderWidth || "1px"}
                            onChange={(e) => updateStyle("borderWidth", e.target.value)}
                            className="border rounded px-2 py-1 text-xs"
                        >
                            <option value="1px">1px</option>
                            <option value="2px">2px</option>
                            <option value="3px">3px</option>
                            <option value="4px">4px</option>
                        </select>
                        <div className="relative flex-1">
                            <div
                                className="w-8 h-8 rounded border-2 border-slate-200 cursor-pointer"
                                style={{ backgroundColor: styles.borderColor || "#e5e7eb" }}
                            />
                            <input
                                type="color"
                                value={styles.borderColor || "#e5e7eb"}
                                onChange={(e) => updateStyle("borderColor", e.target.value)}
                                className="absolute inset-0 w-8 h-8 opacity-0 cursor-pointer"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Background Gradient */}
            <div className="space-y-2">
                <Label className="text-xs">🎨 Fond dégradé</Label>
                <div className="grid grid-cols-4 gap-1">
                    {[
                        { value: "", label: "Aucun", preview: "#f1f5f9" },
                        { value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", label: "Violet", preview: "linear-gradient(135deg, #667eea, #764ba2)" },
                        { value: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", label: "Rose", preview: "linear-gradient(135deg, #f093fb, #f5576c)" },
                        { value: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", label: "Bleu", preview: "linear-gradient(135deg, #4facfe, #00f2fe)" },
                        { value: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", label: "Vert", preview: "linear-gradient(135deg, #43e97b, #38f9d7)" },
                        { value: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", label: "Sunset", preview: "linear-gradient(135deg, #fa709a, #fee140)" },
                        { value: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)", label: "Ocean", preview: "linear-gradient(135deg, #30cfd0, #330867)" },
                        { value: "linear-gradient(135deg, #0c0c0c 0%, #434343 100%)", label: "Dark", preview: "linear-gradient(135deg, #0c0c0c, #434343)" },
                    ].map(({ value, label, preview }) => (
                        <button
                            key={label}
                            onClick={() => updateStyle("backgroundImage", value)}
                            className={`
                                h-8 rounded text-[10px] font-medium transition-all
                                ${styles.backgroundImage === value
                                    ? "ring-2 ring-indigo-500 ring-offset-1"
                                    : "hover:scale-105"
                                }
                            `}
                            style={{
                                background: preview,
                                color: label === "Dark" || label === "Ocean" ? "#fff" : "#333"
                            }}
                            title={label}
                        >
                            {value === "" ? "∅" : ""}
                        </button>
                    ))}
                </div>
            </div>

            {/* Flex Alignment */}
            <div className="space-y-2">
                <Label className="text-xs">📍 Alignement contenu</Label>
                <div className="grid grid-cols-3 gap-1">
                    {[
                        { value: "flex-start", label: "Haut" },
                        { value: "center", label: "Centre" },
                        { value: "flex-end", label: "Bas" },
                    ].map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => {
                                updateStyle("display", "flex");
                                updateStyle("flexDirection", "column");
                                updateStyle("alignItems", "center");
                                updateStyle("justifyContent", value as ElementStyleOverride["justifyContent"]);
                            }}
                            className={`
                                py-1.5 text-xs rounded transition-all
                                ${styles.justifyContent === value
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
                    className="h-16 flex items-center justify-center text-xs text-slate-400 rounded"
                    style={{
                        backgroundColor: styles.backgroundImage ? undefined : (styles.backgroundColor || "#f8fafc"),
                        backgroundImage: styles.backgroundImage || undefined,
                        padding: styles.padding ? `calc(${styles.padding} / 3)` : "12px",
                        borderRadius: styles.borderRadius || "0px",
                        borderStyle: styles.borderStyle || "none",
                        borderWidth: styles.borderWidth || "1px",
                        borderColor: styles.borderColor || "#e5e7eb",
                    }}
                >
                    Contenu de section
                </div>
            </div>
        </div>
    );
}

