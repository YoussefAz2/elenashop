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
import type {
    ThemeConfig,
    HeroContent,
    ProductGridContent,
    TestimonialsContent,
    FooterContent,
    HeaderContent,
    AnnouncementContent,
    AboutPageContent,
    ContactPageContent,
    FAQPageContent,
    FloatingWhatsAppConfig,
    SEOConfig,
} from "@/types";
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

const DEFAULT_PRODUCT_GRID: ProductGridContent = {
    title: "Nos Produits",
    showDescription: false,
    showPrice: true,
    columns: 3,
    aspectRatio: "square",
    gap: "medium",
    cardShadow: true,
};

const DEFAULT_TESTIMONIALS: TestimonialsContent = {
    visible: false,
    title: "Ce que disent nos clients",
    subtitle: "Découvrez les avis de nos clients satisfaits",
    items: [],
    layout: "grid",
    showRating: true,
    showAvatar: true,
};

const DEFAULT_FOOTER: FooterContent = {
    text: "© 2024 Ma Boutique. Tous droits réservés.",
    showSocials: false,
    instagram: "",
    facebook: "",
    tiktok: "",
    whatsapp: "",
};

export function SidebarSectionEditor({
    activeSection,
    config,
    onUpdateConfig,
    onBack,
}: SidebarSectionEditorProps) {
    const currentSection = SECTIONS.find((s) => s.id === activeSection);

    // Update helpers
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

    const updateTestimonials = (updates: Partial<TestimonialsContent>) => {
        onUpdateConfig({
            ...config,
            homeContent: {
                ...config.homeContent,
                testimonials: { ...config.homeContent.testimonials, ...updates },
            },
        });
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

    // Marketing updaters
    const updateFloatingWhatsApp = (updates: Partial<FloatingWhatsAppConfig>) => {
        onUpdateConfig({
            ...config,
            floatingWhatsApp: { ...config.floatingWhatsApp, ...updates },
        });
    };

    // SEO updater
    const updateSEO = (updates: Partial<SEOConfig>) => {
        onUpdateConfig({
            ...config,
            seo: { ...config.seo, ...updates },
        });
    };

    // Reset functions
    const resetHero = () => updateHero(DEFAULT_HERO);
    const resetProductGrid = () => updateProductGrid(DEFAULT_PRODUCT_GRID);
    const resetTestimonials = () => updateTestimonials(DEFAULT_TESTIMONIALS);
    const resetFooter = () => updateFooter(DEFAULT_FOOTER);

    // Get reset function for current section
    const getResetFunction = () => {
        switch (activeSection) {
            case "hero": return resetHero;
            case "products": return resetProductGrid;
            case "testimonials": return resetTestimonials;
            case "footer": return resetFooter;
            default: return null;
        }
    };

    const resetFn = getResetFunction();

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
                {resetFn && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetFn}
                        className="text-slate-400 hover:text-slate-600"
                    >
                        <RotateCcw className="h-3.5 w-3.5 mr-1" />
                        Réinitialiser
                    </Button>
                )}
            </div>

            {/* Section Content - Scrollable */}
            <div className="flex-1 overflow-y-auto">
                {/* ======================== HEADER ======================== */}
                {activeSection === "header" && (
                    <div className="space-y-4">
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
                        <div className="space-y-2 border-t pt-4 mt-2">
                            <Label className="text-sm">Logo de la boutique</Label>
                            <ImageUpload
                                value={config.homeContent.header.logoUrl || ""}
                                onChange={(url) => updateHeader({ logoUrl: url })}
                                folder="logos"
                            />
                        </div>
                    </div>
                )}

                {/* ======================== ANNOUNCEMENT ======================== */}
                {activeSection === "announcement" && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm">Activer le bandeau</Label>
                            <Switch
                                checked={config.homeContent.announcement.enabled}
                                onCheckedChange={(v) => updateAnnouncement({ enabled: v })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm">Texte d'annonce</Label>
                            <Textarea
                                value={config.homeContent.announcement.text}
                                onChange={(e) => updateAnnouncement({ text: e.target.value })}
                                placeholder="🎉 Livraison gratuite dès 50 DT !"
                                className="min-h-[60px] resize-none"
                            />
                        </div>
                    </div>
                )}

                {/* ======================== HERO ======================== */}
                {activeSection === "hero" && (
                    <Tabs defaultValue="content" className="flex-1">
                        <TabsList className="grid w-full grid-cols-3 mb-4">
                            <TabsTrigger value="content" className="text-xs">✏️ Contenu</TabsTrigger>
                            <TabsTrigger value="style" className="text-xs">🎨 Style</TabsTrigger>
                            <TabsTrigger value="settings" className="text-xs">⚙️ Réglages</TabsTrigger>
                        </TabsList>

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
                                <Label className="text-sm">Image de fond</Label>
                                <ImageUpload
                                    value={config.homeContent.hero.imageUrl || ""}
                                    onChange={(url) => updateHero({ imageUrl: url })}
                                    folder="hero"
                                />
                            </div>
                        </TabsContent>

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
                                </>
                            )}
                            {!config.homeContent.hero.imageUrl && (
                                <p className="text-sm text-slate-400 text-center py-8">
                                    Ajoutez une image de fond pour accéder aux options de style.
                                </p>
                            )}
                        </TabsContent>

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

                {/* ======================== PRODUCTS ======================== */}
                {activeSection === "products" && (
                    <Tabs defaultValue="content" className="flex-1">
                        <TabsList className="grid w-full grid-cols-3 mb-4">
                            <TabsTrigger value="content" className="text-xs">✏️ Contenu</TabsTrigger>
                            <TabsTrigger value="style" className="text-xs">🎨 Style</TabsTrigger>
                            <TabsTrigger value="settings" className="text-xs">⚙️ Réglages</TabsTrigger>
                        </TabsList>

                        <TabsContent value="content" className="space-y-4 mt-0">
                            <div className="space-y-2">
                                <Label className="text-sm">Titre de la section</Label>
                                <Textarea
                                    value={config.homeContent.productGrid.title}
                                    onChange={(e) => updateProductGrid({ title: e.target.value })}
                                    placeholder="Nos Produits"
                                    className="min-h-[60px] resize-none"
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="style" className="space-y-4 mt-0">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <Label className="text-sm">Nombre de colonnes</Label>
                                    <span className="text-xs text-slate-500">
                                        {config.homeContent.productGrid.columns}
                                    </span>
                                </div>
                                <Slider
                                    value={[config.homeContent.productGrid.columns]}
                                    onValueChange={([v]) => updateProductGrid({ columns: v as 2 | 3 | 4 })}
                                    min={2}
                                    max={4}
                                    step={1}
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="settings" className="space-y-4 mt-0">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm">Afficher les prix</Label>
                                <Switch
                                    checked={config.homeContent.productGrid.showPrice}
                                    onCheckedChange={(v) => updateProductGrid({ showPrice: v })}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label className="text-sm">Afficher les descriptions</Label>
                                <Switch
                                    checked={config.homeContent.productGrid.showDescription}
                                    onCheckedChange={(v) => updateProductGrid({ showDescription: v })}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label className="text-sm">Ombre sur les cartes</Label>
                                <Switch
                                    checked={config.homeContent.productGrid.cardShadow}
                                    onCheckedChange={(v) => updateProductGrid({ cardShadow: v })}
                                />
                            </div>
                        </TabsContent>
                    </Tabs>
                )}

                {/* ======================== TESTIMONIALS ======================== */}
                {activeSection === "testimonials" && (
                    <Tabs defaultValue="content" className="flex-1">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="content" className="text-xs">✏️ Contenu</TabsTrigger>
                            <TabsTrigger value="settings" className="text-xs">⚙️ Réglages</TabsTrigger>
                        </TabsList>

                        <TabsContent value="content" className="space-y-4 mt-0">
                            <div className="space-y-2">
                                <Label className="text-sm">Titre de la section</Label>
                                <Textarea
                                    value={config.homeContent.testimonials?.title || "Ce que nos clients disent"}
                                    onChange={(e) => updateTestimonials({ title: e.target.value })}
                                    placeholder="Ce que nos clients disent"
                                    className="min-h-[60px] resize-none"
                                />
                            </div>
                            <p className="text-xs text-slate-400">
                                💡 Les témoignages peuvent être ajoutés depuis le panneau dédié.
                            </p>
                        </TabsContent>

                        <TabsContent value="settings" className="space-y-4 mt-0">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm">Afficher les témoignages</Label>
                                <Switch
                                    checked={config.homeContent.testimonials?.visible ?? true}
                                    onCheckedChange={(v) => updateTestimonials({ visible: v })}
                                />
                            </div>
                        </TabsContent>
                    </Tabs>
                )}

                {/* ======================== FOOTER ======================== */}
                {activeSection === "footer" && (
                    <Tabs defaultValue="content" className="flex-1">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="content" className="text-xs">✏️ Contenu</TabsTrigger>
                            <TabsTrigger value="settings" className="text-xs">⚙️ Réglages</TabsTrigger>
                        </TabsList>

                        <TabsContent value="content" className="space-y-4 mt-0">
                            <div className="space-y-2">
                                <Label className="text-sm">Texte du footer</Label>
                                <Textarea
                                    value={config.homeContent.footer.text}
                                    onChange={(e) => updateFooter({ text: e.target.value })}
                                    placeholder="© 2024 Ma Boutique. Tous droits réservés."
                                    className="min-h-[60px] resize-none"
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="settings" className="space-y-4 mt-0">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm">Afficher les réseaux sociaux</Label>
                                <Switch
                                    checked={config.homeContent.footer.showSocials}
                                    onCheckedChange={(v) => updateFooter({ showSocials: v })}
                                />
                            </div>
                        </TabsContent>
                    </Tabs>
                )}

                {/* ======================== ABOUT PAGE ======================== */}
                {activeSection === "about-page" && (
                    <Tabs defaultValue="content" className="flex-1">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="content" className="text-xs">✏️ Contenu</TabsTrigger>
                            <TabsTrigger value="settings" className="text-xs">⚙️ Réglages</TabsTrigger>
                        </TabsList>

                        <TabsContent value="content" className="space-y-4 mt-0">
                            <div className="space-y-2">
                                <Label className="text-sm">Titre de la page</Label>
                                <Input
                                    value={config.aboutPageContent.title}
                                    onChange={(e) => updateAboutPage({ title: e.target.value })}
                                    placeholder="Notre Histoire"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm">Sous-titre</Label>
                                <Input
                                    value={config.aboutPageContent.subtitle}
                                    onChange={(e) => updateAboutPage({ subtitle: e.target.value })}
                                    placeholder="Découvrez qui nous sommes"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm">Texte de présentation</Label>
                                <Textarea
                                    value={config.aboutPageContent.story?.text || ""}
                                    onChange={(e) => updateAboutPage({ story: { ...config.aboutPageContent.story, text: e.target.value } })}
                                    placeholder="Racontez votre histoire..."
                                    className="min-h-[120px] resize-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm">Image</Label>
                                <ImageUpload
                                    value={config.aboutPageContent.story?.imageUrl || ""}
                                    onChange={(url) => updateAboutPage({ story: { ...config.aboutPageContent.story, imageUrl: url } })}
                                    folder="about"
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="settings" className="space-y-4 mt-0">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm">Afficher la page</Label>
                                <Switch
                                    checked={config.aboutPageContent.visible}
                                    onCheckedChange={(v) => updateAboutPage({ visible: v })}
                                />
                            </div>
                        </TabsContent>
                    </Tabs>
                )}

                {/* ======================== CONTACT PAGE ======================== */}
                {activeSection === "contact-page" && (
                    <Tabs defaultValue="content" className="flex-1">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="content" className="text-xs">✏️ Contenu</TabsTrigger>
                            <TabsTrigger value="settings" className="text-xs">⚙️ Réglages</TabsTrigger>
                        </TabsList>

                        <TabsContent value="content" className="space-y-4 mt-0">
                            <div className="space-y-2">
                                <Label className="text-sm">Titre</Label>
                                <Input
                                    value={config.contactPageContent.title}
                                    onChange={(e) => updateContactPage({ title: e.target.value })}
                                    placeholder="Contactez-nous"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm">Email</Label>
                                <Input
                                    type="email"
                                    value={config.contactPageContent.email}
                                    onChange={(e) => updateContactPage({ email: e.target.value })}
                                    placeholder="contact@boutique.tn"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm">Téléphone</Label>
                                <Input
                                    value={config.contactPageContent.phone}
                                    onChange={(e) => updateContactPage({ phone: e.target.value })}
                                    placeholder="+216 XX XXX XXX"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm">WhatsApp</Label>
                                <Input
                                    value={config.contactPageContent.whatsapp}
                                    onChange={(e) => updateContactPage({ whatsapp: e.target.value })}
                                    placeholder="+216 XX XXX XXX"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm">Adresse</Label>
                                <Textarea
                                    value={config.contactPageContent.address}
                                    onChange={(e) => updateContactPage({ address: e.target.value })}
                                    placeholder="123 Rue Example, Tunis"
                                    className="min-h-[60px] resize-none"
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="settings" className="space-y-4 mt-0">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm">Afficher la page</Label>
                                <Switch
                                    checked={config.contactPageContent.visible}
                                    onCheckedChange={(v) => updateContactPage({ visible: v })}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label className="text-sm">Formulaire de contact</Label>
                                <Switch
                                    checked={config.contactPageContent.formEnabled}
                                    onCheckedChange={(v) => updateContactPage({ formEnabled: v })}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label className="text-sm">Afficher la carte</Label>
                                <Switch
                                    checked={config.contactPageContent.showMap}
                                    onCheckedChange={(v) => updateContactPage({ showMap: v })}
                                />
                            </div>
                        </TabsContent>
                    </Tabs>
                )}

                {/* ======================== FAQ PAGE ======================== */}
                {activeSection === "faq-page" && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm">Afficher la page FAQ</Label>
                            <Switch
                                checked={config.faqPageContent.visible}
                                onCheckedChange={(v) => updateFAQPage({ visible: v })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm">Titre</Label>
                            <Input
                                value={config.faqPageContent.title}
                                onChange={(e) => updateFAQPage({ title: e.target.value })}
                                placeholder="Questions Fréquentes"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm">Sous-titre</Label>
                            <Input
                                value={config.faqPageContent.subtitle}
                                onChange={(e) => updateFAQPage({ subtitle: e.target.value })}
                                placeholder="Trouvez les réponses à vos questions"
                            />
                        </div>
                        <p className="text-xs text-slate-400">
                            💡 Les questions/réponses peuvent être gérées depuis un panneau dédié.
                        </p>
                    </div>
                )}

                {/* ======================== WHATSAPP (Marketing) ======================== */}
                {activeSection === "whatsapp" && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm">Activer le bouton WhatsApp</Label>
                            <Switch
                                checked={config.floatingWhatsApp.enabled}
                                onCheckedChange={(v) => updateFloatingWhatsApp({ enabled: v })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm">Numéro WhatsApp</Label>
                            <Input
                                value={config.floatingWhatsApp.phoneNumber}
                                onChange={(e) => updateFloatingWhatsApp({ phoneNumber: e.target.value })}
                                placeholder="+216 XX XXX XXX"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm">Message pré-rempli</Label>
                            <Textarea
                                value={config.floatingWhatsApp.message}
                                onChange={(e) => updateFloatingWhatsApp({ message: e.target.value })}
                                placeholder="Bonjour ! J'ai une question..."
                                className="min-h-[80px] resize-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm">Position du bouton</Label>
                            <Select
                                value={config.floatingWhatsApp.position}
                                onValueChange={(v) => updateFloatingWhatsApp({ position: v as "left" | "right" })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="left">← Gauche</SelectItem>
                                    <SelectItem value="right">Droite →</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}

                {/* ======================== SEO ======================== */}
                {activeSection === "seo" && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-sm">Méta Titre</Label>
                            <Input
                                value={config.seo?.title || ""}
                                onChange={(e) => updateSEO({ title: e.target.value })}
                                placeholder="Ma Boutique - Vente en ligne"
                            />
                            <p className="text-xs text-slate-400">Apparaît dans l'onglet du navigateur</p>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm">Méta Description</Label>
                            <Textarea
                                value={config.seo?.description || ""}
                                onChange={(e) => updateSEO({ description: e.target.value })}
                                placeholder="Découvrez notre collection de produits..."
                                className="min-h-[80px] resize-none"
                            />
                            <p className="text-xs text-slate-400">Apparaît dans les résultats Google</p>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm">Mots-clés</Label>
                            <Input
                                value={config.seo?.keywords || ""}
                                onChange={(e) => updateSEO({ keywords: e.target.value })}
                                placeholder="boutique, tunisie, vêtements"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm">Image de partage (OG Image)</Label>
                            <ImageUpload
                                value={config.seo?.ogImage || ""}
                                onChange={(url) => updateSEO({ ogImage: url })}
                                folder="seo"
                            />
                            <p className="text-xs text-slate-400">Image affichée lors du partage sur les réseaux sociaux</p>
                        </div>
                    </div>
                )}

                {/* ======================== PROMOS (placeholder) ======================== */}
                {activeSection === "promos" && (
                    <div className="flex-1 flex items-center justify-center py-12">
                        <p className="text-sm text-slate-400 text-center">
                            Les promotions sont gérées depuis le tableau de bord Promos.
                        </p>
                    </div>
                )}

                {/* ======================== ABOUT SECTION (home) ======================== */}
                {activeSection === "about" && (
                    <div className="flex-1 flex items-center justify-center py-12">
                        <p className="text-sm text-slate-400 text-center">
                            Section "À propos" de l'accueil - à implémenter.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
