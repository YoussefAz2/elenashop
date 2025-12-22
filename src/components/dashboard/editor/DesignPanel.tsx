"use client";

import { Crown, MousePointer, Sparkles } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { ThemeConfig, TemplateId } from "@/types";
import { DEFAULT_THEME_CONFIGS } from "@/types";
import { TEMPLATES } from "@/lib/templates";
import { ThemePresets } from "./ThemePresets";
import { THEME_PRESETS } from "@/components/providers/ThemeStyleProvider";

interface DesignPanelProps {
    config: ThemeConfig;
    onUpdateConfig: (config: ThemeConfig) => void;
    advancedMode?: boolean;
    onAdvancedModeChange?: (mode: boolean) => void;
}

export function DesignPanel({
    config,
    onUpdateConfig,
    advancedMode = false,
    onAdvancedModeChange
}: DesignPanelProps) {

    // ---------- TEMPLATE SELECTION ----------
    const selectTemplate = (templateId: TemplateId) => {
        const preset = DEFAULT_THEME_CONFIGS[templateId];
        onUpdateConfig({
            ...config,
            templateId,
            global: preset.global,
            // Clear element overrides when switching templates
            elementOverrides: {},
        });
    };

    // ---------- THEME PRESET SELECTION ----------
    const handleSelectPreset = (presetId: string) => {
        const preset = THEME_PRESETS[presetId];
        if (preset && preset.variables) {
            onUpdateConfig({
                ...config,
                activePreset: presetId,
                // Clear element overrides so theme applies fully
                elementOverrides: {},
                global: {
                    ...config.global,
                    colors: {
                        ...config.global.colors,
                        primary: preset.variables.primary || config.global.colors.primary,
                        secondary: preset.variables.secondary || config.global.colors.secondary,
                        background: preset.variables.background || config.global.colors.background,
                        text: preset.variables.text || config.global.colors.text,
                    },
                    borderRadius: preset.variables.radius || config.global.borderRadius,
                    font: preset.variables.fontBody || config.global.font,
                    headingFont: preset.variables.fontHeading || config.global.headingFont,
                },
            });
        }
    };

    // ---------- RENDER ----------
    return (
        <div className="p-6 space-y-8">
            {/* Template Selection */}
            <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-900">1</span>
                    <Label className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Template</Label>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    {TEMPLATES.map((template) => (
                        <button
                            key={template.id}
                            onClick={() => selectTemplate(template.id)}
                            className={`group relative p-3 rounded-2xl border transition-all duration-300 text-left ${config.templateId === template.id
                                ? "border-zinc-900 ring-1 ring-zinc-900 bg-zinc-50"
                                : "border-zinc-100 hover:border-zinc-300 hover:shadow-md hover:-translate-y-0.5"
                                }`}
                        >
                            {template.isPremium && (
                                <div className="absolute -top-2 -right-2 flex items-center gap-1 bg-zinc-900 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-lg border border-white">
                                    <Crown className="h-2.5 w-2.5" />
                                    PRO
                                </div>
                            )}
                            <div className={`h-12 rounded-xl bg-gradient-to-br ${template.preview} mb-3 shadow-inner opacity-80 group-hover:opacity-100 transition-opacity`} />
                            <p className="text-xs font-bold text-zinc-900 leading-tight mb-0.5">{template.name}</p>
                            {template.isPremium && (
                                <p className="text-[10px] text-zinc-500 font-medium font-serif italic">{template.price} TND</p>
                            )}
                        </button>
                    ))}
                </div>
            </section>

            {/* Theme Presets */}
            <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-900">2</span>
                    <Label className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Thème</Label>
                </div>
                <ThemePresets
                    activePreset={config.activePreset || null}
                    onSelectPreset={handleSelectPreset}
                />
            </section>

            {/* Advanced Mode Toggle */}
            <section className="space-y-4 pt-6 border-t border-zinc-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-zinc-50 flex items-center justify-center border border-zinc-100">
                            <MousePointer className="h-4 w-4 text-zinc-900" />
                        </div>
                        <div>
                            <Label className="text-sm font-bold text-zinc-900 cursor-pointer">Mode Éditeur Visuel</Label>
                            <p className="text-xs text-zinc-500 font-medium">Cliquez sur les éléments pour éditer</p>
                        </div>
                    </div>
                    <Switch
                        checked={advancedMode}
                        onCheckedChange={onAdvancedModeChange}
                        className="data-[state=checked]:bg-zinc-900"
                    />
                </div>

                {/* V2 Mode Explanation */}
                {advancedMode && (
                    <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-4 space-y-3 relative overflow-hidden group">
                        <div className="absolute -right-6 -top-6 h-24 w-24 bg-zinc-200/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="flex items-center gap-2 relative z-10">
                            <Sparkles className="h-4 w-4 text-zinc-900" />
                            <span className="text-sm font-bold text-zinc-900">
                                Mode Éditeur Activé
                            </span>
                        </div>
                        <ul className="text-xs text-zinc-500 space-y-1.5 ml-1 relative z-10 font-medium">
                            <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-zinc-400" />Cliquez sur un texte pour le modifier</li>
                            <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-zinc-400" />Changez couleurs, polices, tailles</li>
                            <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-zinc-400" />Modifications sauvegardées automatiquement</li>
                        </ul>
                    </div>
                )}
            </section>
        </div>
    );
}
