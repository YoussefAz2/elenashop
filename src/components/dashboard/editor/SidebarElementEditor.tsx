"use client";

import React from "react";
import { X, Copy, ClipboardPaste, Undo2, Redo2, Sparkles } from "lucide-react";
import type { EditorStateReturn } from "@/hooks/useEditorState";
import { TitleToolbar } from "@/components/editor/toolbars/TitleToolbar";
import { ParagraphToolbar } from "@/components/editor/toolbars/ParagraphToolbar";
import { ButtonToolbar } from "@/components/editor/toolbars/ButtonToolbar";
import { ImageToolbar } from "@/components/editor/toolbars/ImageToolbar";
import { ProductCardToolbar } from "@/components/editor/toolbars/ProductCardToolbar";
import { ContainerToolbar } from "@/components/editor/toolbars/ContainerToolbar";
import { IconToolbar } from "@/components/editor/toolbars/IconToolbar";
import { DividerToolbar } from "@/components/editor/toolbars/DividerToolbar";

// ---------- PROPS ----------

interface SidebarElementEditorProps {
    editor: EditorStateReturn;
}

// ---------- COMPONENT ----------

/**
 * SidebarElementEditor
 * 
 * Displays element styling controls in the sidebar when an element is selected
 * from the mobile preview iframe. This provides the same editing experience
 * as the FloatingPalette but integrated into the sidebar layout.
 */
export function SidebarElementEditor({ editor }: SidebarElementEditorProps) {
    const { selectedElement, overrides, canUndo, canRedo, undo, redo, copyStyle, pasteStyle, copiedStyle } = editor;

    // Don't render if nothing selected
    if (!selectedElement) return null;

    const { id, type, label } = selectedElement;
    const currentStyles = overrides[id] || {};

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
        <div className="border-b border-zinc-100 dark:border-zinc-800">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 border-b border-purple-200/50">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-purple-500 text-white">
                        <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wide">
                            Élément sélectionné
                        </p>
                        <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate max-w-[180px]">
                            {label}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleClose}
                    className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-white/10 transition-colors"
                    title="Fermer"
                >
                    <X className="w-4 h-4 text-zinc-500" />
                </button>
            </div>

            {/* Actions bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-1">
                    {/* Undo */}
                    <button
                        onClick={undo}
                        disabled={!canUndo}
                        className="p-2 rounded-lg hover:bg-white dark:hover:bg-zinc-800 disabled:opacity-30 transition-colors"
                        title="Annuler (Ctrl+Z)"
                    >
                        <Undo2 className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                    </button>
                    {/* Redo */}
                    <button
                        onClick={redo}
                        disabled={!canRedo}
                        className="p-2 rounded-lg hover:bg-white dark:hover:bg-zinc-800 disabled:opacity-30 transition-colors"
                        title="Rétablir (Ctrl+Shift+Z)"
                    >
                        <Redo2 className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                    </button>
                    <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-700 mx-1" />
                    {/* Copy style */}
                    <button
                        onClick={() => copyStyle(id)}
                        className="p-2 rounded-lg hover:bg-white dark:hover:bg-zinc-800 transition-colors"
                        title="Copier le style"
                    >
                        <Copy className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                    </button>
                    {/* Paste style */}
                    <button
                        onClick={() => pasteStyle(id)}
                        disabled={!copiedStyle}
                        className="p-2 rounded-lg hover:bg-white dark:hover:bg-zinc-800 disabled:opacity-30 transition-colors"
                        title="Coller le style"
                    >
                        <ClipboardPaste className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                    </button>
                </div>
                <button
                    onClick={handleReset}
                    className="text-xs font-medium text-zinc-500 hover:text-red-500 transition-colors px-2 py-1"
                >
                    Réinitialiser
                </button>
            </div>

            {/* Toolbar content */}
            <div className="p-4">
                {renderToolbar()}
            </div>
        </div>
    );
}
