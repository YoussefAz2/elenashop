"use client";

import React, { useRef, ReactNode, useCallback } from "react";
import type { EditableType, EditorStateReturn } from "@/hooks/useEditorState";

// ---------- LABEL MAPPING ----------

const ELEMENT_LABELS: Record<string, string> = {
    // Hero
    "hero-title": "Titre Hero",
    "hero-subtitle": "Sous-titre Hero",
    "hero-button": "Bouton Hero",
    "hero-section": "Section Hero",
    "hero-image": "Image Hero",
    // Products
    "products-title": "Titre Produits",
    "products-section": "Section Produits",
    // About
    "about-title": "Titre À Propos",
    "about-text": "Texte À Propos",
    "about-section": "Section À Propos",
    "about-image": "Image À Propos",
    // Testimonials
    "testimonials-title": "Titre Témoignages",
    "testimonials-section": "Section Témoignages",
    // Footer
    "footer-section": "Footer",
    "footer-text": "Texte Footer",
};

// ---------- PROPS ----------

interface EditableAreaProps {
    id: string;
    type: EditableType;
    label?: string;
    className?: string;
    children: ReactNode;
    // Editor connection
    editor?: EditorStateReturn;
}

// ---------- COMPONENT ----------

export function EditableArea({
    id,
    type,
    label,
    className = "",
    children,
    editor,
}: EditableAreaProps) {
    const ref = useRef<HTMLDivElement>(null);

    // Determine label
    const displayLabel = label || ELEMENT_LABELS[id] || id;

    // Check if we're in editing mode
    const isEditing = editor?.isEditing && !editor?.isPreviewMode;
    const isSelected = editor?.selectedElement?.id === id;
    const isHovered = editor?.hoveredElement?.id === id;
    const hasOverride = editor?.overrides?.[id] !== undefined;

    // Get override styles
    const overrideStyles = editor?.getOverride?.(id);
    const appliedStyles: React.CSSProperties = overrideStyles ? {
        color: overrideStyles.color,
        backgroundColor: overrideStyles.backgroundColor,
        fontSize: overrideStyles.fontSize,
        fontWeight: overrideStyles.fontWeight as React.CSSProperties["fontWeight"],
        fontFamily: overrideStyles.fontFamily,
    } : {};

    // ---------- HANDLERS ----------

    const handleClick = useCallback((e: React.MouseEvent) => {
        if (!isEditing) return;

        e.preventDefault();
        e.stopPropagation();

        const rect = ref.current?.getBoundingClientRect();
        editor?.selectElement({ id, type, label: displayLabel, rect });
    }, [isEditing, editor, id, type, displayLabel]);

    const handleMouseEnter = useCallback(() => {
        if (!isEditing) return;
        editor?.hoverElement({ id, type, label: displayLabel });
    }, [isEditing, editor, id, type, displayLabel]);

    const handleMouseLeave = useCallback(() => {
        if (!isEditing) return;
        editor?.hoverElement(null);
    }, [isEditing, editor]);

    // ---------- NOT IN EDIT MODE ----------

    if (!isEditing) {
        return (
            <div ref={ref} className={className} style={appliedStyles}>
                {children}
            </div>
        );
    }

    // ---------- EDIT MODE ----------

    return (
        <div
            ref={ref}
            className={`
                ${className}
                relative cursor-pointer transition-all duration-150
                ${isSelected ? "ring-2 ring-blue-500 ring-offset-2" : ""}
                ${isHovered && !isSelected ? "ring-1 ring-blue-400/50" : ""}
            `}
            style={appliedStyles}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}

            {/* Override badge */}
            {hasOverride && !isSelected && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center text-white text-[8px] shadow-sm z-10 pointer-events-none">
                    ✨
                </span>
            )}

            {/* Hover label */}
            {isHovered && !isSelected && (
                <div className="absolute -top-7 left-0 bg-blue-600 text-white text-[10px] font-medium px-2 py-0.5 rounded shadow-lg z-20 whitespace-nowrap pointer-events-none">
                    {displayLabel}
                </div>
            )}

            {/* Selected indicator */}
            {isSelected && (
                <div className="absolute -top-7 left-0 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded shadow-lg z-20 flex items-center gap-1 pointer-events-none">
                    <span>✏️</span>
                    <span>{displayLabel}</span>
                </div>
            )}
        </div>
    );
}
