"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Palette, Type, Layers, MousePointer, Sparkles, Move, Crown, Settings2, Check } from "lucide-react";
import type {
    ThemeConfig,
    TemplateId,
    GlobalStyles,
    HeroStyles,
    CardStyles,
    ButtonStyles,
    FooterStyles,
    TypographySettings,
    SpacingSettings,
    AnimationSettings,
} from "@/types";
import { DEFAULT_THEME_CONFIGS, AVAILABLE_FONTS, FONT_CATEGORIES } from "@/types";
import { TEMPLATES } from "@/lib/templates";
import { COLOR_PALETTES, applyPalette, type ColorPalette } from "@/lib/palettes";
import { ThemePresets } from "./ThemePresets";
import { THEME_PRESETS } from "@/components/providers/ThemeStyleProvider";

interface DesignPanelProps {
    config: ThemeConfig;
    onUpdateConfig: (config: ThemeConfig) => void;
    advancedMode?: boolean;
    onAdvancedModeChange?: (mode: boolean) => void;
}

export function DesignPanel({ config, onUpdateConfig, advancedMode: externalAdvancedMode, onAdvancedModeChange }: DesignPanelProps) {
    const [internalAdvancedMode, setInternalAdvancedMode] = useState(false);

    // Use external state if provided, otherwise internal
    const advancedMode = externalAdvancedMode !== undefined ? externalAdvancedMode : internalAdvancedMode;
    const setAdvancedMode = (mode: boolean) => {
        if (onAdvancedModeChange) {
            onAdvancedModeChange(mode);
        } else {
            setInternalAdvancedMode(mode);
        }
    };

    const selectTemplate = (templateId: TemplateId) => {
        const preset = DEFAULT_THEME_CONFIGS[templateId];
        onUpdateConfig({
            ...config,
            templateId,
            global: preset.global,
        });
    };

    const applyColorPalette = (palette: ColorPalette) => {
        const updated = applyPalette(palette, config);
        onUpdateConfig({
            ...config,
            global: updated.global,
        });
    };

    const updateGlobalColor = (key: keyof GlobalStyles["colors"], value: string) => {
        onUpdateConfig({
            ...config,
            global: {
                ...config.global,
                colors: { ...config.global.colors, [key]: value },
            },
        });
    };

    const updateHeroStyle = (updates: Partial<HeroStyles>) => {
        onUpdateConfig({
            ...config,
            global: { ...config.global, hero: { ...config.global.hero, ...updates } },
        });
    };

    const updateCardStyle = (updates: Partial<CardStyles>) => {
        onUpdateConfig({
            ...config,
            global: { ...config.global, cards: { ...config.global.cards, ...updates } },
        });
    };

    const updateButtonStyle = (updates: Partial<ButtonStyles>) => {
        onUpdateConfig({
            ...config,
            global: { ...config.global, buttons: { ...config.global.buttons, ...updates } },
        });
    };

    const updateFooterStyle = (updates: Partial<FooterStyles>) => {
        onUpdateConfig({
            ...config,
            global: { ...config.global, footer: { ...config.global.footer, ...updates } },
        });
    };

    const updateTypography = (updates: Partial<TypographySettings>) => {
        onUpdateConfig({
            ...config,
            global: { ...config.global, typography: { ...config.global.typography, ...updates } },
        });
    };

    const updateSpacing = (updates: Partial<SpacingSettings>) => {
        onUpdateConfig({
            ...config,
            global: { ...config.global, spacing: { ...config.global.spacing, ...updates } },
        });
    };

    const updateAnimations = (updates: Partial<AnimationSettings>) => {
        onUpdateConfig({
            ...config,
            global: { ...config.global, animations: { ...config.global.animations, ...updates } },
        });
    };

    const radiusValues = ["0", "0.375rem", "0.5rem", "0.75rem", "1rem", "1.5rem", "9999px"];
    const getRadiusIndex = () => {
        const idx = radiusValues.indexOf(config.global.borderRadius);
        return idx >= 0 ? idx : 3;
    };

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

    return (
        <div className="p-4 space-y-4">
            {/* Template Selection */}
            <div className="space-y-3">
                <Label className="text-sm font-medium">Template</Label>
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
                            {/* Premium Badge */}
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
            </div>

            <Accordion type="single" collapsible defaultValue="colors" className="space-y-2">
                {/* Colors Section - Simplified with Palettes */}
                <AccordionItem value="colors" className="border rounded-lg px-3">
                    <AccordionTrigger className="hover:no-underline py-3">
                        <div className="flex items-center gap-2">
                            <Palette className="h-4 w-4 text-slate-500" />
                            <span className="font-medium text-sm">🎨 Couleurs</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 space-y-4">
                        {/* Theme Presets */}
                        <ThemePresets
                            activePreset={config.activePreset || null}
                            onSelectPreset={handleSelectPreset}
                        />

                        {/* Advanced Mode Toggle */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                            <div className="flex items-center gap-2">
                                <Settings2 className="h-4 w-4 text-slate-400" />
                                <Label className="text-xs text-slate-500">Mode avancé</Label>
                            </div>
                            <Switch
                                checked={advancedMode}
                                onCheckedChange={setAdvancedMode}
                            />
                        </div>

                        {/* Advanced Color Pickers - Only shown in advanced mode */}
                        {advancedMode && (
                            <div className="space-y-4 pt-3 border-t border-slate-100">
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">🏠 Page d&apos;accueil</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <ColorPicker label="Fond" value={config.global.colors.background} onChange={(v) => updateGlobalColor("background", v)} />
                                    <ColorPicker label="Texte" value={config.global.colors.text} onChange={(v) => updateGlobalColor("text", v)} />
                                    <ColorPicker label="Accent" value={config.global.colors.primary} onChange={(v) => updateGlobalColor("primary", v)} />
                                    <ColorPicker label="Secondaire" value={config.global.colors.secondary} onChange={(v) => updateGlobalColor("secondary", v)} />
                                </div>

                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide pt-2">🖼️ Bannière Hero</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <ColorPicker label="Fond" value={config.global.hero.backgroundColor} onChange={(v) => updateHeroStyle({ backgroundColor: v })} />
                                    <ColorPicker label="Texte" value={config.global.hero.textColor} onChange={(v) => updateHeroStyle({ textColor: v })} />
                                    <ColorPicker label="Bouton fond" value={config.global.hero.buttonBg} onChange={(v) => updateHeroStyle({ buttonBg: v })} />
                                    <ColorPicker label="Bouton texte" value={config.global.hero.buttonText} onChange={(v) => updateHeroStyle({ buttonText: v })} />
                                </div>

                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide pt-2">🛍️ Cartes produits</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <ColorPicker label="Fond" value={config.global.cards.backgroundColor} onChange={(v) => updateCardStyle({ backgroundColor: v })} />
                                    <ColorPicker label="Texte" value={config.global.cards.textColor} onChange={(v) => updateCardStyle({ textColor: v })} />
                                    <ColorPicker label="Prix" value={config.global.cards.priceColor} onChange={(v) => updateCardStyle({ priceColor: v })} />
                                    <ColorPicker label="Bordure" value={config.global.cards.borderColor} onChange={(v) => updateCardStyle({ borderColor: v })} />
                                </div>

                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide pt-2">🖱️ Boutons achat</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <ColorPicker label="Fond" value={config.global.buttons.backgroundColor} onChange={(v) => updateButtonStyle({ backgroundColor: v })} />
                                    <ColorPicker label="Texte" value={config.global.buttons.textColor} onChange={(v) => updateButtonStyle({ textColor: v })} />
                                    <ColorPicker label="Hover" value={config.global.buttons.hoverBg} onChange={(v) => updateButtonStyle({ hoverBg: v })} />
                                </div>

                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide pt-2">🦶 Pied de page</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <ColorPicker label="Fond" value={config.global.footer.backgroundColor} onChange={(v) => updateFooterStyle({ backgroundColor: v })} />
                                    <ColorPicker label="Texte" value={config.global.footer.textColor} onChange={(v) => updateFooterStyle({ textColor: v })} />
                                    <ColorPicker label="Accent" value={config.global.footer.accentColor} onChange={(v) => updateFooterStyle({ accentColor: v })} />
                                </div>
                            </div>
                        )}
                    </AccordionContent>
                </AccordionItem>

                {/* Typography */}
                <AccordionItem value="typography" className="border rounded-lg px-3">
                    <AccordionTrigger className="hover:no-underline py-3">
                        <div className="flex items-center gap-2">
                            <Type className="h-4 w-4 text-slate-500" />
                            <span className="font-medium text-sm">🔤 Typographie</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 space-y-4">
                        {/* Main Font - Visual Selector with Preview */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Police principale</Label>
                            <div className="max-h-48 overflow-y-auto pr-1 space-y-3">
                                {(Object.keys(FONT_CATEGORIES) as Array<keyof typeof FONT_CATEGORIES>).map((category) => (
                                    <div key={category} className="space-y-1.5">
                                        <p className="text-[10px] text-slate-400 uppercase tracking-wide sticky top-0 bg-white py-0.5">
                                            {FONT_CATEGORIES[category].emoji} {FONT_CATEGORIES[category].label}
                                        </p>
                                        <div className="grid grid-cols-2 gap-1.5">
                                            {AVAILABLE_FONTS.filter(f => f.category === category).map((font) => (
                                                <button
                                                    key={font.id}
                                                    onClick={() => onUpdateConfig({ ...config, global: { ...config.global, font: font.id } })}
                                                    className={`p-2 text-left rounded-lg border transition-all ${config.global.font === font.id
                                                        ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500/20"
                                                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                                        }`}
                                                >
                                                    <span
                                                        className="font-medium block truncate text-sm"
                                                        style={{ fontFamily: `'${font.name}', sans-serif` }}
                                                    >
                                                        {font.name}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400">{font.style}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Heading Font with Preview */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Police titres</Label>
                            <Select value={config.global.headingFont} onValueChange={(v) => onUpdateConfig({ ...config, global: { ...config.global, headingFont: v as GlobalStyles["headingFont"] } })}>
                                <SelectTrigger><SelectValue placeholder="Même" /></SelectTrigger>
                                <SelectContent className="max-h-60">
                                    {AVAILABLE_FONTS.map((f) => (
                                        <SelectItem key={f.id} value={f.id}>
                                            <span style={{ fontFamily: `'${f.name}', sans-serif` }}>{f.name}</span>
                                            <span className="text-slate-400"> • {f.style}</span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Font Sizes - Compact Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label className="text-xs text-slate-500">Taille titres</Label>
                                <Select value={config.global.typography.headingSize} onValueChange={(v) => updateTypography({ headingSize: v as TypographySettings["headingSize"] })}>
                                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="small">Petit</SelectItem>
                                        <SelectItem value="medium">Moyen</SelectItem>
                                        <SelectItem value="large">Grand</SelectItem>
                                        <SelectItem value="xlarge">Très grand</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-slate-500">Taille texte</Label>
                                <Select value={config.global.typography.bodySize} onValueChange={(v) => updateTypography({ bodySize: v as TypographySettings["bodySize"] })}>
                                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="small">Petit</SelectItem>
                                        <SelectItem value="medium">Moyen</SelectItem>
                                        <SelectItem value="large">Grand</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Advanced Typography Options */}
                        {advancedMode && (
                            <div className="space-y-4 pt-3 border-t border-slate-100">
                                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">🔤 Options avancées</p>

                                {/* Heading Weight */}
                                <div className="space-y-2">
                                    <Label className="text-xs text-slate-500">Épaisseur titres</Label>
                                    <div className="grid grid-cols-4 gap-1.5">
                                        {[
                                            { value: "normal", label: "Fin" },
                                            { value: "medium", label: "Normal" },
                                            { value: "bold", label: "Gras" },
                                            { value: "extrabold", label: "Très gras" },
                                        ].map((opt) => (
                                            <button
                                                key={opt.value}
                                                onClick={() => updateTypography({ headingWeight: opt.value as TypographySettings["headingWeight"] })}
                                                className={`p-2 rounded-lg border text-center transition-all ${(config.global.typography.headingWeight || "bold") === opt.value
                                                    ? "border-blue-500 bg-blue-50"
                                                    : "border-slate-200 hover:border-slate-300"
                                                    }`}
                                            >
                                                <div className="text-[10px]">{opt.label}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Letter Spacing */}
                                <div className="space-y-2">
                                    <Label className="text-xs text-slate-500">Espacement lettres</Label>
                                    <div className="grid grid-cols-3 gap-1.5">
                                        {[
                                            { value: "tight", label: "Serré", preview: "-0.5px" },
                                            { value: "normal", label: "Normal", preview: "0" },
                                            { value: "wide", label: "Large", preview: "+1px" },
                                        ].map((opt) => (
                                            <button
                                                key={opt.value}
                                                onClick={() => updateTypography({ letterSpacing: opt.value as TypographySettings["letterSpacing"] })}
                                                className={`p-2 rounded-lg border text-center transition-all ${(config.global.typography.letterSpacing || "normal") === opt.value
                                                    ? "border-blue-500 bg-blue-50"
                                                    : "border-slate-200 hover:border-slate-300"
                                                    }`}
                                            >
                                                <div className="text-[10px] font-medium">{opt.label}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Heading Transform */}
                                <div className="space-y-2">
                                    <Label className="text-xs text-slate-500">Casse des titres</Label>
                                    <div className="grid grid-cols-3 gap-1.5">
                                        {[
                                            { value: "none", label: "Normal" },
                                            { value: "uppercase", label: "MAJUSCULES" },
                                            { value: "capitalize", label: "Capitale" },
                                        ].map((opt) => (
                                            <button
                                                key={opt.value}
                                                onClick={() => updateTypography({ headingTransform: opt.value as TypographySettings["headingTransform"] })}
                                                className={`p-2 rounded-lg border text-center transition-all ${config.global.typography.headingTransform === opt.value
                                                    ? "border-blue-500 bg-blue-50"
                                                    : "border-slate-200 hover:border-slate-300"
                                                    }`}
                                            >
                                                <div className="text-[10px]">{opt.label}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </AccordionContent>
                </AccordionItem>

                {/* Layout & Style */}
                <AccordionItem value="layout" className="border rounded-lg px-3">
                    <AccordionTrigger className="hover:no-underline py-3">
                        <div className="flex items-center gap-2">
                            <Layers className="h-4 w-4 text-slate-500" />
                            <span className="font-medium text-sm">📐 Style</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 space-y-4">
                        {/* Hero Height - Visual Buttons */}
                        <div className="space-y-2">
                            <Label className="text-xs text-slate-500">Taille du Hero</Label>
                            <div className="grid grid-cols-4 gap-1.5">
                                {[
                                    { value: "compact", label: "S", icon: "▬" },
                                    { value: "normal", label: "M", icon: "▬▬" },
                                    { value: "large", label: "L", icon: "▬▬▬" },
                                    { value: "fullscreen", label: "XL", icon: "█" },
                                ].map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => updateHeroStyle({ height: opt.value as HeroStyles["height"] })}
                                        className={`p-2 rounded-lg border text-center transition-all ${config.global.hero.height === opt.value
                                            ? "border-blue-500 bg-blue-50 text-blue-700"
                                            : "border-slate-200 hover:border-slate-300"
                                            }`}
                                    >
                                        <div className="text-lg">{opt.icon}</div>
                                        <div className="text-[10px] font-medium">{opt.label}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Hero Alignment - Visual Buttons */}
                        <div className="space-y-2">
                            <Label className="text-xs text-slate-500">Position du texte</Label>
                            <div className="grid grid-cols-3 gap-1.5">
                                {[
                                    { value: "left", icon: "◀" },
                                    { value: "center", icon: "◆" },
                                    { value: "right", icon: "▶" },
                                ].map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => updateHeroStyle({ contentAlign: opt.value as HeroStyles["contentAlign"] })}
                                        className={`p-2.5 rounded-lg border text-lg transition-all ${config.global.hero.contentAlign === opt.value
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-slate-200 hover:border-slate-300"
                                            }`}
                                    >
                                        {opt.icon}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Corners - Visual Slider */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs text-slate-500">Arrondis</Label>
                                <div className="flex gap-1">
                                    {["0", "0.5rem", "1rem", "1.5rem"].map((val, i) => (
                                        <button
                                            key={val}
                                            onClick={() => onUpdateConfig({ ...config, global: { ...config.global, borderRadius: val } })}
                                            className={`w-6 h-6 rounded-sm border transition-all ${config.global.borderRadius === val
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-slate-200 hover:border-slate-300"
                                                }`}
                                        >
                                            <div
                                                className="w-4 h-4 m-auto bg-slate-400"
                                                style={{ borderRadius: val }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Spacing - Visual Buttons */}
                        <div className="space-y-2">
                            <Label className="text-xs text-slate-500">Espacement</Label>
                            <div className="grid grid-cols-3 gap-1.5">
                                {[
                                    { value: "compact", label: "Compact", icon: "│││" },
                                    { value: "normal", label: "Normal", icon: "│ │ │" },
                                    { value: "spacious", label: "Aéré", icon: "│  │  │" },
                                ].map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => updateSpacing({ sectionPadding: opt.value as SpacingSettings["sectionPadding"] })}
                                        className={`p-2 rounded-lg border text-center transition-all ${config.global.spacing.sectionPadding === opt.value
                                            ? "border-blue-500 bg-blue-50 text-blue-700"
                                            : "border-slate-200 hover:border-slate-300"
                                            }`}
                                    >
                                        <div className="text-xs font-medium">{opt.label}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Advanced Hero Options */}
                        {advancedMode && (
                            <div className="space-y-4 pt-3 border-t border-slate-100">
                                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">🖼️ Options bannière Hero</p>

                                {/* Image Filter */}
                                <div className="space-y-2">
                                    <Label className="text-xs text-slate-500">Filtre image</Label>
                                    <div className="grid grid-cols-4 gap-1.5">
                                        {[
                                            { value: "none", label: "Aucun", icon: "○" },
                                            { value: "blur", label: "Flou", icon: "◎" },
                                            { value: "grayscale", label: "N&B", icon: "◐" },
                                            { value: "sepia", label: "Sépia", icon: "◑" },
                                        ].map((opt) => (
                                            <button
                                                key={opt.value}
                                                onClick={() => updateHeroStyle({ imageFilter: opt.value as HeroStyles["imageFilter"] })}
                                                className={`p-2 rounded-lg border text-center transition-all ${config.global.hero.imageFilter === opt.value
                                                    ? "border-blue-500 bg-blue-50"
                                                    : "border-slate-200 hover:border-slate-300"
                                                    }`}
                                            >
                                                <div className="text-lg">{opt.icon}</div>
                                                <div className="text-[10px]">{opt.label}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Overlay Opacity */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs text-slate-500">Assombrissement</Label>
                                        <span className="text-xs text-slate-400">{Math.round((config.global.hero.overlayOpacity || 0.4) * 100)}%</span>
                                    </div>
                                    <Slider
                                        value={[(config.global.hero.overlayOpacity || 0.4) * 100]}
                                        onValueChange={([v]) => updateHeroStyle({ overlayOpacity: v / 100 })}
                                        min={0}
                                        max={80}
                                        step={5}
                                        className="w-full"
                                    />
                                </div>

                                {/* Section Dividers */}
                                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                                    <div>
                                        <Label className="text-xs font-medium">Séparateurs de sections</Label>
                                        <p className="text-[10px] text-slate-500">Lignes entre les sections</p>
                                    </div>
                                    <Switch
                                        checked={config.global.spacing.showSectionDividers}
                                        onCheckedChange={(v) => updateSpacing({ showSectionDividers: v })}
                                    />
                                </div>
                            </div>
                        )}
                    </AccordionContent>
                </AccordionItem>

                {/* Buttons */}
                <AccordionItem value="buttons" className="border rounded-lg px-3">
                    <AccordionTrigger className="hover:no-underline py-3">
                        <div className="flex items-center gap-2">
                            <MousePointer className="h-4 w-4 text-slate-500" />
                            <span className="font-medium text-sm">🖱️ Boutons</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 space-y-4">
                        {/* Button Style - Visual */}
                        <div className="space-y-2">
                            <Label className="text-xs text-slate-500">Style</Label>
                            <div className="grid grid-cols-3 gap-1.5">
                                {[
                                    { value: "solid", label: "Plein", preview: "bg-slate-800 text-white" },
                                    { value: "outline", label: "Contour", preview: "border-2 border-slate-800" },
                                    { value: "ghost", label: "Minimal", preview: "text-slate-800 underline" },
                                ].map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => updateButtonStyle({ style: opt.value as ButtonStyles["style"] })}
                                        className={`p-2 rounded-lg border transition-all ${config.global.buttons.style === opt.value
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-slate-200 hover:border-slate-300"
                                            }`}
                                    >
                                        <div className={`text-[10px] px-2 py-1 rounded mx-auto w-fit ${opt.preview}`}>
                                            Acheter
                                        </div>
                                        <div className="text-[10px] text-slate-500 mt-1">{opt.label}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Button Size */}
                        <div className="space-y-2">
                            <Label className="text-xs text-slate-500">Taille</Label>
                            <div className="grid grid-cols-3 gap-1.5">
                                {[
                                    { value: "small", label: "S" },
                                    { value: "medium", label: "M" },
                                    { value: "large", label: "L" },
                                ].map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => updateButtonStyle({ size: opt.value as ButtonStyles["size"] })}
                                        className={`p-2 rounded-lg border text-sm font-medium transition-all ${config.global.buttons.size === opt.value
                                            ? "border-blue-500 bg-blue-50 text-blue-700"
                                            : "border-slate-200 hover:border-slate-300"
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Button Colors - Mode avancé */}
                        {advancedMode && (
                            <div className="space-y-3 pt-2 border-t border-slate-100">
                                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">🎨 Couleurs boutons</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <ColorPicker label="Fond" value={config.global.buttons.backgroundColor} onChange={(v) => updateButtonStyle({ backgroundColor: v })} />
                                    <ColorPicker label="Texte" value={config.global.buttons.textColor} onChange={(v) => updateButtonStyle({ textColor: v })} />
                                    <ColorPicker label="Hover" value={config.global.buttons.hoverBg} onChange={(v) => updateButtonStyle({ hoverBg: v })} />
                                </div>
                            </div>
                        )}
                    </AccordionContent>
                </AccordionItem>

                {/* Cards Effects */}
                <AccordionItem value="cards" className="border rounded-lg px-3">
                    <AccordionTrigger className="hover:no-underline py-3">
                        <div className="flex items-center gap-2">
                            <Move className="h-4 w-4 text-slate-500" />
                            <span className="font-medium text-sm">🛍️ Produits</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 space-y-4">
                        {/* Hover Effect */}
                        <div className="space-y-2">
                            <Label className="text-xs text-slate-500">Effet au survol</Label>
                            <div className="grid grid-cols-4 gap-1.5">
                                {[
                                    { value: "none", label: "Aucun", icon: "—" },
                                    { value: "lift", label: "Élever", icon: "↑" },
                                    { value: "zoom", label: "Zoom", icon: "⊕" },
                                    { value: "glow", label: "Lueur", icon: "✨" },
                                ].map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => updateCardStyle({ hoverEffect: opt.value as CardStyles["hoverEffect"] })}
                                        className={`p-2 rounded-lg border text-center transition-all ${config.global.cards.hoverEffect === opt.value
                                            ? "border-blue-500 bg-blue-50 text-blue-700"
                                            : "border-slate-200 hover:border-slate-300"
                                            }`}
                                    >
                                        <div className="text-lg">{opt.icon}</div>
                                        <div className="text-[10px]">{opt.label}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Card Shadow - Mode avancé */}
                        {advancedMode && (
                            <>
                                <div className="space-y-2">
                                    <Label className="text-xs text-slate-500">Ombre des cartes</Label>
                                    <div className="grid grid-cols-3 gap-1.5">
                                        {[
                                            { value: "none", label: "Aucune", preview: "shadow-none" },
                                            { value: "sm", label: "Légère", preview: "shadow-sm" },
                                            { value: "md", label: "Moyenne", preview: "shadow-md" },
                                        ].map((opt) => (
                                            <button
                                                key={opt.value}
                                                onClick={() => onUpdateConfig({
                                                    ...config,
                                                    homeContent: {
                                                        ...config.homeContent,
                                                        productGrid: { ...config.homeContent.productGrid, cardShadow: opt.value !== "none" }
                                                    }
                                                })}
                                                className={`p-3 rounded-lg border text-center transition-all ${(config.homeContent.productGrid.cardShadow ? "md" : "none") === opt.value
                                                    ? "border-blue-500 bg-blue-50"
                                                    : "border-slate-200 hover:border-slate-300"
                                                    }`}
                                            >
                                                <div className={`w-8 h-6 mx-auto rounded bg-white ${opt.preview} mb-1`} />
                                                <div className="text-[10px]">{opt.label}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Card Colors - Mode avancé */}
                                <div className="space-y-3 pt-2 border-t border-slate-100">
                                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">🎨 Couleurs cartes</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <ColorPicker label="Fond" value={config.global.cards.backgroundColor} onChange={(v) => updateCardStyle({ backgroundColor: v })} />
                                        <ColorPicker label="Texte" value={config.global.cards.textColor} onChange={(v) => updateCardStyle({ textColor: v })} />
                                        <ColorPicker label="Prix" value={config.global.cards.priceColor} onChange={(v) => updateCardStyle({ priceColor: v })} />
                                        <ColorPicker label="Bordure" value={config.global.cards.borderColor} onChange={(v) => updateCardStyle({ borderColor: v })} />
                                    </div>
                                </div>
                            </>
                        )}
                    </AccordionContent>
                </AccordionItem>

                {/* Animations - Simplified */}
                <AccordionItem value="animations" className="border rounded-lg px-3">
                    <AccordionTrigger className="hover:no-underline py-3">
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-slate-500" />
                            <span className="font-medium text-sm">✨ Animations</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 space-y-4">
                        {/* Main Toggle */}
                        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                            <div>
                                <Label className="text-sm font-medium">Activer</Label>
                                <p className="text-[10px] text-slate-500">Effets de transition</p>
                            </div>
                            <Switch
                                checked={config.global.animations.enableAnimations}
                                onCheckedChange={(v) => updateAnimations({ enableAnimations: v })}
                            />
                        </div>

                        {config.global.animations.enableAnimations && (
                            <div className="space-y-4">
                                {/* Speed */}
                                <div className="space-y-2">
                                    <Label className="text-xs text-slate-500">Vitesse</Label>
                                    <div className="grid grid-cols-3 gap-1.5">
                                        {[
                                            { value: "slow", label: "Lente", icon: "🐢" },
                                            { value: "normal", label: "Normal", icon: "🚶" },
                                            { value: "fast", label: "Rapide", icon: "⚡" },
                                        ].map((opt) => (
                                            <button
                                                key={opt.value}
                                                onClick={() => updateAnimations({ animationSpeed: opt.value as AnimationSettings["animationSpeed"] })}
                                                className={`p-2 rounded-lg border text-center transition-all ${config.global.animations.animationSpeed === opt.value
                                                    ? "border-blue-500 bg-blue-50"
                                                    : "border-slate-200 hover:border-slate-300"
                                                    }`}
                                            >
                                                <div className="text-sm">{opt.icon}</div>
                                                <div className="text-[10px]">{opt.label}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Advanced Animation Options */}
                                {advancedMode && (
                                    <div className="space-y-4 pt-3 border-t border-slate-100">
                                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">✨ Options avancées</p>

                                        {/* Entrance Effect */}
                                        <div className="space-y-2">
                                            <Label className="text-xs text-slate-500">Effet d&apos;apparition</Label>
                                            <div className="grid grid-cols-4 gap-1.5">
                                                {[
                                                    { value: "none", label: "Aucun", icon: "—" },
                                                    { value: "fadeIn", label: "Fondu", icon: "◌" },
                                                    { value: "slideUp", label: "Glisser", icon: "↑" },
                                                    { value: "zoomIn", label: "Zoom", icon: "⊕" },
                                                ].map((opt) => (
                                                    <button
                                                        key={opt.value}
                                                        onClick={() => updateAnimations({ entranceEffect: opt.value as AnimationSettings["entranceEffect"] })}
                                                        className={`p-2 rounded-lg border text-center transition-all ${(config.global.animations.entranceEffect || "none") === opt.value
                                                            ? "border-blue-500 bg-blue-50"
                                                            : "border-slate-200 hover:border-slate-300"
                                                            }`}
                                                    >
                                                        <div className="text-lg">{opt.icon}</div>
                                                        <div className="text-[10px]">{opt.label}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Scroll Animations Toggle */}
                                        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                                            <div>
                                                <Label className="text-xs font-medium">Animations au scroll</Label>
                                                <p className="text-[10px] text-slate-500">Anime les éléments au défilement</p>
                                            </div>
                                            <Switch
                                                checked={config.global.animations.scrollAnimations ?? true}
                                                onCheckedChange={(v) => updateAnimations({ scrollAnimations: v })}
                                            />
                                        </div>

                                        {/* Hover Transition */}
                                        <div className="space-y-2">
                                            <Label className="text-xs text-slate-500">Transition au survol</Label>
                                            <div className="grid grid-cols-4 gap-1.5">
                                                {[
                                                    { value: "none", label: "Aucun", icon: "—" },
                                                    { value: "fade", label: "Fondu", icon: "◌" },
                                                    { value: "scale", label: "Échelle", icon: "↗" },
                                                    { value: "slide", label: "Glisser", icon: "→" },
                                                ].map((opt) => (
                                                    <button
                                                        key={opt.value}
                                                        onClick={() => updateAnimations({ hoverTransition: opt.value as AnimationSettings["hoverTransition"] })}
                                                        className={`p-2 rounded-lg border text-center transition-all ${config.global.animations.hoverTransition === opt.value
                                                            ? "border-blue-500 bg-blue-50"
                                                            : "border-slate-200 hover:border-slate-300"
                                                            }`}
                                                    >
                                                        <div className="text-lg">{opt.icon}</div>
                                                        <div className="text-[10px]">{opt.label}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}

function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
    return (
        <div className="space-y-1">
            <Label className="text-xs text-slate-500">{label}</Label>
            <div className="flex items-center gap-2">
                <input
                    type="color"
                    value={value.startsWith("#") ? value.slice(0, 7) : "#000000"}
                    onChange={(e) => onChange(e.target.value)}
                    className="h-8 w-8 rounded cursor-pointer border-0"
                />
                <Input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="h-8 text-xs font-mono flex-1"
                />
            </div>
        </div>
    );
}
