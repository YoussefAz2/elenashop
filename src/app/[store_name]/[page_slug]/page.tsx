import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import type { Store, Page, ThemeConfig } from "@/types";
import { DEFAULT_THEME_CONFIG } from "@/types";
import { AboutPage, ContactPage, FAQPage } from "@/components/store/pages";
import { ArrowLeft } from "lucide-react";

interface PageProps {
    params: Promise<{ store_name: string; page_slug: string }>;
}

// Pre-configured page slugs
const PRECONFIGURED_PAGES = ["a-propos", "contact", "faq"];

export default async function StorePage({ params }: PageProps) {
    const { store_name, page_slug } = await params;
    const supabase = await createClient();

    // Fetch store by slug (multi-store architecture)
    const { data: store } = await supabase
        .from("stores")
        .select("*")
        .ilike("slug", store_name)
        .single();

    if (!store) {
        notFound();
    }

    const currentStore = store as Store;

    // Deep merge theme_config with defaults
    const rawConfig: Partial<ThemeConfig> = currentStore.theme_config || {};
    const config: ThemeConfig = {
        ...DEFAULT_THEME_CONFIG,
        ...rawConfig,
        global: {
            ...DEFAULT_THEME_CONFIG.global,
            ...rawConfig.global,
            colors: { ...DEFAULT_THEME_CONFIG.global.colors, ...rawConfig.global?.colors },
            hero: { ...DEFAULT_THEME_CONFIG.global.hero, ...rawConfig.global?.hero },
            cards: { ...DEFAULT_THEME_CONFIG.global.cards, ...rawConfig.global?.cards },
            buttons: { ...DEFAULT_THEME_CONFIG.global.buttons, ...rawConfig.global?.buttons },
            footer: { ...DEFAULT_THEME_CONFIG.global.footer, ...rawConfig.global?.footer },
            typography: { ...DEFAULT_THEME_CONFIG.global.typography, ...rawConfig.global?.typography },
            spacing: { ...DEFAULT_THEME_CONFIG.global.spacing, ...rawConfig.global?.spacing },
            animations: { ...DEFAULT_THEME_CONFIG.global.animations, ...rawConfig.global?.animations },
        },
        homeContent: {
            ...DEFAULT_THEME_CONFIG.homeContent,
            ...rawConfig.homeContent,
            header: { ...DEFAULT_THEME_CONFIG.homeContent.header, ...rawConfig.homeContent?.header },
            announcement: { ...DEFAULT_THEME_CONFIG.homeContent.announcement, ...rawConfig.homeContent?.announcement },
            hero: { ...DEFAULT_THEME_CONFIG.homeContent.hero, ...rawConfig.homeContent?.hero },
            productGrid: { ...DEFAULT_THEME_CONFIG.homeContent.productGrid, ...rawConfig.homeContent?.productGrid },
            about: { ...DEFAULT_THEME_CONFIG.homeContent.about, ...rawConfig.homeContent?.about },
            footer: { ...DEFAULT_THEME_CONFIG.homeContent.footer, ...rawConfig.homeContent?.footer },
        },
        aboutPageContent: {
            ...DEFAULT_THEME_CONFIG.aboutPageContent,
            ...rawConfig.aboutPageContent,
            story: { ...DEFAULT_THEME_CONFIG.aboutPageContent.story, ...rawConfig.aboutPageContent?.story },
            values: { ...DEFAULT_THEME_CONFIG.aboutPageContent.values, ...rawConfig.aboutPageContent?.values },
            team: { ...DEFAULT_THEME_CONFIG.aboutPageContent.team, ...rawConfig.aboutPageContent?.team },
        },
        contactPageContent: {
            ...DEFAULT_THEME_CONFIG.contactPageContent,
            ...rawConfig.contactPageContent,
        },
        faqPageContent: {
            ...DEFAULT_THEME_CONFIG.faqPageContent,
            ...rawConfig.faqPageContent,
        },
    };

    // Fetch published pages by store_id
    const { data: pages } = await supabase
        .from("pages")
        .select("*")
        .eq("store_id", currentStore.id)
        .eq("is_published", true)
        .order("created_at", { ascending: true });

    const publishedPages = (pages as Page[]) || [];

    // Build navigation (only custom pages - templates handle built-in pages separately)
    const navPages: Page[] = [...publishedPages];

    // Google Font
    const fontFamily = config.global.font || "Inter";
    const googleFontUrl = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, "+")}:wght@300;400;500;600;700;900&display=swap`;

    // Check if this is a preconfigured page
    if (PRECONFIGURED_PAGES.includes(page_slug)) {
        return (
            <>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link href={googleFontUrl} rel="stylesheet" />

                {page_slug === "a-propos" && config.aboutPageContent.visible && (
                    <AboutPage config={config} storeName={currentStore.slug} pages={navPages} />
                )}
                {page_slug === "contact" && config.contactPageContent.visible && (
                    <ContactPage config={config} storeName={currentStore.slug} sellerId={currentStore.id} pages={navPages} />
                )}
                {page_slug === "faq" && config.faqPageContent.visible && (
                    <FAQPage config={config} storeName={currentStore.slug} pages={navPages} />
                )}
            </>
        );
    }

    // Otherwise, look for a custom page in the database
    const { data: page } = await supabase
        .from("pages")
        .select("*")
        .eq("store_id", currentStore.id)
        .eq("slug", page_slug)
        .eq("is_published", true)
        .single();

    if (!page) {
        notFound();
    }

    const pageData = page as Page;

    // Render custom page with theme styling
    return (
        <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link href={googleFontUrl} rel="stylesheet" />

            <div
                className="min-h-screen"
                style={{
                    backgroundColor: config.global.colors.background,
                    color: config.global.colors.text,
                    fontFamily: `"${config.global.font}", system-ui, sans-serif`,
                }}
            >
                {/* Header */}
                <header
                    className="sticky top-0 z-50 py-4 px-6 border-b backdrop-blur-md"
                    style={{
                        backgroundColor: `${config.global.colors.background}ee`,
                        borderColor: `${config.global.colors.text}15`,
                    }}
                >
                    <div className="mx-auto max-w-4xl flex items-center gap-4">
                        <a
                            href={`/${currentStore.slug}`}
                            className="flex items-center gap-2 text-sm opacity-70 hover:opacity-100 transition-opacity"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Retour
                        </a>
                        <h1 className="text-lg font-bold">{pageData.title}</h1>
                    </div>
                </header>

                {/* Content */}
                <main className="mx-auto max-w-4xl px-4 py-12">
                    <article className="prose prose-slate max-w-none">
                        <div className="whitespace-pre-line leading-relaxed">
                            {pageData.content}
                        </div>
                    </article>
                </main>

                {/* Footer */}
                <footer className="py-8 px-6 border-t" style={{ borderColor: `${config.global.colors.text}10` }}>
                    <div className="max-w-4xl mx-auto text-center">
                        <a href={`/${currentStore.slug}`} className="text-sm opacity-60 hover:opacity-100 transition-opacity">
                            ← Retour à la boutique
                        </a>
                    </div>
                </footer>
            </div>
        </>
    );
}
