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
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wide">
                    🎨 Thèmes
                </h3>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-500">1 clic = tout change</span>
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
                relative p-3 rounded-2xl border transition-all text-left group
                hover:shadow-lg hover:-translate-y-0.5 duration-300
                ${isActive
                    ? "border-zinc-900 ring-1 ring-zinc-900 bg-zinc-50"
                    : "border-zinc-100 dark:border-zinc-800 hover:border-zinc-300"
                }
            `}
            style={{ backgroundColor: background }}
        >
            {/* Active indicator */}
            {isActive && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-zinc-900 rounded-full flex items-center justify-center shadow-md border border-white">
                    <Check className="w-3 h-3 text-white" />
                </div>
            )}

            {/* Preview colors */}
            <div className="flex items-center gap-2 mb-2">
                <span className="text-xl filter drop-shadow-sm group-hover:scale-110 transition-transform">{emoji}</span>
                <div className="flex gap-1 ml-auto">
                    <div
                        className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: primary }}
                    />
                    <div
                        className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: accent }}
                    />
                </div>
            </div>

            {/* Name */}
            <p
                className="text-xs font-bold truncate"
                style={{ color: variables.text || primary }}
            >
                {name}
            </p>
        </button>
    );
}
