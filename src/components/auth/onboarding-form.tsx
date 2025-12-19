"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Store,
    Loader2,
    Check,
    X,
    ArrowRight,
    ArrowLeft,
    PartyPopper,
    Sparkles,
} from "lucide-react";
import { TemplateCard } from "./TemplateCard";
import { StoreBuildingAnimation } from "./StoreBuildingAnimation";
import {
    STORE_CATEGORIES,
    VISUAL_STYLES,
    TEMPLATE_OPTIONS,
    getRecommendedTemplate,
    generatePreConfiguredTheme,
    type StoreCategory,
    type VisualStyle,
} from "@/lib/onboarding-data";
import { createStore, isSlugAvailable, setCurrentStoreId, getCurrentStoreId } from "@/lib/stores";
import type { TemplateId } from "@/types";

interface OnboardingFormProps {
    userId: string;
    userEmail: string;
}

const STEPS = [
    { id: 1, title: "Nom", emoji: "🏪" },
    { id: 2, title: "Catégorie", emoji: "📦" },
    { id: 3, title: "Style", emoji: "🎨" },
    { id: 4, title: "Template", emoji: "✨" },
];

const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 300 : -300,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction: number) => ({
        x: direction < 0 ? 300 : -300,
        opacity: 0,
    }),
};

export function OnboardingForm({ userId }: OnboardingFormProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [direction, setDirection] = useState(0);

    // Form data
    const [storeName, setStoreName] = useState("");
    const [category, setCategory] = useState<StoreCategory | "">("");
    const [style, setStyle] = useState<VisualStyle | "">("");
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateId | "">("");

    // UI states
    const [isLoading, setIsLoading] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);

    const router = useRouter();
    const supabase = createClient();

    // Get recommended template based on selections
    const recommendedTemplate = category && style
        ? getRecommendedTemplate(category as StoreCategory, style as VisualStyle)
        : "minimal";

    // Auto-select recommended template when entering step 4
    useEffect(() => {
        if (currentStep === 4 && !selectedTemplate && recommendedTemplate) {
            setSelectedTemplate(recommendedTemplate);
        }
    }, [currentStep, selectedTemplate, recommendedTemplate]);

    // Debounced store name availability check
    const checkAvailability = useCallback(async (name: string) => {
        if (name.length < 3) {
            setIsAvailable(null);
            return;
        }

        setIsChecking(true);
        try {
            const available = await isSlugAvailable(name.toLowerCase());
            setIsAvailable(available);
        } catch {
            setIsAvailable(true);
        } finally {
            setIsChecking(false);
        }
    }, [supabase]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (storeName.length >= 3) {
                checkAvailability(storeName);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [storeName, checkAvailability]);

    const handleStoreNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "")
            .slice(0, 20);
        setStoreName(value);
        setIsAvailable(null);
    };

    const nextStep = () => {
        if (currentStep < 4) {
            setDirection(1);
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setDirection(-1);
            setCurrentStep(currentStep - 1);
        }
    };

    const canProceed = () => {
        switch (currentStep) {
            case 1: return storeName.length >= 3 && isAvailable === true;
            case 2: return category !== "";
            case 3: return style !== "";
            case 4: return selectedTemplate !== "";
            default: return false;
        }
    };

    const handleSubmit = async () => {
        if (!selectedTemplate || !category) return;

        setIsLoading(true);
        setError(null);

        try {
            // Final availability check
            const available = await isSlugAvailable(storeName.toLowerCase());

            if (!available) {
                setError("Ce nom de boutique vient d'être pris.");
                setIsLoading(false);
                return;
            }

            // Generate pre-configured theme
            const themeConfig = generatePreConfiguredTheme(
                selectedTemplate as TemplateId,
                category as StoreCategory,
                storeName
            );

            // Create store (this also creates store_member with owner role)
            const store = await createStore({
                slug: storeName.toLowerCase(),
                name: storeName,
                themeConfig,
            });

            if (!store) {
                throw new Error("Failed to create store");
            }

            // Set as current store in localStorage
            setCurrentStoreId(store.id);

            // Show celebration animation (no auto-redirect here, animation handles it)
            setShowConfetti(true);

        } catch (err) {
            console.error("Onboarding error:", err);
            setError("Une erreur est survenue. Veuillez réessayer.");
            setIsLoading(false);
        }
    };

    // Store building animation screen
    if (showConfetti) {
        const categoryLabel = STORE_CATEGORIES.find(c => c.id === category)?.label || category;

        return (
            <StoreBuildingAnimation
                storeName={storeName}
                templateId={selectedTemplate}
                category={categoryLabel}
                onComplete={() => {
                    // Set cookie for server-side access
                    const storeId = getCurrentStoreId();
                    if (storeId) {
                        document.cookie = `current_store_id=${storeId}; path=/; max-age=31536000`;
                    }
                    // Navigate with newStore flag to skip initial checks
                    window.location.href = "/dashboard?newStore=true";
                }}
            />
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Progress Steps */}
            <div className="mb-8">
                <div className="flex items-center justify-between relative">
                    {/* Progress Line */}
                    <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200">
                        <motion.div
                            className="h-full bg-emerald-500"
                            initial={{ width: "0%" }}
                            animate={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>

                    {STEPS.map((step) => (
                        <div key={step.id} className="relative z-10 flex flex-col items-center">
                            <motion.div
                                animate={{
                                    scale: currentStep === step.id ? 1.1 : 1,
                                    backgroundColor: currentStep >= step.id ? "#10b981" : "#e2e8f0",
                                }}
                                className={`h-10 w-10 rounded-full flex items-center justify-center text-lg shadow-md ${currentStep >= step.id ? "text-white" : "text-slate-400"
                                    }`}
                            >
                                {currentStep > step.id ? (
                                    <Check className="h-5 w-5" />
                                ) : (
                                    step.emoji
                                )}
                            </motion.div>
                            <span className={`text-xs mt-2 font-medium ${currentStep >= step.id ? "text-emerald-600" : "text-slate-400"
                                }`}>
                                {step.title}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Card */}
            <Card className="border-slate-200/50 shadow-2xl overflow-hidden">
                <CardContent className="p-8">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={currentStep}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ type: "tween", duration: 0.3 }}
                        >
                            {/* Step 1: Store Name */}
                            {currentStep === 1 && (
                                <div className="space-y-6">
                                    <div className="text-center mb-8">
                                        <div className="inline-flex items-center justify-center h-16 w-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl mb-4 shadow-lg">
                                            <Store className="h-8 w-8 text-white" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-slate-900">
                                            Comment s'appelle votre boutique ?
                                        </h2>
                                        <p className="text-slate-500 mt-2">
                                            Ce nom sera votre adresse unique sur Elena
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-slate-700">
                                            Nom de boutique
                                        </Label>
                                        <div className="relative">
                                            <div className="absolute left-0 top-0 bottom-0 flex items-center pl-4 pointer-events-none">
                                                <span className="text-slate-400 text-sm">elenashop.tn/</span>
                                            </div>
                                            <Input
                                                type="text"
                                                placeholder="maboutique"
                                                value={storeName}
                                                onChange={handleStoreNameChange}
                                                className={`h-14 pl-28 pr-12 rounded-xl text-lg font-medium border-2 transition-colors ${isAvailable === true
                                                    ? "border-emerald-500 bg-emerald-50/50"
                                                    : isAvailable === false
                                                        ? "border-red-500 bg-red-50/50"
                                                        : "border-slate-200"
                                                    }`}
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                                {isChecking && <Loader2 className="h-5 w-5 text-slate-400 animate-spin" />}
                                                {!isChecking && isAvailable === true && <Check className="h-5 w-5 text-emerald-500" />}
                                                {!isChecking && isAvailable === false && <X className="h-5 w-5 text-red-500" />}
                                            </div>
                                        </div>
                                        <p className={`text-sm ${isAvailable === true ? "text-emerald-600" :
                                            isAvailable === false ? "text-red-600" : "text-slate-500"
                                            }`}>
                                            {storeName.length < 3
                                                ? "Minimum 3 caractères (lettres et chiffres uniquement)"
                                                : isChecking
                                                    ? "Vérification..."
                                                    : isAvailable === true
                                                        ? "✓ Ce nom est disponible !"
                                                        : isAvailable === false
                                                            ? "✗ Ce nom est déjà pris"
                                                            : ""
                                            }
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Category */}
                            {currentStep === 2 && (
                                <div className="space-y-6">
                                    <div className="text-center mb-8">
                                        <h2 className="text-2xl font-bold text-slate-900">
                                            Que vendez-vous ?
                                        </h2>
                                        <p className="text-slate-500 mt-2">
                                            Cela nous aide à personnaliser votre boutique
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {STORE_CATEGORIES.map((cat) => (
                                            <motion.button
                                                key={cat.id}
                                                type="button"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setCategory(cat.id)}
                                                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${category === cat.id
                                                    ? "border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/10"
                                                    : "border-slate-200 hover:border-slate-300"
                                                    }`}
                                            >
                                                <span className="text-3xl">{cat.emoji}</span>
                                                <span className="text-sm font-semibold text-slate-700">{cat.label}</span>
                                                <span className="text-xs text-slate-400">{cat.description}</span>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Visual Style */}
                            {currentStep === 3 && (
                                <div className="space-y-6">
                                    <div className="text-center mb-8">
                                        <h2 className="text-2xl font-bold text-slate-900">
                                            Quel style vous représente ?
                                        </h2>
                                        <p className="text-slate-500 mt-2">
                                            Définissez l'ambiance de votre boutique
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {VISUAL_STYLES.map((s) => (
                                            <motion.button
                                                key={s.id}
                                                type="button"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setStyle(s.id)}
                                                className={`relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all overflow-hidden ${style === s.id
                                                    ? "border-emerald-500 shadow-lg"
                                                    : "border-slate-200 hover:border-slate-300"
                                                    }`}
                                            >
                                                {/* Color Preview */}
                                                <div className="flex gap-1">
                                                    {s.colors.map((color, i) => (
                                                        <div
                                                            key={i}
                                                            className="h-8 w-8 rounded-full border-2 border-white shadow-md"
                                                            style={{ backgroundColor: color }}
                                                        />
                                                    ))}
                                                </div>
                                                <div className="text-center">
                                                    <span className="text-2xl mb-1 block">{s.emoji}</span>
                                                    <span className="text-sm font-bold text-slate-800">{s.label}</span>
                                                    <span className="text-xs text-slate-400 block mt-1">{s.description}</span>
                                                </div>
                                                {style === s.id && (
                                                    <div className="absolute top-2 right-2">
                                                        <Check className="h-5 w-5 text-emerald-500" />
                                                    </div>
                                                )}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Template Selection */}
                            {currentStep === 4 && (
                                <div className="space-y-6">
                                    <div className="text-center mb-6">
                                        <h2 className="text-2xl font-bold text-slate-900">
                                            Choisissez votre template
                                        </h2>
                                        <p className="text-slate-500 mt-2">
                                            Basé sur vos choix, nous vous recommandons le template idéal
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {TEMPLATE_OPTIONS.map((template) => (
                                            <TemplateCard
                                                key={template.id}
                                                {...template}
                                                isSelected={selectedTemplate === template.id}
                                                isRecommended={template.id === recommendedTemplate}
                                                onSelect={() => setSelectedTemplate(template.id)}
                                            />
                                        ))}
                                    </div>

                                    {/* Smart Matching Info */}
                                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                                        <Sparkles className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-amber-800">
                                                Recommandation intelligente
                                            </p>
                                            <p className="text-xs text-amber-600 mt-1">
                                                Le template <strong>{TEMPLATE_OPTIONS.find(t => t.id === recommendedTemplate)?.name}</strong> est parfait pour une boutique <strong>{STORE_CATEGORIES.find(c => c.id === category)?.label}</strong> avec un style <strong>{VISUAL_STYLES.find(s => s.id === style)?.label}</strong>.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            className="gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Retour
                        </Button>

                        {currentStep < 4 ? (
                            <Button
                                type="button"
                                onClick={nextStep}
                                disabled={!canProceed()}
                                className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                            >
                                Continuer
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                onClick={handleSubmit}
                                disabled={!canProceed() || isLoading}
                                className="gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/25"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        <Sparkles className="h-5 w-5" />
                                        Créer ma boutique
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
