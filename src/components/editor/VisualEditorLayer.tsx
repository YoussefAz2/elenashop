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

    // Detect mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Update editor state
    useEffect(() => {
        editor.setMobileView(isMobile);
    }, [isMobile, editor]);

    // When in preview mode, disable all pointer events on editable areas
    const containerClassName = editor.isPreviewMode
        ? ""
        : "";

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
