"use client";

import React, { useEffect, useState } from "react";
import { EditorStateReturn } from "@/hooks/useEditorState";
import { FloatingPalette } from "./FloatingPalette";
import { EditorDrawer } from "./EditorDrawer";

// ---------- PROPS ----------

interface VisualEditorLayerProps {
    editor: EditorStateReturn;
    children: React.ReactNode;
}

// ---------- COMPONENT ----------

export function VisualEditorLayer({ editor, children }: VisualEditorLayerProps) {
    const [isMobile, setIsMobile] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Detect mobile
    useEffect(() => {
        setIsMounted(true);
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Update editor state - only depend on isMobile, not editor
    // editor.setMobileView is a stable callback (useCallback with empty deps)
    useEffect(() => {
        editor.setMobileView(isMobile);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMobile]);

    // When in preview mode, disable all pointer events on editable areas
    const containerClassName = editor.isPreviewMode
        ? ""
        : "";

    if (!isMounted) {
        return <div className={containerClassName}>{children}</div>;
    }

    return (
        <div className={containerClassName}>
            {/* Main content */}
            {children}

            {/* Editor UI - only show when editing and element selected */}
            {editor.isEditing && editor.selectedElement && (
                <>
                    {isMobile ? (
                        <EditorDrawer editor={editor} />
                    ) : (
                        <FloatingPalette editor={editor} />
                    )}
                </>
            )}
        </div>
    );
}
