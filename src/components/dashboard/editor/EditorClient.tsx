"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    Save,
    Loader2,
    Check,
    ArrowLeft,
    Palette,
    Type,
    Smartphone,
    Monitor,
    Paintbrush,
    Wand2,
    Eye,
    Home,
    FileText,
    Phone,
    HelpCircle,
    ChevronDown,
    RefreshCw,
} from "lucide-react";
import type { Store, Product, Page, ThemeConfig, ElementStyleOverride } from "@/types";
import { DesignPanel } from "./DesignPanel";
import { ContentPanel } from "./ContentPanel";
import { UpgradeModal } from "./UpgradeModal";
import { TemplateMinimal, TemplateLuxe, TemplateStreet } from "@/components/store/templates";
import { AboutPage } from "@/components/store/pages/AboutPage";
import { ContactPage } from "@/components/store/pages/ContactPage";
import { FAQPage } from "@/components/store/pages/FAQPage";
import { isTemplatePremium, getTemplateConfig } from "@/lib/templates";
import { useEditorState } from "@/hooks/useEditorState";
import { VisualEditorLayer, EditorWrapper } from "@/components/editor";
import { PresetManager } from "@/components/editor/PresetManager";
import { ColorPicker } from "./ColorPicker";

interface EditorClientProps {
    seller: Store;
    themeConfig: ThemeConfig;
    products: Product[];
    pages: Page[];
}

type EditorTab = "design" | "content";
type EditorPage = "home" | "about" | "contact" | "faq";

export function EditorClient({
    seller,
    themeConfig: initialConfig,
    products,
    pages,
}: EditorClientProps) {
    // Deep merge with defaults to handle legacy/partial configs
    const templateId = initialConfig?.templateId || "minimal";

    const mergedConfig: ThemeConfig = {
        templateId,
        global: {
            colors: {
                primary: initialConfig?.global?.colors?.primary || "#18181b",
                secondary: initialConfig?.global?.colors?.secondary || "#71717a",
                background: initialConfig?.global?.colors?.background || "#ffffff",
                text: initialConfig?.global?.colors?.text || "#18181b",
            },
            font: initialConfig?.global?.font || "Inter",
            headingFont: initialConfig?.global?.headingFont || "Inter",
            borderRadius: initialConfig?.global?.borderRadius || "0.75rem",
            // Per-section styles
            hero: {
                backgroundColor: initialConfig?.global?.hero?.backgroundColor || "#f4f4f5",
                textColor: initialConfig?.global?.hero?.textColor || "#18181b",
                buttonBg: initialConfig?.global?.hero?.buttonBg || "#18181b",
                buttonText: initialConfig?.global?.hero?.buttonText || "#ffffff",
                height: initialConfig?.global?.hero?.height || "normal",
                contentAlign: initialConfig?.global?.hero?.contentAlign || "center",
                imageFilter: initialConfig?.global?.hero?.imageFilter || "none",
            },
            cards: {
                backgroundColor: initialConfig?.global?.cards?.backgroundColor || "#ffffff",
                textColor: initialConfig?.global?.cards?.textColor || "#18181b",
                priceColor: initialConfig?.global?.cards?.priceColor || "#059669",
                borderColor: initialConfig?.global?.cards?.borderColor || "#e5e7eb",
                hoverEffect: initialConfig?.global?.cards?.hoverEffect || "lift",
            },
            buttons: {
                backgroundColor: initialConfig?.global?.buttons?.backgroundColor || "#18181b",
                textColor: initialConfig?.global?.buttons?.textColor || "#ffffff",
                hoverBg: initialConfig?.global?.buttons?.hoverBg || "#27272a",
                style: initialConfig?.global?.buttons?.style || "solid",
                size: initialConfig?.global?.buttons?.size || "medium",
            },
            footer: {
                backgroundColor: initialConfig?.global?.footer?.backgroundColor || "#fafafa",
                textColor: initialConfig?.global?.footer?.textColor || "#71717a",
                accentColor: initialConfig?.global?.footer?.accentColor || "#18181b",
            },
            typography: {
                headingSize: initialConfig?.global?.typography?.headingSize || "large",
                bodySize: initialConfig?.global?.typography?.bodySize || "medium",
                headingTransform: initialConfig?.global?.typography?.headingTransform || "none",
            },
            spacing: {
                sectionPadding: initialConfig?.global?.spacing?.sectionPadding || "normal",
                showSectionDividers: initialConfig?.global?.spacing?.showSectionDividers ?? false,
            },
            animations: {
                enableAnimations: initialConfig?.global?.animations?.enableAnimations ?? true,
                animationSpeed: initialConfig?.global?.animations?.animationSpeed || "normal",
                hoverTransition: initialConfig?.global?.animations?.hoverTransition || "scale",
            },
        },
        homeContent: {
            header: {
                visible: initialConfig?.homeContent?.header?.visible ?? true,
                sticky: initialConfig?.homeContent?.header?.sticky ?? true,
                showStoreName: initialConfig?.homeContent?.header?.showStoreName ?? true,
                showProductCount: initialConfig?.homeContent?.header?.showProductCount ?? true,
                logoUrl: initialConfig?.homeContent?.header?.logoUrl || "",
                logoSize: initialConfig?.homeContent?.header?.logoSize ?? 40,
            },
            announcement: {
                enabled: initialConfig?.homeContent?.announcement?.enabled ?? false,
                sticky: initialConfig?.homeContent?.announcement?.sticky ?? false,
                text: initialConfig?.homeContent?.announcement?.text || "🚚 Livraison gratuite à partir de 100 TND !",
                backgroundColor: initialConfig?.homeContent?.announcement?.backgroundColor || "#18181b",
                textColor: initialConfig?.homeContent?.announcement?.textColor || "#ffffff",
                link: initialConfig?.homeContent?.announcement?.link || "",
            },
            hero: {
                visible: initialConfig?.homeContent?.hero?.visible ?? true,
                title: initialConfig?.homeContent?.hero?.title || "Bienvenue",
                subtitle: initialConfig?.homeContent?.hero?.subtitle || "",
                buttonText: initialConfig?.homeContent?.hero?.buttonText || "Voir les produits",
                buttonUrl: initialConfig?.homeContent?.hero?.buttonUrl || "#products",
                imageUrl: initialConfig?.homeContent?.hero?.imageUrl || "",
                overlayOpacity: initialConfig?.homeContent?.hero?.overlayOpacity ?? 0.5,
                gradientEnabled: initialConfig?.homeContent?.hero?.gradientEnabled ?? false,
                gradientDirection: initialConfig?.homeContent?.hero?.gradientDirection || "left",
            },
            productGrid: {
                title: initialConfig?.homeContent?.productGrid?.title || "Nos Produits",
                showDescription: initialConfig?.homeContent?.productGrid?.showDescription ?? false,
                showPrice: initialConfig?.homeContent?.productGrid?.showPrice ?? true,
                columns: initialConfig?.homeContent?.productGrid?.columns || 2,
                aspectRatio: initialConfig?.homeContent?.productGrid?.aspectRatio || "square",
                gap: initialConfig?.homeContent?.productGrid?.gap || "medium",
                cardShadow: initialConfig?.homeContent?.productGrid?.cardShadow ?? true,
            },
            testimonials: {
                visible: initialConfig?.homeContent?.testimonials?.visible ?? false,
                title: initialConfig?.homeContent?.testimonials?.title || "Ce que disent nos clients",
                subtitle: initialConfig?.homeContent?.testimonials?.subtitle || "Découvrez les avis de nos clients satisfaits",
                items: initialConfig?.homeContent?.testimonials?.items || [],
                layout: initialConfig?.homeContent?.testimonials?.layout || "grid",
                showRating: initialConfig?.homeContent?.testimonials?.showRating ?? true,
                showAvatar: initialConfig?.homeContent?.testimonials?.showAvatar ?? true,
            },
            about: {
                visible: initialConfig?.homeContent?.about?.visible ?? false,
                title: initialConfig?.homeContent?.about?.title || "Notre Histoire",
                text: initialConfig?.homeContent?.about?.text || "",
                imageUrl: initialConfig?.homeContent?.about?.imageUrl || "",
                imagePosition: initialConfig?.homeContent?.about?.imagePosition || "right",
            },
            footer: {
                text: initialConfig?.homeContent?.footer?.text || "",
                showSocials: initialConfig?.homeContent?.footer?.showSocials ?? true,
                instagram: initialConfig?.homeContent?.footer?.instagram || "",
                facebook: initialConfig?.homeContent?.footer?.facebook || "",
                tiktok: initialConfig?.homeContent?.footer?.tiktok || "",
                whatsapp: initialConfig?.homeContent?.footer?.whatsapp || "",
            },
        },
        aboutPageContent: {
            visible: initialConfig?.aboutPageContent?.visible ?? true,
            title: initialConfig?.aboutPageContent?.title || "Notre Histoire",
            subtitle: initialConfig?.aboutPageContent?.subtitle || "Découvrez qui nous sommes",
            story: {
                title: initialConfig?.aboutPageContent?.story?.title || "Comment tout a commencé",
                text: initialConfig?.aboutPageContent?.story?.text || "",
                imageUrl: initialConfig?.aboutPageContent?.story?.imageUrl || "",
            },
            values: {
                visible: initialConfig?.aboutPageContent?.values?.visible ?? true,
                title: initialConfig?.aboutPageContent?.values?.title || "Nos Valeurs",
                items: initialConfig?.aboutPageContent?.values?.items || [],
            },
            team: {
                visible: initialConfig?.aboutPageContent?.team?.visible ?? false,
                title: initialConfig?.aboutPageContent?.team?.title || "Notre Équipe",
                members: initialConfig?.aboutPageContent?.team?.members || [],
            },
        },
        contactPageContent: {
            visible: initialConfig?.contactPageContent?.visible ?? true,
            title: initialConfig?.contactPageContent?.title || "Contactez-nous",
            subtitle: initialConfig?.contactPageContent?.subtitle || "Une question ? Écrivez-nous",
            email: initialConfig?.contactPageContent?.email || "",
            phone: initialConfig?.contactPageContent?.phone || "",
            whatsapp: initialConfig?.contactPageContent?.whatsapp || "",
            address: initialConfig?.contactPageContent?.address || "",
            showMap: initialConfig?.contactPageContent?.showMap ?? false,
            mapUrl: initialConfig?.contactPageContent?.mapUrl || "",
            formEnabled: initialConfig?.contactPageContent?.formEnabled ?? true,
            formTitle: initialConfig?.contactPageContent?.formTitle || "Envoyez-nous un message",
        },
        faqPageContent: {
            visible: initialConfig?.faqPageContent?.visible ?? true,
            title: initialConfig?.faqPageContent?.title || "Questions Fréquentes",
            subtitle: initialConfig?.faqPageContent?.subtitle || "Trouvez rapidement vos réponses",
            items: initialConfig?.faqPageContent?.items || [],
        },
        floatingWhatsApp: {
            enabled: initialConfig?.floatingWhatsApp?.enabled ?? false,
            phoneNumber: initialConfig?.floatingWhatsApp?.phoneNumber || "",
            message: initialConfig?.floatingWhatsApp?.message || "Bonjour ! J'ai une question.",
            position: initialConfig?.floatingWhatsApp?.position || "right",
        },
        promoPopup: {
            enabled: initialConfig?.promoPopup?.enabled ?? false,
            title: initialConfig?.promoPopup?.title || "🎉 Offre Spéciale !",
            message: initialConfig?.promoPopup?.message || "Profitez de -10% sur votre première commande",
            buttonText: initialConfig?.promoPopup?.buttonText || "J'en profite",
            buttonUrl: initialConfig?.promoPopup?.buttonUrl || "#products",
            showOnce: initialConfig?.promoPopup?.showOnce ?? true,
        },
        seo: {
            title: initialConfig?.seo?.title || "",
            description: initialConfig?.seo?.description || "",
            keywords: initialConfig?.seo?.keywords || "",
            ogImage: initialConfig?.seo?.ogImage || "",
        },
    };

    const [config, setConfig] = useState<ThemeConfig>(mergedConfig);
    const [activeTab, setActiveTab] = useState<EditorTab>("design");
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("desktop");
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
    const [advancedMode, setAdvancedMode] = useState(true);
    const [currentPage, setCurrentPage] = useState<EditorPage>("home");
    // Mobile iframe refresh key - increment to force iframe reload
    const [mobilePreviewKey, setMobilePreviewKey] = useState(0);

    // Visual Editor V2 - centralized editor state (fixed with stable refs)
    const handleOverridesChange = useCallback((overrides: Record<string, ElementStyleOverride>) => {
        setConfig(prev => ({ ...prev, elementOverrides: overrides }));
    }, []);
    const editor = useEditorState(config.elementOverrides || {}, handleOverridesChange);

    // Sync advancedMode with editor.isEditing
    useEffect(() => {
        editor.setEditingMode(advancedMode);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [advancedMode]);

    const router = useRouter();
    const supabase = createClient();

    // Listen for messages from mobile preview iframe
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            // Validate message structure
            if (event.data?.type !== "ELENA_EDIT_SECTION") return;

            const { sectionId, sectionType, sectionLabel } = event.data;
            if (!sectionId) return;

            console.log("[Editor] Received edit request for element:", sectionId, sectionType);

            // IMPORTANT: Switch to desktop preview for editing
            // The mobile preview is an iframe and can't share React state
            // Desktop preview is a direct React render where changes apply in real-time
            setPreviewMode("desktop");

            // Small delay to let preview mode switch, then select the element
            setTimeout(() => {
                editor.selectElement({
                    id: sectionId,
                    type: sectionType || "container",
                    label: sectionLabel || sectionId,
                    rect: { top: 200, left: 400, width: 300, height: 100, right: 700, bottom: 300, x: 400, y: 200, toJSON: () => ({}) } as DOMRect,
                });
            }, 100);

            // Switch to Design tab for style editing
            setActiveTab("design");
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [editor]);

    // Check if user is trying to use a premium template while being on free plan
    const isPremiumBlocked = isTemplatePremium(config.templateId) && seller.subscription_status !== "pro";
    const currentTemplateConfig = getTemplateConfig(config.templateId);

    const handleSave = async () => {
        // Check if trying to save with premium template on free plan
        if (isPremiumBlocked) {
            setShowUpgradeModal(true);
            return;
        }

        setIsSaving(true);
        try {
            const { error } = await supabase
                .from("profiles")
                .update({ theme_config: config })
                .eq("id", seller.id);

            if (error) throw error;

            setSaved(true);
            router.refresh();
            setTimeout(() => setSaved(false), 2000);
        } catch (error) {
            console.error("Erreur:", error);
            alert("Erreur lors de la sauvegarde");
        } finally {
            setIsSaving(false);
        }
    };

    // Handle element override updates
    const handleUpdateOverride = (elementId: string, styles: import("@/types").ElementStyleOverride | null) => {
        setConfig(prev => {
            const newOverrides = { ...(prev.elementOverrides || {}) };
            if (styles === null) {
                delete newOverrides[elementId];
            } else {
                newOverrides[elementId] = styles;
            }
            return { ...prev, elementOverrides: newOverrides };
        });
    };

    // ---------- PRESET MANAGEMENT ----------

    const handleSavePreset = useCallback((name: string) => {
        const newPreset = {
            id: crypto.randomUUID(),
            name,
            createdAt: new Date().toISOString(),
            elementOverrides: { ...editor.overrides },
        };
        setConfig(prev => ({
            ...prev,
            customPresets: [...(prev.customPresets || []), newPreset],
        }));
    }, [editor.overrides]);

    const handleLoadPreset = useCallback((presetId: string) => {
        const preset = config.customPresets?.find(p => p.id === presetId);
        if (preset) {
            setConfig(prev => ({
                ...prev,
                elementOverrides: { ...preset.elementOverrides },
            }));
            // Also update the editor state
            Object.entries(preset.elementOverrides).forEach(([id, styles]) => {
                editor.setOverride(id, styles);
            });
        }
    }, [config.customPresets, editor]);

    const handleDeletePreset = useCallback((presetId: string) => {
        setConfig(prev => ({
            ...prev,
            customPresets: (prev.customPresets || []).filter(p => p.id !== presetId),
        }));
    }, []);

    // Render the correct template based on templateId and currentPage
    const renderPreview = () => {
        const homeProps = {
            config,
            products,
            sellerId: seller.id,
            storeName: seller.slug,
            pages,
            // Visual Editor V2 props
            editor,
        };

        const pageProps = {
            config,
            storeName: seller.slug,
            sellerId: seller.id,
            pages,
        };

        // Render different pages based on currentPage
        let content;
        switch (currentPage) {
            case "about":
                content = <AboutPage {...pageProps} />;
                break;
            case "contact":
                content = <ContactPage {...pageProps} />;
                break;
            case "faq":
                content = <FAQPage {...pageProps} />;
                break;
            default:
                // Home page - use the template
                const template = (() => {
                    switch (config.templateId) {
                        case "luxe":
                            return <TemplateLuxe {...homeProps} />;
                        case "street":
                            return <TemplateStreet {...homeProps} />;
                        default:
                            return <TemplateMinimal {...homeProps} />;
                    }
                })();
                content = template;
        }

        return (
            <VisualEditorLayer editor={editor}>
                <EditorWrapper editor={editor}>
                    {content}
                </EditorWrapper>
            </VisualEditorLayer>
        );
    };

    return (
        <div className="h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 font-sans selection:bg-zinc-200">
            {/* Header */}
            <header className="h-16 border-b border-zinc-100 bg-white/80 backdrop-blur-xl dark:bg-zinc-900/80 dark:border-zinc-800 flex items-center justify-between px-6 flex-shrink-0 z-50">
                <div className="flex items-center gap-4">
                    <a
                        href="/dashboard"
                        className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span className="hidden sm:inline font-medium text-sm">Retour</span>
                    </a>
                    <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
                    <span className="font-serif font-bold italic text-xl text-zinc-900 dark:text-zinc-100">
                        Éditeur Visuel
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    {/* Page Switcher */}
                    {(config.aboutPageContent?.visible || config.contactPageContent?.visible || config.faqPageContent?.visible) && (
                        <div className="relative group">
                            <button
                                className="flex items-center gap-2 px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-xl text-sm font-bold text-zinc-600 hover:bg-white hover:shadow-md hover:border-zinc-200 transition-all"
                            >
                                {currentPage === "home" && <><Home className="h-4 w-4" /> <span className="hidden sm:inline">Accueil</span></>}
                                {currentPage === "about" && <><FileText className="h-4 w-4" /> <span className="hidden sm:inline">À propos</span></>}
                                {currentPage === "contact" && <><Phone className="h-4 w-4" /> <span className="hidden sm:inline">Contact</span></>}
                                {currentPage === "faq" && <><HelpCircle className="h-4 w-4" /> <span className="hidden sm:inline">FAQ</span></>}
                                <ChevronDown className="h-3 w-3 text-zinc-400" />
                            </button>
                            <div className="absolute top-full right-0 mt-2 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl shadow-xl shadow-zinc-200/50 p-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 min-w-[160px] transform origin-top-right scale-95 group-hover:scale-100">
                                <button onClick={() => setCurrentPage("home")} className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-left hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-colors ${currentPage === "home" ? "bg-zinc-50 text-zinc-900" : "text-zinc-500"}`}>
                                    <Home className="h-4 w-4" /> Accueil
                                </button>
                                {config.aboutPageContent?.visible && (
                                    <button onClick={() => setCurrentPage("about")} className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-left hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-colors ${currentPage === "about" ? "bg-zinc-50 text-zinc-900" : "text-zinc-500"}`}>
                                        <FileText className="h-4 w-4" /> À propos
                                    </button>
                                )}
                                {config.contactPageContent?.visible && (
                                    <button onClick={() => setCurrentPage("contact")} className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-left hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-colors ${currentPage === "contact" ? "bg-zinc-50 text-zinc-900" : "text-zinc-500"}`}>
                                        <Phone className="h-4 w-4" /> Contact
                                    </button>
                                )}
                                {config.faqPageContent?.visible && (
                                    <button onClick={() => setCurrentPage("faq")} className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-left hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-colors ${currentPage === "faq" ? "bg-zinc-50 text-zinc-900" : "text-zinc-500"}`}>
                                        <HelpCircle className="h-4 w-4" /> FAQ
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="h-8 w-px bg-zinc-100 mx-1" />

                    {/* Preview Mode Toggle */}
                    <div className="hidden md:flex items-center gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200/50">
                        <button
                            onClick={() => setPreviewMode("mobile")}
                            className={`p-2 rounded-lg transition-all ${previewMode === "mobile"
                                ? "bg-white text-zinc-900 shadow-sm"
                                : "text-zinc-400 hover:text-zinc-600"
                                }`}
                        >
                            <Smartphone className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setPreviewMode("desktop")}
                            className={`p-2 rounded-lg transition-all ${previewMode === "desktop"
                                ? "bg-white text-zinc-900 shadow-sm"
                                : "text-zinc-400 hover:text-zinc-600"
                                }`}
                        >
                            <Monitor className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Color Picker Tool */}
                    <ColorPicker />

                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl px-6 h-10 shadow-lg shadow-zinc-900/20 active:scale-95 transition-all font-bold"
                    >
                        {isSaving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : saved ? (
                            <>
                                <Check className="h-4 w-4 mr-2" />
                                Enregistré
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Enregistrer
                            </>
                        )}
                    </Button>
                </div>
            </header>

            {/* Main Content - Split View on Desktop, Full Preview on Mobile */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar - Controls (Hidden on Mobile) */}
                <aside className="hidden md:flex w-80 border-r border-zinc-100 bg-white dark:bg-zinc-900 dark:border-zinc-800 flex-col flex-shrink-0 z-40 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)]">
                    {/* Preset Manager */}
                    <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
                        <PresetManager
                            customPresets={config.customPresets || []}
                            currentOverrides={editor.overrides}
                            onSavePreset={handleSavePreset}
                            onLoadPreset={handleLoadPreset}
                            onDeletePreset={handleDeletePreset}
                        />
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-zinc-100 dark:border-zinc-800 px-4 pt-2 gap-2">
                        <TabButton
                            active={activeTab === "design"}
                            onClick={() => setActiveTab("design")}
                            icon={<Palette className="h-4 w-4" />}
                            label="Design"
                        />
                        <TabButton
                            active={activeTab === "content"}
                            onClick={() => setActiveTab("content")}
                            icon={<Type className="h-4 w-4" />}
                            label="Contenu"
                        />
                    </div>

                    {/* Panel Content */}
                    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-200 scrollbar-track-transparent">
                        {activeTab === "design" && (
                            <DesignPanel config={config} onUpdateConfig={setConfig} advancedMode={advancedMode} onAdvancedModeChange={setAdvancedMode} />
                        )}
                        {activeTab === "content" && (
                            <ContentPanel config={config} onUpdateConfig={setConfig} />
                        )}
                    </div>
                </aside>

                {/* Right - Live Preview (Full width on mobile) */}
                <main className="flex-1 overflow-hidden bg-zinc-50/50 dark:bg-zinc-950 p-4 md:p-8 relative grid place-items-center">
                    <div className="absolute inset-0 bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] [background-size:20px_20px] opacity-50 pointer-events-none" />

                    {/* Mobile Preview Refresh Button */}
                    {previewMode === "mobile" && (
                        <button
                            onClick={() => setMobilePreviewKey(k => k + 1)}
                            className="absolute top-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 bg-white border border-zinc-200 rounded-xl shadow-lg hover:shadow-xl hover:bg-zinc-50 transition-all text-sm font-bold text-zinc-700 group"
                        >
                            <RefreshCw className="h-4 w-4 text-zinc-500 group-hover:rotate-180 transition-transform duration-500" />
                            Actualiser
                        </button>
                    )}

                    <div
                        className={`bg-white shadow-2xl shadow-zinc-200 transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] relative
                            ${previewMode === "mobile"
                                ? "w-[375px] h-[812px] rounded-[3rem] border-[8px] border-zinc-900 ring-4 ring-zinc-900/10 overflow-hidden"
                                : "w-full h-full max-w-[1400px] rounded-xl border border-zinc-200/50 shadow-xl overflow-y-auto scrollbar-hide"
                            }`}
                    >
                        {/* Mobile Notch & UI Elements (Visual Only) */}
                        {previewMode === "mobile" && (
                            <div className="absolute top-0 left-0 right-0 h-6 bg-zinc-900 z-50 flex justify-center">
                                <div className="w-32 h-4 bg-black rounded-b-xl" />
                            </div>
                        )}

                        {previewMode === "mobile" ? (
                            /* Mobile Preview: iframe with real 375px viewport for accurate responsive testing */
                            <div
                                className="bg-white overflow-hidden pt-6"
                                style={{
                                    width: '375px',
                                    height: 'calc(812px - 24px)',
                                }}
                            >
                                <iframe
                                    key={mobilePreviewKey}
                                    src={`/${seller.slug}?preview=mobile`}
                                    className="w-full h-full border-0 bg-white"
                                    title="Aperçu Mobile"
                                    style={{
                                        width: '375px',
                                        height: '100%',
                                    }}
                                />
                            </div>
                        ) : (
                            /* Desktop Preview: Real-time React rendering */
                            <div className="h-full w-full bg-white overflow-y-auto scrollbar-hide">
                                {/* Google Font */}
                                <link rel="preconnect" href="https://fonts.googleapis.com" />
                                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                                <link
                                    href={`https://fonts.googleapis.com/css2?family=${config.global.font.replace(/ /g, "+")}:wght@300;400;500;600;700;900&display=swap`}
                                    rel="stylesheet"
                                />
                                {renderPreview()}
                            </div>
                        )}
                    </div>

                    {/* Mobile FAB - Customize Button */}
                    <button
                        onClick={() => setMobileSheetOpen(true)}
                        className="md:hidden fixed bottom-6 right-6 h-14 px-6 bg-zinc-900 text-white rounded-full shadow-xl shadow-zinc-900/30 flex items-center gap-3 z-50 transition-transform active:scale-95 font-bold"
                    >
                        <Paintbrush className="h-5 w-5" />
                        <span className="font-medium">Éditer</span>
                    </button>
                </main>
            </div>

            {/* Mobile Sheet for Editor Controls */}
            <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
                <SheetContent side="bottom" className="h-[90vh] rounded-t-[2.5rem] p-0 border-zinc-100 shadow-2xl">
                    <SheetHeader className="px-6 py-4 border-b border-zinc-100 bg-white rounded-t-[2.5rem]">
                        <div className="w-12 h-1.5 bg-zinc-100 rounded-full mx-auto mb-4" />
                        <SheetTitle className="text-xl font-serif font-bold italic text-zinc-900">Personnaliser</SheetTitle>
                        {/* Mobile PresetManager */}
                        <PresetManager
                            customPresets={config.customPresets || []}
                            currentOverrides={editor.overrides}
                            onSavePreset={handleSavePreset}
                            onLoadPreset={handleLoadPreset}
                            onDeletePreset={handleDeletePreset}
                        />
                    </SheetHeader>

                    {/* Tabs */}
                    <div className="flex border-b border-zinc-100 px-6 pt-2 gap-2 bg-white">
                        <TabButton
                            active={activeTab === "design"}
                            onClick={() => setActiveTab("design")}
                            icon={<Palette className="h-4 w-4" />}
                            label="Design"
                        />
                        <TabButton
                            active={activeTab === "content"}
                            onClick={() => setActiveTab("content")}
                            icon={<Type className="h-4 w-4" />}
                            label="Contenu"
                        />
                    </div>

                    {/* Panel Content */}
                    <div className="flex-1 overflow-y-auto h-[calc(90vh-180px)] bg-zinc-50/50">
                        {activeTab === "design" && (
                            <DesignPanel config={config} onUpdateConfig={setConfig} advancedMode={advancedMode} onAdvancedModeChange={setAdvancedMode} />
                        )}
                        {activeTab === "content" && (
                            <ContentPanel config={config} onUpdateConfig={setConfig} />
                        )}
                    </div>
                </SheetContent>
            </Sheet>

            {/* Upgrade Modal */}
            <UpgradeModal
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
                templateName={currentTemplateConfig?.name || config.templateId}
                price={currentTemplateConfig?.price || 49}
            />
        </div>
    );
}

function TabButton({
    active,
    onClick,
    icon,
    label,
}: {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
}) {
    return (
        <button
            onClick={onClick}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold transition-all border-b-2 rounded-t-lg ${active
                ? "border-zinc-900 text-zinc-900 bg-zinc-50"
                : "border-transparent text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50/50"
                }`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
}
