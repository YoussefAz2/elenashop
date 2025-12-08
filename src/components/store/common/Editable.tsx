"use client";

import React, { useState, useCallback, ReactNode, ElementType } from "react";
import { ElementStyleOverride } from "@/types";

// ---------- TYPES ----------

interface EditableProps<T extends ElementType = "span"> {
    id: string;
    children: ReactNode;
    as?: T;
    className?: string;
    // Editor mode props
    isEditing?: boolean;
    override?: ElementStyleOverride;
    onUpdateOverride?: (id: string, styles: ElementStyleOverride | null) => void;
}

// ---------- EDIT POPUP ----------

function EditPopup({
    id,
    currentStyles,
    onSave,
    onReset,
    onClose,
}: {
    id: string;
    currentStyles: ElementStyleOverride;
    onSave: (styles: ElementStyleOverride) => void;
    onReset: () => void;
    onClose: () => void;
}) {
    const [styles, setStyles] = useState<ElementStyleOverride>(currentStyles);

    const LABELS: Record<string, string> = {
        "hero-title": "🏠 Titre Hero",
        "hero-subtitle": "🏠 Sous-titre Hero",
        "hero-button": "🏠 Bouton Hero",
        "products-title": "🛍️ Titre Section Produits",
        "category-title": "📁 Titre Catégorie",
        "about-title": "ℹ️ Titre À propos",
        "about-text": "ℹ️ Texte À propos",
        "testimonials-title": "⭐ Titre Témoignages",
        "footer-text": "🦶 Texte Footer",
        "footer-name": "🦶 Nom Boutique Footer",
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/60 z-[9999] backdrop-blur-sm" onClick={onClose} />
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-[95vw] max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
                    <h3 className="font-bold text-lg">✏️ Modifier l&apos;élément</h3>
                    <p className="text-sm text-white/80">{LABELS[id] || id}</p>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                    {/* Text Color */}
                    <div>
                        <label className="text-sm font-medium block mb-2">🎨 Couleur du texte</label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                value={styles.color || "#000000"}
                                onChange={(e) => setStyles(s => ({ ...s, color: e.target.value }))}
                                className="h-10 w-14 rounded-lg cursor-pointer border-2 border-gray-200"
                            />
                            <input
                                type="text"
                                value={styles.color || ""}
                                onChange={(e) => setStyles(s => ({ ...s, color: e.target.value }))}
                                placeholder="ex: #333333"
                                className="flex-1 border-2 border-gray-200 rounded-lg px-3 text-sm"
                            />
                        </div>
                    </div>

                    {/* Background Color */}
                    <div>
                        <label className="text-sm font-medium block mb-2">🖼️ Couleur de fond</label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                value={styles.backgroundColor || "#ffffff"}
                                onChange={(e) => setStyles(s => ({ ...s, backgroundColor: e.target.value }))}
                                className="h-10 w-14 rounded-lg cursor-pointer border-2 border-gray-200"
                            />
                            <input
                                type="text"
                                value={styles.backgroundColor || ""}
                                onChange={(e) => setStyles(s => ({ ...s, backgroundColor: e.target.value }))}
                                placeholder="transparent"
                                className="flex-1 border-2 border-gray-200 rounded-lg px-3 text-sm"
                            />
                        </div>
                    </div>

                    {/* Font Size */}
                    <div>
                        <label className="text-sm font-medium block mb-2">📏 Taille du texte</label>
                        <select
                            value={styles.fontSize || ""}
                            onChange={(e) => setStyles(s => ({ ...s, fontSize: e.target.value || undefined }))}
                            className="w-full border-2 border-gray-200 rounded-lg p-2.5 text-sm"
                        >
                            <option value="">Par défaut</option>
                            <option value="0.875rem">Petit (14px)</option>
                            <option value="1rem">Normal (16px)</option>
                            <option value="1.25rem">Moyen (20px)</option>
                            <option value="1.5rem">Grand (24px)</option>
                            <option value="2rem">Très grand (32px)</option>
                            <option value="2.5rem">XL (40px)</option>
                            <option value="3rem">XXL (48px)</option>
                            <option value="4rem">Énorme (64px)</option>
                        </select>
                    </div>

                    {/* Font Weight */}
                    <div>
                        <label className="text-sm font-medium block mb-2">💪 Épaisseur</label>
                        <select
                            value={styles.fontWeight || ""}
                            onChange={(e) => setStyles(s => ({ ...s, fontWeight: e.target.value || undefined }))}
                            className="w-full border-2 border-gray-200 rounded-lg p-2.5 text-sm"
                        >
                            <option value="">Par défaut</option>
                            <option value="300">Léger</option>
                            <option value="400">Normal</option>
                            <option value="500">Medium</option>
                            <option value="600">Semi-gras</option>
                            <option value="700">Gras</option>
                            <option value="800">Très gras</option>
                            <option value="900">Extra gras</option>
                        </select>
                    </div>

                    {/* Preview */}
                    <div className="p-3 bg-gray-100 rounded-xl">
                        <p className="text-xs text-gray-500 mb-2">👁️ Aperçu</p>
                        <div
                            className="p-3 rounded-lg border-2 border-dashed border-gray-300"
                            style={{
                                color: styles.color,
                                backgroundColor: styles.backgroundColor,
                                fontSize: styles.fontSize,
                                fontWeight: styles.fontWeight,
                            }}
                        >
                            Texte d&apos;exemple
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-4 bg-gray-50 border-t">
                    <button
                        onClick={onReset}
                        className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        🔄 Réinitialiser
                    </button>
                    <div className="flex gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={() => { onSave(styles); onClose(); }}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                        >
                            ✓ Appliquer
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

// ---------- EDITABLE COMPONENT ----------

export function Editable<T extends ElementType = "span">({
    id,
    children,
    as,
    className = "",
    isEditing = false,
    override,
    onUpdateOverride,
}: EditableProps<T>) {
    const Component = as || "span";
    const [isHovered, setIsHovered] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    const handleClick = useCallback((e: React.MouseEvent) => {
        if (!isEditing) return;
        e.preventDefault();
        e.stopPropagation();
        setShowPopup(true);
    }, [isEditing]);

    const handleSave = useCallback((styles: ElementStyleOverride) => {
        onUpdateOverride?.(id, styles);
    }, [id, onUpdateOverride]);

    const handleReset = useCallback(() => {
        onUpdateOverride?.(id, null);
        setShowPopup(false);
    }, [id, onUpdateOverride]);

    // Build inline styles from override
    const overrideStyles: React.CSSProperties = override ? {
        color: override.color,
        fontSize: override.fontSize,
        fontWeight: override.fontWeight as React.CSSProperties["fontWeight"],
        fontFamily: override.fontFamily,
        backgroundColor: override.backgroundColor,
    } : {};

    // Not in edit mode - just render normally with overrides
    if (!isEditing) {
        return (
            <Component className={className} style={overrideStyles}>
                {children}
            </Component>
        );
    }

    // In edit mode - add click handler and visual feedback
    const hasOverride = override && Object.keys(override).some(k => override[k as keyof ElementStyleOverride]);

    return (
        <>
            <Component
                className={`${className} cursor-pointer transition-all duration-200 ${isHovered ? "outline outline-2 outline-blue-500 outline-offset-2 rounded" : ""
                    }`}
                style={overrideStyles}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleClick}
            >
                {children}
                {/* Badge for modified elements */}
                {hasOverride && (
                    <span className="inline-flex ml-1 w-4 h-4 bg-blue-500 rounded-full items-center justify-center text-white text-[8px] align-top">
                        ✓
                    </span>
                )}
            </Component>

            {/* Edit Popup */}
            {showPopup && (
                <EditPopup
                    id={id}
                    currentStyles={override || {}}
                    onSave={handleSave}
                    onReset={handleReset}
                    onClose={() => setShowPopup(false)}
                />
            )}
        </>
    );
}
