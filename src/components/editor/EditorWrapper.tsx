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

    // Apply styles to selected element
    useEffect(() => {
        if (!editor?.isEditing) return;

        const container = containerRef.current;
        if (!container) return;

        // Find all editable elements and apply overrides
        const editableElements = container.querySelectorAll('[data-editable]');

        editableElements.forEach((el) => {
            const htmlEl = el as HTMLElement;
            const id = htmlEl.getAttribute('data-editable-id');

            if (id && editor.overrides[id]) {
                const overrides = editor.overrides[id];

                // Apply style overrides
                if (overrides.color) htmlEl.style.color = overrides.color;
                if (overrides.backgroundColor) htmlEl.style.backgroundColor = overrides.backgroundColor;
                if (overrides.fontSize) htmlEl.style.fontSize = overrides.fontSize;
                if (overrides.fontWeight) htmlEl.style.fontWeight = overrides.fontWeight;
                if (overrides.fontFamily) htmlEl.style.fontFamily = overrides.fontFamily;
                if (overrides.textAlign) htmlEl.style.textAlign = overrides.textAlign;
                if (overrides.borderRadius) htmlEl.style.borderRadius = overrides.borderRadius;
                if (overrides.opacity !== undefined) htmlEl.style.opacity = String(overrides.opacity);
                if (overrides.lineHeight) htmlEl.style.lineHeight = overrides.lineHeight;
                if (overrides.padding) htmlEl.style.padding = overrides.padding;
                if (overrides.boxShadow) htmlEl.style.boxShadow = overrides.boxShadow;
            }

            // Mark selected element
            if (editor.selectedElement?.id === id) {
                htmlEl.setAttribute('data-editable-selected', '');
            } else {
                htmlEl.removeAttribute('data-editable-selected');
            }
        });
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
