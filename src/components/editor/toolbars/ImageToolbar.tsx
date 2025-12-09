"use client";

import React from "react";
import { Image as ImageIcon, RotateCcw, Upload } from "lucide-react";
import { Label } from "@/components/ui/label";

// ---------- PROPS ----------

interface ImageToolbarProps {
    elementId: string;
    elementLabel: string;
    onReset: () => void;
    onClose: () => void;
}

// ---------- CONSTANTS ----------

const OPACITY_OPTIONS = [
    { value: 100, label: "100%" },
    { value: 75, label: "75%" },
    { value: 50, label: "50%" },
    { value: 25, label: "25%" },
];

const FILTER_OPTIONS = [
    { value: "none", label: "Normal" },
    { value: "grayscale(100%)", label: "N&B" },
    { value: "sepia(50%)", label: "Sépia" },
    { value: "blur(2px)", label: "Flou" },
];

// ---------- COMPONENT ----------

export function ImageToolbar({
    elementId,
    elementLabel,
    onReset,
    onClose,
}: ImageToolbarProps) {
    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b">
                <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-green-600" />
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

            {/* Upload button */}
            <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs">
                    <Upload className="w-3 h-3" />
                    Changer l&apos;image
                </Label>
                <button
                    className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-sm text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                    onClick={() => {/* TODO: Open image picker */ }}
                >
                    <Upload className="w-4 h-4" />
                    Uploader une image
                </button>
            </div>

            {/* Opacity */}
            <div className="space-y-2">
                <Label className="text-xs">🌗 Opacité</Label>
                <div className="flex gap-1">
                    {OPACITY_OPTIONS.map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => {/* TODO: Add opacity to overrides */ }}
                            className="flex-1 py-2 text-xs rounded bg-slate-100 hover:bg-slate-200 transition-colors"
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Filters */}
            <div className="space-y-2">
                <Label className="text-xs">🎨 Filtres</Label>
                <div className="grid grid-cols-2 gap-1">
                    {FILTER_OPTIONS.map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => {/* TODO: Add filter to overrides */ }}
                            className="py-2 text-xs rounded bg-slate-100 hover:bg-slate-200 transition-colors"
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Info */}
            <div className="p-3 bg-amber-50 rounded-lg text-xs text-amber-700">
                💡 Les modifications d&apos;image seront bientôt disponibles
            </div>
        </div>
    );
}
