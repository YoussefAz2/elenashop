"use client";

import React, { useEffect, useRef } from "react";
import { X, Copy, ClipboardPaste, Undo2, Redo2 } from "lucide-react";
import type { EditorStateReturn } from "@/hooks/useEditorState";
import { TitleToolbar } from "./toolbars/TitleToolbar";
import { ParagraphToolbar } from "./toolbars/ParagraphToolbar";
import { ButtonToolbar } from "./toolbars/ButtonToolbar";
import { ImageToolbar } from "./toolbars/ImageToolbar";
import { ProductCardToolbar } from "./toolbars/ProductCardToolbar";
import { ContainerToolbar } from "./toolbars/ContainerToolbar";
import { IconToolbar } from "./toolbars/IconToolbar";
import { DividerToolbar } from "./toolbars/DividerToolbar";

// ---------- PROPS ----------

interface FloatingPaletteProps {
    editor: EditorStateReturn;
}

// ---------- COMPONENT ----------

export function FloatingPalette({ editor }: FloatingPaletteProps) {
    const paletteRef = useRef<HTMLDivElement>(null);
    const { selectedElement, overrides, canUndo, canRedo, undo, redo, copyStyle, pasteStyle, copiedStyle } = editor;

    // Close on escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                editor.clearSelection();
            }
            // Undo/Redo shortcuts
            if ((e.metaKey || e.ctrlKey) && e.key === "z") {
                e.preventDefault();
                if (e.shiftKey) {
                    redo();
                } else {
                    undo();
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [editor, undo, redo]);

    // Don't render if nothing selected
    if (!selectedElement) return null;

    const { id, type, label, rect } = selectedElement;
    const currentStyles = overrides[id] || {};

    // Calculate position
    const getPosition = () => {
        if (!rect) return { top: 100, left: 100 };

        // Position to the right of the element if space, otherwise left
        const paletteWidth = 300;
        const viewportWidth = window.innerWidth;

        let left = rect.right + 16;
        if (left + paletteWidth > viewportWidth - 20) {
            left = rect.left - paletteWidth - 16;
        }
        if (left < 20) {
            left = 20;
        }

        let top = rect.top;
        if (top + 400 > window.innerHeight) {
            top = Math.max(20, window.innerHeight - 420);
        }

        return { top, left };
    };

    const position = getPosition();

    const handleSave = (styles: import("@/types").ElementStyleOverride) => {
        editor.setOverride(id, styles);
    };

    const handleReset = () => {
        editor.resetOverride(id);
    };

    const handleClose = () => {
        editor.clearSelection();
    };

    // Render the appropriate toolbar based on type
    const renderToolbar = () => {
        const toolbarProps = {
            elementId: id,
            elementLabel: label,
            currentStyles: currentStyles,
            onSave: handleSave,
            onReset: handleReset,
            onClose: handleClose,
        };

        switch (type) {
            case "title":
                return <TitleToolbar {...toolbarProps} />;
            case "paragraph":
                return <ParagraphToolbar {...toolbarProps} />;
            case "button":
                return <ButtonToolbar {...toolbarProps} />;
            case "image":
                return <ImageToolbar {...toolbarProps} />;
            case "productCard":
                return <ProductCardToolbar {...toolbarProps} />;
            case "container":
                return <ContainerToolbar {...toolbarProps} />;
            case "icon":
                return <IconToolbar {...toolbarProps} />;
            case "divider":
                return <DividerToolbar {...toolbarProps} />;
            // Legacy "text" type - use TitleToolbar as default
            case "text":
            default:
                return <TitleToolbar {...toolbarProps} />;
        }
    };

    return (
        <div
            ref={paletteRef}
            className="fixed z-[9999] w-[280px] bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
            style={{ top: position.top, left: position.left }}
        >
            {/* Top bar with actions */}
            <div className="flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-slate-800 border-b">
                <div className="flex items-center gap-1">
                    {/* Undo */}
                    <button
                        onClick={undo}
                        disabled={!canUndo}
                        className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors"
                        title="Annuler (Ctrl+Z)"
                    >
                        <Undo2 className="w-4 h-4" />
                    </button>
                    {/* Redo */}
                    <button
                        onClick={redo}
                        disabled={!canRedo}
                        className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors"
                        title="Rétablir (Ctrl+Shift+Z)"
                    >
                        <Redo2 className="w-4 h-4" />
                    </button>
                    <div className="w-px h-4 bg-slate-300 mx-1" />
                    {/* Copy style */}
                    <button
                        onClick={() => copyStyle(id)}
                        className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        title="Copier le style"
                    >
                        <Copy className="w-4 h-4" />
                    </button>
                    {/* Paste style */}
                    <button
                        onClick={() => pasteStyle(id)}
                        disabled={!copiedStyle}
                        className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors"
                        title="Coller le style"
                    >
                        <ClipboardPaste className="w-4 h-4" />
                    </button>
                </div>
                <button
                    onClick={handleClose}
                    className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Toolbar content */}
            <div className="p-4 max-h-[400px] overflow-y-auto">
                {renderToolbar()}
            </div>
        </div>
    );
}
