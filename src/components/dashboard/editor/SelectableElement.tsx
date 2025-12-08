"use client";

import React, { useRef, useState, useCallback, ReactNode, ElementType } from "react";
import { useElementSelection } from "./ElementSelectionContext";

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
    const LONG_PRESS_DURATION = 500; // ms

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

    // Build inline styles from override
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

            {/* Override indicator badge */}
            {hasCustomOverride && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-[8px] shadow-sm z-10">
                    ✏️
                </span>
            )}

            {/* Hover hint */}
            {isHovered && !isPressing && (
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded whitespace-nowrap z-20 pointer-events-none">
                    Maintenir pour modifier
                </span>
            )}

            {/* Press progress indicator */}
            {isPressing && (
                <div className="absolute inset-0 bg-blue-500/10 rounded pointer-events-none">
                    <div className="absolute bottom-0 left-0 h-1 bg-blue-500 animate-pulse w-full rounded-b" />
                </div>
            )}
        </Component>
    );
}
