// Central types file for ElenaShop
// Smart Templates System - Complete Configuration

// ============================================
// THEME TYPES (Smart Templates)
// ============================================

export type TemplateId = "minimal" | "luxe" | "street";

// ---------- SECTION-SPECIFIC STYLES ----------

export interface HeroStyles {
    backgroundColor: string;
    textColor: string;
    buttonBg: string;
    buttonText: string;
    // Advanced options
    height: "compact" | "normal" | "large" | "fullscreen";
    contentAlign: "left" | "center" | "right";
    imageFilter: "none" | "grayscale" | "sepia" | "blur";
    overlayOpacity?: number;
}

export interface CardStyles {
    backgroundColor: string;
    textColor: string;
    priceColor: string;
    borderColor: string;
    // Advanced options
    hoverEffect: "none" | "lift" | "zoom" | "glow" | "border";
}

export interface ButtonStyles {
    backgroundColor: string;
    textColor: string;
    hoverBg: string;
    // Advanced options
    style: "solid" | "outline" | "ghost";
    size: "small" | "medium" | "large";
}

export interface FooterStyles {
    backgroundColor: string;
    textColor: string;
    accentColor: string;
}

// ---------- ADVANCED STYLING ----------

export interface TypographySettings {
    headingSize: "small" | "medium" | "large" | "xlarge";
    bodySize: "small" | "medium" | "large";
    headingTransform: "none" | "uppercase" | "capitalize";
    headingWeight?: "normal" | "medium" | "bold" | "extrabold";
    letterSpacing?: "tight" | "normal" | "wide";
}

export interface SpacingSettings {
    sectionPadding: "compact" | "normal" | "spacious";
    showSectionDividers: boolean;
}

export interface AnimationSettings {
    enableAnimations: boolean;
    animationSpeed: "slow" | "normal" | "fast";
    hoverTransition: "none" | "fade" | "scale" | "slide";
    entranceEffect?: "none" | "fadeIn" | "slideUp" | "zoomIn";
    scrollAnimations?: boolean;
}

// ---------- GLOBAL STYLES ----------

export interface GlobalStyles {
    colors: {
        primary: string;
        secondary: string;
        background: string;
        text: string;
    };
    font: string; // Any Google Font from AVAILABLE_FONTS
    headingFont: string; // Any Google Font from AVAILABLE_FONTS
    borderRadius: string;
    // Section styles
    hero: HeroStyles;
    cards: CardStyles;
    buttons: ButtonStyles;
    footer: FooterStyles;
    // Advanced styling
    typography: TypographySettings;
    spacing: SpacingSettings;
    animations: AnimationSettings;
}

// ---------- ELEMENT OVERRIDES (Design System V2) ----------

// Element types for the design system
export type ElementType =
    | "title"           // Headings (h1, h2, h3)
    | "paragraph"       // Body text, descriptions
    | "button"          // CTA buttons
    | "image"           // Images
    | "productCard"     // Product cards
    | "container";      // Sections, containers

// Complete style override interface for all element types
export interface ElementStyleOverride {
    // Text styles
    color?: string;
    fontSize?: string;
    fontWeight?: string;
    fontFamily?: string;
    textAlign?: "left" | "center" | "right";
    lineHeight?: string;
    letterSpacing?: string;
    textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";

    // Background & borders
    backgroundColor?: string;
    borderRadius?: string;
    borderColor?: string;
    borderWidth?: string;

    // Spacing
    padding?: string;

    // Effects
    boxShadow?: string;
    opacity?: number;

    // Image-specific
    filter?: string;
    objectFit?: "cover" | "contain" | "fill";

    // Product card text colors
    titleColor?: string;
    descriptionColor?: string;
    priceColor?: string;

    // Product card info box (new)
    infoBoxBackgroundColor?: string;
    infoBoxPadding?: string;
    infoBoxFullWidth?: boolean;

    // Icon color (new)
    iconColor?: string;

    // Product card button colors (new)
    buttonBgColor?: string;
    buttonTextColor?: string;

    // Divider width (for section dividers)
    width?: string;
}

export interface ElementOverride {
    elementId: string; // e.g., "hero-title", "section-products-title"
    styles: ElementStyleOverride;
}

// ---------- CONTENT TYPES ----------

// Header section
export interface HeaderContent {
    visible: boolean;
    sticky: boolean;
    showStoreName: boolean;
    showProductCount: boolean;
    logoUrl: string;
    logoSize: number;
}

// Announcement banner
export interface AnnouncementContent {
    enabled: boolean;
    sticky: boolean;
    text: string;
    backgroundColor: string;
    textColor: string;
    link: string;
}

// Hero section
export interface HeroContent {
    visible: boolean;
    title: string;
    subtitle: string;
    buttonText: string;
    buttonUrl: string;
    imageUrl: string;
    overlayOpacity: number;
    gradientEnabled: boolean;
    gradientDirection: "left" | "right" | "top" | "bottom";
}

// Product grid section
export interface ProductGridContent {
    title: string;
    showDescription: boolean;
    showPrice: boolean;
    columns: 2 | 3 | 4;
    aspectRatio: "square" | "portrait" | "landscape";
    gap: "small" | "medium" | "large";
    cardShadow: boolean;
}

// About section
export interface AboutContent {
    visible: boolean;
    title: string;
    text: string;
    imageUrl: string;
    imagePosition: "left" | "right";
}

// Footer section
export interface FooterContent {
    text: string;
    showSocials: boolean;
    instagram: string;
    facebook: string;
    tiktok: string;
    whatsapp: string;
}

// Testimonial
export interface Testimonial {
    id: string;
    name: string;
    text: string;
    rating: number; // 1-5 stars
    imageUrl?: string; // Optional customer photo
}

export interface TestimonialsContent {
    visible: boolean;
    title: string;
    subtitle: string;
    items: Testimonial[];
    layout: "grid" | "carousel";
    showRating: boolean;
    showAvatar: boolean;
}

// Complete home content
export interface HomeContent {
    header: HeaderContent;
    announcement: AnnouncementContent;
    hero: HeroContent;
    productGrid: ProductGridContent;
    testimonials: TestimonialsContent;
    about: AboutContent;
    footer: FooterContent;
}

// ---------- PAGE CONTENT TYPES ----------

// About Page
export interface AboutPageContent {
    visible: boolean;
    title: string;
    subtitle: string;
    story: {
        title: string;
        text: string;
        imageUrl: string;
    };
    values: {
        visible: boolean;
        title: string;
        items: { icon: string; title: string; text: string }[];
    };
    team: {
        visible: boolean;
        title: string;
        members: { name: string; role: string; imageUrl: string }[];
    };
}

// Contact Page
export interface ContactPageContent {
    visible: boolean;
    title: string;
    subtitle: string;
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    showMap: boolean;
    mapUrl: string;
    formEnabled: boolean;
    formTitle: string;
}

// FAQ Page
export interface FAQItem {
    id: string;
    question: string;
    answer: string;
}

export interface FAQPageContent {
    visible: boolean;
    title: string;
    subtitle: string;
    items: FAQItem[];
}

// Floating WhatsApp
export interface FloatingWhatsAppConfig {
    enabled: boolean;
    phoneNumber: string;
    message: string;
    position: "left" | "right";
}

// Promo Popup
export interface PromoPopupConfig {
    enabled: boolean;
    title: string;
    message: string;
    buttonText: string;
    buttonUrl: string;
    showOnce: boolean;
}

// SEO Configuration
export interface SEOConfig {
    title: string;
    description: string;
    keywords: string;
    ogImage: string;
}

// ---------- MAIN CONFIG ----------

export interface ThemeConfig {
    templateId: TemplateId;
    global: GlobalStyles;
    homeContent: HomeContent;
    aboutPageContent: AboutPageContent;
    contactPageContent: ContactPageContent;
    faqPageContent: FAQPageContent;
    floatingWhatsApp: FloatingWhatsAppConfig;
    promoPopup: PromoPopupConfig;
    seo: SEOConfig;
    // Visual Editor V2
    activePreset?: string;
    elementOverrides?: Record<string, ElementStyleOverride>;
}

export interface NavItem {
    label: string;
    url: string;
}

// ---------- CONSTANTS ----------

export const AVAILABLE_FONTS = [
    // Modern & Clean
    { id: "Inter", name: "Inter", style: "Moderne", category: "modern" },
    { id: "Poppins", name: "Poppins", style: "Tendance", category: "modern" },
    { id: "Outfit", name: "Outfit", style: "Moderne", category: "modern" },
    { id: "DM Sans", name: "DM Sans", style: "Épuré", category: "modern" },
    { id: "Space Grotesk", name: "Space Grotesk", style: "Tech", category: "modern" },

    // Elegant & Luxury
    { id: "Playfair Display", name: "Playfair Display", style: "Élégant", category: "elegant" },
    { id: "Cormorant Garamond", name: "Cormorant", style: "Luxe", category: "elegant" },
    { id: "Libre Baskerville", name: "Libre Baskerville", style: "Classique", category: "elegant" },
    { id: "Crimson Pro", name: "Crimson Pro", style: "Raffiné", category: "elegant" },
    { id: "EB Garamond", name: "EB Garamond", style: "Sophistiqué", category: "elegant" },

    // Bold & Impactful
    { id: "Oswald", name: "Oswald", style: "Urbain", category: "bold" },
    { id: "Montserrat", name: "Montserrat", style: "Géométrique", category: "bold" },
    { id: "Bebas Neue", name: "Bebas Neue", style: "Impactant", category: "bold" },
    { id: "Anton", name: "Anton", style: "Fort", category: "bold" },
    { id: "Archivo Black", name: "Archivo Black", style: "Puissant", category: "bold" },

    // Friendly & Warm
    { id: "Nunito", name: "Nunito", style: "Doux", category: "friendly" },
    { id: "Quicksand", name: "Quicksand", style: "Arrondi", category: "friendly" },
    { id: "Comfortaa", name: "Comfortaa", style: "Amical", category: "friendly" },
    { id: "Varela Round", name: "Varela Round", style: "Chaleureux", category: "friendly" },

    // Classic & Versatile
    { id: "Lato", name: "Lato", style: "Classique", category: "classic" },
    { id: "Roboto", name: "Roboto", style: "Polyvalent", category: "classic" },
    { id: "Open Sans", name: "Open Sans", style: "Neutre", category: "classic" },
    { id: "Source Sans 3", name: "Source Sans", style: "Lisible", category: "classic" },
] as const;

export type FontCategory = "modern" | "elegant" | "bold" | "friendly" | "classic";

export const FONT_CATEGORIES: Record<FontCategory, { label: string; emoji: string }> = {
    modern: { label: "Moderne", emoji: "✨" },
    elegant: { label: "Élégant", emoji: "👑" },
    bold: { label: "Impact", emoji: "💪" },
    friendly: { label: "Amical", emoji: "😊" },
    classic: { label: "Classique", emoji: "📖" },
};

export const TEMPLATE_PRESETS: Record<TemplateId, { name: string; description: string; preview: string }> = {
    minimal: {
        name: "Minimal",
        description: "Épuré et professionnel",
        preview: "from-slate-100 to-white",
    },
    luxe: {
        name: "Luxe",
        description: "Élégant et premium",
        preview: "from-zinc-900 to-black",
    },
    street: {
        name: "Street",
        description: "Urbain et audacieux",
        preview: "from-violet-600 to-purple-900",
    },
};

// ---------- DEFAULTS ----------

const DEFAULT_HEADER: HeaderContent = {
    visible: true,
    sticky: true,
    showStoreName: true,
    showProductCount: true,
    logoUrl: "",
    logoSize: 40,
};

const DEFAULT_ANNOUNCEMENT: AnnouncementContent = {
    enabled: false,
    sticky: false,
    text: "🚚 Livraison gratuite à partir de 100 TND !",
    backgroundColor: "#18181b",
    textColor: "#ffffff",
    link: "",
};

const DEFAULT_HERO: HeroContent = {
    visible: true,
    title: "Bienvenue",
    subtitle: "Découvrez notre collection",
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
    columns: 2,
    aspectRatio: "square",
    gap: "medium",
    cardShadow: true,
};

const DEFAULT_ABOUT: AboutContent = {
    visible: false,
    title: "Notre Histoire",
    text: "Écrivez ici votre histoire, votre mission ou ce qui rend votre boutique unique.",
    imageUrl: "",
    imagePosition: "right",
};

const DEFAULT_FOOTER: FooterContent = {
    text: "",
    showSocials: true,
    instagram: "",
    facebook: "",
    tiktok: "",
    whatsapp: "",
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

const DEFAULT_HOME_CONTENT: HomeContent = {
    header: DEFAULT_HEADER,
    announcement: DEFAULT_ANNOUNCEMENT,
    hero: DEFAULT_HERO,
    productGrid: DEFAULT_PRODUCT_GRID,
    testimonials: DEFAULT_TESTIMONIALS,
    about: DEFAULT_ABOUT,
    footer: DEFAULT_FOOTER,
};

// Style defaults
const DEFAULT_HERO_STYLES: HeroStyles = {
    backgroundColor: "#18181b",
    textColor: "#ffffff",
    buttonBg: "#ffffff",
    buttonText: "#18181b",
    height: "normal",
    contentAlign: "center",
    imageFilter: "none",
};

const DEFAULT_CARD_STYLES: CardStyles = {
    backgroundColor: "#ffffff",
    textColor: "#18181b",
    priceColor: "#059669",
    borderColor: "#e5e7eb",
    hoverEffect: "lift",
};

const DEFAULT_BUTTON_STYLES: ButtonStyles = {
    backgroundColor: "#18181b",
    textColor: "#ffffff",
    hoverBg: "#27272a",
    style: "solid",
    size: "medium",
};

const DEFAULT_FOOTER_STYLES: FooterStyles = {
    backgroundColor: "#fafafa",
    textColor: "#71717a",
    accentColor: "#18181b",
};

const DEFAULT_TYPOGRAPHY: TypographySettings = {
    headingSize: "large",
    bodySize: "medium",
    headingTransform: "none",
};

const DEFAULT_SPACING: SpacingSettings = {
    sectionPadding: "normal",
    showSectionDividers: false,
};

const DEFAULT_ANIMATIONS: AnimationSettings = {
    enableAnimations: true,
    animationSpeed: "normal",
    hoverTransition: "scale",
};

// Default About Page
const DEFAULT_ABOUT_PAGE: AboutPageContent = {
    visible: true,
    title: "Notre Histoire",
    subtitle: "Découvrez qui nous sommes et ce qui nous anime",
    story: {
        title: "Comment tout a commencé",
        text: "Notre aventure a débuté avec une passion simple : offrir des produits de qualité à des prix accessibles. Depuis, nous n'avons cessé de grandir tout en gardant nos valeurs fondatrices.",
        imageUrl: "",
    },
    values: {
        visible: true,
        title: "Nos Valeurs",
        items: [
            { icon: "heart", title: "Qualité", text: "Des produits soigneusement sélectionnés" },
            { icon: "truck", title: "Livraison Rapide", text: "Expédition sous 24-48h" },
            { icon: "shield", title: "Garantie", text: "Satisfait ou remboursé" },
        ],
    },
    team: {
        visible: false,
        title: "Notre Équipe",
        members: [],
    },
};

// Default Contact Page
const DEFAULT_CONTACT_PAGE: ContactPageContent = {
    visible: true,
    title: "Contactez-nous",
    subtitle: "Une question ? N'hésitez pas à nous écrire",
    email: "",
    phone: "",
    whatsapp: "",
    address: "",
    showMap: false,
    mapUrl: "",
    formEnabled: true,
    formTitle: "Envoyez-nous un message",
};

// Default FAQ Page
const DEFAULT_FAQ_PAGE: FAQPageContent = {
    visible: true,
    title: "Questions Fréquentes",
    subtitle: "Trouvez rapidement les réponses à vos questions",
    items: [
        { id: "1", question: "Quels sont les délais de livraison ?", answer: "Nous livrons généralement sous 2 à 5 jours ouvrables selon votre région." },
        { id: "2", question: "Comment suivre ma commande ?", answer: "Un numéro de suivi vous sera envoyé par SMS dès l'expédition de votre colis." },
        { id: "3", question: "Puis-je retourner un article ?", answer: "Oui, vous disposez de 7 jours après réception pour retourner un article non porté avec son étiquette." },
    ],
};

// Default Floating WhatsApp
const DEFAULT_FLOATING_WHATSAPP: FloatingWhatsAppConfig = {
    enabled: false,
    phoneNumber: "",
    message: "Bonjour ! J'ai une question concernant votre boutique.",
    position: "right",
};

// Default Promo Popup
const DEFAULT_PROMO_POPUP: PromoPopupConfig = {
    enabled: false,
    title: "🎉 Offre Spéciale !",
    message: "Profitez de -10% sur votre première commande avec le code BIENVENUE",
    buttonText: "J'en profite",
    buttonUrl: "#products",
    showOnce: true,
};

// Default SEO
const DEFAULT_SEO: SEOConfig = {
    title: "",
    description: "",
    keywords: "",
    ogImage: "",
};

// Template-specific configs
export const DEFAULT_THEME_CONFIGS: Record<TemplateId, ThemeConfig> = {
    minimal: {
        templateId: "minimal",
        global: {
            colors: { primary: "#18181b", secondary: "#71717a", background: "#ffffff", text: "#18181b" },
            font: "Inter",
            headingFont: "Inter",
            borderRadius: "0.75rem",
            hero: { ...DEFAULT_HERO_STYLES, backgroundColor: "#f4f4f5", textColor: "#18181b", buttonBg: "#18181b", buttonText: "#ffffff" },
            cards: { ...DEFAULT_CARD_STYLES, borderColor: "transparent" },
            buttons: { ...DEFAULT_BUTTON_STYLES },
            footer: { ...DEFAULT_FOOTER_STYLES },
            typography: { ...DEFAULT_TYPOGRAPHY },
            spacing: { ...DEFAULT_SPACING },
            animations: { ...DEFAULT_ANIMATIONS, hoverTransition: "fade" },
        },
        homeContent: DEFAULT_HOME_CONTENT,
        aboutPageContent: DEFAULT_ABOUT_PAGE,
        contactPageContent: DEFAULT_CONTACT_PAGE,
        faqPageContent: DEFAULT_FAQ_PAGE,
        floatingWhatsApp: DEFAULT_FLOATING_WHATSAPP,
        promoPopup: DEFAULT_PROMO_POPUP,
        seo: DEFAULT_SEO,
    },
    luxe: {
        templateId: "luxe",
        global: {
            colors: { primary: "#D4AF37", secondary: "#8B7355", background: "#0a0a0a", text: "#fafafa" },
            font: "Lato",
            headingFont: "Playfair Display",
            borderRadius: "0",
            hero: { backgroundColor: "#0a0a0a", textColor: "#fafafa", buttonBg: "#D4AF37", buttonText: "#0a0a0a", height: "large", contentAlign: "center", imageFilter: "none" },
            cards: { backgroundColor: "#171717", textColor: "#fafafa", priceColor: "#D4AF37", borderColor: "#D4AF3730", hoverEffect: "glow" },
            buttons: { backgroundColor: "#D4AF37", textColor: "#0a0a0a", hoverBg: "#B8962F", style: "solid", size: "large" },
            footer: { backgroundColor: "#0a0a0a", textColor: "#a1a1aa", accentColor: "#D4AF37" },
            typography: { headingSize: "xlarge", bodySize: "medium", headingTransform: "none" },
            spacing: { sectionPadding: "spacious", showSectionDividers: false },
            animations: { enableAnimations: true, animationSpeed: "slow", hoverTransition: "fade" },
        },
        homeContent: {
            ...DEFAULT_HOME_CONTENT,
            announcement: { ...DEFAULT_ANNOUNCEMENT, backgroundColor: "#D4AF37", textColor: "#0a0a0a" },
        },
        aboutPageContent: DEFAULT_ABOUT_PAGE,
        contactPageContent: DEFAULT_CONTACT_PAGE,
        faqPageContent: DEFAULT_FAQ_PAGE,
        floatingWhatsApp: DEFAULT_FLOATING_WHATSAPP,
        promoPopup: DEFAULT_PROMO_POPUP,
        seo: DEFAULT_SEO,
    },
    street: {
        templateId: "street",
        global: {
            colors: { primary: "#a855f7", secondary: "#ec4899", background: "#0c0a09", text: "#fafaf9" },
            font: "Oswald",
            headingFont: "Oswald",
            borderRadius: "0",
            hero: { backgroundColor: "#0c0a09", textColor: "#fafaf9", buttonBg: "#a855f7", buttonText: "#fafaf9", height: "normal", contentAlign: "left", imageFilter: "none" },
            cards: { backgroundColor: "#1c1917", textColor: "#fafaf9", priceColor: "#a855f7", borderColor: "#fafaf9", hoverEffect: "border" },
            buttons: { backgroundColor: "#a855f7", textColor: "#fafaf9", hoverBg: "#9333ea", style: "solid", size: "large" },
            footer: { backgroundColor: "#a855f7", textColor: "#fafaf9", accentColor: "#fafaf9" },
            typography: { headingSize: "xlarge", bodySize: "medium", headingTransform: "uppercase" },
            spacing: { sectionPadding: "normal", showSectionDividers: true },
            animations: { enableAnimations: true, animationSpeed: "fast", hoverTransition: "scale" },
        },
        homeContent: {
            ...DEFAULT_HOME_CONTENT,
            announcement: { ...DEFAULT_ANNOUNCEMENT, backgroundColor: "#a855f7", textColor: "#fafaf9" },
        },
        aboutPageContent: DEFAULT_ABOUT_PAGE,
        contactPageContent: DEFAULT_CONTACT_PAGE,
        faqPageContent: DEFAULT_FAQ_PAGE,
        floatingWhatsApp: DEFAULT_FLOATING_WHATSAPP,
        promoPopup: DEFAULT_PROMO_POPUP,
        seo: DEFAULT_SEO,
    },
};

export const DEFAULT_THEME_CONFIG = DEFAULT_THEME_CONFIGS.minimal;

// ============================================
// DATABASE TYPES
// ============================================

export interface Profile {
    id: string;
    store_name: string;
    phone_number: string | null;
    avatar_url: string | null;
    subscription_status: "free" | "pro";
    theme_config: ThemeConfig | null;
    created_at: string;
}

export interface Product {
    id: string;
    user_id: string;
    title: string;
    price: number;
    image_url: string | null;
    images: string[];  // Array of additional image URLs
    image_position: "center" | "top" | "bottom";  // Image cropping position
    description: string | null;
    stock: number;
    is_active: boolean;
    category_id: string | null;
    created_at: string;
}

export interface Order {
    id: string;
    user_id: string;
    customer_name: string;
    customer_phone: string;
    customer_governorate: string;
    customer_city: string | null;
    customer_address: string | null;
    product_details: {
        title: string;
        price: number;
        quantity?: number;
    } | null;
    total_price: number;
    status: "new" | "confirmed" | "shipped" | "delivered" | "cancelled";
    created_at: string;
}

export interface Lead {
    id: string;
    user_id: string;
    customer_phone: string;
    customer_name: string | null;
    created_at: string;
}

export interface Page {
    id: string;
    user_id: string;
    slug: string;
    title: string;
    content: string | null;
    is_published: boolean;
    created_at: string;
}

export interface Category {
    id: string;
    user_id: string;
    name: string;
    slug: string;
    position: number;
    created_at: string;
}

export interface Promo {
    id: string;
    user_id: string;
    name: string;
    discount_type: "percentage" | "fixed";
    discount_value: number;
    scope: "global" | "category" | "product";
    category_id: string | null;
    product_ids: string[];
    is_active: boolean;
    show_popup: boolean;
    popup_title: string | null;
    popup_message: string | null;
    starts_at: string | null;
    ends_at: string | null;
    created_at: string;
}

// ============================================
// CONSTANTS
// ============================================

export const GOUVERNORATS = [
    "Tunis", "Ariana", "Ben Arous", "Manouba", "Nabeul", "Zaghouan",
    "Bizerte", "Beja", "Jendouba", "Kef", "Siliana", "Kairouan",
    "Kasserine", "Sidi Bouzid", "Sousse", "Monastir", "Mahdia", "Sfax",
    "Gafsa", "Tozeur", "Kebili", "Gabes", "Medenine", "Tataouine",
] as const;

export type Gouvernorat = (typeof GOUVERNORATS)[number];

// ============================================
// ORDER & STATUS TYPES
// ============================================

export type OrderStatus = "new" | "confirmed" | "shipped" | "delivered" | "cancelled";

export type StatusFilter = "all" | OrderStatus;

export const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bgColor: string }> = {
    new: { label: "Nouveau", color: "text-blue-700", bgColor: "bg-blue-100" },
    confirmed: { label: "Confirmé", color: "text-amber-700", bgColor: "bg-amber-100" },
    shipped: { label: "Expédié", color: "text-purple-700", bgColor: "bg-purple-100" },
    delivered: { label: "Livré", color: "text-emerald-700", bgColor: "bg-emerald-100" },
    cancelled: { label: "Annulé", color: "text-red-700", bgColor: "bg-red-100" },
};

// ============================================
// CHECKOUT TYPES
// ============================================

export type CheckoutStep = 1 | 2 | 3;

export interface ContactFormData {
    customer_name: string;
    customer_phone: string;
}

export interface DeliveryFormData {
    delivery_address: string;
    gouvernorat: Gouvernorat | "";
    notes: string;
}

// ============================================
// DASHBOARD TYPES
// ============================================

export type DashboardTab = "orders" | "stats" | "products" | "categories" | "promos" | "leads" | "editor" | "settings";

export type StatsPeriod = "7d" | "30d" | "90d" | "all";
