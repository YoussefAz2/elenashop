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
import { StoreBuildingAnimation } from "./StoreBuildingAnimation"; // V2.0 Cinematic Animation
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
    enter: (direction: number) => {
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
        const distance = isMobile ? 150 : 300;
        return {
            x: direction > 0 ? distance : -distance,
            opacity: 0,
            scale: isMobile ? 0.97 : 1,
        };
    },
    center: {
        x: 0,
        opacity: 1,
        scale: 1,
    },
    exit: (direction: number) => {
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
        const distance = isMobile ? 150 : 300;
        return {
            x: direction < 0 ? distance : -distance,
            opacity: 0,
            scale: isMobile ? 0.97 : 1,
        };
    },
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
                    router.push('/dashboard?newStore=true');
                }}
                targetUrl="/dashboard?newStore=true"
            />
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Progress Steps */}
            <div className="mb-6 sm:mb-12">
                <div className="flex items-center justify-between relative max-w-lg mx-auto">
                    {/* Progress Line */}
                    <div className="absolute top-5 left-0 right-0 h-[1px] bg-zinc-200">
                        <motion.div
                            className="h-full bg-zinc-900"
                            initial={{ width: "0%" }}
                            animate={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                            transition={{ duration: 0.5, ease: "circOut" }}
                        />
                    </div>

                    {STEPS.map((step) => (
                        <div key={step.id} className="relative z-10 flex flex-col items-center group">
                            <motion.div
                                animate={{
                                    scale: currentStep === step.id ? 1.1 : 1,
                                    backgroundColor: currentStep >= step.id ? "#18181b" : "#ffffff",
                                    borderColor: currentStep >= step.id ? "#18181b" : "#e4e4e7",
                                }}
                                className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center text-sm border-2 transition-colors duration-300 ${currentStep >= step.id ? "text-white" : "text-zinc-300"
                                    }`}
                            >
                                {currentStep > step.id ? (
                                    <Check className="h-4 w-4" />
                                ) : (
                                    <span className="text-lg">{step.emoji}</span>
                                )}
                            </motion.div>
                            <span className={`text-[10px] mt-3 font-bold uppercase tracking-widest transition-colors duration-300 ${currentStep >= step.id ? "text-zinc-900" : "text-zinc-300"
                                }`}>
                                {step.title}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Card */}
            <Card className="border-white shadow-2xl shadow-zinc-200/50 overflow-hidden bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-[2rem]">
                <CardContent className="p-4 sm:p-10">
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
                                <div className="space-y-6 sm:space-y-8">
                                    <div className="text-center mb-6 sm:mb-10">
                                        <div className="inline-flex items-center justify-center h-14 w-14 sm:h-20 sm:w-20 bg-zinc-900 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 shadow-xl shadow-zinc-900/10">
                                            <Store className="h-7 w-7 sm:h-10 sm:w-10 text-white" />
                                        </div>
                                        <h2 className="text-xl sm:text-3xl font-serif font-bold text-zinc-900 italic">
                                            Nommait votre boutique
                                        </h2>
                                        <p className="text-zinc-500 mt-2 sm:mt-3 text-sm sm:text-base font-medium">
                                            Ce nom sera votre identité unique sur Elena
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-slate-700">
                                            Nom de boutique
                                        </Label>
                                        <div className="relative">
                                            <div className="absolute left-0 top-0 bottom-0 flex items-center pl-6 pointer-events-none">
                                                <span className="text-zinc-400 font-medium font-serif italic text-lg">elenashop.tn/</span>
                                            </div>
                                            <Input
                                                type="text"
                                                placeholder="maboutique"
                                                value={storeName}
                                                onChange={handleStoreNameChange}
                                                className={`h-12 sm:h-16 pl-32 sm:pl-40 pr-10 sm:pr-12 rounded-xl sm:rounded-2xl text-base sm:text-xl font-bold border transition-all duration-300 ${isAvailable === true
                                                    ? "border-emerald-200 bg-emerald-50/30 ring-4 ring-emerald-50"
                                                    : isAvailable === false
                                                        ? "border-red-200 bg-red-50/30 ring-4 ring-red-50"
                                                        : "border-zinc-200 focus:border-zinc-900 focus:ring-4 focus:ring-zinc-100"
                                                    }`}
                                            />
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2">
                                                {isChecking && <Loader2 className="h-5 w-5 text-zinc-400 animate-spin" />}
                                                {!isChecking && isAvailable === true && <div className="bg-emerald-100 p-1.5 rounded-full"><Check className="h-4 w-4 text-emerald-600" /></div>}
                                                {!isChecking && isAvailable === false && <div className="bg-red-100 p-1.5 rounded-full"><X className="h-4 w-4 text-red-600" /></div>}
                                            </div>
                                        </div>
                                        <p className={`text-sm font-medium text-center ${isAvailable === true ? "text-emerald-600" :
                                            isAvailable === false ? "text-red-600" : "text-zinc-400"
                                            }`}>
                                            {storeName.length < 3
                                                ? "Minimum 3 caractères (lettres et chiffres uniquement)"
                                                : isChecking
                                                    ? "Vérification..."
                                                    : isAvailable === true
                                                        ? "✓ Ce nom est parfait !"
                                                        : isAvailable === false
                                                            ? "✗ Ce nom est déjà pris, essayez-en un autre"
                                                            : ""
                                            }
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Category */}
                            {currentStep === 2 && (
                                <div className="space-y-6 sm:space-y-8">
                                    <div className="text-center mb-6 sm:mb-10">
                                        <h2 className="text-xl sm:text-3xl font-serif font-bold text-zinc-900 italic">
                                            Que vendez-vous ?
                                        </h2>
                                        <p className="text-zinc-500 mt-2 sm:mt-3 text-sm sm:text-base font-medium">
                                            Cela nous aide à personnaliser votre expérience
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                                        {STORE_CATEGORIES.map((cat) => (
                                            <motion.button
                                                key={cat.id}
                                                type="button"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setCategory(cat.id)}
                                                className={`flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-6 rounded-xl sm:rounded-2xl border transition-all duration-300 ${category === cat.id
                                                    ? "border-zinc-900 bg-zinc-900 text-white shadow-xl shadow-zinc-900/20"
                                                    : "border-zinc-100 bg-white hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-200/50"
                                                    }`}
                                            >
                                                <span className="text-2xl sm:text-4xl">{cat.emoji}</span>
                                                <span className={`text-xs sm:text-sm font-bold ${category === cat.id ? "text-white" : "text-zinc-700"}`}>{cat.label}</span>
                                                <span className={`text-[8px] sm:text-[10px] uppercase tracking-wider hidden sm:block ${category === cat.id ? "text-zinc-400" : "text-zinc-400"}`}>{cat.description}</span>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Visual Style */}
                            {currentStep === 3 && (
                                <div className="space-y-6 sm:space-y-8">
                                    <div className="text-center mb-6 sm:mb-10">
                                        <h2 className="text-xl sm:text-3xl font-serif font-bold text-zinc-900 italic">
                                            Quel style vous représente ?
                                        </h2>
                                        <p className="text-zinc-500 mt-2 sm:mt-3 text-sm sm:text-base font-medium">
                                            Définissez l'atmosphère visuelle de votre marque
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 sm:gap-6">
                                        {VISUAL_STYLES.map((s) => (
                                            <motion.button
                                                key={s.id}
                                                type="button"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setStyle(s.id)}
                                                className={`relative flex flex-col items-center gap-2 sm:gap-4 p-4 sm:p-6 rounded-xl sm:rounded-[2rem] border transition-all duration-300 overflow-hidden ${style === s.id
                                                    ? "border-zinc-900 bg-zinc-50 shadow-xl shadow-zinc-900/5 group"
                                                    : "border-zinc-100 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-200/50"
                                                    }`}
                                            >
                                                {/* Color Preview */}
                                                <div className="flex -space-x-2 sm:-space-x-3">
                                                    {s.colors.map((color, i) => (
                                                        <div
                                                            key={i}
                                                            className="h-6 w-6 sm:h-10 sm:w-10 rounded-full border-2 sm:border-4 border-white shadow-lg z-10"
                                                            style={{ backgroundColor: color }}
                                                        />
                                                    ))}
                                                </div>
                                                <div className="text-center">
                                                    <span className="text-xl sm:text-3xl mb-1 sm:mb-2 block filter drop-shadow-md">{s.emoji}</span>
                                                    <span className="text-sm sm:text-base font-bold text-zinc-900">{s.label}</span>
                                                    <span className="text-[10px] sm:text-xs text-zinc-500 block mt-0.5 sm:mt-1 font-medium hidden sm:block">{s.description}</span>
                                                </div>
                                                {style === s.id && (
                                                    <div className="absolute top-4 right-4 bg-zinc-900 text-white p-1.5 rounded-full">
                                                        <Check className="h-3 w-3" />
                                                    </div>
                                                )}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Template Selection */}
                            {currentStep === 4 && (
                                <div className="space-y-6 sm:space-y-8">
                                    <div className="text-center mb-4 sm:mb-8">
                                        <h2 className="text-xl sm:text-3xl font-serif font-bold text-zinc-900 italic">
                                            Choisissez votre template
                                        </h2>
                                        <p className="text-zinc-500 mt-2 sm:mt-3 text-sm sm:text-base font-medium">
                                            Nous avons sélectionné le meilleur design pour vous
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 sm:gap-4">
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

                                    {/* Smart Matching Info - hidden on mobile */}
                                    <div className="hidden sm:flex bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-5 items-start gap-4 shadow-sm">
                                        <div className="bg-white p-2 rounded-lg shadow-sm border border-amber-100">
                                            <Sparkles className="h-4 w-4 text-amber-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-amber-900 mb-1">
                                                Recommandation IA
                                            </p>
                                            <p className="text-xs text-amber-700/80 leading-relaxed">
                                                Le template <strong>{TEMPLATE_OPTIONS.find(t => t.id === recommendedTemplate)?.name}</strong> est optimisé pour les boutiques <strong>{STORE_CATEGORIES.find(c => c.id === category)?.label}</strong> au style <strong>{VISUAL_STYLES.find(s => s.id === style)?.label}</strong>.
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
                    <div className="flex justify-between mt-6 sm:mt-10 pt-4 sm:pt-8 border-t border-zinc-100">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            className="gap-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 active:scale-95 transition-transform min-h-[44px]"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Retour
                        </Button>

                        {currentStep < 4 ? (
                            <Button
                                type="button"
                                onClick={nextStep}
                                disabled={!canProceed()}
                                className="gap-2 bg-zinc-900 hover:bg-zinc-800 text-white px-8 rounded-xl font-bold shadow-lg shadow-zinc-200 active:scale-95 transition-transform min-h-[44px]"
                            >
                                Continuer
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                onClick={handleSubmit}
                                disabled={!canProceed() || isLoading}
                                className="gap-2 bg-zinc-900 hover:bg-zinc-800 text-white px-8 rounded-xl font-bold shadow-lg shadow-zinc-900/20 active:scale-95 transition-transform min-h-[44px]"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        <Sparkles className="h-4 w-4 text-amber-200" />
                                        Lancer ma boutique
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
