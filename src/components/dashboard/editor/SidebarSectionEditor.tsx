"use client";

import { ChevronLeft, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ui/image-upload";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import type { ThemeConfig, HeroContent } from "@/types";
import { SectionId, SECTIONS } from "./SidebarSectionList";

interface SidebarSectionEditorProps {
    activeSection: SectionId;
    config: ThemeConfig;
    onUpdateConfig: (config: ThemeConfig) => void;
    onBack: () => void;
}

// Default values for reset functionality
const DEFAULT_HERO: HeroContent = {
    visible: true,
    title: "Bienvenue",
    subtitle: "",
    buttonText: "Voir les produits",
    buttonUrl: "#products",
    imageUrl: "",
    overlayOpacity: 0.5,
    gradientEnabled: false,
    gradientDirection: "left",
};

export function SidebarSectionEditor({
    activeSection,
    config,
    onUpdateConfig,
    onBack,
}: SidebarSectionEditorProps) {
    const currentSection = SECTIONS.find((s) => s.id === activeSection);

    // Hero update helper
    const updateHero = (updates: Partial<HeroContent>) => {
        onUpdateConfig({
            ...config,
            homeContent: {
                ...config.homeContent,
                hero: { ...config.homeContent.hero, ...updates },
            },
        });
    };

    // Reset hero to defaults
    const resetHero = () => {
        onUpdateConfig({
            ...config,
            homeContent: {
                ...config.homeContent,
                hero: DEFAULT_HERO,
            },
        });
    };

    return (
        <div className="flex flex-col h-full">
            {/* Back Button */}
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-4 -ml-1 transition-colors"
            >
                <ChevronLeft className="h-4 w-4" />
                <span>Retour</span>
            </button>

            {/* Section Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                    <div className="text-slate-500">{currentSection?.icon}</div>
                    <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                        {currentSection?.label}
                    </h2>
                </div>
                {activeSection === "hero" && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetHero}
                        className="text-slate-400 hover:text-slate-600"
                    >
                        <RotateCcw className="h-3.5 w-3.5 mr-1" />
                        Réinitialiser
                    </Button>
                )}
            </div>

            {/* Section Content with Tabs */}
            {activeSection === "hero" && (
                <Tabs defaultValue="content" className="flex-1">
                    <TabsList className="grid w-full grid-cols-3 mb-4">
                        <TabsTrigger value="content" className="text-xs">✏️ Contenu</TabsTrigger>
                        <TabsTrigger value="style" className="text-xs">🎨 Style</TabsTrigger>
                        <TabsTrigger value="settings" className="text-xs">⚙️ Réglages</TabsTrigger>
                    </TabsList>

                    {/* Content Tab */}
                    <TabsContent value="content" className="space-y-4 mt-0">
                        <div className="space-y-2">
                            <Label className="text-sm">Titre principal</Label>
                            <Textarea
                                value={config.homeContent.hero.title}
                                onChange={(e) => updateHero({ title: e.target.value })}
                                placeholder="Votre titre accrocheur"
                                className="min-h-[60px] resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm">Sous-titre</Label>
                            <Textarea
                                value={config.homeContent.hero.subtitle || ""}
                                onChange={(e) => updateHero({ subtitle: e.target.value })}
                                placeholder="Description de votre boutique"
                                className="min-h-[80px] resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm">Texte du bouton</Label>
                            <Input
                                value={config.homeContent.hero.buttonText}
                                onChange={(e) => updateHero({ buttonText: e.target.value })}
                                placeholder="Voir les produits"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm">Lien du bouton</Label>
                            <Input
                                value={config.homeContent.hero.buttonUrl}
                                onChange={(e) => updateHero({ buttonUrl: e.target.value })}
                                placeholder="#products"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm">Image de fond</Label>
                            <ImageUpload
                                value={config.homeContent.hero.imageUrl || ""}
                                onChange={(url) => updateHero({ imageUrl: url })}
                                folder="hero"
                            />
                        </div>
                    </TabsContent>

                    {/* Style Tab */}
                    <TabsContent value="style" className="space-y-4 mt-0">
                        {config.homeContent.hero.imageUrl && (
                            <>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <Label className="text-sm">Opacité de l'overlay</Label>
                                        <span className="text-xs text-slate-500">
                                            {Math.round((config.homeContent.hero.overlayOpacity || 0.5) * 100)}%
                                        </span>
                                    </div>
                                    <Slider
                                        value={[config.homeContent.hero.overlayOpacity || 0.5]}
                                        onValueChange={([v]) => updateHero({ overlayOpacity: v })}
                                        min={0}
                                        max={1}
                                        step={0.1}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <Label className="text-sm">Dégradé sur l'image</Label>
                                    <Switch
                                        checked={config.homeContent.hero.gradientEnabled || false}
                                        onCheckedChange={(v) => updateHero({ gradientEnabled: v })}
                                    />
                                </div>

                                {config.homeContent.hero.gradientEnabled && (
                                    <div className="space-y-2">
                                        <Label className="text-sm">Direction du dégradé</Label>
                                        <Select
                                            value={config.homeContent.hero.gradientDirection || "left"}
                                            onValueChange={(v) => updateHero({ gradientDirection: v as "left" | "right" | "top" | "bottom" })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="left">← Gauche</SelectItem>
                                                <SelectItem value="right">→ Droite</SelectItem>
                                                <SelectItem value="top">↑ Haut</SelectItem>
                                                <SelectItem value="bottom">↓ Bas</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </>
                        )}

                        {!config.homeContent.hero.imageUrl && (
                            <p className="text-sm text-slate-400 text-center py-8">
                                Ajoutez une image de fond dans l'onglet Contenu pour accéder aux options de style.
                            </p>
                        )}
                    </TabsContent>

                    {/* Settings Tab */}
                    <TabsContent value="settings" className="space-y-4 mt-0">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-sm">Afficher la bannière</Label>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Masquer la section Hero de la page
                                </p>
                            </div>
                            <Switch
                                checked={config.homeContent.hero.visible}
                                onCheckedChange={(v) => updateHero({ visible: v })}
                            />
                        </div>
                    </TabsContent>
                </Tabs>
            )}

            {/* Placeholder for other sections */}
            {activeSection !== "hero" && (
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-sm text-slate-400 text-center">
                        Éditeur pour "{currentSection?.label}" à venir...
                    </p>
                </div>
            )}
        </div>
    );
}
