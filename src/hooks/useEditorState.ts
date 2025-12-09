"use client";

import { useState, useCallback, useMemo } from "react";
import type { ElementStyleOverride } from "@/types";

// ---------- TYPES ----------

export type EditableType = "text" | "button" | "container" | "image" | "section";

export interface EditableElement {
    id: string;
    type: EditableType;
    label: string;
    rect?: DOMRect;
}

interface EditorHistory {
    past: Record<string, ElementStyleOverride>[];
    future: Record<string, ElementStyleOverride>[];
}

interface EditorState {
    // Mode
    isEditing: boolean;
    isPreviewMode: boolean;
    isMobile: boolean;
    // Selection
    selectedElement: EditableElement | null;
    hoveredElement: EditableElement | null;
    // Overrides
    overrides: Record<string, ElementStyleOverride>;
    // Clipboard
    copiedStyle: ElementStyleOverride | null;
    // History
    history: EditorHistory;
}

// ---------- HOOK ----------

export function useEditorState(
    initialOverrides: Record<string, ElementStyleOverride> = {},
    onOverridesChange?: (overrides: Record<string, ElementStyleOverride>) => void
) {
    const [state, setState] = useState<EditorState>({
        isEditing: false,
        isPreviewMode: false,
        isMobile: false,
        selectedElement: null,
        hoveredElement: null,
        overrides: initialOverrides,
        copiedStyle: null,
        history: { past: [], future: [] },
    });

    // ---------- MODE ACTIONS ----------

    const setEditingMode = useCallback((editing: boolean) => {
        setState(s => ({ ...s, isEditing: editing, selectedElement: null }));
    }, []);

    const togglePreviewMode = useCallback(() => {
        setState(s => ({ ...s, isPreviewMode: !s.isPreviewMode, selectedElement: null }));
    }, []);

    const setMobileView = useCallback((mobile: boolean) => {
        setState(s => ({ ...s, isMobile: mobile }));
    }, []);

    // ---------- SELECTION ACTIONS ----------

    const selectElement = useCallback((element: EditableElement | null) => {
        setState(s => ({ ...s, selectedElement: element }));
    }, []);

    const hoverElement = useCallback((element: EditableElement | null) => {
        setState(s => ({ ...s, hoveredElement: element }));
    }, []);

    const clearSelection = useCallback(() => {
        setState(s => ({ ...s, selectedElement: null }));
    }, []);

    // ---------- OVERRIDE ACTIONS ----------

    const setOverride = useCallback((elementId: string, styles: ElementStyleOverride) => {
        setState(s => {
            // Save to history
            const newPast = [...s.history.past, s.overrides];
            const newOverrides = { ...s.overrides, [elementId]: styles };

            onOverridesChange?.(newOverrides);

            return {
                ...s,
                overrides: newOverrides,
                history: { past: newPast.slice(-50), future: [] }, // Max 50 undo steps
            };
        });
    }, [onOverridesChange]);

    const resetOverride = useCallback((elementId: string) => {
        setState(s => {
            const newPast = [...s.history.past, s.overrides];
            const newOverrides = { ...s.overrides };
            delete newOverrides[elementId];

            onOverridesChange?.(newOverrides);

            return {
                ...s,
                overrides: newOverrides,
                history: { past: newPast.slice(-50), future: [] },
            };
        });
    }, [onOverridesChange]);

    const getOverride = useCallback((elementId: string): ElementStyleOverride | undefined => {
        return state.overrides[elementId];
    }, [state.overrides]);

    // ---------- CLIPBOARD ACTIONS ----------

    const copyStyle = useCallback((elementId: string) => {
        const style = state.overrides[elementId];
        if (style) {
            setState(s => ({ ...s, copiedStyle: { ...style } }));
        }
    }, [state.overrides]);

    const pasteStyle = useCallback((elementId: string) => {
        if (state.copiedStyle) {
            setOverride(elementId, state.copiedStyle);
        }
    }, [state.copiedStyle, setOverride]);

    // ---------- HISTORY ACTIONS (UNDO/REDO) ----------

    const undo = useCallback(() => {
        setState(s => {
            if (s.history.past.length === 0) return s;

            const previous = s.history.past[s.history.past.length - 1];
            const newPast = s.history.past.slice(0, -1);

            onOverridesChange?.(previous);

            return {
                ...s,
                overrides: previous,
                history: {
                    past: newPast,
                    future: [s.overrides, ...s.history.future],
                },
            };
        });
    }, [onOverridesChange]);

    const redo = useCallback(() => {
        setState(s => {
            if (s.history.future.length === 0) return s;

            const next = s.history.future[0];
            const newFuture = s.history.future.slice(1);

            onOverridesChange?.(next);

            return {
                ...s,
                overrides: next,
                history: {
                    past: [...s.history.past, s.overrides],
                    future: newFuture,
                },
            };
        });
    }, [onOverridesChange]);

    const canUndo = state.history.past.length > 0;
    const canRedo = state.history.future.length > 0;

    // ---------- RETURN ----------

    return useMemo(() => ({
        // State
        ...state,
        canUndo,
        canRedo,
        // Mode actions
        setEditingMode,
        togglePreviewMode,
        setMobileView,
        // Selection actions
        selectElement,
        hoverElement,
        clearSelection,
        // Override actions
        setOverride,
        resetOverride,
        getOverride,
        // Clipboard actions
        copyStyle,
        pasteStyle,
        // History actions
        undo,
        redo,
    }), [
        state, canUndo, canRedo,
        setEditingMode, togglePreviewMode, setMobileView,
        selectElement, hoverElement, clearSelection,
        setOverride, resetOverride, getOverride,
        copyStyle, pasteStyle,
        undo, redo,
    ]);
}

export type EditorStateReturn = ReturnType<typeof useEditorState>;
