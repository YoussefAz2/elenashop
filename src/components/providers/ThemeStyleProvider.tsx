"use client";

import React, { createContext, useContext, useEffect, useMemo, ReactNode } from "react";
import type { ThemeConfig } from "@/types";

// ---------- TYPES ----------

interface ThemeVariables {
    // Colors
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
    muted: string;
    // Typography
    fontHeading: string;
    fontBody: string;
    // Spacing & Shape
    radius: string;
    // Shadows
    shadowSoft: string;
    shadowStrong: string;
}

interface ThemeStyleContextType {
    variables: ThemeVariables;
    activePreset: string | null;
    applyPreset: (presetId: string) => void;
}

// ---------- PRESETS ----------

export const THEME_PRESETS: Record<string, { name: string; emoji: string; variables: Partial<ThemeVariables> }> = {
    "minimalist-white": {
        name: "Minimalist White",
        emoji: "⬜",
        variables: {
            primary: "#1a1a1a",
            secondary: "#6b7280",
            background: "#ffffff",
            text: "#1a1a1a",
            accent: "#3b82f6",
            muted: "#f3f4f6",
            fontHeading: "Inter",
            fontBody: "Inter",
            radius: "8px",
        },
    },
    "midnight-black": {
        name: "Midnight Black",
        emoji: "🌙",
        variables: {
            primary: "#ffffff",
            secondary: "#a1a1aa",
            background: "#0a0a0a",
            text: "#ffffff",
            accent: "#8b5cf6",
            muted: "#18181b",
            fontHeading: "Inter",
            fontBody: "Inter",
            radius: "8px",
        },
    },
    "royal-gold": {
        name: "Royal Gold",
        emoji: "👑",
        variables: {
            primary: "#d4af37",
            secondary: "#b8860b",
            background: "#1c1c1c",
            text: "#f5f5f5",
            accent: "#d4af37",
            muted: "#2a2a2a",
            fontHeading: "Playfair Display",
            fontBody: "Lato",
            radius: "4px",
        },
    },
    "streetwear-neon": {
        name: "Streetwear Neon",
        emoji: "⚡",
        variables: {
            primary: "#00ff88",
            secondary: "#ff00ff",
            background: "#0f0f0f",
            text: "#ffffff",
            accent: "#00ff88",
            muted: "#1a1a1a",
            fontHeading: "Bebas Neue",
            fontBody: "Roboto",
            radius: "0px",
        },
    },
    "corporate-blue": {
        name: "Corporate Blue",
        emoji: "💼",
        variables: {
            primary: "#2563eb",
            secondary: "#1e40af",
            background: "#f8fafc",
            text: "#1e293b",
            accent: "#2563eb",
            muted: "#e2e8f0",
            fontHeading: "Inter",
            fontBody: "Inter",
            radius: "6px",
        },
    },
    "soft-pastel": {
        name: "Soft Pastel",
        emoji: "🌸",
        variables: {
            primary: "#e879f9",
            secondary: "#f0abfc",
            background: "#fdf4ff",
            text: "#581c87",
            accent: "#e879f9",
            muted: "#fae8ff",
            fontHeading: "Quicksand",
            fontBody: "Nunito",
            radius: "16px",
        },
    },
};

// ---------- DEFAULT VALUES ----------

const DEFAULT_VARIABLES: ThemeVariables = {
    primary: "#1a1a1a",
    secondary: "#6b7280",
    background: "#ffffff",
    text: "#1a1a1a",
    accent: "#3b82f6",
    muted: "#f3f4f6",
    fontHeading: "Inter",
    fontBody: "Inter",
    radius: "8px",
    shadowSoft: "0 2px 8px rgba(0,0,0,0.08)",
    shadowStrong: "0 8px 32px rgba(0,0,0,0.16)",
};

// ---------- CONTEXT ----------

const ThemeStyleContext = createContext<ThemeStyleContextType | null>(null);

export function useThemeStyle() {
    const context = useContext(ThemeStyleContext);
    if (!context) {
        return {
            variables: DEFAULT_VARIABLES,
            activePreset: null,
            applyPreset: () => { },
        };
    }
    return context;
}

// ---------- PROVIDER ----------

interface ThemeStyleProviderProps {
    children: ReactNode;
    config?: ThemeConfig;
    onPresetChange?: (presetId: string) => void;
}

export function ThemeStyleProvider({
    children,
    config,
    onPresetChange,
}: ThemeStyleProviderProps) {
    // Build variables from config
    const variables = useMemo<ThemeVariables>(() => {
        const base = { ...DEFAULT_VARIABLES };

        if (config?.global) {
            const { colors, headingFont, font, borderRadius } = config.global;
            base.primary = colors.primary;
            base.background = colors.background;
            base.text = colors.text;
            base.accent = colors.primary;
            base.fontHeading = headingFont;
            base.fontBody = font;
            base.radius = borderRadius;
        }

        return base;
    }, [config]);

    const activePreset = config?.activePreset || null;

    const applyPreset = (presetId: string) => {
        onPresetChange?.(presetId);
    };

    // Inject CSS variables into document
    useEffect(() => {
        // Ensure we are in browser
        if (typeof window === "undefined") return;

        const root = document.documentElement;
        if (!root) return;

        root.style.setProperty("--theme-primary", variables.primary);
        root.style.setProperty("--theme-secondary", variables.secondary);
        root.style.setProperty("--theme-background", variables.background);
        root.style.setProperty("--theme-text", variables.text);
        root.style.setProperty("--theme-accent", variables.accent);
        root.style.setProperty("--theme-muted", variables.muted);
        root.style.setProperty("--theme-font-heading", `"${variables.fontHeading}", system-ui, sans-serif`);
        root.style.setProperty("--theme-font-body", `"${variables.fontBody}", system-ui, sans-serif`);
        root.style.setProperty("--theme-radius", variables.radius);
        root.style.setProperty("--theme-shadow-soft", variables.shadowSoft);
        root.style.setProperty("--theme-shadow-strong", variables.shadowStrong);

    }, [variables]);

    const contextValue = useMemo(() => ({
        variables,
        activePreset,
        applyPreset,
    }), [variables, activePreset]);

    return (
        <ThemeStyleContext.Provider value={contextValue}>
            {children}
        </ThemeStyleContext.Provider>
    );
}
