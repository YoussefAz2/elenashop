"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import type { ElementStyleOverride } from "@/types";

// ---------- TYPES ----------

// Design System V2 element types
export type EditableType =
    | "title"           // Headings (h1, h2, h3)
    | "paragraph"       // Body text, descriptions
    | "button"          // CTA buttons
    | "image"           // Images
    | "productCard"     // Product cards
    | "container"       // Sections, containers
    | "icon"            // Icons (social, logo icons)
    | "divider"         // Section dividers
    | "text"            // Legacy - maps to title
    | "section";        // Legacy - maps to container

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
    const [state, setState] = useState<EditorState>(() => ({
        isEditing: false,
        isPreviewMode: false,
        isMobile: false,
        selectedElement: null,
        hoveredElement: null,
        overrides: initialOverrides,
        copiedStyle: null,
        history: { past: [], future: [] },
    }));

    // Use refs to access current state in callbacks without adding to dependencies
    const stateRef = useRef(state);
    const onOverridesChangeRef = useRef(onOverridesChange);

    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    useEffect(() => {
        onOverridesChangeRef.current = onOverridesChange;
    }, [onOverridesChange]);

    // Sync editor state when initialOverrides changes externally (e.g., theme preset clears it)
    useEffect(() => {
        setState(s => ({
            ...s,
            overrides: initialOverrides,
            selectedElement: null, // Clear selection to avoid stale state
        }));
    }, [initialOverrides]);

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

    // MERGE styles with existing overrides (not replace)
    // This fixes stale state issues because caller only needs to pass changed properties
    const setOverride = useCallback((elementId: string, styles: ElementStyleOverride) => {
        setState(s => {
            const newPast = [...s.history.past, s.overrides];
            // MERGE with existing styles instead of replacing
            const existingStyles = s.overrides[elementId] || {};
            const mergedStyles = { ...existingStyles, ...styles };
            const newOverrides = { ...s.overrides, [elementId]: mergedStyles };

            // Call callback via ref to avoid dependency
            onOverridesChangeRef.current?.(newOverrides);

            return {
                ...s,
                overrides: newOverrides,
                history: { past: newPast.slice(-50), future: [] },
            };
        });
    }, []);

    const resetOverride = useCallback((elementId: string) => {
        setState(s => {
            const newPast = [...s.history.past, s.overrides];
            const newOverrides = { ...s.overrides };
            delete newOverrides[elementId];

            onOverridesChangeRef.current?.(newOverrides);

            return {
                ...s,
                overrides: newOverrides,
                history: { past: newPast.slice(-50), future: [] },
            };
        });
    }, []);

    const getOverride = useCallback((elementId: string): ElementStyleOverride | undefined => {
        return stateRef.current.overrides[elementId];
    }, []);

    // ---------- CLIPBOARD ACTIONS ----------

    const copyStyle = useCallback((elementId: string) => {
        const style = stateRef.current.overrides[elementId];
        if (style) {
            setState(s => ({ ...s, copiedStyle: { ...style } }));
        }
    }, []);

    const pasteStyle = useCallback((elementId: string) => {
        const copiedStyle = stateRef.current.copiedStyle;
        if (copiedStyle) {
            setOverride(elementId, copiedStyle);
        }
    }, [setOverride]);

    // ---------- HISTORY ACTIONS (UNDO/REDO) ----------

    const undo = useCallback(() => {
        setState(s => {
            if (s.history.past.length === 0) return s;

            const previous = s.history.past[s.history.past.length - 1];
            const newPast = s.history.past.slice(0, -1);

            onOverridesChangeRef.current?.(previous);

            return {
                ...s,
                overrides: previous,
                history: {
                    past: newPast,
                    future: [s.overrides, ...s.history.future],
                },
            };
        });
    }, []);

    const redo = useCallback(() => {
        setState(s => {
            if (s.history.future.length === 0) return s;

            const next = s.history.future[0];
            const newFuture = s.history.future.slice(1);

            onOverridesChangeRef.current?.(next);

            return {
                ...s,
                overrides: next,
                history: {
                    past: [...s.history.past, s.overrides],
                    future: newFuture,
                },
            };
        });
    }, []);

    // ---------- STABLE ACTIONS OBJECT ----------

    // This object only contains stable callbacks, never changes
    const actions = useMemo(() => ({
        setEditingMode,
        togglePreviewMode,
        setMobileView,
        selectElement,
        hoverElement,
        clearSelection,
        setOverride,
        resetOverride,
        getOverride,
        copyStyle,
        pasteStyle,
        undo,
        redo,
    }), [
        setEditingMode, togglePreviewMode, setMobileView,
        selectElement, hoverElement, clearSelection,
        setOverride, resetOverride, getOverride,
        copyStyle, pasteStyle, undo, redo,
    ]);

    // ---------- RETURN ----------
    // State values change, but actions object is stable
    return {
        // State values (these can change)
        ...state,
        canUndo: state.history.past.length > 0,
        canRedo: state.history.future.length > 0,
        // Stable actions (never change reference)
        ...actions,
    };
}

export type EditorStateReturn = ReturnType<typeof useEditorState>;
