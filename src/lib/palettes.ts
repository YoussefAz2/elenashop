// Color Palettes - Only colors, no layout changes
// Templates handle layout, palettes handle colors

import type { GlobalStyles } from "@/types";

export interface ColorPalette {
    id: string;
    name: string;
    emoji: string;
    // Preview colors for the selector
    preview: {
        primary: string;
        secondary: string;
        accent: string;
    };
    // Actual colors to apply
    colors: {
        // Base
        background: string;
        text: string;
        primary: string;
        secondary: string;
        // Hero
        heroBg: string;
        heroText: string;
        heroButtonBg: string;
        heroButtonText: string;
        // Cards
        cardBg: string;
        cardText: string;
        cardPrice: string;
        cardBorder: string;
        // Buttons
        buttonBg: string;
        buttonText: string;
        buttonHover: string;
        // Footer
        footerBg: string;
        footerText: string;
        footerAccent: string;
    };
}

export const COLOR_PALETTES: ColorPalette[] = [
    {
        id: "minimal",
        name: "Minimal",
        emoji: "⚫",
        preview: { primary: "#18181b", secondary: "#f4f4f5", accent: "#71717a" },
        colors: {
            background: "#ffffff",
            text: "#18181b",
            primary: "#18181b",
            secondary: "#71717a",
            heroBg: "#18181b",
            heroText: "#ffffff",
            heroButtonBg: "#ffffff",
            heroButtonText: "#18181b",
            cardBg: "#ffffff",
            cardText: "#18181b",
            cardPrice: "#18181b",
            cardBorder: "#e4e4e7",
            buttonBg: "#18181b",
            buttonText: "#ffffff",
            buttonHover: "#27272a",
            footerBg: "#18181b",
            footerText: "#a1a1aa",
            footerAccent: "#ffffff",
        },
    },
    {
        id: "nature",
        name: "Nature",
        emoji: "🌿",
        preview: { primary: "#10b981", secondary: "#ecfdf5", accent: "#059669" },
        colors: {
            background: "#ffffff",
            text: "#1f2937",
            primary: "#10b981",
            secondary: "#6b7280",
            heroBg: "#10b981",
            heroText: "#ffffff",
            heroButtonBg: "#ffffff",
            heroButtonText: "#10b981",
            cardBg: "#ffffff",
            cardText: "#1f2937",
            cardPrice: "#10b981",
            cardBorder: "#d1fae5",
            buttonBg: "#10b981",
            buttonText: "#ffffff",
            buttonHover: "#059669",
            footerBg: "#065f46",
            footerText: "#a7f3d0",
            footerAccent: "#34d399",
        },
    },
    {
        id: "rose",
        name: "Rose",
        emoji: "🌸",
        preview: { primary: "#f43f5e", secondary: "#fff1f2", accent: "#e11d48" },
        colors: {
            background: "#ffffff",
            text: "#1f2937",
            primary: "#f43f5e",
            secondary: "#6b7280",
            heroBg: "#f43f5e",
            heroText: "#ffffff",
            heroButtonBg: "#ffffff",
            heroButtonText: "#f43f5e",
            cardBg: "#ffffff",
            cardText: "#1f2937",
            cardPrice: "#f43f5e",
            cardBorder: "#fecdd3",
            buttonBg: "#f43f5e",
            buttonText: "#ffffff",
            buttonHover: "#e11d48",
            footerBg: "#881337",
            footerText: "#fda4af",
            footerAccent: "#fb7185",
        },
    },
    {
        id: "ocean",
        name: "Ocean",
        emoji: "🧊",
        preview: { primary: "#0ea5e9", secondary: "#f0f9ff", accent: "#0284c7" },
        colors: {
            background: "#ffffff",
            text: "#0f172a",
            primary: "#0ea5e9",
            secondary: "#64748b",
            heroBg: "#0ea5e9",
            heroText: "#ffffff",
            heroButtonBg: "#ffffff",
            heroButtonText: "#0ea5e9",
            cardBg: "#ffffff",
            cardText: "#0f172a",
            cardPrice: "#0ea5e9",
            cardBorder: "#bae6fd",
            buttonBg: "#0ea5e9",
            buttonText: "#ffffff",
            buttonHover: "#0284c7",
            footerBg: "#0c4a6e",
            footerText: "#7dd3fc",
            footerAccent: "#38bdf8",
        },
    },
    {
        id: "sunset",
        name: "Sunset",
        emoji: "🌅",
        preview: { primary: "#f59e0b", secondary: "#fffbeb", accent: "#d97706" },
        colors: {
            background: "#ffffff",
            text: "#1f2937",
            primary: "#f59e0b",
            secondary: "#6b7280",
            heroBg: "#f59e0b",
            heroText: "#ffffff",
            heroButtonBg: "#ffffff",
            heroButtonText: "#f59e0b",
            cardBg: "#ffffff",
            cardText: "#1f2937",
            cardPrice: "#f59e0b",
            cardBorder: "#fde68a",
            buttonBg: "#f59e0b",
            buttonText: "#ffffff",
            buttonHover: "#d97706",
            footerBg: "#78350f",
            footerText: "#fcd34d",
            footerAccent: "#fbbf24",
        },
    },
    {
        id: "dark",
        name: "Dark",
        emoji: "🌙",
        preview: { primary: "#8b5cf6", secondary: "#1f2937", accent: "#a78bfa" },
        colors: {
            background: "#111827",
            text: "#f9fafb",
            primary: "#8b5cf6",
            secondary: "#9ca3af",
            heroBg: "#1f2937",
            heroText: "#f9fafb",
            heroButtonBg: "#8b5cf6",
            heroButtonText: "#ffffff",
            cardBg: "#1f2937",
            cardText: "#f9fafb",
            cardPrice: "#a78bfa",
            cardBorder: "#374151",
            buttonBg: "#8b5cf6",
            buttonText: "#ffffff",
            buttonHover: "#7c3aed",
            footerBg: "#030712",
            footerText: "#9ca3af",
            footerAccent: "#a78bfa",
        },
    },
];

// Apply a palette to a config
export function applyPalette(palette: ColorPalette, currentConfig: { global: GlobalStyles }): { global: GlobalStyles } {
    const { colors } = palette;

    return {
        global: {
            ...currentConfig.global,
            colors: {
                background: colors.background,
                text: colors.text,
                primary: colors.primary,
                secondary: colors.secondary,
            },
            hero: {
                ...currentConfig.global.hero,
                backgroundColor: colors.heroBg,
                textColor: colors.heroText,
                buttonBg: colors.heroButtonBg,
                buttonText: colors.heroButtonText,
            },
            cards: {
                ...currentConfig.global.cards,
                backgroundColor: colors.cardBg,
                textColor: colors.cardText,
                priceColor: colors.cardPrice,
                borderColor: colors.cardBorder,
            },
            buttons: {
                ...currentConfig.global.buttons,
                backgroundColor: colors.buttonBg,
                textColor: colors.buttonText,
                hoverBg: colors.buttonHover,
            },
            footer: {
                ...currentConfig.global.footer,
                backgroundColor: colors.footerBg,
                textColor: colors.footerText,
                accentColor: colors.footerAccent,
            },
        },
    };
}

// Get palette by ID
export function getPalette(id: string): ColorPalette | undefined {
    return COLOR_PALETTES.find((p) => p.id === id);
}
