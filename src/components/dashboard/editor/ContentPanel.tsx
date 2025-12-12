"use client";

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
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Image,
    ShoppingBag,
    Footprints,
    Megaphone,
    PanelTop,
    User,
    FileText,
    Phone,
    HelpCircle,
    Plus,
    Trash2,
    MessageCircle,
    Gift,
    Search,
    Star,
} from "lucide-react";
import type {
    ThemeConfig,
    HeaderContent,
    AnnouncementContent,
    HeroContent,
    ProductGridContent,
    AboutContent,
    FooterContent,
    TestimonialsContent,
    Testimonial,
    AboutPageContent,
    ContactPageContent,
    FAQPageContent,
    FAQItem,
    FloatingWhatsAppConfig,
    PromoPopupConfig,
    SEOConfig,
} from "@/types";

interface ContentPanelProps {
    config: ThemeConfig;
    onUpdateConfig: (config: ThemeConfig) => void;
}

export function ContentPanel({ config, onUpdateConfig }: ContentPanelProps) {
    const updateHeader = (updates: Partial<HeaderContent>) => {
        onUpdateConfig({
            ...config,
            homeContent: {
                ...config.homeContent,
                header: { ...config.homeContent.header, ...updates },
            },
        });
    };

    const updateAnnouncement = (updates: Partial<AnnouncementContent>) => {
        onUpdateConfig({
            ...config,
            homeContent: {
                ...config.homeContent,
                announcement: { ...config.homeContent.announcement, ...updates },
            },
        });
    };

    const updateHero = (updates: Partial<HeroContent>) => {
        onUpdateConfig({
            ...config,
            homeContent: {
                ...config.homeContent,
                hero: { ...config.homeContent.hero, ...updates },
            },
        });
    };

    const updateProductGrid = (updates: Partial<ProductGridContent>) => {
        onUpdateConfig({
            ...config,
            homeContent: {
                ...config.homeContent,
                productGrid: { ...config.homeContent.productGrid, ...updates },
            },
        });
    };

    const updateAbout = (updates: Partial<AboutContent>) => {
        onUpdateConfig({
            ...config,
            homeContent: {
                ...config.homeContent,
                about: { ...config.homeContent.about, ...updates },
            },
        });
    };

    const updateTestimonials = (updates: Partial<TestimonialsContent>) => {
        onUpdateConfig({
            ...config,
            homeContent: {
                ...config.homeContent,
                testimonials: { ...config.homeContent.testimonials, ...updates },
            },
        });
    };

    const addTestimonial = () => {
        const newItem: Testimonial = {
            id: Date.now().toString(),
            name: "Client satisfait",
            text: "Excellent produit, je recommande !",
            rating: 5,
        };
        updateTestimonials({ items: [...(config.homeContent.testimonials.items || []), newItem] });
    };

    const updateTestimonialItem = (id: string, updates: Partial<Testimonial>) => {
        const items = config.homeContent.testimonials.items.map((item) =>
            item.id === id ? { ...item, ...updates } : item
        );
        updateTestimonials({ items });
    };

    const deleteTestimonial = (id: string) => {
        const items = config.homeContent.testimonials.items.filter((item) => item.id !== id);
        updateTestimonials({ items });
    };

    const updateFooter = (updates: Partial<FooterContent>) => {
        onUpdateConfig({
            ...config,
            homeContent: {
                ...config.homeContent,
                footer: { ...config.homeContent.footer, ...updates },
            },
        });
    };

    // Page content updaters
    const updateAboutPage = (updates: Partial<AboutPageContent>) => {
        onUpdateConfig({
            ...config,
            aboutPageContent: { ...config.aboutPageContent, ...updates },
        });
    };

    const updateContactPage = (updates: Partial<ContactPageContent>) => {
        onUpdateConfig({
            ...config,
            contactPageContent: { ...config.contactPageContent, ...updates },
        });
    };

    const updateFAQPage = (updates: Partial<FAQPageContent>) => {
        onUpdateConfig({
            ...config,
            faqPageContent: { ...config.faqPageContent, ...updates },
        });
    };

    const addFAQItem = () => {
        const newItem: FAQItem = {
            id: Date.now().toString(),
            question: "Nouvelle question",
            answer: "Réponse...",
        };
        updateFAQPage({ items: [...(config.faqPageContent.items || []), newItem] });
    };

    const updateFAQItem = (id: string, updates: Partial<FAQItem>) => {
        const items = config.faqPageContent.items.map((item) =>
            item.id === id ? { ...item, ...updates } : item
        );
        updateFAQPage({ items });
    };

    const deleteFAQItem = (id: string) => {
        const items = config.faqPageContent.items.filter((item) => item.id !== id);
        updateFAQPage({ items });
    };

    const updateFloatingWhatsApp = (updates: Partial<FloatingWhatsAppConfig>) => {
        onUpdateConfig({
            ...config,
            floatingWhatsApp: { ...config.floatingWhatsApp, ...updates },
        });
    };

    const updatePromoPopup = (updates: Partial<PromoPopupConfig>) => {
        onUpdateConfig({
            ...config,
            promoPopup: { ...config.promoPopup, ...updates },
        });
    };

    const updateSEO = (updates: Partial<SEOConfig>) => {
        onUpdateConfig({
            ...config,
            seo: { ...config.seo, ...updates },
        });
    };

    return (
        <div className="p-4">
            <Accordion type="single" collapsible defaultValue="header" className="space-y-2">

                {/* Header Section */}
                <AccordionItem value="header" className="border rounded-lg px-3">
                    <AccordionTrigger className="hover:no-underline py-3">
                        <div className="flex items-center gap-2">
                            <PanelTop className="h-4 w-4 text-slate-500" />
                            <span className="font-medium text-sm">En-tête</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm">Afficher l'en-tête</Label>
                            <Switch
                                checked={config.homeContent.header.visible}
                                onCheckedChange={(v) => updateHeader({ visible: v })}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label className="text-sm">Fixé en haut (sticky)</Label>
                            <Switch
                                checked={config.homeContent.header.sticky}
                                onCheckedChange={(v) => updateHeader({ sticky: v })}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label className="text-sm">Afficher le nom</Label>
                            <Switch
                                checked={config.homeContent.header.showStoreName}
                                onCheckedChange={(v) => updateHeader({ showStoreName: v })}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label className="text-sm">Afficher le nombre de produits</Label>
                            <Switch
                                checked={config.homeContent.header.showProductCount}
                                onCheckedChange={(v) => updateHeader({ showProductCount: v })}
                            />
                        </div>
                        <div className="space-y-2 border-t pt-4 mt-2">
                            <Label className="text-sm">Logo de la boutique</Label>
                            <ImageUpload
                                value={config.homeContent.header.logoUrl || ""}
                                onChange={(url) => updateHeader({ logoUrl: url })}
                                folder="logos"
                            />
                            {config.homeContent.header.logoUrl && (
                                <div className="space-y-2 mt-3">
                                    <div className="flex justify-between">
                                        <Label className="text-sm">Taille du logo</Label>
                                        <span className="text-xs text-slate-500">{config.homeContent.header.logoSize || 40}px</span>
                                    </div>
                                    <Slider
                                        value={[config.homeContent.header.logoSize || 40]}
                                        onValueChange={([v]) => updateHeader({ logoSize: v })}
                                        min={24}
                                        max={80}
                                        step={4}
                                        className="w-full"
                                    />
                                </div>
                            )}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Announcement Banner */}
                <AccordionItem value="announcement" className="border rounded-lg px-3">
                    <AccordionTrigger className="hover:no-underline py-3">
                        <div className="flex items-center gap-2">
                            <Megaphone className="h-4 w-4 text-slate-500" />
                            <span className="font-medium text-sm">Bandeau annonce</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm">Activer le bandeau</Label>
                            <Switch
                                checked={config.homeContent.announcement.enabled}
                                onCheckedChange={(v) => updateAnnouncement({ enabled: v })}
                            />
                        </div>
                        {config.homeContent.announcement.enabled && (
                            <>
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm">Fixé en haut (sticky)</Label>
                                    <Switch
                                        checked={config.homeContent.announcement.sticky}
                                        onCheckedChange={(v) => updateAnnouncement({ sticky: v })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm">Texte</Label>
                                    <Input
                                        value={config.homeContent.announcement.text}
                                        onChange={(e) => updateAnnouncement({ text: e.target.value })}
                                        placeholder="🚚 Livraison gratuite..."
                                        className="h-10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm">Lien (optionnel)</Label>
                                    <Input
                                        value={config.homeContent.announcement.link}
                                        onChange={(e) => updateAnnouncement({ link: e.target.value })}
                                        placeholder="https://..."
                                        className="h-10"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <Label className="text-sm">Fond</Label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                value={config.homeContent.announcement.backgroundColor}
                                                onChange={(e) => updateAnnouncement({ backgroundColor: e.target.value })}
                                                className="h-8 w-8 rounded cursor-pointer"
                                            />
                                            <Input
                                                value={config.homeContent.announcement.backgroundColor}
                                                onChange={(e) => updateAnnouncement({ backgroundColor: e.target.value })}
                                                className="h-8 text-xs font-mono flex-1"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm">Texte</Label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                value={config.homeContent.announcement.textColor}
                                                onChange={(e) => updateAnnouncement({ textColor: e.target.value })}
                                                className="h-8 w-8 rounded cursor-pointer"
                                            />
                                            <Input
                                                value={config.homeContent.announcement.textColor}
                                                onChange={(e) => updateAnnouncement({ textColor: e.target.value })}
                                                className="h-8 text-xs font-mono flex-1"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </AccordionContent>
                </AccordionItem>

                {/* Hero Section */}
                <AccordionItem value="hero" className="border rounded-lg px-3">
                    <AccordionTrigger className="hover:no-underline py-3">
                        <div className="flex items-center gap-2">
                            <Image className="h-4 w-4 text-slate-500" />
                            <span className="font-medium text-sm">Bannière principale</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm">Afficher la bannière</Label>
                            <Switch
                                checked={config.homeContent.hero.visible}
                                onCheckedChange={(v) => updateHero({ visible: v })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm">Titre</Label>
                            <Input
                                value={config.homeContent.hero.title}
                                onChange={(e) => updateHero({ title: e.target.value })}
                                placeholder="Bienvenue"
                                className="h-10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm">Sous-titre</Label>
                            <Input
                                value={config.homeContent.hero.subtitle}
                                onChange={(e) => updateHero({ subtitle: e.target.value })}
                                placeholder="Découvrez notre collection"
                                className="h-10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm">Texte du bouton</Label>
                            <Input
                                value={config.homeContent.hero.buttonText}
                                onChange={(e) => updateHero({ buttonText: e.target.value })}
                                placeholder="Acheter"
                                className="h-10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm">Image de fond</Label>
                            <ImageUpload
                                value={config.homeContent.hero.imageUrl}
                                onChange={(url) => updateHero({ imageUrl: url })}
                                folder="hero"
                                label="Télécharger"
                                shape="wide"
                                size="md"
                            />
                        </div>

                        {config.homeContent.hero.imageUrl && (
                            <div className="pt-2 border-t space-y-4">
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                    Options de l'overlay
                                </p>
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <Label className="text-sm">Opacité (assombrir)</Label>
                                        <span className="text-xs text-slate-500">
                                            {Math.round(config.homeContent.hero.overlayOpacity * 100)}%
                                        </span>
                                    </div>
                                    <Slider
                                        value={[config.homeContent.hero.overlayOpacity * 100]}
                                        onValueChange={([v]) => updateHero({ overlayOpacity: v / 100 })}
                                        max={100}
                                        step={5}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm">Activer le dégradé</Label>
                                    <Switch
                                        checked={config.homeContent.hero.gradientEnabled}
                                        onCheckedChange={(v) => updateHero({ gradientEnabled: v })}
                                    />
                                </div>
                                {config.homeContent.hero.gradientEnabled && (
                                    <div className="space-y-2">
                                        <Label className="text-sm">Direction du dégradé</Label>
                                        <Select
                                            value={config.homeContent.hero.gradientDirection}
                                            onValueChange={(v) => updateHero({ gradientDirection: v as "left" | "right" | "top" | "bottom" })}
                                        >
                                            <SelectTrigger className="h-10">
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
                            </div>
                        )}
                    </AccordionContent>
                </AccordionItem>

                {/* Product Grid Section */}
                <AccordionItem value="products" className="border rounded-lg px-3">
                    <AccordionTrigger className="hover:no-underline py-3">
                        <div className="flex items-center gap-2">
                            <ShoppingBag className="h-4 w-4 text-slate-500" />
                            <span className="font-medium text-sm">Grille produits</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 space-y-4">
                        <div className="space-y-2">
                            <Label className="text-sm">Titre de section</Label>
                            <Input
                                value={config.homeContent.productGrid.title}
                                onChange={(e) => updateProductGrid({ title: e.target.value })}
                                placeholder="Nos Produits"
                                className="h-10"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label className="text-sm">Afficher descriptions</Label>
                            <Switch
                                checked={config.homeContent.productGrid.showDescription}
                                onCheckedChange={(v) => updateProductGrid({ showDescription: v })}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label className="text-sm">Afficher les prix</Label>
                            <Switch
                                checked={config.homeContent.productGrid.showPrice}
                                onCheckedChange={(v) => updateProductGrid({ showPrice: v })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm">Colonnes</Label>
                            <Select
                                value={String(config.homeContent.productGrid.columns)}
                                onValueChange={(v) => updateProductGrid({ columns: Number(v) as 2 | 3 | 4 })}
                            >
                                <SelectTrigger className="h-10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="2">2 colonnes</SelectItem>
                                    <SelectItem value="3">3 colonnes</SelectItem>
                                    <SelectItem value="4">4 colonnes</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm">Format image</Label>
                            <Select
                                value={config.homeContent.productGrid.aspectRatio}
                                onValueChange={(v) => updateProductGrid({ aspectRatio: v as "square" | "portrait" | "landscape" })}
                            >
                                <SelectTrigger className="h-10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="square">Carré (1:1)</SelectItem>
                                    <SelectItem value="portrait">Portrait (3:4)</SelectItem>
                                    <SelectItem value="landscape">Paysage (4:3)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="pt-2 border-t space-y-3">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                Espacement
                            </p>
                            <div className="space-y-2">
                                <Label className="text-sm">Espace entre cartes</Label>
                                <Select
                                    value={config.homeContent.productGrid.gap}
                                    onValueChange={(v) => updateProductGrid({ gap: v as "small" | "medium" | "large" })}
                                >
                                    <SelectTrigger className="h-10">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="small">Petit</SelectItem>
                                        <SelectItem value="medium">Moyen</SelectItem>
                                        <SelectItem value="large">Grand</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center justify-between">
                                <Label className="text-sm">Ombres sur les cartes</Label>
                                <Switch
                                    checked={config.homeContent.productGrid.cardShadow}
                                    onCheckedChange={(v) => updateProductGrid({ cardShadow: v })}
                                />
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Testimonials Section */}
                <AccordionItem value="testimonials" className="border rounded-lg px-3">
                    <AccordionTrigger className="hover:no-underline py-3">
                        <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-slate-500" />
                            <span className="font-medium text-sm">Témoignages</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm">Afficher la section</Label>
                            <Switch
                                checked={config.homeContent.testimonials.visible}
                                onCheckedChange={(v) => updateTestimonials({ visible: v })}
                            />
                        </div>
                        {config.homeContent.testimonials.visible && (
                            <>
                                <div className="space-y-2">
                                    <Label className="text-sm">Titre</Label>
                                    <Input
                                        value={config.homeContent.testimonials.title}
                                        onChange={(e) => updateTestimonials({ title: e.target.value })}
                                        placeholder="Ce que disent nos clients"
                                        className="h-10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm">Sous-titre</Label>
                                    <Input
                                        value={config.homeContent.testimonials.subtitle}
                                        onChange={(e) => updateTestimonials({ subtitle: e.target.value })}
                                        placeholder="Découvrez les avis de nos clients"
                                        className="h-10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm">Disposition</Label>
                                    <Select
                                        value={config.homeContent.testimonials.layout}
                                        onValueChange={(v) => updateTestimonials({ layout: v as "grid" | "carousel" })}
                                    >
                                        <SelectTrigger className="h-10">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="grid">Grille</SelectItem>
                                            <SelectItem value="carousel">Carrousel</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm">Afficher les étoiles</Label>
                                    <Switch
                                        checked={config.homeContent.testimonials.showRating}
                                        onCheckedChange={(v) => updateTestimonials({ showRating: v })}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm">Afficher les avatars</Label>
                                    <Switch
                                        checked={config.homeContent.testimonials.showAvatar}
                                        onCheckedChange={(v) => updateTestimonials({ showAvatar: v })}
                                    />
                                </div>

                                {/* Testimonials List */}
                                <div className="pt-2 border-t space-y-3">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                            Témoignages ({config.homeContent.testimonials.items?.length || 0})
                                        </p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={addTestimonial}
                                            className="h-7 text-xs"
                                        >
                                            <Plus className="h-3 w-3 mr-1" />
                                            Ajouter
                                        </Button>
                                    </div>

                                    {config.homeContent.testimonials.items?.map((item) => (
                                        <div key={item.id} className="p-3 bg-slate-50 rounded-lg space-y-3">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 space-y-3">
                                                    <Input
                                                        value={item.name}
                                                        onChange={(e) => updateTestimonialItem(item.id, { name: e.target.value })}
                                                        placeholder="Nom du client"
                                                        className="h-9 text-sm"
                                                    />
                                                    <Textarea
                                                        value={item.text}
                                                        onChange={(e) => updateTestimonialItem(item.id, { text: e.target.value })}
                                                        placeholder="Témoignage..."
                                                        rows={2}
                                                        className="text-sm"
                                                    />
                                                    <div className="flex items-center gap-2">
                                                        <Label className="text-xs">Note :</Label>
                                                        <div className="flex gap-1">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <button
                                                                    key={star}
                                                                    type="button"
                                                                    onClick={() => updateTestimonialItem(item.id, { rating: star })}
                                                                    className="p-0.5"
                                                                >
                                                                    <Star
                                                                        className={`h-4 w-4 ${star <= item.rating
                                                                            ? "fill-amber-400 text-amber-400"
                                                                            : "text-slate-300"
                                                                            }`}
                                                                    />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <ImageUpload
                                                        value={item.imageUrl || ""}
                                                        onChange={(url) => updateTestimonialItem(item.id, { imageUrl: url })}
                                                        folder="testimonials"
                                                        label="Photo"
                                                        shape="circle"
                                                        size="sm"
                                                    />
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => deleteTestimonial(item.id)}
                                                    className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 ml-2"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}

                                    {(!config.homeContent.testimonials.items || config.homeContent.testimonials.items.length === 0) && (
                                        <p className="text-xs text-slate-400 text-center py-4">
                                            Aucun témoignage. Cliquez sur "Ajouter" pour créer le premier.
                                        </p>
                                    )}
                                </div>
                            </>
                        )}
                    </AccordionContent>
                </AccordionItem>

                {/* About Section - Homepage */}
                <AccordionItem value="about" className="border rounded-lg px-3">
                    <AccordionTrigger className="hover:no-underline py-3">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-slate-500" />
                            <span className="font-medium text-sm">À propos (section accueil)</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm">Afficher la section</Label>
                            <Switch
                                checked={config.homeContent.about.visible}
                                onCheckedChange={(v) => updateAbout({ visible: v })}
                            />
                        </div>
                        {config.homeContent.about.visible && (
                            <>
                                <div className="space-y-2">
                                    <Label className="text-sm">Titre</Label>
                                    <Input
                                        value={config.homeContent.about.title}
                                        onChange={(e) => updateAbout({ title: e.target.value })}
                                        placeholder="Notre Histoire"
                                        className="h-10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm">Texte</Label>
                                    <Textarea
                                        value={config.homeContent.about.text}
                                        onChange={(e) => updateAbout({ text: e.target.value })}
                                        placeholder="Décrivez votre boutique..."
                                        rows={4}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm">Image</Label>
                                    <ImageUpload
                                        value={config.homeContent.about.imageUrl}
                                        onChange={(url) => updateAbout({ imageUrl: url })}
                                        folder="about"
                                        label="Télécharger"
                                        shape="wide"
                                        size="md"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm">Position de l'image</Label>
                                    <Select
                                        value={config.homeContent.about.imagePosition}
                                        onValueChange={(v) => updateAbout({ imagePosition: v as "left" | "right" })}
                                    >
                                        <SelectTrigger className="h-10">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="left">← Gauche</SelectItem>
                                            <SelectItem value="right">→ Droite</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </>
                        )}
                    </AccordionContent>
                </AccordionItem>

                {/* Footer Section */}
                <AccordionItem value="footer" className="border rounded-lg px-3">
                    <AccordionTrigger className="hover:no-underline py-3">
                        <div className="flex items-center gap-2">
                            <Footprints className="h-4 w-4 text-slate-500" />
                            <span className="font-medium text-sm">Pied de page</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 space-y-4">
                        <div className="space-y-2">
                            <Label className="text-sm">Texte copyright</Label>
                            <Input
                                value={config.homeContent.footer.text}
                                onChange={(e) => updateFooter({ text: e.target.value })}
                                placeholder="© 2024 Ma Boutique"
                                className="h-10"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label className="text-sm">Afficher réseaux sociaux</Label>
                            <Switch
                                checked={config.homeContent.footer.showSocials}
                                onCheckedChange={(v) => updateFooter({ showSocials: v })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm">Instagram</Label>
                            <Input
                                value={config.homeContent.footer.instagram}
                                onChange={(e) => updateFooter({ instagram: e.target.value })}
                                placeholder="maboutique"
                                className="h-10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm">Facebook</Label>
                            <Input
                                value={config.homeContent.footer.facebook}
                                onChange={(e) => updateFooter({ facebook: e.target.value })}
                                className="h-10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm">TikTok</Label>
                            <Input
                                value={config.homeContent.footer.tiktok}
                                onChange={(e) => updateFooter({ tiktok: e.target.value })}
                                className="h-10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm">WhatsApp</Label>
                            <Input
                                value={config.homeContent.footer.whatsapp}
                                onChange={(e) => updateFooter({ whatsapp: e.target.value })}
                                placeholder="+216..."
                                className="h-10"
                            />
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* SEPARATOR: Pages Section */}
                <div className="pt-4 pb-2 px-1">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pages</h3>
                </div>

                {/* About Page */}
                <AccordionItem value="about-page" className="border rounded-lg px-3">
                    <AccordionTrigger className="hover:no-underline py-3">
                        <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-slate-500" />
                            <span className="font-medium text-sm">Page À propos</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm">Afficher cette page</Label>
                            <Switch
                                checked={config.aboutPageContent?.visible ?? true}
                                onCheckedChange={(checked) => updateAboutPage({ visible: checked })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm">Titre</Label>
                            <Input
                                value={config.aboutPageContent?.title || ""}
                                onChange={(e) => updateAboutPage({ title: e.target.value })}
                                className="h-10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm">Sous-titre</Label>
                            <Input
                                value={config.aboutPageContent?.subtitle || ""}
                                onChange={(e) => updateAboutPage({ subtitle: e.target.value })}
                                className="h-10"
                            />
                        </div>
                        <div className="border-t pt-4 mt-4">
                            <Label className="text-sm font-medium">Section Histoire</Label>
                            <div className="mt-3 space-y-3">
                                <Input
                                    value={config.aboutPageContent?.story?.title || ""}
                                    onChange={(e) => updateAboutPage({ story: { ...config.aboutPageContent.story, title: e.target.value } })}
                                    placeholder="Titre de l'histoire"
                                    className="h-10"
                                />
                                <Textarea
                                    value={config.aboutPageContent?.story?.text || ""}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateAboutPage({ story: { ...config.aboutPageContent.story, text: e.target.value } })}
                                    placeholder="Racontez votre histoire..."
                                    className="min-h-[100px]"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between border-t pt-4">
                            <Label className="text-sm">Afficher la section Valeurs</Label>
                            <Switch
                                checked={config.aboutPageContent?.values?.visible ?? true}
                                onCheckedChange={(checked) => updateAboutPage({ values: { ...config.aboutPageContent.values, visible: checked } })}
                            />
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Contact Page */}
                <AccordionItem value="contact-page" className="border rounded-lg px-3">
                    <AccordionTrigger className="hover:no-underline py-3">
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-slate-500" />
                            <span className="font-medium text-sm">Page Contact</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm">Afficher cette page</Label>
                            <Switch
                                checked={config.contactPageContent?.visible ?? true}
                                onCheckedChange={(checked) => updateContactPage({ visible: checked })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm">Titre</Label>
                            <Input
                                value={config.contactPageContent?.title || ""}
                                onChange={(e) => updateContactPage({ title: e.target.value })}
                                className="h-10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm">Sous-titre</Label>
                            <Input
                                value={config.contactPageContent?.subtitle || ""}
                                onChange={(e) => updateContactPage({ subtitle: e.target.value })}
                                className="h-10"
                            />
                        </div>
                        <div className="border-t pt-4 mt-4">
                            <Label className="text-sm font-medium">Coordonnées</Label>
                            <div className="mt-3 space-y-3">
                                <div className="space-y-2">
                                    <Label className="text-xs text-slate-500">Email</Label>
                                    <Input
                                        type="email"
                                        value={config.contactPageContent?.email || ""}
                                        onChange={(e) => updateContactPage({ email: e.target.value })}
                                        placeholder="contact@votreboutique.com"
                                        className="h-10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-slate-500">Téléphone</Label>
                                    <Input
                                        value={config.contactPageContent?.phone || ""}
                                        onChange={(e) => updateContactPage({ phone: e.target.value })}
                                        placeholder="+216 XX XXX XXX"
                                        className="h-10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-slate-500">WhatsApp</Label>
                                    <Input
                                        value={config.contactPageContent?.whatsapp || ""}
                                        onChange={(e) => updateContactPage({ whatsapp: e.target.value })}
                                        placeholder="+216 XX XXX XXX"
                                        className="h-10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-slate-500">Adresse</Label>
                                    <Textarea
                                        value={config.contactPageContent?.address || ""}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateContactPage({ address: e.target.value })}
                                        placeholder="Votre adresse..."
                                        className="min-h-[60px]"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between border-t pt-4">
                            <Label className="text-sm">Formulaire de contact</Label>
                            <Switch
                                checked={config.contactPageContent?.formEnabled ?? true}
                                onCheckedChange={(checked) => updateContactPage({ formEnabled: checked })}
                            />
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* FAQ Page */}
                <AccordionItem value="faq-page" className="border rounded-lg px-3">
                    <AccordionTrigger className="hover:no-underline py-3">
                        <div className="flex items-center gap-2">
                            <HelpCircle className="h-4 w-4 text-slate-500" />
                            <span className="font-medium text-sm">Page FAQ</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm">Afficher cette page</Label>
                            <Switch
                                checked={config.faqPageContent?.visible ?? true}
                                onCheckedChange={(checked) => updateFAQPage({ visible: checked })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm">Titre</Label>
                            <Input
                                value={config.faqPageContent?.title || ""}
                                onChange={(e) => updateFAQPage({ title: e.target.value })}
                                className="h-10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm">Sous-titre</Label>
                            <Input
                                value={config.faqPageContent?.subtitle || ""}
                                onChange={(e) => updateFAQPage({ subtitle: e.target.value })}
                                className="h-10"
                            />
                        </div>
                        <div className="border-t pt-4 mt-4">
                            <div className="flex items-center justify-between mb-3">
                                <Label className="text-sm font-medium">Questions / Réponses</Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addFAQItem}
                                    className="h-8"
                                >
                                    <Plus className="h-3 w-3 mr-1" /> Ajouter
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {(config.faqPageContent?.items || []).map((item, index) => (
                                    <div key={item.id} className="p-3 bg-slate-50 rounded-lg space-y-2">
                                        <div className="flex items-start justify-between gap-2">
                                            <span className="text-xs font-medium text-slate-400">Q{index + 1}</span>
                                            <button
                                                type="button"
                                                onClick={() => deleteFAQItem(item.id)}
                                                className="text-red-500 hover:text-red-700 p-1"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </button>
                                        </div>
                                        <Input
                                            value={item.question}
                                            onChange={(e) => updateFAQItem(item.id, { question: e.target.value })}
                                            placeholder="Question"
                                            className="h-9 text-sm"
                                        />
                                        <Textarea
                                            value={item.answer}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateFAQItem(item.id, { answer: e.target.value })}
                                            placeholder="Réponse"
                                            className="min-h-[60px] text-sm"
                                        />
                                    </div>
                                ))}
                                {(config.faqPageContent?.items || []).length === 0 && (
                                    <p className="text-sm text-slate-400 text-center py-4">
                                        Aucune question. Cliquez sur &quot;Ajouter&quot; pour commencer.
                                    </p>
                                )}
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* SEPARATOR: Marketing & Widgets */}
                <div className="pt-4 pb-2 px-1">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Marketing</h3>
                </div>

                {/* Floating WhatsApp */}
                <AccordionItem value="floating-whatsapp" className="border rounded-lg px-3">
                    <AccordionTrigger className="hover:no-underline py-3">
                        <div className="flex items-center gap-2">
                            <MessageCircle className="h-4 w-4 text-slate-500" />
                            <span className="font-medium text-sm">Bouton WhatsApp Flottant</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm">Activer le bouton</Label>
                            <Switch
                                checked={config.floatingWhatsApp?.enabled ?? false}
                                onCheckedChange={(checked) => updateFloatingWhatsApp({ enabled: checked })}
                            />
                        </div>
                        {config.floatingWhatsApp?.enabled && (
                            <>
                                <div className="space-y-2">
                                    <Label className="text-sm">Numéro WhatsApp</Label>
                                    <Input
                                        value={config.floatingWhatsApp?.phoneNumber || ""}
                                        onChange={(e) => updateFloatingWhatsApp({ phoneNumber: e.target.value })}
                                        placeholder="+216 XX XXX XXX"
                                        className="h-10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm">Message pré-rempli</Label>
                                    <Input
                                        value={config.floatingWhatsApp?.message || ""}
                                        onChange={(e) => updateFloatingWhatsApp({ message: e.target.value })}
                                        placeholder="Bonjour, j'ai une question..."
                                        className="h-10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm">Position</Label>
                                    <Select
                                        value={config.floatingWhatsApp?.position || "right"}
                                        onValueChange={(v) => updateFloatingWhatsApp({ position: v as "left" | "right" })}
                                    >
                                        <SelectTrigger className="h-10">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="right">Droite</SelectItem>
                                            <SelectItem value="left">Gauche</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </>
                        )}
                    </AccordionContent>
                </AccordionItem>

                {/* Promo Popup - Now managed from /dashboard/promos */}
                <AccordionItem value="promo-popup" className="border rounded-lg px-3">
                    <AccordionTrigger className="hover:no-underline py-3">
                        <div className="flex items-center gap-2">
                            <Gift className="h-4 w-4 text-slate-500" />
                            <span className="font-medium text-sm">Promotions</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                        <div className="p-4 bg-slate-50 rounded-xl text-center">
                            <Gift className="h-8 w-8 text-rose-400 mx-auto mb-2" />
                            <p className="text-sm text-slate-600 mb-3">
                                Gérez vos promotions et popups depuis la page dédiée
                            </p>
                            <a
                                href="/dashboard/promos"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                <Gift className="h-4 w-4" />
                                Gérer les promotions
                            </a>
                        </div>
                        <p className="text-xs text-slate-400 text-center">
                            Créez des promos globales, par catégorie ou par produit avec option popup
                        </p>
                    </AccordionContent>
                </AccordionItem>

                {/* SEPARATOR: SEO */}
                <div className="pt-4 pb-2 px-1">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Référencement</h3>
                </div>

                {/* SEO Section */}
                <AccordionItem value="seo" className="border rounded-lg px-3">
                    <AccordionTrigger className="hover:no-underline py-3">
                        <div className="flex items-center gap-2">
                            <Search className="h-4 w-4 text-slate-500" />
                            <span className="font-medium text-sm">SEO & Référencement</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                        <p className="text-xs text-slate-400 mb-4">
                            Optimisez votre boutique pour les moteurs de recherche
                        </p>

                        <div className="space-y-2">
                            <Label className="text-sm">Titre du site</Label>
                            <Input
                                value={config.seo?.title || ""}
                                onChange={(e) => updateSEO({ title: e.target.value })}
                                placeholder="Ma Boutique - Mode Tunisienne"
                                className="h-10"
                            />
                            <p className="text-xs text-slate-400">Affiché dans l'onglet du navigateur (60 caractères max)</p>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm">Description</Label>
                            <Textarea
                                value={config.seo?.description || ""}
                                onChange={(e) => updateSEO({ description: e.target.value })}
                                placeholder="Découvrez notre collection de vêtements tendance..."
                                rows={3}
                            />
                            <p className="text-xs text-slate-400">Affichée dans les résultats Google (160 caractères max)</p>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm">Mots-clés</Label>
                            <Input
                                value={config.seo?.keywords || ""}
                                onChange={(e) => updateSEO({ keywords: e.target.value })}
                                placeholder="mode, vêtements, tunisie, boutique"
                                className="h-10"
                            />
                            <p className="text-xs text-slate-400">Séparés par des virgules</p>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm">Image de partage (OG Image)</Label>
                            <ImageUpload
                                value={config.seo?.ogImage || ""}
                                onChange={(url) => updateSEO({ ogImage: url })}
                                folder="seo"
                            />
                            <p className="text-xs text-slate-400">Image affichée lors du partage sur les réseaux sociaux (1200x630 recommandé)</p>
                        </div>
                    </AccordionContent>
                </AccordionItem>

            </Accordion>
        </div>
    );
}
