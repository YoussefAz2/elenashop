"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode, useRef, ElementType } from "react";

// ---------- TYPES ----------

interface ElementStyleOverride {
    color?: string;
    fontSize?: string;
    fontWeight?: string;
    fontFamily?: string;
    backgroundColor?: string;
}

interface ElementOverride {
    elementId: string;
    styles: ElementStyleOverride;
}

// ---------- CONTEXT ----------

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
}

const ElementSelectionContext = createContext<ElementSelectionContextType | null>(null);

function useElementSelection(): ElementSelectionContextType {
    const context = useContext(ElementSelectionContext);
    if (!context) {
        // Return a no-op context for when used outside provider (public store view)
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
        };
    }
    return context;
}

// ---------- SELECTABLE ELEMENT COMPONENT ----------

interface SelectableElementProps<T extends ElementType = "div"> {
    elementId: string;
    children: ReactNode;
    className?: string;
    as?: T;
}

export function SelectableElement<T extends ElementType = "div">({
    elementId,
    children,
    className = "",
    as,
}: SelectableElementProps<T>) {
    const Component = as || "div";

    const {
        isEditorMode,
        isAdvancedMode,
        getOverride,
        hasOverride,
        selectElement,
    } = useElementSelection();

    const [isHovered, setIsHovered] = useState(false);
    const [isPressing, setIsPressing] = useState(false);
    const longPressTimer = useRef<NodeJS.Timeout | null>(null);
    const LONG_PRESS_DURATION = 500;

    const override = getOverride(elementId);
    const hasCustomOverride = hasOverride(elementId);

    const handlePressStart = useCallback(() => {
        if (!isEditorMode || !isAdvancedMode) return;
        setIsPressing(true);
        longPressTimer.current = setTimeout(() => {
            selectElement(elementId);
            setIsPressing(false);
        }, LONG_PRESS_DURATION);
    }, [isEditorMode, isAdvancedMode, elementId, selectElement]);

    const handlePressEnd = useCallback(() => {
        setIsPressing(false);
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
    }, []);

    const handleContextMenu = useCallback((e: React.MouseEvent) => {
        if (!isEditorMode || !isAdvancedMode) return;
        e.preventDefault();
        selectElement(elementId);
    }, [isEditorMode, isAdvancedMode, elementId, selectElement]);

    const overrideStyles: React.CSSProperties = override ? {
        color: override.color,
        fontSize: override.fontSize,
        fontWeight: override.fontWeight as React.CSSProperties["fontWeight"],
        fontFamily: override.fontFamily,
        backgroundColor: override.backgroundColor,
    } : {};

    // Don't add selection behavior if not in editor advanced mode
    if (!isEditorMode || !isAdvancedMode) {
        return (
            <Component className={className} style={overrideStyles}>
                {children}
            </Component>
        );
    }

    return (
        <Component
            className={`${className} relative cursor-pointer transition-all ${isHovered ? "ring-2 ring-blue-500 ring-offset-2" : ""
                } ${isPressing ? "scale-[0.98] opacity-90" : ""}`}
            style={overrideStyles}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                handlePressEnd();
            }}
            onMouseDown={handlePressStart}
            onMouseUp={handlePressEnd}
            onTouchStart={handlePressStart}
            onTouchEnd={handlePressEnd}
            onTouchCancel={handlePressEnd}
            onContextMenu={handleContextMenu}
        >
            {children}

            {hasCustomOverride && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-[8px] shadow-sm z-10">
                    ✏️
                </span>
            )}

            {isHovered && !isPressing && (
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded whitespace-nowrap z-20 pointer-events-none">
                    Maintenir pour modifier
                </span>
            )}

            {isPressing && (
                <div className="absolute inset-0 bg-blue-500/10 rounded pointer-events-none">
                    <div className="absolute bottom-0 left-0 h-1 bg-blue-500 animate-pulse w-full rounded-b" />
                </div>
            )}
        </Component>
    );
}

// ---------- CONTEXT PROVIDER (exported for EditorClient) ----------

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
        setSelectedElementId(null);
    }, [onOverridesChange]);

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
            }}
        >
            {children}

            {/* Simple popup for editing - inline implementation */}
            {selectedElementId && (
                <EditPopup
                    elementId={selectedElementId}
                    currentOverride={getOverride(selectedElementId)}
                    onClose={clearSelection}
                    onSave={setOverride}
                    onReset={resetOverride}
                />
            )}
        </ElementSelectionContext.Provider>
    );
}

// Simple inline edit popup
function EditPopup({
    elementId,
    currentOverride,
    onClose,
    onSave,
    onReset,
}: {
    elementId: string;
    currentOverride?: ElementStyleOverride;
    onClose: () => void;
    onSave: (id: string, styles: ElementStyleOverride) => void;
    onReset: (id: string) => void;
}) {
    const [styles, setStyles] = useState<ElementStyleOverride>(currentOverride || {});

    const LABELS: Record<string, string> = {
        "hero-title": "Titre Hero",
        "hero-subtitle": "Sous-titre Hero",
        "section-products-title": "Titre Produits",
        "section-about-title": "Titre À propos",
        "footer-text": "Texte Footer",
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-md bg-white rounded-xl shadow-2xl p-4">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="font-semibold">✏️ Modifier</h3>
                        <p className="text-sm text-gray-500">{LABELS[elementId] || elementId}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">✕</button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium block mb-1">Couleur texte</label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                value={styles.color || "#000000"}
                                onChange={(e) => setStyles(s => ({ ...s, color: e.target.value }))}
                                className="h-10 w-12 rounded cursor-pointer border"
                            />
                            <input
                                type="text"
                                value={styles.color || ""}
                                onChange={(e) => setStyles(s => ({ ...s, color: e.target.value }))}
                                placeholder="#000000"
                                className="flex-1 border rounded px-2"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium block mb-1">Taille</label>
                        <select
                            value={styles.fontSize || ""}
                            onChange={(e) => setStyles(s => ({ ...s, fontSize: e.target.value || undefined }))}
                            className="w-full border rounded p-2"
                        >
                            <option value="">Par défaut</option>
                            <option value="1rem">Normal (16px)</option>
                            <option value="1.5rem">Grand (24px)</option>
                            <option value="2rem">Très grand (32px)</option>
                            <option value="3rem">XXL (48px)</option>
                        </select>
                    </div>

                    <div className="p-3 bg-gray-50 rounded">
                        <p className="text-xs text-gray-400 mb-1">Aperçu</p>
                        <div style={{ ...styles }} className="p-2 bg-white rounded">
                            Texte d&apos;exemple
                        </div>
                    </div>
                </div>

                <div className="flex justify-between mt-4 pt-4 border-t">
                    <button
                        onClick={() => { onReset(elementId); }}
                        className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                    >
                        🔄 Réinitialiser
                    </button>
                    <div className="flex gap-2">
                        <button onClick={onClose} className="px-4 py-2 text-sm border rounded hover:bg-gray-50">
                            Annuler
                        </button>
                        <button
                            onClick={() => { onSave(elementId, styles); onClose(); }}
                            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Appliquer
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export { ElementSelectionContext, useElementSelection };
export type { ElementStyleOverride, ElementOverride, ElementSelectionContextType };
