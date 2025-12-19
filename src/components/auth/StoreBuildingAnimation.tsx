"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Store, ShoppingBag, Check, Rocket, Sparkles } from "lucide-react";

interface StoreBuildingAnimationProps {
    storeName: string;
    templateId: string;
    category: string;
    onComplete: () => void;
}

const STEPS = [
    { id: "init", label: "Préparation de votre espace...", duration: 800 },
    { id: "header", label: "Design du header...", duration: 600 },
    { id: "hero", label: "Création de la bannière...", duration: 800 },
    { id: "name", label: "Personnalisation...", duration: 1000 },
    { id: "products", label: "Mise en place des produits...", duration: 1200 },
    { id: "style", label: "Touches finales...", duration: 600 },
    { id: "done", label: "✨ Magie en cours...", duration: 500 },
];

// Fun emojis for confetti
const CONFETTI_ITEMS = ["🎉", "✨", "💫", "⭐", "🚀", "💎", "🎊", "🌟", "💜", "💚", "🔥", "💰"];

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
        minimal: { primary: "#10b981", secondary: "#34d399", bg: "#ffffff", text: "#1e293b" },
        luxe: { primary: "#d4af37", secondary: "#f4d03f", bg: "#1a1a1a", text: "#ffffff" },
        street: { primary: "#a855f7", secondary: "#c084fc", bg: "#0f0f0f", text: "#ffffff" },
    }[templateId] || { primary: "#10b981", secondary: "#34d399", bg: "#ffffff", text: "#1e293b" };

    // Auto-advance steps
    useEffect(() => {
        if (currentStep < STEPS.length) {
            const timer = setTimeout(() => {
                setCurrentStep((prev) => prev + 1);
            }, STEPS[currentStep]?.duration || 500);
            return () => clearTimeout(timer);
        } else {
            setShowConfetti(true);
        }
    }, [currentStep]);

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
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center z-50 overflow-hidden">
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={`bg-${i}`}
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                            opacity: 0.1
                        }}
                        animate={{
                            y: [null, Math.random() * -200],
                            opacity: [0.1, 0.3, 0.1]
                        }}
                        transition={{
                            duration: 5 + Math.random() * 5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute w-1 h-1 rounded-full bg-white/20"
                    />
                ))}
            </div>

            {/* Progress indicator - Creative dots */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2">
                <div className="flex items-center gap-3">
                    {STEPS.slice(0, -1).map((step, i) => (
                        <motion.div
                            key={step.id}
                            initial={{ scale: 0.5, opacity: 0.3 }}
                            animate={{
                                scale: isStepActive(i) ? 1.4 : isStepComplete(i) ? 1 : 0.8,
                                opacity: isStepComplete(i) ? 1 : isStepActive(i) ? 1 : 0.3,
                            }}
                            className="relative"
                        >
                            <div
                                className={`w-3 h-3 rounded-full transition-colors duration-300 ${isStepComplete(i)
                                        ? "bg-emerald-400"
                                        : isStepActive(i)
                                            ? "bg-blue-400"
                                            : "bg-slate-600"
                                    }`}
                            />
                            {isStepActive(i) && (
                                <motion.div
                                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                    transition={{ repeat: Infinity, duration: 1 }}
                                    className="absolute inset-0 rounded-full bg-blue-400"
                                />
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Current step label with icon */}
            <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 mb-6"
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                </motion.div>
                <span className="text-amber-300 text-sm font-medium tracking-wide">
                    {STEPS[currentStep]?.label || "C'est prêt !"}
                </span>
            </motion.div>

            {/* Phone Mockup with glow effect */}
            <div className="relative">
                {/* Glow effect behind phone */}
                <motion.div
                    animate={{
                        boxShadow: [
                            `0 0 60px ${templateColors.primary}40`,
                            `0 0 100px ${templateColors.primary}60`,
                            `0 0 60px ${templateColors.primary}40`
                        ]
                    }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 rounded-[3rem] blur-xl"
                />

                {/* Phone Frame */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0, rotateY: -15 }}
                    animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                    transition={{ type: "spring", duration: 0.8 }}
                    className="relative w-[320px] h-[640px] bg-gradient-to-b from-slate-700 to-slate-800 rounded-[3rem] p-2 shadow-2xl"
                >
                    {/* Screen */}
                    <motion.div
                        className="w-full h-full rounded-[2.5rem] overflow-hidden relative"
                        animate={{ backgroundColor: templateColors.bg }}
                        transition={{ delay: 2.5, duration: 0.5 }}
                    >
                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-slate-800 rounded-b-3xl z-20 flex items-center justify-center">
                            <div className="w-16 h-1.5 bg-slate-700 rounded-full" />
                        </div>

                        {/* Content that builds up */}
                        <div className="w-full h-full pt-10 flex flex-col">
                            {/* Header - Step 1 */}
                            <AnimatePresence>
                                {currentStep >= 1 && (
                                    <motion.div
                                        initial={{ y: -50, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        className="px-4 py-3 border-b flex items-center justify-between"
                                        style={{ borderColor: `${templateColors.text}15` }}
                                    >
                                        <div className="flex items-center gap-2">
                                            <motion.div
                                                animate={{
                                                    backgroundColor: templateColors.primary,
                                                    boxShadow: `0 0 20px ${templateColors.primary}50`
                                                }}
                                                className="w-8 h-8 rounded-xl flex items-center justify-center"
                                            >
                                                <Store className="w-4 h-4 text-white" />
                                            </motion.div>
                                            <motion.span
                                                animate={{ color: templateColors.text }}
                                                className="text-sm font-bold"
                                            >
                                                {displayedName || "..."}
                                                {currentStep === 3 && displayedName.length < storeName.length && (
                                                    <motion.span
                                                        animate={{ opacity: [1, 0] }}
                                                        transition={{ repeat: Infinity, duration: 0.5 }}
                                                        className="text-emerald-400"
                                                    >
                                                        |
                                                    </motion.span>
                                                )}
                                            </motion.span>
                                        </div>
                                        <ShoppingBag className="w-5 h-5" style={{ color: templateColors.text }} />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Hero - Step 2 */}
                            <AnimatePresence>
                                {currentStep >= 2 && (
                                    <motion.div
                                        initial={{ scaleY: 0, opacity: 0 }}
                                        animate={{ scaleY: 1, opacity: 1 }}
                                        style={{
                                            originY: 0,
                                            background: `linear-gradient(135deg, ${templateColors.primary}, ${templateColors.secondary})`
                                        }}
                                        className="h-36 flex flex-col items-center justify-center px-4 relative overflow-hidden"
                                    >
                                        {/* Decorative circles */}
                                        <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-white/10" />
                                        <div className="absolute -left-5 -bottom-5 w-20 h-20 rounded-full bg-white/10" />

                                        <motion.h1
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="text-white text-xl font-bold text-center relative z-10"
                                        >
                                            Bienvenue
                                        </motion.h1>
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 0.9 }}
                                            transition={{ delay: 0.5 }}
                                            className="text-white/90 text-sm text-center mt-1 relative z-10"
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
                                        className="flex-1 p-3 grid grid-cols-2 gap-3"
                                    >
                                        {[0, 1, 2, 3].map((i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ scale: 0, opacity: 0, rotate: -10 }}
                                                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                                transition={{ delay: i * 0.15, type: "spring", bounce: 0.4 }}
                                                className="rounded-xl overflow-hidden shadow-lg"
                                                style={{ backgroundColor: `${templateColors.text}08` }}
                                            >
                                                <div
                                                    className="aspect-square relative"
                                                    style={{
                                                        background: `linear-gradient(135deg, ${templateColors.primary}20, ${templateColors.secondary}30)`
                                                    }}
                                                >
                                                    {/* Product placeholder icon */}
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div
                                                            className="w-8 h-8 rounded-full"
                                                            style={{ backgroundColor: `${templateColors.primary}40` }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="p-2">
                                                    <div
                                                        className="h-2 rounded-full w-3/4 mb-1.5"
                                                        style={{ backgroundColor: `${templateColors.text}20` }}
                                                    />
                                                    <motion.div
                                                        animate={{ backgroundColor: templateColors.primary }}
                                                        className="h-2 rounded-full w-1/2"
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
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ duration: 0.4 }}
                                    className="absolute inset-0 z-30"
                                    style={{
                                        background: `radial-gradient(circle at center, ${templateColors.primary}80, transparent)`
                                    }}
                                />
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>

                {/* Floating emojis during build */}
                <AnimatePresence>
                    {currentStep >= 1 && currentStep <= 5 && (
                        <>
                            {["🔨", "✨", "🎨", "⚡"].map((emoji, i) => (
                                <motion.div
                                    key={emoji}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{
                                        opacity: [0, 1, 0],
                                        scale: [0.5, 1.2, 0.5],
                                        x: [0, (i % 2 === 0 ? -30 : 30), 0],
                                        y: [0, -20, 0]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: i * 0.5
                                    }}
                                    className="absolute text-2xl"
                                    style={{
                                        left: i % 2 === 0 ? "-40px" : "auto",
                                        right: i % 2 === 1 ? "-40px" : "auto",
                                        top: `${25 + i * 20}%`
                                    }}
                                >
                                    {emoji}
                                </motion.div>
                            ))}
                        </>
                    )}
                </AnimatePresence>
            </div>

            {/* Completion state - More creative */}
            <AnimatePresence>
                {showConfetti && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", bounce: 0.4 }}
                        className="absolute bottom-8 text-center"
                    >
                        {/* Success icon with multiple rings */}
                        <div className="relative inline-block mb-6">
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="absolute inset-0 w-24 h-24 -m-2 rounded-full bg-emerald-400"
                            />
                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                                className="absolute inset-0 w-20 h-20 rounded-full bg-emerald-500/50"
                            />
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", delay: 0.3, bounce: 0.5 }}
                                className="relative w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/40"
                            >
                                <Check className="w-10 h-10 text-white" strokeWidth={3} />
                            </motion.div>
                        </div>

                        {/* Text */}
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="text-3xl font-bold text-white mb-2"
                        >
                            <span className="text-4xl">🎉</span> Votre boutique est prête !
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="text-slate-400 mb-8"
                        >
                            <span className="text-emerald-400 font-semibold">{storeName}</span>
                            <span className="mx-2">•</span>
                            {category}
                        </motion.p>

                        {/* Creative button */}
                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9, type: "spring" }}
                            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(16, 185, 129, 0.4)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onComplete}
                            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white font-bold text-lg rounded-2xl shadow-xl shadow-emerald-500/30 overflow-hidden"
                        >
                            {/* Button shine effect */}
                            <motion.div
                                animate={{ x: [-200, 200] }}
                                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                            />

                            <Rocket className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                            <span>Lancer ma boutique</span>
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Emoji confetti - more fun! */}
            {showConfetti && (
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    {[...Array(40)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{
                                x: "50vw",
                                y: "110vh",
                                scale: 0,
                                rotate: 0,
                            }}
                            animate={{
                                x: `${10 + Math.random() * 80}vw`,
                                y: `${-10 + Math.random() * 60}vh`,
                                scale: [0, 1.5, 1],
                                rotate: Math.random() * 360,
                            }}
                            transition={{
                                duration: 1.5 + Math.random() * 1,
                                ease: "easeOut",
                                delay: Math.random() * 0.5,
                            }}
                            className="absolute text-2xl"
                        >
                            {CONFETTI_ITEMS[Math.floor(Math.random() * CONFETTI_ITEMS.length)]}
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
