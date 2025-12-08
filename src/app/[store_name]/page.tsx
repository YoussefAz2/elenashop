import { notFound } from "next/navigation";
import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import type { Profile, Product, Page, ThemeConfig, Promo } from "@/types";
import { DEFAULT_THEME_CONFIG } from "@/types";
import { TemplateMinimal, TemplateLuxe, TemplateStreet } from "@/components/store/templates";
import { ElenaShopWatermark } from "@/components/store/common/ElenaShopWatermark";

interface StorePageProps {
    params: Promise<{ store_name: string }>;
}

export async function generateMetadata({ params }: StorePageProps): Promise<Metadata> {
    const { store_name } = await params;
    const supabase = await createClient();

    const { data: profile } = await supabase
        .from("profiles")
        .select("store_name, bio, avatar_url, theme_config")
        .eq("store_name", store_name)
        .single();

    if (!profile) {
        return { title: "Boutique non trouvée" };
    }

    const config = profile.theme_config as ThemeConfig | null;
    const seo = config?.seo;
    const storeName = profile.store_name;
    const bio = profile.bio;
    const avatarUrl = profile.avatar_url;

    // Build title and description with fallbacks
    const title = seo?.title || `${storeName} - Boutique en ligne`;
    const description = seo?.description || bio || `Découvrez les produits de ${storeName}. Livraison partout en Tunisie.`;

    // Use OG image, avatar, or default
    const ogImage = seo?.ogImage || avatarUrl || "/og-default.png";

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

    // Fetch the seller profile
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("store_name", store_name)
        .single();

    if (profileError || !profile) {
        notFound();
    }

    const seller = profile as Profile;

    // Deep merge theme_config with defaults to ensure all properties exist
    const rawConfig: Partial<ThemeConfig> = seller.theme_config || {};
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

    // Fetch active products, pages, and promos in parallel
    const [productsRes, pagesRes, promosRes] = await Promise.all([
        supabase.from("products").select("*").eq("user_id", seller.id).eq("is_active", true).order("created_at", { ascending: false }),
        supabase.from("pages").select("*").eq("user_id", seller.id).eq("is_published", true).order("created_at", { ascending: true }),
        supabase.from("promos").select("*").eq("user_id", seller.id).eq("is_active", true),
    ]);

    const activeProducts = (productsRes.data as Product[]) || [];
    const customPages = (pagesRes.data as Page[]) || [];
    const activePromos = (promosRes.data as Promo[]) || [];

    // Build navigation: preconfigured pages + custom pages
    const navPages: Page[] = [
        ...(config.aboutPageContent?.visible !== false ? [{ id: "about", user_id: seller.id, slug: "a-propos", title: "À propos", content: null, is_published: true, created_at: "" }] : []),
        ...(config.contactPageContent?.visible !== false ? [{ id: "contact", user_id: seller.id, slug: "contact", title: "Contact", content: null, is_published: true, created_at: "" }] : []),
        ...(config.faqPageContent?.visible !== false ? [{ id: "faq", user_id: seller.id, slug: "faq", title: "FAQ", content: null, is_published: true, created_at: "" }] : []),
        ...customPages,
    ];

    // Common props for all templates
    const templateProps = {
        config,
        products: activeProducts,
        sellerId: seller.id,
        storeName: seller.store_name,
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
            <ElenaShopWatermark isPro={seller.subscription_status === "pro"} />
        </>
    );
}
