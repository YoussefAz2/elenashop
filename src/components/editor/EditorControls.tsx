"use client";

import React from "react";
import { Eye, EyeOff, Smartphone, Monitor, Wand2, Sparkles } from "lucide-react";
import type { EditorStateReturn } from "@/hooks/useEditorState";

// ---------- PROPS ----------

interface EditorControlsProps {
    editor: EditorStateReturn;
}

// ---------- COMPONENT ----------

export function EditorControls({ editor }: EditorControlsProps) {
    const { isEditing, isPreviewMode, isMobile } = editor;

    return (
        <div className="flex items-center gap-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
            {/* Edit mode toggle */}
            <button
                onClick={() => editor.setEditingMode(!isEditing)}
                className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
                    ${isEditing
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900"
                        : "bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                    }
                `}
            >
                <Wand2 className="w-4 h-4" />
                <span className="hidden sm:inline">
                    {isEditing ? "Mode Édition" : "Éditer"}
                </span>
            </button>

            {/* Separator */}
            <div className="w-px h-6 bg-slate-300 dark:bg-slate-600" />

            {/* Preview toggle */}
            <button
                onClick={editor.togglePreviewMode}
                className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
                    ${isPreviewMode
                        ? "bg-green-600 text-white"
                        : "bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                    }
                `}
                title={isPreviewMode ? "Mode Aperçu actif" : "Voir l'aperçu"}
            >
                {isPreviewMode ? (
                    <Eye className="w-4 h-4" />
                ) : (
                    <EyeOff className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">Aperçu</span>
            </button>

            {/* Responsive toggle */}
            <button
                onClick={() => editor.setMobileView(!isMobile)}
                className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
                    bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50
                `}
                title={isMobile ? "Vue Mobile" : "Vue Desktop"}
            >
                {isMobile ? (
                    <Smartphone className="w-4 h-4" />
                ) : (
                    <Monitor className="w-4 h-4" />
                )}
            </button>

            {/* Edit status */}
            {isEditing && !isPreviewMode && (
                <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 ml-2">
                    <Sparkles className="w-3 h-3 animate-pulse" />
                    <span>Cliquez sur un élément</span>
                </div>
            )}
        </div>
    );
}
