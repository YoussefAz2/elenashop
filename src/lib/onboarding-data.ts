// Smart Onboarding Data - Template Matching & Category Content

import type { ThemeConfig, TemplateId } from "@/types";
import { DEFAULT_THEME_CONFIGS } from "@/types";

// ============================================
// TYPES
// ============================================

export type StoreCategory = "mode" | "beaute" | "tech" | "maison" | "bijoux" | "autre";
export type VisualStyle = "minimaliste" | "colore" | "sombre" | "luxe";

export interface CategoryOption {
    id: StoreCategory;
    label: string;
    emoji: string;
    description: string;
}

export interface StyleOption {
    id: VisualStyle;
    label: string;
    emoji: string;
    colors: string[];
    description: string;
}

export interface CategoryContent {
    heroTitle: string;
    heroSubtitle: string;
    buttonText: string;
    testimonialTitle: string;
}

// ============================================
// CATEGORIES
// ============================================

export const STORE_CATEGORIES: CategoryOption[] = [
    { id: "mode", label: "Mode & Vêtements", emoji: "👗", description: "Prêt-à-porter, accessoires" },
    { id: "beaute", label: "Beauté & Cosmétiques", emoji: "💄", description: "Soins, maquillage" },
    { id: "tech", label: "Tech & Électronique", emoji: "📱", description: "Gadgets, accessoires tech" },
    { id: "maison", label: "Maison & Déco", emoji: "🏠", description: "Décoration, accessoires" },
    { id: "bijoux", label: "Bijoux & Montres", emoji: "💎", description: "Joaillerie, accessoires luxe" },
    { id: "autre", label: "Autre", emoji: "🛍️", description: "Catégorie personnalisée" },
];

// ============================================
// VISUAL STYLES
// ============================================

export const VISUAL_STYLES: StyleOption[] = [
    {
        id: "minimaliste",
        label: "Minimaliste",
        emoji: "✨",
        colors: ["#ffffff", "#f8fafc", "#18181b"],
        description: "Épuré, élégant, professionnel"
    },
    {
        id: "colore",
        label: "Coloré",
        emoji: "🌈",
        colors: ["#f472b6", "#a78bfa", "#38bdf8"],
        description: "Vibrant, dynamique, fun"
    },
    {
        id: "sombre",
        label: "Sombre",
        emoji: "🌙",
        colors: ["#18181b", "#27272a", "#a855f7"],
        description: "Moderne, tech, audacieux"
    },
    {
        id: "luxe",
        label: "Luxe",
        emoji: "👑",
        colors: ["#1c1917", "#d4af37", "#f5f5f4"],
        description: "Premium, sophistiqué, exclusif"
    },
];

// ============================================
// SMART TEMPLATE MATCHING
// ============================================

const TEMPLATE_MATCHING: Record<string, TemplateId> = {
    // Tech combinations
    "tech-sombre": "street",
    "tech-minimaliste": "minimal",
    "tech-colore": "street",
    "tech-luxe": "luxe",

    // Mode combinations
    "mode-minimaliste": "minimal",
    "mode-colore": "minimal",
    "mode-sombre": "street",
    "mode-luxe": "luxe",

    // Beauté combinations
    "beaute-minimaliste": "minimal",
    "beaute-colore": "minimal",
    "beaute-sombre": "luxe",
    "beaute-luxe": "luxe",

    // Bijoux combinations
    "bijoux-minimaliste": "luxe",
    "bijoux-colore": "luxe",
    "bijoux-sombre": "luxe",
    "bijoux-luxe": "luxe",

    // Maison combinations
    "maison-minimaliste": "minimal",
    "maison-colore": "minimal",
    "maison-sombre": "street",
    "maison-luxe": "luxe",

    // Autre - defaults
    "autre-minimaliste": "minimal",
    "autre-colore": "street",
    "autre-sombre": "street",
    "autre-luxe": "luxe",
};

export function getRecommendedTemplate(category: StoreCategory, style: VisualStyle): TemplateId {
    const key = `${category}-${style}`;
    return TEMPLATE_MATCHING[key] || "minimal";
}

// ============================================
// CATEGORY-SPECIFIC CONTENT
// ============================================

const CATEGORY_CONTENT: Record<StoreCategory, CategoryContent> = {
    tech: {
        heroTitle: "Le futur est ici",
        heroSubtitle: "Découvrez nos gadgets et accessoires tech innovants",
        buttonText: "Voir les gadgets",
        testimonialTitle: "Ce que nos geeks disent",
    },
    mode: {
        heroTitle: "Nouvelle Collection 2025",
        heroSubtitle: "Des tendances qui vous ressemblent",
        buttonText: "Shopper le look",
        testimonialTitle: "Nos clients stylés",
    },
    beaute: {
        heroTitle: "Révélez votre beauté",
        heroSubtitle: "Produits cosmétiques premium pour sublimer votre peau",
        buttonText: "Découvrir",
        testimonialTitle: "Elles adorent nos produits",
    },
    bijoux: {
        heroTitle: "L'éclat qui vous distingue",
        heroSubtitle: "Bijoux et montres d'exception pour chaque occasion",
        buttonText: "Explorer la collection",
        testimonialTitle: "Nos clientes brillent",
    },
    maison: {
        heroTitle: "Votre intérieur, notre passion",
        heroSubtitle: "Transformez votre espace avec nos créations uniques",
        buttonText: "Explorer",
        testimonialTitle: "Nos clients satisfaits",
    },
    autre: {
        heroTitle: "Bienvenue dans notre boutique",
        heroSubtitle: "Découvrez notre sélection unique de produits",
        buttonText: "Voir les produits",
        testimonialTitle: "Ce que nos clients disent",
    },
};

export function getCategoryContent(category: StoreCategory): CategoryContent {
    return CATEGORY_CONTENT[category] || CATEGORY_CONTENT.autre;
}

// ============================================
// TEMPLATE INFO FOR DISPLAY
// ============================================

export interface TemplateInfo {
    id: TemplateId;
    name: string;
    description: string;
    preview: string; // Tailwind gradient classes
    features: string[];
}

export const TEMPLATE_OPTIONS: TemplateInfo[] = [
    {
        id: "minimal",
        name: "Minimal",
        description: "Design épuré et professionnel",
        preview: "from-slate-100 to-white",
        features: ["Clean", "Moderne", "Polyvalent"],
    },
    {
        id: "luxe",
        name: "Luxe",
        description: "Élégance et sophistication",
        preview: "from-amber-100 via-stone-100 to-amber-50",
        features: ["Premium", "Or & Noir", "Exclusif"],
    },
    {
        id: "street",
        name: "Street",
        description: "Audacieux et contemporain",
        preview: "from-violet-600 via-purple-700 to-fuchsia-800",
        features: ["Vibrant", "Jeune", "Dynamique"],
    },
];

// ============================================
// GENERATE PRE-CONFIGURED THEME
// ============================================

export function generatePreConfiguredTheme(
    templateId: TemplateId,
    category: StoreCategory,
    storeName: string
): ThemeConfig {
    // Get base template config
    const baseConfig = DEFAULT_THEME_CONFIGS[templateId];
    const categoryContent = getCategoryContent(category);

    // Create pre-configured theme with category-specific content
    return {
        ...baseConfig,
        homeContent: {
            ...baseConfig.homeContent,
            hero: {
                ...baseConfig.homeContent.hero,
                title: categoryContent.heroTitle,
                subtitle: categoryContent.heroSubtitle,
                buttonText: categoryContent.buttonText,
            },
            testimonials: {
                ...baseConfig.homeContent.testimonials,
                title: categoryContent.testimonialTitle,
            },
        },
        seo: {
            ...baseConfig.seo,
            title: storeName,
            description: categoryContent.heroSubtitle,
        },
    };
}
