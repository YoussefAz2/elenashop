import { notFound } from "next/navigation";
import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import type { Store, Product, Page, ThemeConfig, Promo, Category } from "@/types";
import { DEFAULT_THEME_CONFIG } from "@/types";
import { TemplateMinimal, TemplateLuxe, TemplateStreet } from "@/components/store/templates";
import { ElenaShopWatermark } from "@/components/store/common/ElenaShopWatermark";

interface StorePageProps {
    params: Promise<{ store_name: string }>;
}

export async function generateMetadata({ params }: StorePageProps): Promise<Metadata> {
    const { store_name } = await params;
    const supabase = await createClient();

    // Fetch store by slug (new multi-store architecture)
    const { data: store } = await supabase
        .from("stores")
        .select("slug, name, theme_config")
        .ilike("slug", store_name)
        .single();

    if (!store) {
        return { title: "Boutique non trouvée" };
    }

    const config = store.theme_config as ThemeConfig | null;
    const seo = config?.seo;
    const storeName = store.name;

    // Build title and description with fallbacks
    const title = seo?.title || `${storeName} - Boutique en ligne`;
    const description = seo?.description || `Découvrez les produits de ${storeName}. Livraison partout en Tunisie.`;

    // Use OG image or default
    const ogImage = seo?.ogImage || "/og-default.png";

    return {
        title,
        description,
        keywords: seo?.keywords || `${storeName}, boutique, tunisie, achat en ligne`,
        openGraph: {
            title,
            description,
            images: [{ url: ogImage, width: 1200, height: 630, alt: storeName }],
            type: "website",
            siteName: "ElenaShop",
            locale: "fr_TN",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [ogImage],
        },
        other: {
            "og:locale": "fr_TN",
        },
    };
}

export default async function StorePage({ params }: StorePageProps) {
    const { store_name } = await params;
    const supabase = await createClient();

    // Fetch the store by slug (new multi-store architecture)
    const { data: store, error: storeError } = await supabase
        .from("stores")
        .select("*")
        .ilike("slug", store_name)
        .single();

    // If store not found, return 404
    if (storeError || !store) {
        notFound();
    }

    const currentStore = store as Store;

    // Deep merge theme_config with defaults to ensure all properties exist
    const rawConfig: Partial<ThemeConfig> = currentStore.theme_config || {};
    const config = {
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
    };

    // Fetch active products, pages, promos, and categories by store_id
    const [productsRes, pagesRes, promosRes, categoriesRes] = await Promise.all([
        supabase.from("products").select("*").eq("store_id", currentStore.id).eq("is_active", true).order("created_at", { ascending: false }),
        supabase.from("pages").select("*").eq("store_id", currentStore.id).eq("is_published", true).order("created_at", { ascending: true }),
        supabase.from("promos").select("*").eq("store_id", currentStore.id).eq("is_active", true),
        supabase.from("categories").select("*").eq("store_id", currentStore.id).order("position", { ascending: true }),
    ]);

    const activeProducts = (productsRes.data as Product[]) || [];
    const customPages = (pagesRes.data as Page[]) || [];
    const activePromos = (promosRes.data as Promo[]) || [];
    const categories = (categoriesRes.data as Category[]) || [];

    // Build navigation: only custom pages (templates handle built-in pages separately)
    const navPages: Page[] = [...customPages];

    // Common props for all templates
    const templateProps = {
        config,
        products: activeProducts,
        categories,
        sellerId: currentStore.id,
        storeName: currentStore.name,
        pages: navPages,
        promos: activePromos,
    };

    // Google Font
    const fontFamily = config.global.font || "Inter";
    const googleFontUrl = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, "+")}:wght@300;400;500;600;700;900&display=swap`;

    return (
        <>
            {/* Google Font */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link href={googleFontUrl} rel="stylesheet" />

            {/* Render the correct template */}
            {config.templateId === "luxe" ? (
                <TemplateLuxe {...templateProps} />
            ) : config.templateId === "street" ? (
                <TemplateStreet {...templateProps} />
            ) : (
                <TemplateMinimal {...templateProps} />
            )}

            {/* Watermark for free users */}
            <ElenaShopWatermark isPro={currentStore.subscription_status === "pro"} />
        </>
    );
}
