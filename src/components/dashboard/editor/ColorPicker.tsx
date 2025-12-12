"use client";

import { useState, useCallback } from "react";
import { Pipette, Copy, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ColorPickerProps {
    onColorPicked?: (color: string) => void;
}

// Extend Window interface for EyeDropper API
declare global {
    interface Window {
        EyeDropper?: new () => {
            open: () => Promise<{ sRGBHex: string }>;
        };
    }
}

export function ColorPicker({ onColorPicked }: ColorPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [pickedColor, setPickedColor] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isSupported = typeof window !== "undefined" && "EyeDropper" in window;

    const pickColor = useCallback(async () => {
        if (!isSupported || !window.EyeDropper) {
            setError("Pipette non supportée sur ce navigateur");
            return;
        }

        try {
            setError(null);
            const eyeDropper = new window.EyeDropper();
            const result = await eyeDropper.open();
            const color = result.sRGBHex;
            setPickedColor(color);
            setIsOpen(true);
            onColorPicked?.(color);
        } catch {
            // User cancelled or error
            setError(null);
        }
    }, [isSupported, onColorPicked]);

    const copyToClipboard = useCallback(async () => {
        if (!pickedColor) return;

        try {
            await navigator.clipboard.writeText(pickedColor);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for older browsers
            const textarea = document.createElement("textarea");
            textarea.value = pickedColor;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [pickedColor]);

    const close = () => {
        setIsOpen(false);
        setPickedColor(null);
        setCopied(false);
    };

    if (!isSupported) {
        return (
            <Button
                variant="outline"
                size="sm"
                disabled
                className="gap-2 opacity-50"
                title="Non supporté sur ce navigateur (utilisez Chrome ou Edge)"
            >
                <Pipette className="h-4 w-4" />
                <span className="hidden sm:inline">Pipette</span>
            </Button>
        );
    }

    return (
        <div className="relative">
            {/* Picker Button */}
            <Button
                variant="outline"
                size="sm"
                onClick={pickColor}
                className="gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Cliquer pour capturer une couleur"
            >
                <Pipette className="h-4 w-4" />
                <span className="hidden sm:inline">Pipette</span>
            </Button>

            {/* Color Result Popup */}
            {isOpen && pickedColor && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={close}
                    />

                    {/* Popup */}
                    <div className="absolute top-full left-0 mt-2 z-50 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-4 min-w-[200px] animate-in fade-in slide-in-from-top-2 duration-200">
                        {/* Close button */}
                        <button
                            onClick={close}
                            className="absolute top-2 right-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        {/* Color Preview */}
                        <div className="flex items-center gap-3 mb-3">
                            <div
                                className="w-14 h-14 rounded-xl shadow-inner border-2 border-white dark:border-slate-700"
                                style={{ backgroundColor: pickedColor }}
                            />
                            <div>
                                <p className="text-xs text-slate-400 mb-0.5">Couleur</p>
                                <p className="font-mono font-bold text-lg text-slate-900 dark:text-slate-100 uppercase">
                                    {pickedColor}
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <Button
                                variant="default"
                                size="sm"
                                onClick={copyToClipboard}
                                className="flex-1 gap-2"
                            >
                                {copied ? (
                                    <>
                                        <Check className="h-4 w-4" />
                                        Copié !
                                    </>
                                ) : (
                                    <>
                                        <Copy className="h-4 w-4" />
                                        Copier
                                    </>
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={pickColor}
                                className="gap-2"
                            >
                                <Pipette className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </>
            )}

            {/* Error Toast */}
            {error && (
                <div className="absolute top-full left-0 mt-2 z-50 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm px-3 py-2 rounded-lg shadow-lg border border-red-200 dark:border-red-800">
                    {error}
                </div>
            )}
        </div>
    );
}
