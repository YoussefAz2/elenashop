"use client";

import React from "react";
import { Check } from "lucide-react";
import { THEME_PRESETS } from "@/components/providers/ThemeStyleProvider";

interface ThemePresetsProps {
    activePreset?: string | null;
    onSelectPreset: (presetId: string) => void;
}

export function ThemePresets({ activePreset, onSelectPreset }: ThemePresetsProps) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    🎨 Thèmes Rapides
                </h3>
                <span className="text-xs text-slate-500">1 clic = tout change</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
                {Object.entries(THEME_PRESETS).map(([id, preset]) => (
                    <PresetCard
                        key={id}
                        id={id}
                        name={preset.name}
                        emoji={preset.emoji}
                        variables={preset.variables}
                        isActive={activePreset === id}
                        onClick={() => onSelectPreset(id)}
                    />
                ))}
            </div>
        </div>
    );
}

// ---------- PRESET CARD ----------

interface PresetCardProps {
    id: string;
    name: string;
    emoji: string;
    variables: {
        primary?: string;
        background?: string;
        text?: string;
        accent?: string;
    };
    isActive: boolean;
    onClick: () => void;
}

function PresetCard({ name, emoji, variables, isActive, onClick }: PresetCardProps) {
    const { primary, background, accent } = variables;

    return (
        <button
            onClick={onClick}
            className={`
                relative p-3 rounded-lg border-2 transition-all text-left
                hover:scale-[1.02] hover:shadow-md
                ${isActive
                    ? "border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                }
            `}
            style={{ backgroundColor: background }}
        >
            {/* Active indicator */}
            {isActive && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                </div>
            )}

            {/* Preview colors */}
            <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{emoji}</span>
                <div className="flex gap-1">
                    <div
                        className="w-4 h-4 rounded-full border border-white/20"
                        style={{ backgroundColor: primary }}
                    />
                    <div
                        className="w-4 h-4 rounded-full border border-white/20"
                        style={{ backgroundColor: accent }}
                    />
                </div>
            </div>

            {/* Name */}
            <p
                className="text-xs font-medium truncate"
                style={{ color: variables.text || primary }}
            >
                {name}
            </p>
        </button>
    );
}
