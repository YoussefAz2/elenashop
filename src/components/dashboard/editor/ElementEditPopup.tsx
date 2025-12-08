"use client";

import { useState, useEffect } from "react";
import { X, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ElementStyleOverride } from "@/types";

interface ElementEditPopupProps {
    isOpen: boolean;
    elementId: string;
    elementLabel: string;
    currentOverride?: ElementStyleOverride;
    onClose: () => void;
    onSave: (elementId: string, styles: ElementStyleOverride) => void;
    onReset: (elementId: string) => void;
}

// Human-readable labels for element IDs
const ELEMENT_LABELS: Record<string, string> = {
    "hero-title": "Titre du Hero",
    "hero-subtitle": "Sous-titre du Hero",
    "hero-button": "Bouton du Hero",
    "section-products-title": "Titre Section Produits",
    "section-testimonials-title": "Titre Section Témoignages",
    "section-about-title": "Titre Section À propos",
    "product-card-title": "Titre Produit",
    "product-card-price": "Prix Produit",
    "footer-text": "Texte Footer",
};

export function ElementEditPopup({
    isOpen,
    elementId,
    elementLabel,
    currentOverride,
    onClose,
    onSave,
    onReset,
}: ElementEditPopupProps) {
    const [styles, setStyles] = useState<ElementStyleOverride>({});
    const hasChanges = Object.keys(styles).some(key => styles[key as keyof ElementStyleOverride]);

    useEffect(() => {
        if (currentOverride) {
            setStyles(currentOverride);
        } else {
            setStyles({});
        }
    }, [currentOverride, elementId]);

    const updateStyle = (key: keyof ElementStyleOverride, value: string) => {
        setStyles(prev => ({
            ...prev,
            [key]: value || undefined,
        }));
    };

    const handleSave = () => {
        onSave(elementId, styles);
        onClose();
    };

    const handleReset = () => {
        onReset(elementId);
        setStyles({});
        onClose();
    };

    if (!isOpen) return null;

    const label = ELEMENT_LABELS[elementId] || elementLabel || elementId;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Popup */}
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-md bg-white rounded-xl shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div>
                        <h3 className="font-semibold text-lg">✏️ Modifier l&apos;élément</h3>
                        <p className="text-sm text-slate-500">{label}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
                    {/* Color */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Couleur du texte</Label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                value={styles.color?.startsWith("#") ? styles.color : "#000000"}
                                onChange={(e) => updateStyle("color", e.target.value)}
                                className="h-10 w-12 rounded cursor-pointer border"
                            />
                            <Input
                                value={styles.color || ""}
                                onChange={(e) => updateStyle("color", e.target.value)}
                                placeholder="ex: #333333"
                                className="flex-1"
                            />
                        </div>
                    </div>

                    {/* Background Color */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Couleur de fond</Label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                value={styles.backgroundColor?.startsWith("#") ? styles.backgroundColor : "#ffffff"}
                                onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                                className="h-10 w-12 rounded cursor-pointer border"
                            />
                            <Input
                                value={styles.backgroundColor || ""}
                                onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                                placeholder="ex: #ffffff"
                                className="flex-1"
                            />
                        </div>
                    </div>

                    {/* Font Size */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Taille du texte</Label>
                        <Select
                            value={styles.fontSize || ""}
                            onValueChange={(v) => updateStyle("fontSize", v)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Par défaut" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">Par défaut</SelectItem>
                                <SelectItem value="0.875rem">Petit (14px)</SelectItem>
                                <SelectItem value="1rem">Normal (16px)</SelectItem>
                                <SelectItem value="1.25rem">Moyen (20px)</SelectItem>
                                <SelectItem value="1.5rem">Grand (24px)</SelectItem>
                                <SelectItem value="2rem">Très grand (32px)</SelectItem>
                                <SelectItem value="2.5rem">XL (40px)</SelectItem>
                                <SelectItem value="3rem">XXL (48px)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Font Weight */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Épaisseur</Label>
                        <Select
                            value={styles.fontWeight || ""}
                            onValueChange={(v) => updateStyle("fontWeight", v)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Par défaut" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">Par défaut</SelectItem>
                                <SelectItem value="300">Léger</SelectItem>
                                <SelectItem value="400">Normal</SelectItem>
                                <SelectItem value="500">Medium</SelectItem>
                                <SelectItem value="600">Semi-gras</SelectItem>
                                <SelectItem value="700">Gras</SelectItem>
                                <SelectItem value="800">Très gras</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Preview */}
                    <div className="p-4 bg-slate-50 rounded-lg border">
                        <p className="text-xs text-slate-400 mb-2">Aperçu</p>
                        <div
                            className="min-h-[40px] flex items-center justify-center rounded bg-white p-2"
                            style={{
                                color: styles.color,
                                fontSize: styles.fontSize,
                                fontWeight: styles.fontWeight,
                                backgroundColor: styles.backgroundColor,
                            }}
                        >
                            Texte d&apos;exemple
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-4 border-t bg-slate-50 rounded-b-xl">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleReset}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Réinitialiser
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={onClose}>
                            Annuler
                        </Button>
                        <Button onClick={handleSave} disabled={!hasChanges}>
                            Appliquer
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
