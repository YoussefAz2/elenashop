"use client";

import React, { useEffect, useRef } from "react";
import type { EditorStateReturn } from "@/hooks/useEditorState";

interface EditorWrapperProps {
    editor?: EditorStateReturn;
    children: React.ReactNode;
    className?: string;
}

/**
 * EditorWrapper - Wrapper centralisé pour le mode édition
 * 
 * Ce composant gère automatiquement :
 * - Le blocage de tous les clics (liens, boutons) en mode édition
 * - L'attribut data-editing pour le CSS global
 * 
 * Usage:
 * <EditorWrapper editor={editor}>
 *   <TemplateMinimal {...props} />
 * </EditorWrapper>
 */
export function EditorWrapper({ editor, children, className = "" }: EditorWrapperProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    // Block ALL clicks in edit mode except for editable areas
    useEffect(() => {
        if (!editor?.isEditing) return;

        const container = containerRef.current;
        if (!container) return;

        const blockClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Allow clicks on EditableArea elements (they have data-editable-area)
            if (target.closest('[data-editable-area]')) {
                return;
            }
            // Block everything else
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        };

        // Use capture phase to intercept BEFORE React handlers
        container.addEventListener('click', blockClick, true);

        return () => {
            container.removeEventListener('click', blockClick, true);
        };
    }, [editor?.isEditing]);

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
