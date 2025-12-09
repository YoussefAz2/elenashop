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

    // Get override styles DIRECTLY from editor.overrides (not getOverride which uses stale ref)
    // This ensures real-time updates when state changes
    const overrideStyles = editor?.overrides?.[id];

    // CSS variables for !important override via globals.css
    const appliedStyles: React.CSSProperties = overrideStyles ? {
        // CSS variables that get picked up by globals.css with !important
        ["--editable-color" as string]: overrideStyles.color,
        ["--editable-font-size" as string]: overrideStyles.fontSize,
        ["--editable-font-weight" as string]: overrideStyles.fontWeight,
        ["--editable-text-align" as string]: overrideStyles.textAlign,
        ["--editable-bg-color" as string]: overrideStyles.backgroundColor,
    } : {};

    // Data attributes that enable the CSS !important rules
    const dataAttributes: Record<string, boolean | undefined> = {
        "data-editable-override-fontsize": !!overrideStyles?.fontSize,
        "data-editable-override-color": !!overrideStyles?.color,
        "data-editable-override-fontweight": !!overrideStyles?.fontWeight,
        "data-editable-override-textalign": !!overrideStyles?.textAlign,
        "data-editable-override-bgcolor": !!overrideStyles?.backgroundColor,
    };

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

    // Render children with override styles applied
    const renderContent = () => {
        if (!overrideStyles) return children;

        // Clone children to apply override styles
        return React.Children.map(children, child => {
            if (!React.isValidElement(child)) return child;

            // Merge override styles with child's existing styles
            const childStyle = (child.props as { style?: React.CSSProperties }).style || {};
            return React.cloneElement(child as React.ReactElement<{ style?: React.CSSProperties }>, {
                style: {
                    ...childStyle,
                    ...(overrideStyles.color && { color: overrideStyles.color }),
                    ...(overrideStyles.fontSize && { fontSize: overrideStyles.fontSize }),
                    ...(overrideStyles.fontWeight && { fontWeight: overrideStyles.fontWeight }),
                    ...(overrideStyles.backgroundColor && { backgroundColor: overrideStyles.backgroundColor }),
                    ...(overrideStyles.textAlign && { textAlign: overrideStyles.textAlign }),
                },
            });
        });
    };

    if (!isEditing) {
        return (
            <div
                ref={ref}
                className={className}
                style={appliedStyles}
                {...(dataAttributes["data-editable-override-fontsize"] ? { "data-editable-override-fontsize": "" } : {})}
                {...(dataAttributes["data-editable-override-color"] ? { "data-editable-override-color": "" } : {})}
                {...(dataAttributes["data-editable-override-fontweight"] ? { "data-editable-override-fontweight": "" } : {})}
                {...(dataAttributes["data-editable-override-textalign"] ? { "data-editable-override-textalign": "" } : {})}
                {...(dataAttributes["data-editable-override-bgcolor"] ? { "data-editable-override-bgcolor": "" } : {})}
            >
                {renderContent()}
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
            {...(dataAttributes["data-editable-override-fontsize"] ? { "data-editable-override-fontsize": "" } : {})}
            {...(dataAttributes["data-editable-override-color"] ? { "data-editable-override-color": "" } : {})}
            {...(dataAttributes["data-editable-override-fontweight"] ? { "data-editable-override-fontweight": "" } : {})}
            {...(dataAttributes["data-editable-override-textalign"] ? { "data-editable-override-textalign": "" } : {})}
            {...(dataAttributes["data-editable-override-bgcolor"] ? { "data-editable-override-bgcolor": "" } : {})}
        >
            {renderContent()}

            {/* Override badge - small indicator showing element has custom styles */}
            {hasOverride && !isSelected && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center text-white text-[8px] shadow-sm z-10 pointer-events-none">
                    ✨
                </span>
            )}

            {/* Ring indicator is enough - labels removed to not block view */}
        </div>
    );
}
