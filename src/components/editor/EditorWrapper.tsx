"use client";

import React, { useEffect, useRef, useCallback } from "react";
import type { EditorStateReturn, EditableType } from "@/hooks/useEditorState";

interface EditorWrapperProps {
    editor?: EditorStateReturn;
    children: React.ReactNode;
    className?: string;
}

/**
 * EditorWrapper - Système d'édition automatique centralisé
 * 
 * Détecte automatiquement les éléments avec data-editable et les rend éditables.
 * 
 * Usage dans les templates:
 * <h1 data-editable="title" data-editable-id="hero-title">Mon Titre</h1>
 * <button data-editable="button" data-editable-id="hero-btn">Commander</button>
 */
export function EditorWrapper({ editor, children, className = "" }: EditorWrapperProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const hoveredElementRef = useRef<HTMLElement | null>(null);

    // Get editable element from click target
    const getEditableElement = useCallback((target: HTMLElement) => {
        // Find closest element with data-editable
        const editableEl = target.closest('[data-editable]') as HTMLElement | null;
        if (!editableEl) return null;

        const type = editableEl.getAttribute('data-editable') as EditableType;
        const id = editableEl.getAttribute('data-editable-id') || `auto-${type}-${Date.now()}`;
        const label = editableEl.getAttribute('data-editable-label') || getDefaultLabel(type);

        return { element: editableEl, id, type, label };
    }, []);

    // Default labels for element types
    const getDefaultLabel = (type: EditableType): string => {
        const labels: Record<EditableType, string> = {
            title: "Titre",
            paragraph: "Paragraphe",
            button: "Bouton",
            image: "Image",
            productCard: "Cartes produit",
            container: "Section",
            icon: "Icône",
            divider: "Séparateur",
            text: "Texte",
            section: "Section"
        };
        return labels[type] || "Élément";
    };

    // Handle clicks on editable elements
    useEffect(() => {
        if (!editor?.isEditing) return;

        const container = containerRef.current;
        if (!container) return;

        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const editable = getEditableElement(target);

            if (editable) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                // Select the element
                editor.selectElement({
                    id: editable.id,
                    type: editable.type,
                    label: editable.label,
                    rect: editable.element.getBoundingClientRect()
                });
            } else {
                // Block click but don't select
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
            }
        };

        // Use capture phase to intercept BEFORE React handlers
        container.addEventListener('click', handleClick, true);

        return () => {
            container.removeEventListener('click', handleClick, true);
        };
    }, [editor?.isEditing, editor?.selectElement, getEditableElement]);

    // Add hover effects to editable elements
    useEffect(() => {
        if (!editor?.isEditing) return;

        const container = containerRef.current;
        if (!container) return;

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const editable = getEditableElement(target);

            // Clear previous hover
            if (hoveredElementRef.current && hoveredElementRef.current !== editable?.element) {
                hoveredElementRef.current.removeAttribute('data-editable-hover');
            }

            if (editable) {
                editable.element.setAttribute('data-editable-hover', '');
                hoveredElementRef.current = editable.element;

                editor.hoverElement({
                    id: editable.id,
                    type: editable.type,
                    label: editable.label,
                    rect: editable.element.getBoundingClientRect()
                });
            }
        };

        const handleMouseOut = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const editable = getEditableElement(target);

            if (editable) {
                editable.element.removeAttribute('data-editable-hover');
            }

            editor.hoverElement(null);
            hoveredElementRef.current = null;
        };

        container.addEventListener('mouseover', handleMouseOver);
        container.addEventListener('mouseout', handleMouseOut);

        return () => {
            container.removeEventListener('mouseover', handleMouseOver);
            container.removeEventListener('mouseout', handleMouseOut);
            // Clean up any remaining hover state
            if (hoveredElementRef.current) {
                hoveredElementRef.current.removeAttribute('data-editable-hover');
            }
        };
    }, [editor?.isEditing, editor?.hoverElement, getEditableElement]);

    // Apply styles to editable elements
    useEffect(() => {
        if (!editor?.isEditing) return;

        const container = containerRef.current;
        if (!container) return;

        // Helper to apply all style overrides to an HTMLElement
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const applyStyles = (el: HTMLElement, overrides: any) => {
            // Text styles
            if (overrides.color) el.style.color = overrides.color;
            if (overrides.fontSize) el.style.fontSize = overrides.fontSize;
            if (overrides.fontWeight) el.style.fontWeight = overrides.fontWeight;
            if (overrides.fontFamily) el.style.fontFamily = overrides.fontFamily;
            if (overrides.textAlign) el.style.textAlign = overrides.textAlign;
            if (overrides.lineHeight) el.style.lineHeight = overrides.lineHeight;
            if (overrides.letterSpacing) el.style.letterSpacing = overrides.letterSpacing;
            if (overrides.textTransform) el.style.textTransform = overrides.textTransform;
            if (overrides.fontStyle) el.style.fontStyle = overrides.fontStyle;
            if (overrides.textDecoration) el.style.textDecoration = overrides.textDecoration;
            if (overrides.textShadow) el.style.textShadow = overrides.textShadow;

            // Background & borders
            if (overrides.backgroundColor) el.style.backgroundColor = overrides.backgroundColor;
            if (overrides.backgroundImage) el.style.backgroundImage = overrides.backgroundImage;
            if (overrides.borderRadius) el.style.borderRadius = overrides.borderRadius;
            if (overrides.borderColor) el.style.borderColor = overrides.borderColor;
            if (overrides.borderWidth) el.style.borderWidth = overrides.borderWidth;
            if (overrides.borderStyle) el.style.borderStyle = overrides.borderStyle;

            // Spacing & dimensions
            if (overrides.padding) el.style.padding = overrides.padding;
            if (overrides.width) el.style.width = overrides.width;

            // Effects
            if (overrides.boxShadow) el.style.boxShadow = overrides.boxShadow;
            if (overrides.opacity !== undefined) el.style.opacity = String(overrides.opacity);

            // Flex
            if (overrides.display) el.style.display = overrides.display;
            if (overrides.flexDirection) el.style.flexDirection = overrides.flexDirection;
            if (overrides.alignItems) el.style.alignItems = overrides.alignItems;
            if (overrides.justifyContent) el.style.justifyContent = overrides.justifyContent;
        };

        // Find all editable elements and apply overrides
        const editableElements = container.querySelectorAll('[data-editable]');

        editableElements.forEach((el) => {
            const htmlEl = el as HTMLElement;
            const id = htmlEl.getAttribute('data-editable-id');
            const type = htmlEl.getAttribute('data-editable');

            if (id && editor.overrides[id]) {
                const overrides = editor.overrides[id];

                // For buttons/badges, apply to children elements, not the wrapper
                if (type === 'button') {
                    // Get the child button/link element
                    const childLink = htmlEl.querySelector('a, button') as HTMLElement;
                    const targetEl = childLink || htmlEl;

                    // Apply all basic styles
                    applyStyles(targetEl, overrides);

                    // Handle paddingX/Y
                    if (overrides.paddingY || overrides.paddingX) {
                        const py = overrides.paddingY || '12px';
                        const px = overrides.paddingX || '24px';
                        targetEl.style.padding = `${py} ${px}`;
                    }

                    // Handle hover states via CSS custom properties
                    if (overrides.hoverBackgroundColor) {
                        targetEl.style.setProperty('--hover-bg', overrides.hoverBackgroundColor);
                        targetEl.setAttribute('data-has-hover', 'true');
                    }
                    if (overrides.hoverColor) {
                        targetEl.style.setProperty('--hover-color', overrides.hoverColor);
                    }

                    // Apply text color to all child spans
                    htmlEl.querySelectorAll('span').forEach((span) => {
                        if (overrides.color) span.style.color = overrides.color;
                        if (overrides.backgroundColor) span.style.backgroundColor = overrides.backgroundColor;
                        if (overrides.paddingY || overrides.paddingX) {
                            const py = overrides.paddingY || '12px';
                            const px = overrides.paddingX || '24px';
                            span.style.padding = `${py} ${px}`;
                        }
                        if (overrides.borderRadius) span.style.borderRadius = overrides.borderRadius;
                    });

                    // Apply icon color to child SVGs
                    htmlEl.querySelectorAll('svg').forEach((svg) => {
                        if (overrides.color) svg.style.color = overrides.color;
                    });
                }
                // For images, apply to child img element
                else if (type === 'image') {
                    const imgEl = htmlEl.querySelector('img') as HTMLImageElement;
                    if (imgEl) {
                        if (overrides.opacity !== undefined) imgEl.style.opacity = String(overrides.opacity);
                        if (overrides.filter) imgEl.style.filter = overrides.filter;
                        if (overrides.borderRadius) imgEl.style.borderRadius = overrides.borderRadius;
                    } else {
                        // Apply to wrapper if no img found
                        if (overrides.opacity !== undefined) htmlEl.style.opacity = String(overrides.opacity);
                        if (overrides.filter) htmlEl.style.filter = overrides.filter;
                        if (overrides.borderRadius) htmlEl.style.borderRadius = overrides.borderRadius;
                    }
                }
                // For containers/sections, apply background and spacing styles
                else if (type === 'container' || type === 'section') {
                    if (overrides.backgroundColor) htmlEl.style.backgroundColor = overrides.backgroundColor;
                    if (overrides.padding) htmlEl.style.padding = overrides.padding;
                }
                // For icons, apply icon color
                else if (type === 'icon') {
                    const iconColor = overrides.iconColor || overrides.color;
                    if (iconColor) {
                        // Apply to the element itself and any child SVG/icon
                        htmlEl.style.color = iconColor;
                        const svgEl = htmlEl.querySelector('svg');
                        if (svgEl) {
                            svgEl.style.color = iconColor;
                        }
                    }
                }
                // For dividers, apply divider-specific styles
                else if (type === 'divider') {
                    if (overrides.backgroundColor) htmlEl.style.backgroundColor = overrides.backgroundColor;
                    if (overrides.borderWidth) htmlEl.style.height = overrides.borderWidth;
                    if (overrides.width) htmlEl.style.width = overrides.width;
                    if (overrides.opacity !== undefined) htmlEl.style.opacity = String(overrides.opacity);
                    // Apply alignment via margin
                    if (overrides.dividerAlign && overrides.width !== "100%") {
                        switch (overrides.dividerAlign) {
                            case "left":
                                htmlEl.style.marginLeft = "0";
                                htmlEl.style.marginRight = "auto";
                                break;
                            case "right":
                                htmlEl.style.marginLeft = "auto";
                                htmlEl.style.marginRight = "0";
                                break;
                            default: // center
                                htmlEl.style.marginLeft = "auto";
                                htmlEl.style.marginRight = "auto";
                                break;
                        }
                    }
                }
                // For text elements (title, paragraph, text)
                else {
                    applyStyles(htmlEl, overrides);
                }
            }

            // Mark selected element
            if (editor.selectedElement?.id === id) {
                htmlEl.setAttribute('data-editable-selected', '');
            } else {
                htmlEl.removeAttribute('data-editable-selected');
            }
        });

        // ===== CENTRALIZED PRODUCT CARD STYLE APPLICATION =====
        const cardStyleId = "product-cards-style";
        const cardOverrides = editor.overrides[cardStyleId];

        if (cardOverrides) {
            // Apply to card containers
            container.querySelectorAll('[data-editable-card="product-cards-style"]').forEach((el) => {
                const htmlEl = el as HTMLElement;
                if (cardOverrides.backgroundColor) htmlEl.style.backgroundColor = cardOverrides.backgroundColor;
                if (cardOverrides.borderRadius) htmlEl.style.borderRadius = cardOverrides.borderRadius;
                if (cardOverrides.boxShadow) htmlEl.style.boxShadow = cardOverrides.boxShadow;
                if (cardOverrides.padding) htmlEl.style.padding = cardOverrides.padding;
            });

            // Apply to info box (title/price area)
            container.querySelectorAll('[data-card-info-box="product-cards-style"]').forEach((el) => {
                const htmlEl = el as HTMLElement;
                if (cardOverrides.infoBoxBackgroundColor) htmlEl.style.backgroundColor = cardOverrides.infoBoxBackgroundColor;
                if (cardOverrides.infoBoxPadding) htmlEl.style.padding = cardOverrides.infoBoxPadding;
                if (cardOverrides.infoBoxFullWidth) {
                    htmlEl.style.marginLeft = `-${cardOverrides.padding || '0px'}`;
                    htmlEl.style.marginRight = `-${cardOverrides.padding || '0px'}`;
                    htmlEl.style.marginBottom = `-${cardOverrides.padding || '0px'}`;
                    htmlEl.style.paddingLeft = cardOverrides.padding || '16px';
                    htmlEl.style.paddingRight = cardOverrides.padding || '16px';
                    htmlEl.style.paddingBottom = cardOverrides.padding || '16px';
                }
            });

            // Apply to card titles
            container.querySelectorAll('[data-card-title="product-cards-style"]').forEach((el) => {
                const htmlEl = el as HTMLElement;
                if (cardOverrides.titleColor) htmlEl.style.color = cardOverrides.titleColor;
            });

            // Apply to card descriptions
            container.querySelectorAll('[data-card-description="product-cards-style"]').forEach((el) => {
                const htmlEl = el as HTMLElement;
                if (cardOverrides.descriptionColor) htmlEl.style.color = cardOverrides.descriptionColor;
            });

            // Apply to card prices
            container.querySelectorAll('[data-card-price="product-cards-style"]').forEach((el) => {
                const htmlEl = el as HTMLElement;
                if (cardOverrides.priceColor) htmlEl.style.color = cardOverrides.priceColor;
            });

            // Apply to card buttons (COMMANDER buttons)
            container.querySelectorAll('[data-card-button="product-cards-style"]').forEach((el) => {
                const htmlEl = el as HTMLElement;
                if (cardOverrides.buttonBgColor) htmlEl.style.backgroundColor = cardOverrides.buttonBgColor;
                if (cardOverrides.buttonTextColor) htmlEl.style.color = cardOverrides.buttonTextColor;
            });
        }
    }, [editor?.isEditing, editor?.overrides, editor?.selectedElement]);

    return (
        <div
            ref={containerRef}
            data-editing={editor?.isEditing ? "" : undefined}
            className={className}
        >
            {children}
        </div>
    );
}
