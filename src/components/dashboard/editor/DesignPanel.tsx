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
        });
    };

    // ---------- THEME PRESET SELECTION ----------
    const handleSelectPreset = (presetId: string) => {
        const preset = THEME_PRESETS[presetId];
        if (preset && preset.variables) {
            onUpdateConfig({
                ...config,
                activePreset: presetId,
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
        <div className="p-4 space-y-6">
            {/* Template Selection */}
            <section className="space-y-3">
                <Label className="text-sm font-medium">📐 Template</Label>
                <div className="grid grid-cols-3 gap-2">
                    {TEMPLATES.map((template) => (
                        <button
                            key={template.id}
                            onClick={() => selectTemplate(template.id)}
                            className={`relative p-3 rounded-lg border-2 transition-all ${config.templateId === template.id
                                    ? "border-blue-500 ring-2 ring-blue-500/20"
                                    : "border-slate-200 hover:border-slate-300"
                                }`}
                        >
                            {template.isPremium && (
                                <div className="absolute -top-2 -right-2 flex items-center gap-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                                    <Crown className="h-2.5 w-2.5" />
                                    PRO
                                </div>
                            )}
                            <div className={`h-8 rounded bg-gradient-to-br ${template.preview} mb-2`} />
                            <p className="text-xs font-medium">{template.name}</p>
                            {template.isPremium && (
                                <p className="text-[10px] text-amber-600 font-medium">{template.price} TND</p>
                            )}
                        </button>
                    ))}
                </div>
            </section>

            {/* Theme Presets */}
            <section className="space-y-3">
                <ThemePresets
                    activePreset={config.activePreset || null}
                    onSelectPreset={handleSelectPreset}
                />
            </section>

            {/* Advanced Mode Toggle */}
            <section className="space-y-3 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <MousePointer className="h-4 w-4 text-slate-400" />
                        <div>
                            <Label className="text-sm font-medium">Mode Éditeur V2</Label>
                            <p className="text-xs text-slate-500">Cliquez sur les éléments pour les modifier</p>
                        </div>
                    </div>
                    <Switch
                        checked={advancedMode}
                        onCheckedChange={onAdvancedModeChange}
                    />
                </div>

                {/* V2 Mode Explanation */}
                {advancedMode && (
                    <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3 space-y-2">
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                Mode Éditeur Activé
                            </span>
                        </div>
                        <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1 ml-6">
                            <li>• Cliquez sur un texte pour le modifier</li>
                            <li>• Changez couleurs, polices, tailles</li>
                            <li>• Modifications sauvegardées automatiquement</li>
                        </ul>
                    </div>
                )}
            </section>
        </div>
    );
}
