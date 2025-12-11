"use client";

import React, { useState } from "react";
import { Save, Trash2, Check, X, FolderOpen } from "lucide-react";
import type { CustomPreset, ElementStyleOverride } from "@/types";

// ---------- PROPS ----------

interface PresetManagerProps {
    customPresets: CustomPreset[];
    currentOverrides: Record<string, ElementStyleOverride>;
    onSavePreset: (name: string) => void;
    onLoadPreset: (presetId: string) => void;
    onDeletePreset: (presetId: string) => void;
}

// ---------- COMPONENT ----------

export function PresetManager({
    customPresets,
    currentOverrides,
    onSavePreset,
    onLoadPreset,
    onDeletePreset,
}: PresetManagerProps) {
    const [isCreating, setIsCreating] = useState(false);
    const [newPresetName, setNewPresetName] = useState("");
    const [showList, setShowList] = useState(false);

    const handleSave = () => {
        if (!newPresetName.trim()) return;
        onSavePreset(newPresetName.trim());
        setNewPresetName("");
        setIsCreating(false);
    };

    const handleCancel = () => {
        setNewPresetName("");
        setIsCreating(false);
    };

    const hasOverrides = Object.keys(currentOverrides).length > 0;

    return (
        <div className="border-b border-slate-200 dark:border-slate-700 pb-3 mb-3">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Mes Designs
                </span>
                <div className="flex gap-1">
                    {customPresets.length > 0 && (
                        <button
                            onClick={() => setShowList(!showList)}
                            className={`p-1.5 rounded transition-colors ${showList
                                    ? "bg-indigo-100 text-indigo-600"
                                    : "hover:bg-slate-100 text-slate-500"
                                }`}
                            title="Voir mes designs"
                        >
                            <FolderOpen className="w-4 h-4" />
                        </button>
                    )}
                    <button
                        onClick={() => setIsCreating(true)}
                        disabled={!hasOverrides || isCreating}
                        className="p-1.5 rounded hover:bg-slate-100 text-slate-500 disabled:opacity-30 transition-colors"
                        title="Sauvegarder le design actuel"
                    >
                        <Save className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Create New Preset Form */}
            {isCreating && (
                <div className="flex gap-2 mb-2">
                    <input
                        type="text"
                        value={newPresetName}
                        onChange={(e) => setNewPresetName(e.target.value)}
                        placeholder="Nom du design..."
                        className="flex-1 px-2 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSave();
                            if (e.key === "Escape") handleCancel();
                        }}
                    />
                    <button
                        onClick={handleSave}
                        disabled={!newPresetName.trim()}
                        className="p-1.5 rounded bg-green-500 text-white hover:bg-green-600 disabled:opacity-50 transition-colors"
                    >
                        <Check className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleCancel}
                        className="p-1.5 rounded bg-slate-200 hover:bg-slate-300 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Presets List */}
            {showList && customPresets.length > 0 && (
                <div className="space-y-1 max-h-40 overflow-y-auto">
                    {customPresets.map((preset) => (
                        <div
                            key={preset.id}
                            className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-lg group"
                        >
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                    {preset.name}
                                </p>
                                <p className="text-[10px] text-slate-400">
                                    {new Date(preset.createdAt).toLocaleDateString("fr-FR", {
                                        day: "numeric",
                                        month: "short",
                                    })}
                                </p>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => onLoadPreset(preset.id)}
                                    className="px-2 py-1 text-xs bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors"
                                >
                                    Appliquer
                                </button>
                                <button
                                    onClick={() => onDeletePreset(preset.id)}
                                    className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {showList && customPresets.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-2">
                    Aucun design sauvegardé
                </p>
            )}

            {/* No overrides hint */}
            {!hasOverrides && !isCreating && (
                <p className="text-[10px] text-slate-400 text-center">
                    Personnalisez des éléments pour sauvegarder
                </p>
            )}
        </div>
    );
}
