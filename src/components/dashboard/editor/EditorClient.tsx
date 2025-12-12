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
} from "lucide-react";
import type { Profile, Product, Page, ThemeConfig, ElementStyleOverride } from "@/types";
import { DesignPanel } from "./DesignPanel";
import { ContentPanel } from "./ContentPanel";
import { UpgradeModal } from "./UpgradeModal";
import { TemplateMinimal, TemplateLuxe, TemplateStreet } from "@/components/store/templates";
import { isTemplatePremium, getTemplateConfig } from "@/lib/templates";
import { useEditorState } from "@/hooks/useEditorState";
import { VisualEditorLayer, EditorWrapper } from "@/components/editor";
import { PresetManager } from "@/components/editor/PresetManager";

interface EditorClientProps {
    seller: Profile;
    themeConfig: ThemeConfig;
    products: Product[];
    pages: Page[];
}

type EditorTab = "design" | "content";

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
    const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("mobile");
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
    const [advancedMode, setAdvancedMode] = useState(true);

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

    // Render the correct template based on templateId
    const renderPreview = () => {
        const props = {
            config,
            products,
            sellerId: seller.id,
            storeName: seller.store_name,
            pages,
            // Visual Editor V2 props
            editor,
        };

        const template = (() => {
            switch (config.templateId) {
                case "luxe":
                    return <TemplateLuxe {...props} />;
                case "street":
                    return <TemplateStreet {...props} />;
                default:
                    return <TemplateMinimal {...props} />;
            }
        })();

        return (
            <VisualEditorLayer editor={editor}>
                <EditorWrapper editor={editor}>
                    {template}
                </EditorWrapper>
            </VisualEditorLayer>
        );
    };

    return (
        <div className="h-screen flex flex-col bg-slate-100 dark:bg-slate-950">
            {/* Header */}
            <header className="h-14 border-b border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 flex items-center justify-between px-4 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <a
                        href="/dashboard"
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-700"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">Dashboard</span>
                    </a>
                    <span className="text-slate-300 dark:text-slate-700">/</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                        Éditeur
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {/* Preview Mode Toggle */}
                    <div className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                        <button
                            onClick={() => setPreviewMode("mobile")}
                            className={`p-2 rounded-md transition-colors ${previewMode === "mobile"
                                ? "bg-white dark:bg-slate-700 shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            <Smartphone className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setPreviewMode("desktop")}
                            className={`p-2 rounded-md transition-colors ${previewMode === "desktop"
                                ? "bg-white dark:bg-slate-700 shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            <Monitor className="h-4 w-4" />
                        </button>
                    </div>

                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4"
                    >
                        {isSaving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : saved ? (
                            <>
                                <Check className="h-4 w-4 mr-1" />
                                Sauvé
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-1" />
                                Sauvegarder
                            </>
                        )}
                    </Button>
                </div>
            </header>

            {/* Main Content - Split View on Desktop, Full Preview on Mobile */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar - Controls (Hidden on Mobile) */}
                <aside className="hidden md:flex w-80 border-r border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 flex-col flex-shrink-0">
                    {/* Preset Manager */}
                    <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                        <PresetManager
                            customPresets={config.customPresets || []}
                            currentOverrides={editor.overrides}
                            onSavePreset={handleSavePreset}
                            onLoadPreset={handleLoadPreset}
                            onDeletePreset={handleDeletePreset}
                        />
                    </div>
                    {/* Tabs */}
                    <div className="flex border-b border-slate-200 dark:border-slate-800">
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
                    <div className="flex-1 overflow-y-auto">
                        {activeTab === "design" && (
                            <DesignPanel config={config} onUpdateConfig={setConfig} advancedMode={advancedMode} onAdvancedModeChange={setAdvancedMode} />
                        )}
                        {activeTab === "content" && (
                            <ContentPanel config={config} onUpdateConfig={setConfig} />
                        )}
                    </div>
                </aside>

                {/* Right - Live Preview (Full width on mobile) */}
                <main className="flex-1 overflow-hidden bg-slate-200 dark:bg-slate-800 p-2 md:p-4 relative">
                    <div className="h-full flex items-start justify-center">
                        <div
                            className={`bg-white shadow-2xl rounded-lg overflow-y-auto transition-all w-full md:w-auto ${previewMode === "mobile" ? "md:w-[375px]" : "md:w-full md:max-w-[1200px]"
                                }`}
                            style={{ maxHeight: "100%" }}
                        >
                            {/* Google Font */}
                            <link rel="preconnect" href="https://fonts.googleapis.com" />
                            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                            <link
                                href={`https://fonts.googleapis.com/css2?family=${config.global.font.replace(/ /g, "+")}:wght@300;400;500;600;700;900&display=swap`}
                                rel="stylesheet"
                            />
                            {renderPreview()}
                        </div>
                    </div>

                    {/* Mobile FAB - Customize Button */}
                    <button
                        onClick={() => setMobileSheetOpen(true)}
                        className="md:hidden fixed bottom-6 right-6 h-14 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg shadow-emerald-600/30 flex items-center gap-2 z-50 transition-transform active:scale-95"
                    >
                        <Paintbrush className="h-5 w-5" />
                        <span className="font-medium">Personnaliser</span>
                    </button>
                </main>
            </div>

            {/* Mobile Sheet for Editor Controls */}
            <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
                <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl p-0">
                    <SheetHeader className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
                        <SheetTitle className="text-lg font-semibold">Personnaliser</SheetTitle>
                    </SheetHeader>

                    {/* Tabs */}
                    <div className="flex border-b border-slate-200 dark:border-slate-800">
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
                    <div className="flex-1 overflow-y-auto h-[calc(85vh-110px)]">
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
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors border-b-2 ${active
                ? "border-emerald-500 text-emerald-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
        >
            {icon}
            <span className="hidden sm:inline">{label}</span>
        </button>
    );
}
