"use client";

// Shared constants for all toolbars
// Prevents duplication and ensures consistency

// ---------- FONT SIZES ----------

export const TITLE_FONT_SIZES = [
    { value: "1.5rem", label: "S" },
    { value: "2rem", label: "M" },
    { value: "2.5rem", label: "L" },
    { value: "3rem", label: "XL" },
    { value: "3.5rem", label: "2XL" },
];

export const PARAGRAPH_FONT_SIZES = [
    { value: "0.875rem", label: "XS" },
    { value: "1rem", label: "S" },
    { value: "1.125rem", label: "M" },
    { value: "1.25rem", label: "L" },
    { value: "1.5rem", label: "XL" },
];

// ---------- FONT WEIGHTS ----------

export const FONT_WEIGHTS = [
    { value: "300", label: "Light" },
    { value: "400", label: "Normal" },
    { value: "500", label: "Medium" },
    { value: "600", label: "Semi" },
    { value: "700", label: "Bold" },
    { value: "800", label: "Extra" },
];

// ---------- FONTS ----------

export const HEADING_FONTS = [
    { value: "system-ui, sans-serif", label: "Système" },
    { value: "'Playfair Display', serif", label: "Playfair" },
    { value: "'Montserrat', sans-serif", label: "Montserrat" },
    { value: "'Roboto', sans-serif", label: "Roboto" },
    { value: "'Poppins', sans-serif", label: "Poppins" },
    { value: "'Cormorant Garamond', serif", label: "Cormorant" },
    { value: "'Oswald', sans-serif", label: "Oswald" },
];

export const BODY_FONTS = [
    { value: "system-ui, sans-serif", label: "Système" },
    { value: "'Inter', sans-serif", label: "Inter" },
    { value: "'Open Sans', sans-serif", label: "Open Sans" },
    { value: "'Lato', sans-serif", label: "Lato" },
    { value: "'Source Sans Pro', sans-serif", label: "Source Sans" },
];

// ---------- BORDER RADIUS ----------

export const BORDER_RADIUS_OPTIONS = [
    { value: "0px", label: "Carré" },
    { value: "4px", label: "Léger" },
    { value: "8px", label: "Moyen" },
    { value: "16px", label: "Arrondi" },
    { value: "9999px", label: "Pill" },
];

// ---------- SHADOWS ----------

export const SHADOW_OPTIONS = [
    { value: "none", label: "Aucune" },
    { value: "0 2px 8px rgba(0,0,0,0.1)", label: "Douce" },
    { value: "0 8px 24px rgba(0,0,0,0.2)", label: "Forte" },
];

// ---------- PADDING ----------

export const PADDING_OPTIONS = [
    { value: "16px", label: "Petit" },
    { value: "24px", label: "Normal" },
    { value: "32px", label: "Moyen" },
    { value: "48px", label: "Grand" },
    { value: "64px", label: "Très grand" },
];

// ---------- BUTTON PADDING ----------

export const BUTTON_PADDING_OPTIONS = [
    { value: "compact", px: "8px 16px", label: "Compact" },
    { value: "normal", px: "12px 24px", label: "Normal" },
    { value: "airy", px: "16px 32px", label: "Aéré" },
];

// ---------- COLORS ----------

export const COLOR_PRESETS = [
    { value: "#18181b", label: "Noir" },
    { value: "#ffffff", label: "Blanc" },
    { value: "#ef4444", label: "Rouge" },
    { value: "#f97316", label: "Orange" },
    { value: "#eab308", label: "Jaune" },
    { value: "#22c55e", label: "Vert" },
    { value: "#3b82f6", label: "Bleu" },
    { value: "#8b5cf6", label: "Violet" },
    { value: "#ec4899", label: "Rose" },
];

// ---------- TEXT TRANSFORM ----------

export const TEXT_TRANSFORM_OPTIONS = [
    { value: "none", label: "Normal" },
    { value: "uppercase", label: "MAJUSCULES" },
    { value: "lowercase", label: "minuscules" },
    { value: "capitalize", label: "Capitaliser" },
];

// ---------- THEME COLORS (Toolbar accents) ----------

export const TOOLBAR_THEMES = {
    title: "blue-600",
    paragraph: "teal-600",
    button: "purple-600",
    image: "green-600",
    container: "indigo-600",
    icon: "pink-600",
    productCard: "orange-600",
} as const;
