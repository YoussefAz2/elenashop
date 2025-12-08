"use client";

import { Card } from "@/components/ui/card";
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
import { Palette, Type, Layers, MousePointer, Sparkles, Move, Crown } from "lucide-react";
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
import { TEMPLATE_PRESETS, DEFAULT_THEME_CONFIGS, AVAILABLE_FONTS } from "@/types";
import { TEMPLATES } from "@/lib/templates";

interface DesignPanelProps {
    config: ThemeConfig;
    onUpdateConfig: (config: ThemeConfig) => void;
}

export function DesignPanel({ config, onUpdateConfig }: DesignPanelProps) {
    const selectTemplate = (templateId: TemplateId) => {
        const preset = DEFAULT_THEME_CONFIGS[templateId];
        onUpdateConfig({
            ...config,
            templateId,
            global: preset.global,
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
                {/* Base Colors */}
                <AccordionItem value="colors" className="border rounded-lg px-3">
                    <AccordionTrigger className="hover:no-underline py-3">
                        <div className="flex items-center gap-2">
                            <Palette className="h-4 w-4 text-slate-500" />
                            <span className="font-medium text-sm">Couleurs</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 space-y-4">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Base</p>
                        <div className="grid grid-cols-2 gap-3">
                            <ColorPicker label="Fond" value={config.global.colors.background} onChange={(v) => updateGlobalColor("background", v)} />
                            <ColorPicker label="Texte" value={config.global.colors.text} onChange={(v) => updateGlobalColor("text", v)} />
                            <ColorPicker label="Principal" value={config.global.colors.primary} onChange={(v) => updateGlobalColor("primary", v)} />
                            <ColorPicker label="Secondaire" value={config.global.colors.secondary} onChange={(v) => updateGlobalColor("secondary", v)} />
                        </div>

                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide pt-2">Hero</p>
                        <div className="grid grid-cols-2 gap-3">
                            <ColorPicker label="Fond" value={config.global.hero.backgroundColor} onChange={(v) => updateHeroStyle({ backgroundColor: v })} />
                            <ColorPicker label="Texte" value={config.global.hero.textColor} onChange={(v) => updateHeroStyle({ textColor: v })} />
                            <ColorPicker label="Bouton" value={config.global.hero.buttonBg} onChange={(v) => updateHeroStyle({ buttonBg: v })} />
                            <ColorPicker label="Texte btn" value={config.global.hero.buttonText} onChange={(v) => updateHeroStyle({ buttonText: v })} />
                        </div>

                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide pt-2">Cartes</p>
                        <div className="grid grid-cols-2 gap-3">
                            <ColorPicker label="Fond" value={config.global.cards.backgroundColor} onChange={(v) => updateCardStyle({ backgroundColor: v })} />
                            <ColorPicker label="Texte" value={config.global.cards.textColor} onChange={(v) => updateCardStyle({ textColor: v })} />
                            <ColorPicker label="Prix" value={config.global.cards.priceColor} onChange={(v) => updateCardStyle({ priceColor: v })} />
                            <ColorPicker label="Bordure" value={config.global.cards.borderColor} onChange={(v) => updateCardStyle({ borderColor: v })} />
                        </div>

                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide pt-2">Boutons</p>
                        <div className="grid grid-cols-2 gap-3">
                            <ColorPicker label="Fond" value={config.global.buttons.backgroundColor} onChange={(v) => updateButtonStyle({ backgroundColor: v })} />
                            <ColorPicker label="Texte" value={config.global.buttons.textColor} onChange={(v) => updateButtonStyle({ textColor: v })} />
                            <ColorPicker label="Hover" value={config.global.buttons.hoverBg} onChange={(v) => updateButtonStyle({ hoverBg: v })} />
                        </div>

                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide pt-2">Footer</p>
                        <div className="grid grid-cols-2 gap-3">
                            <ColorPicker label="Fond" value={config.global.footer.backgroundColor} onChange={(v) => updateFooterStyle({ backgroundColor: v })} />
                            <ColorPicker label="Texte" value={config.global.footer.textColor} onChange={(v) => updateFooterStyle({ textColor: v })} />
                            <ColorPicker label="Accent" value={config.global.footer.accentColor} onChange={(v) => updateFooterStyle({ accentColor: v })} />
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Typography */}
                <AccordionItem value="typography" className="border rounded-lg px-3">
                    <AccordionTrigger className="hover:no-underline py-3">
                        <div className="flex items-center gap-2">
                            <Type className="h-4 w-4 text-slate-500" />
                            <span className="font-medium text-sm">Typographie</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 space-y-4">
                        <div className="space-y-2">
                            <Label className="text-sm">Police principale</Label>
                            <Select value={config.global.font} onValueChange={(v) => onUpdateConfig({ ...config, global: { ...config.global, font: v as GlobalStyles["font"] } })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {AVAILABLE_FONTS.map((f) => (
                                        <SelectItem key={f.id} value={f.id}>{f.name} ({f.style})</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm">Police titres</Label>
                            <Select value={config.global.headingFont} onValueChange={(v) => onUpdateConfig({ ...config, global: { ...config.global, headingFont: v as GlobalStyles["headingFont"] } })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {AVAILABLE_FONTS.map((f) => (
                                        <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm">Taille titres</Label>
                            <Select value={config.global.typography.headingSize} onValueChange={(v) => updateTypography({ headingSize: v as TypographySettings["headingSize"] })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="small">Petit</SelectItem>
                                    <SelectItem value="medium">Moyen</SelectItem>
                                    <SelectItem value="large">Grand</SelectItem>
                                    <SelectItem value="xlarge">Très grand</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm">Taille texte</Label>
                            <Select value={config.global.typography.bodySize} onValueChange={(v) => updateTypography({ bodySize: v as TypographySettings["bodySize"] })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="small">Petit</SelectItem>
                                    <SelectItem value="medium">Moyen</SelectItem>
                                    <SelectItem value="large">Grand</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm">Style titres</Label>
                            <Select value={config.global.typography.headingTransform} onValueChange={(v) => updateTypography({ headingTransform: v as TypographySettings["headingTransform"] })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Normal</SelectItem>
                                    <SelectItem value="uppercase">MAJUSCULES</SelectItem>
                                    <SelectItem value="capitalize">Première Lettre</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Layout & Spacing */}
                <AccordionItem value="layout" className="border rounded-lg px-3">
                    <AccordionTrigger className="hover:no-underline py-3">
                        <div className="flex items-center gap-2">
                            <Layers className="h-4 w-4 text-slate-500" />
                            <span className="font-medium text-sm">Mise en page</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 space-y-4">
                        <div className="space-y-2">
                            <Label className="text-sm">Hauteur Hero</Label>
                            <Select value={config.global.hero.height} onValueChange={(v) => updateHeroStyle({ height: v as HeroStyles["height"] })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="compact">Compact</SelectItem>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="large">Grand</SelectItem>
                                    <SelectItem value="fullscreen">Plein écran</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm">Alignement Hero</Label>
                            <Select value={config.global.hero.contentAlign} onValueChange={(v) => updateHeroStyle({ contentAlign: v as HeroStyles["contentAlign"] })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="left">← Gauche</SelectItem>
                                    <SelectItem value="center">Centre</SelectItem>
                                    <SelectItem value="right">Droite →</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm">Filtre image Hero</Label>
                            <Select value={config.global.hero.imageFilter} onValueChange={(v) => updateHeroStyle({ imageFilter: v as HeroStyles["imageFilter"] })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Aucun</SelectItem>
                                    <SelectItem value="grayscale">Noir & blanc</SelectItem>
                                    <SelectItem value="sepia">Sépia</SelectItem>
                                    <SelectItem value="blur">Flou</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm">Espacement sections</Label>
                            <Select value={config.global.spacing.sectionPadding} onValueChange={(v) => updateSpacing({ sectionPadding: v as SpacingSettings["sectionPadding"] })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="compact">Compact</SelectItem>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="spacious">Aéré</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label className="text-sm">Séparateurs entre sections</Label>
                            <Switch checked={config.global.spacing.showSectionDividers} onCheckedChange={(v) => updateSpacing({ showSectionDividers: v })} />
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <Label className="text-sm">Arrondis</Label>
                                <span className="text-xs text-slate-500">{config.global.borderRadius}</span>
                            </div>
                            <Slider
                                value={[getRadiusIndex()]}
                                onValueChange={([v]) => onUpdateConfig({ ...config, global: { ...config.global, borderRadius: radiusValues[v] } })}
                                max={radiusValues.length - 1}
                                step={1}
                            />
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Buttons */}
                <AccordionItem value="buttons" className="border rounded-lg px-3">
                    <AccordionTrigger className="hover:no-underline py-3">
                        <div className="flex items-center gap-2">
                            <MousePointer className="h-4 w-4 text-slate-500" />
                            <span className="font-medium text-sm">Boutons</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 space-y-4">
                        <div className="space-y-2">
                            <Label className="text-sm">Style</Label>
                            <Select value={config.global.buttons.style} onValueChange={(v) => updateButtonStyle({ style: v as ButtonStyles["style"] })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="solid">Plein</SelectItem>
                                    <SelectItem value="outline">Contour</SelectItem>
                                    <SelectItem value="ghost">Fantôme</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm">Taille</Label>
                            <Select value={config.global.buttons.size} onValueChange={(v) => updateButtonStyle({ size: v as ButtonStyles["size"] })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="small">Petit</SelectItem>
                                    <SelectItem value="medium">Moyen</SelectItem>
                                    <SelectItem value="large">Grand</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Cards & Effects */}
                <AccordionItem value="cards" className="border rounded-lg px-3">
                    <AccordionTrigger className="hover:no-underline py-3">
                        <div className="flex items-center gap-2">
                            <Move className="h-4 w-4 text-slate-500" />
                            <span className="font-medium text-sm">Cartes produits</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 space-y-4">
                        <div className="space-y-2">
                            <Label className="text-sm">Effet au survol</Label>
                            <Select value={config.global.cards.hoverEffect} onValueChange={(v) => updateCardStyle({ hoverEffect: v as CardStyles["hoverEffect"] })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Aucun</SelectItem>
                                    <SelectItem value="lift">Élévation</SelectItem>
                                    <SelectItem value="zoom">Zoom</SelectItem>
                                    <SelectItem value="glow">Lueur</SelectItem>
                                    <SelectItem value="border">Bordure</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Animations */}
                <AccordionItem value="animations" className="border rounded-lg px-3">
                    <AccordionTrigger className="hover:no-underline py-3">
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-slate-500" />
                            <span className="font-medium text-sm">Animations</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm">Activer les animations</Label>
                            <Switch checked={config.global.animations.enableAnimations} onCheckedChange={(v) => updateAnimations({ enableAnimations: v })} />
                        </div>
                        {config.global.animations.enableAnimations && (
                            <>
                                <div className="space-y-2">
                                    <Label className="text-sm">Vitesse</Label>
                                    <Select value={config.global.animations.animationSpeed} onValueChange={(v) => updateAnimations({ animationSpeed: v as AnimationSettings["animationSpeed"] })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="slow">Lente</SelectItem>
                                            <SelectItem value="normal">Normale</SelectItem>
                                            <SelectItem value="fast">Rapide</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm">Transition hover</Label>
                                    <Select value={config.global.animations.hoverTransition} onValueChange={(v) => updateAnimations({ hoverTransition: v as AnimationSettings["hoverTransition"] })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Aucune</SelectItem>
                                            <SelectItem value="fade">Fondu</SelectItem>
                                            <SelectItem value="scale">Zoom</SelectItem>
                                            <SelectItem value="slide">Glissement</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </>
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
