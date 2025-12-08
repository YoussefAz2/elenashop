"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { ElementStyleOverride, ElementOverride } from "@/types";
import { ElementEditPopup } from "./ElementEditPopup";

interface ElementSelectionContextType {
    isEditorMode: boolean;
    isAdvancedMode: boolean;
    overrides: ElementOverride[];
    selectedElementId: string | null;
    getOverride: (elementId: string) => ElementStyleOverride | undefined;
    hasOverride: (elementId: string) => boolean;
    selectElement: (elementId: string) => void;
    clearSelection: () => void;
    setOverride: (elementId: string, styles: ElementStyleOverride) => void;
    resetOverride: (elementId: string) => void;
    resetAllOverrides: () => void;
}

const ElementSelectionContext = createContext<ElementSelectionContextType | null>(null);

export function useElementSelection() {
    const context = useContext(ElementSelectionContext);
    if (!context) {
        // Return a no-op context for when used outside provider (store view)
        return {
            isEditorMode: false,
            isAdvancedMode: false,
            overrides: [],
            selectedElementId: null,
            getOverride: () => undefined,
            hasOverride: () => false,
            selectElement: () => { },
            clearSelection: () => { },
            setOverride: () => { },
            resetOverride: () => { },
            resetAllOverrides: () => { },
        };
    }
    return context;
}

interface ElementSelectionProviderProps {
    children: ReactNode;
    isEditorMode?: boolean;
    isAdvancedMode?: boolean;
    initialOverrides?: ElementOverride[];
    onOverridesChange?: (overrides: ElementOverride[]) => void;
}

export function ElementSelectionProvider({
    children,
    isEditorMode = false,
    isAdvancedMode = false,
    initialOverrides = [],
    onOverridesChange,
}: ElementSelectionProviderProps) {
    const [overrides, setOverrides] = useState<ElementOverride[]>(initialOverrides);
    const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

    const getOverride = useCallback((elementId: string) => {
        return overrides.find(o => o.elementId === elementId)?.styles;
    }, [overrides]);

    const hasOverride = useCallback((elementId: string) => {
        return overrides.some(o => o.elementId === elementId);
    }, [overrides]);

    const selectElement = useCallback((elementId: string) => {
        setSelectedElementId(elementId);
    }, []);

    const clearSelection = useCallback(() => {
        setSelectedElementId(null);
    }, []);

    const setOverride = useCallback((elementId: string, styles: ElementStyleOverride) => {
        setOverrides(prev => {
            const existing = prev.findIndex(o => o.elementId === elementId);
            let newOverrides: ElementOverride[];
            if (existing >= 0) {
                newOverrides = [...prev];
                newOverrides[existing] = { elementId, styles };
            } else {
                newOverrides = [...prev, { elementId, styles }];
            }
            onOverridesChange?.(newOverrides);
            return newOverrides;
        });
    }, [onOverridesChange]);

    const resetOverride = useCallback((elementId: string) => {
        setOverrides(prev => {
            const newOverrides = prev.filter(o => o.elementId !== elementId);
            onOverridesChange?.(newOverrides);
            return newOverrides;
        });
    }, [onOverridesChange]);

    const resetAllOverrides = useCallback(() => {
        setOverrides([]);
        onOverridesChange?.([]);
    }, [onOverridesChange]);

    const selectedOverride = selectedElementId ? getOverride(selectedElementId) : undefined;

    return (
        <ElementSelectionContext.Provider
            value={{
                isEditorMode,
                isAdvancedMode,
                overrides,
                selectedElementId,
                getOverride,
                hasOverride,
                selectElement,
                clearSelection,
                setOverride,
                resetOverride,
                resetAllOverrides,
            }}
        >
            {children}

            {/* Element Edit Popup - rendered at provider level */}
            <ElementEditPopup
                isOpen={selectedElementId !== null}
                elementId={selectedElementId || ""}
                elementLabel=""
                currentOverride={selectedOverride}
                onClose={clearSelection}
                onSave={setOverride}
                onReset={resetOverride}
            />
        </ElementSelectionContext.Provider>
    );
}
