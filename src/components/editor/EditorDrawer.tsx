"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { X, GripHorizontal, Undo2, Redo2, Copy, ClipboardPaste } from "lucide-react";
import type { EditorStateReturn } from "@/hooks/useEditorState";
import { TextToolbar } from "./toolbars/TextToolbar";
import { ButtonToolbar } from "./toolbars/ButtonToolbar";
import { ImageToolbar } from "./toolbars/ImageToolbar";

// ---------- PROPS ----------

interface EditorDrawerProps {
    editor: EditorStateReturn;
}

// ---------- SNAP POINTS ----------

const SNAP_POINTS = {
    closed: 0,
    peek: 30,
    half: 60,
    full: 90,
};

// ---------- COMPONENT ----------

export function EditorDrawer({ editor }: EditorDrawerProps) {
    const drawerRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(SNAP_POINTS.half);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartY = useRef(0);
    const dragStartHeight = useRef(0);

    const { selectedElement, overrides, canUndo, canRedo, undo, redo, copyStyle, pasteStyle, copiedStyle, clearSelection, setOverride, resetOverride } = editor;

    // Extract values safely
    const elementId = selectedElement?.id;
    const elementType = selectedElement?.type;
    const elementLabel = selectedElement?.label || "";
    const currentStyles = elementId ? (overrides[elementId] || {}) : {};

    // ---------- DRAG HANDLERS ----------

    const handleDragMove = useCallback((e: TouchEvent | MouseEvent) => {
        if (!isDragging) return;
        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
        const delta = dragStartY.current - clientY;
        const deltaPercent = (delta / window.innerHeight) * 100;
        const newHeight = Math.min(90, Math.max(0, dragStartHeight.current + deltaPercent));
        setHeight(newHeight);
    }, [isDragging]);

    const handleDragEnd = useCallback(() => {
        setIsDragging(false);
        // Get current height from state
        setHeight(prev => {
            if (prev < 15) {
                clearSelection();
                return SNAP_POINTS.closed;
            } else if (prev < 45) {
                return SNAP_POINTS.peek;
            } else if (prev < 75) {
                return SNAP_POINTS.half;
            } else {
                return SNAP_POINTS.full;
            }
        });
    }, [clearSelection]);

    const handleDragStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
        setIsDragging(true);
        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
        dragStartY.current = clientY;
        dragStartHeight.current = height;
    }, [height]);

    // Global drag listeners
    useEffect(() => {
        if (isDragging) {
            window.addEventListener("touchmove", handleDragMove);
            window.addEventListener("mousemove", handleDragMove);
            window.addEventListener("touchend", handleDragEnd);
            window.addEventListener("mouseup", handleDragEnd);
        }
        return () => {
            window.removeEventListener("touchmove", handleDragMove);
            window.removeEventListener("mousemove", handleDragMove);
            window.removeEventListener("touchend", handleDragEnd);
            window.removeEventListener("mouseup", handleDragEnd);
        };
    }, [isDragging, handleDragMove, handleDragEnd]);

    // Reset height when element changes
    useEffect(() => {
        if (elementId) {
            setHeight(SNAP_POINTS.half);
        }
    }, [elementId]);

    // ---------- HANDLERS ----------

    const handleSave = useCallback((styles: import("@/types").ElementStyleOverride) => {
        if (elementId) {
            setOverride(elementId, styles);
        }
    }, [elementId, setOverride]);

    const handleReset = useCallback(() => {
        if (elementId) {
            resetOverride(elementId);
        }
    }, [elementId, resetOverride]);

    const handleClose = useCallback(() => {
        clearSelection();
    }, [clearSelection]);

    // Render the appropriate toolbar
    const renderToolbar = () => {
        if (!elementId) return null;

        switch (elementType) {
            case "text":
                return (
                    <TextToolbar
                        elementId={elementId}
                        elementLabel={elementLabel}
                        currentStyles={currentStyles}
                        onSave={handleSave}
                        onReset={handleReset}
                        onClose={handleClose}
                    />
                );
            case "button":
            case "container":
                return (
                    <ButtonToolbar
                        elementId={elementId}
                        elementLabel={elementLabel}
                        currentStyles={currentStyles}
                        onSave={handleSave}
                        onReset={handleReset}
                        onClose={handleClose}
                    />
                );
            case "image":
                return (
                    <ImageToolbar
                        elementId={elementId}
                        elementLabel={elementLabel}
                        currentStyles={currentStyles}
                        onSave={handleSave}
                        onReset={handleReset}
                        onClose={handleClose}
                    />
                );
            default:
                return (
                    <TextToolbar
                        elementId={elementId}
                        elementLabel={elementLabel}
                        currentStyles={currentStyles}
                        onSave={handleSave}
                        onReset={handleReset}
                        onClose={handleClose}
                    />
                );
        }
    };

    // Don't render if nothing selected
    if (!selectedElement) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/30 z-[9998] backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Drawer */}
            <div
                ref={drawerRef}
                className="fixed bottom-0 left-0 right-0 z-[9999] bg-white dark:bg-slate-900 rounded-t-2xl shadow-2xl transition-[height] duration-200"
                style={{ height: `${height}vh` }}
            >
                {/* Handle */}
                <div
                    className="flex items-center justify-center py-3 cursor-grab active:cursor-grabbing touch-none"
                    onTouchStart={handleDragStart}
                    onMouseDown={handleDragStart}
                >
                    <GripHorizontal className="w-8 h-8 text-slate-300" />
                </div>

                {/* Top bar with actions */}
                <div className="flex items-center justify-between px-4 pb-3 border-b">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={undo}
                            disabled={!canUndo}
                            className="p-2 rounded-lg bg-slate-100 disabled:opacity-30 active:bg-slate-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
                        >
                            <Undo2 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={redo}
                            disabled={!canRedo}
                            className="p-2 rounded-lg bg-slate-100 disabled:opacity-30 active:bg-slate-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
                        >
                            <Redo2 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => elementId && copyStyle(elementId)}
                            className="p-2 rounded-lg bg-slate-100 active:bg-slate-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
                        >
                            <Copy className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => elementId && pasteStyle(elementId)}
                            disabled={!copiedStyle}
                            className="p-2 rounded-lg bg-slate-100 disabled:opacity-30 active:bg-slate-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
                        >
                            <ClipboardPaste className="w-5 h-5" />
                        </button>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 rounded-lg bg-slate-100 active:bg-slate-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 overflow-y-auto" style={{ height: `calc(100% - 100px)` }}>
                    {renderToolbar()}
                </div>
            </div>
        </>
    );
}
