"use client";

import { useEffect, useCallback } from "react";

/**
 * MobilePreviewBridge
 * 
 * Injected into store pages when ?preview=mobile is present.
 * Detects interactions on editable sections and sends messages to parent editor.
 * 
 * - Mouse click (PC users previewing mobile) → Immediate action
 * - Long press (500ms) (actual mobile users) → Delayed action to avoid interfering with scroll
 */
export function MobilePreviewBridge() {
    const sendEditMessage = useCallback((sectionId: string, sectionType: string, sectionLabel: string) => {
        // Notify parent editor window
        window.parent.postMessage(
            {
                type: "ELENA_EDIT_SECTION",
                sectionId,
                sectionType,
                sectionLabel,
            },
            "*"
        );
    }, []);

    useEffect(() => {
        let longPressTimer: NodeJS.Timeout | null = null;
        let touchStartElement: HTMLElement | null = null;
        let isLongPress = false;

        // Find closest editable section from event target
        const findEditableSection = (target: EventTarget | null): { id: string; type: string; label: string } | null => {
            if (!target || !(target instanceof HTMLElement)) return null;

            const element = target.closest("[data-editable-id]");
            if (!element) return null;

            const id = element.getAttribute("data-editable-id");
            const type = element.getAttribute("data-editable") || "container";
            const label = element.getAttribute("data-editable-label") || id || "Section";

            if (!id) return null;
            return { id, type, label };
        };

        // Show visual feedback
        const showFeedback = (element: HTMLElement) => {
            // Create overlay
            const overlay = document.createElement("div");
            overlay.className = "elena-edit-feedback";
            overlay.style.cssText = `
                position: absolute;
                inset: 0;
                background: rgba(168, 85, 247, 0.15);
                border: 2px solid rgba(168, 85, 247, 0.6);
                border-radius: inherit;
                pointer-events: none;
                animation: elena-pulse 0.3s ease-out;
                z-index: 9999;
            `;

            // Ensure parent has relative positioning
            const originalPosition = element.style.position;
            if (!originalPosition || originalPosition === "static") {
                element.style.position = "relative";
            }

            element.appendChild(overlay);

            // Haptic feedback if available
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }

            // Remove overlay after animation
            setTimeout(() => {
                overlay.remove();
                if (!originalPosition || originalPosition === "static") {
                    element.style.position = originalPosition || "";
                }
            }, 400);
        };

        // --- MOUSE CLICK (PC users) ---
        const handleClick = (e: MouseEvent) => {
            // Only handle left click
            if (e.button !== 0) return;

            const section = findEditableSection(e.target);
            if (!section) return;

            // Prevent default behavior
            e.preventDefault();
            e.stopPropagation();

            // Show feedback
            const element = (e.target as HTMLElement).closest("[data-editable-id]");
            if (element instanceof HTMLElement) {
                showFeedback(element);
            }

            // Send message to parent
            sendEditMessage(section.id, section.type, section.label);
        };

        // --- TOUCH EVENTS (Mobile users - long press) ---
        const handleTouchStart = (e: TouchEvent) => {
            const section = findEditableSection(e.target);
            if (!section) return;

            touchStartElement = (e.target as HTMLElement).closest("[data-editable-id]") as HTMLElement;
            isLongPress = false;

            // Start long press timer (500ms)
            longPressTimer = setTimeout(() => {
                isLongPress = true;

                if (touchStartElement) {
                    showFeedback(touchStartElement);
                    sendEditMessage(section.id, section.type, section.label);
                }
            }, 500);
        };

        const handleTouchMove = () => {
            // Cancel long press if user moves finger (scrolling)
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }
        };

        const handleTouchEnd = (e: TouchEvent) => {
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }

            // Prevent click event if long press was triggered
            if (isLongPress) {
                e.preventDefault();
            }

            touchStartElement = null;
        };

        // Add animation keyframes
        const style = document.createElement("style");
        style.textContent = `
            @keyframes elena-pulse {
                0% { opacity: 0; transform: scale(0.95); }
                50% { opacity: 1; }
                100% { opacity: 0; transform: scale(1); }
            }
        `;
        document.head.appendChild(style);

        // Register event listeners
        document.addEventListener("click", handleClick, true);
        document.addEventListener("touchstart", handleTouchStart, { passive: false });
        document.addEventListener("touchmove", handleTouchMove, { passive: true });
        document.addEventListener("touchend", handleTouchEnd, { passive: false });

        return () => {
            document.removeEventListener("click", handleClick, true);
            document.removeEventListener("touchstart", handleTouchStart);
            document.removeEventListener("touchmove", handleTouchMove);
            document.removeEventListener("touchend", handleTouchEnd);
            style.remove();
            if (longPressTimer) clearTimeout(longPressTimer);
        };
    }, [sendEditMessage]);

    // This component renders nothing - it just adds event listeners
    return null;
}
