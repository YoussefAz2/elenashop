"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Store, ShoppingBag, Star, Check, ArrowRight } from "lucide-react";

interface StoreBuildingAnimationProps {
    storeName: string;
    templateId: string;
    category: string;
    onComplete: () => void;
}

const STEPS = [
    { id: "init", label: "Initialisation...", duration: 800 },
    { id: "header", label: "Construction du header...", duration: 600 },
    { id: "hero", label: "Ajout de la bannière...", duration: 800 },
    { id: "name", label: "Écriture du nom...", duration: 1000 },
    { id: "products", label: "Ajout des produits...", duration: 1200 },
    { id: "style", label: "Application du style...", duration: 600 },
    { id: "done", label: "Finalisation...", duration: 500 },
];

export function StoreBuildingAnimation({
    storeName,
    templateId,
    category,
    onComplete,
}: StoreBuildingAnimationProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [displayedName, setDisplayedName] = useState("");
    const [showConfetti, setShowConfetti] = useState(false);

    // Get template colors
    const templateColors = {
        minimal: { primary: "#10b981", bg: "#ffffff", text: "#1e293b" },
        luxe: { primary: "#d4af37", bg: "#1a1a1a", text: "#ffffff" },
        street: { primary: "#a855f7", bg: "#0f0f0f", text: "#ffffff" },
    }[templateId] || { primary: "#10b981", bg: "#ffffff", text: "#1e293b" };

    // Auto-advance steps
    useEffect(() => {
        if (currentStep < STEPS.length) {
            const timer = setTimeout(() => {
                setCurrentStep((prev) => prev + 1);
            }, STEPS[currentStep]?.duration || 500);
            return () => clearTimeout(timer);
        } else {
            // All steps complete
            setShowConfetti(true);
            setTimeout(onComplete, 3000);
        }
    }, [currentStep, onComplete]);

    // Typing effect for store name
    useEffect(() => {
        if (currentStep >= 3 && displayedName.length < storeName.length) {
            const timer = setTimeout(() => {
                setDisplayedName(storeName.slice(0, displayedName.length + 1));
            }, 80);
            return () => clearTimeout(timer);
        }
    }, [currentStep, displayedName, storeName]);

    const isStepComplete = (stepIndex: number) => currentStep > stepIndex;
    const isStepActive = (stepIndex: number) => currentStep === stepIndex;

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center z-50 overflow-hidden">
            {/* Progress indicator */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
                {STEPS.slice(0, -1).map((step, i) => (
                    <motion.div
                        key={step.id}
                        initial={{ scale: 0.8, opacity: 0.5 }}
                        animate={{
                            scale: isStepActive(i) ? 1.2 : 1,
                            opacity: isStepComplete(i) ? 1 : isStepActive(i) ? 1 : 0.4,
                            backgroundColor: isStepComplete(i) ? "#10b981" : isStepActive(i) ? "#3b82f6" : "#475569",
                        }}
                        className="w-2 h-2 rounded-full"
                    />
                ))}
            </div>

            {/* Current step label */}
            <motion.p
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-emerald-400 text-sm font-medium mb-6"
            >
                {STEPS[currentStep]?.label || "✨ C'est prêt !"}
            </motion.p>

            {/* Phone Mockup */}
            <div className="relative">
                {/* Phone Frame */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0, rotateY: -15 }}
                    animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                    transition={{ type: "spring", duration: 0.8 }}
                    className="relative w-[340px] h-[680px] bg-slate-800 rounded-[3rem] p-2 shadow-2xl shadow-black/50"
                    style={{ perspective: "1000px" }}
                >
                    {/* Screen */}
                    <motion.div
                        className="w-full h-full rounded-[2.5rem] overflow-hidden relative"
                        animate={{ backgroundColor: templateColors.bg }}
                        transition={{ delay: 2.5, duration: 0.5 }}
                    >
                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-slate-800 rounded-b-2xl z-20" />

                        {/* Content that builds up */}
                        <div className="w-full h-full pt-8 flex flex-col">
                            {/* Header - Step 1 */}
                            <AnimatePresence>
                                {currentStep >= 1 && (
                                    <motion.div
                                        initial={{ y: -50, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        className="px-4 py-3 border-b flex items-center justify-between"
                                        style={{ borderColor: `${templateColors.text}20` }}
                                    >
                                        <div className="flex items-center gap-2">
                                            <motion.div
                                                animate={{ backgroundColor: templateColors.primary }}
                                                className="w-6 h-6 rounded-lg flex items-center justify-center"
                                            >
                                                <Store className="w-3 h-3 text-white" />
                                            </motion.div>
                                            <motion.span
                                                animate={{ color: templateColors.text }}
                                                className="text-xs font-bold"
                                            >
                                                {displayedName || "..."}
                                                {currentStep === 3 && displayedName.length < storeName.length && (
                                                    <motion.span
                                                        animate={{ opacity: [1, 0] }}
                                                        transition={{ repeat: Infinity, duration: 0.5 }}
                                                    >
                                                        |
                                                    </motion.span>
                                                )}
                                            </motion.span>
                                        </div>
                                        <ShoppingBag className="w-4 h-4" style={{ color: templateColors.text }} />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Hero - Step 2 */}
                            <AnimatePresence>
                                {currentStep >= 2 && (
                                    <motion.div
                                        initial={{ scaleY: 0, opacity: 0 }}
                                        animate={{ scaleY: 1, opacity: 1 }}
                                        style={{ originY: 0, backgroundColor: templateColors.primary }}
                                        className="h-32 flex flex-col items-center justify-center px-4"
                                    >
                                        <motion.h1
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="text-white text-lg font-bold text-center"
                                        >
                                            Bienvenue
                                        </motion.h1>
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 0.8 }}
                                            transition={{ delay: 0.5 }}
                                            className="text-white/80 text-xs text-center mt-1"
                                        >
                                            Découvrez notre collection
                                        </motion.p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Products Grid - Step 4 */}
                            <AnimatePresence>
                                {currentStep >= 4 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex-1 p-3 grid grid-cols-2 gap-2"
                                    >
                                        {[0, 1, 2, 3].map((i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: i * 0.15, type: "spring" }}
                                                className="rounded-lg overflow-hidden"
                                                style={{ backgroundColor: `${templateColors.text}10` }}
                                            >
                                                <div
                                                    className="aspect-square"
                                                    style={{ backgroundColor: `${templateColors.primary}30` }}
                                                />
                                                <div className="p-2">
                                                    <div
                                                        className="h-2 rounded w-3/4 mb-1"
                                                        style={{ backgroundColor: `${templateColors.text}30` }}
                                                    />
                                                    <motion.div
                                                        animate={{ backgroundColor: templateColors.primary }}
                                                        className="h-2 rounded w-1/2"
                                                    />
                                                </div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Style flash effect - Step 5 */}
                        <AnimatePresence>
                            {currentStep === 5 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0, 0.8, 0] }}
                                    transition={{ duration: 0.6 }}
                                    className="absolute inset-0 bg-white z-30"
                                />
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>

                {/* Floating elements during build */}
                <AnimatePresence>
                    {currentStep >= 1 && currentStep <= 5 && (
                        <>
                            <motion.div
                                initial={{ x: -100, opacity: 0 }}
                                animate={{ x: [-100, -60, -100], opacity: [0, 1, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute left-0 top-1/4 text-2xl"
                            >
                                🔧
                            </motion.div>
                            <motion.div
                                initial={{ x: 100, opacity: 0 }}
                                animate={{ x: [100, 60, 100], opacity: [0, 1, 0] }}
                                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                className="absolute right-0 top-1/2 text-2xl"
                            >
                                ⚡
                            </motion.div>
                            <motion.div
                                initial={{ y: 100, opacity: 0 }}
                                animate={{ y: [100, 60, 100], opacity: [0, 1, 0] }}
                                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                                className="absolute bottom-0 left-1/2 text-2xl"
                            >
                                🎨
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>

            {/* Completion state */}
            <AnimatePresence>
                {showConfetti && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute bottom-16 text-center"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", delay: 0.2 }}
                            className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-full mb-4"
                        >
                            <Check className="w-8 h-8 text-white" />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-white mb-2">
                            🎉 Votre boutique est prête !
                        </h2>
                        <p className="text-slate-400 mb-4">
                            <span className="text-emerald-400 font-semibold">{storeName}</span> • {category}
                        </p>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="flex items-center justify-center gap-2 text-emerald-400"
                        >
                            <span className="text-sm">Lancement du dashboard</span>
                            <ArrowRight className="w-4 h-4 animate-pulse" />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Confetti */}
            {showConfetti && (
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    {[...Array(50)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{
                                x: "50vw",
                                y: "100vh",
                                scale: 0,
                            }}
                            animate={{
                                x: `${Math.random() * 100}vw`,
                                y: `${Math.random() * 50}vh`,
                                scale: 1,
                                rotate: Math.random() * 720,
                            }}
                            transition={{
                                duration: 1 + Math.random(),
                                ease: "easeOut",
                            }}
                            className="absolute"
                        >
                            <div
                                className="w-3 h-3 rounded-sm"
                                style={{
                                    backgroundColor: ["#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6", "#ec4899"][Math.floor(Math.random() * 6)],
                                }}
                            />
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
