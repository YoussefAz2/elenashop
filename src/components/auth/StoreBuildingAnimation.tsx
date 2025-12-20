"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ArrowRight, Crown, ShoppingBag, Menu, Search, Zap } from "lucide-react";

interface StoreBuildingAnimationProps {
    storeName: string;
    templateId: string;
    category: string;
    onComplete: () => void;
    targetUrl?: string; // Optional URL for prefetching
}

const STEPS = [
    { id: "structure", label: "Initialisation Core", duration: 1500 },
    { id: "style", label: "Injection du Thème", duration: 1500 },
    { id: "branding", label: "Application Identité", duration: 1500 },
    { id: "content", label: "Génération Catalogue", duration: 1800 },
    { id: "final", label: "Optimisation Finale", duration: 1200 },
];

export function StoreBuildingAnimation({
    storeName,
    templateId,
    category,
    onComplete,
    targetUrl
}: StoreBuildingAnimationProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const router = useRouter();

    // Prefetch next page for instant load
    useEffect(() => {
        if (targetUrl) {
            router.prefetch(targetUrl);
        }
    }, [targetUrl, router]);

    const handleStartTransition = () => {
        setIsExiting(true);
        // OPTIMISTIC NAVIGATION: Start loading the new page concurrently with the animation
        // The doors open in 1.4s. We start navigation at 400ms.
        // This gives Next.js ~1s to fetch the new page while the user watches the door animation.
        setTimeout(() => {
            onComplete();
        }, 400);
    };

    // Deep theme configuration
    const theme = {
        minimal: {
            name: "Minimal",
            primary: "#10b981",
            accent: "#34d399",
            bg: "#ffffff",
            text: "text-slate-900",
            font: "font-sans",
            glow: "shadow-[0_0_40px_rgba(16,185,129,0.2)]",
            ambient: "#10b981", // Color for the background aura
            sidebarBg: "bg-white border-r border-slate-200",
            headerBg: "bg-white/80 border-b border-slate-100",
            productRadius: "rounded-xl",
            buttonStyle: "rounded-full",
            gradient: "from-emerald-500 to-teal-400",
            card: "bg-slate-50 border-slate-100"
        },
        luxe: {
            name: "Luxe",
            primary: "#BF953F", // Authentic Metallic Gold
            accent: "#FBF5B7", // Shimmer Gold
            bg: "#0c0a09", // Rich Black (Warmer than pure black)
            text: "text-white",
            font: "font-serif",
            glow: "shadow-[0_0_50px_rgba(191,149,63,0.15)]",
            ambient: "#453823", // Much darker, subtle coffee/gold aura, not yellow mud
            sidebarBg: "bg-stone-950 border-r border-stone-800",
            headerBg: "bg-stone-950/80 border-b border-stone-800",
            productRadius: "rounded-sm",
            buttonStyle: "rounded-sm",
            gradient: "from-yellow-700 via-yellow-600 to-yellow-800", // Gold gradient
            card: "bg-stone-900 border-stone-800"
        },
        street: {
            name: "Street",
            primary: "#8b5cf6",
            accent: "#a78bfa",
            bg: "#09090b",
            text: "text-white",
            font: "font-mono",
            glow: "shadow-[0_0_40px_rgba(139,92,246,0.3)]",
            ambient: "#8b5cf6",
            sidebarBg: "bg-black border-r border-zinc-800",
            headerBg: "bg-black/80 border-b border-zinc-800",
            productRadius: "rounded-none border border-white/20",
            buttonStyle: "rounded-none border border-white",
            gradient: "from-violet-600 to-indigo-500",
            card: "bg-zinc-900 border-zinc-700"
        },
    }[templateId] || {
        name: "Standard",
        primary: "#10b981",
        accent: "#34d399",
        bg: "#ffffff",
        text: "text-slate-900",
        font: "font-sans",
        glow: "shadow-[0_0_30px_rgba(16,185,129,0.3)]",
        ambient: "#10b981",
        sidebarBg: "bg-white border-r border-slate-200",
        headerBg: "bg-white/80 border-b border-slate-100",
        productRadius: "rounded-lg",
        buttonStyle: "rounded-lg",
        gradient: "from-emerald-500 to-teal-400",
        card: "bg-slate-50 border-slate-100"
    };

    useEffect(() => {
        let step = 0;
        const processStep = () => {
            if (step < STEPS.length) {
                setTimeout(() => {
                    setCurrentStep(step + 1);
                    step++;
                    processStep();
                }, STEPS[step].duration);
            } else {
                setTimeout(() => setIsCompleted(true), 1000);
            }
        };
        processStep();
    }, []);

    // ANIMATION LAYERS
    // Layer 0: Mock Dashboard (Bottom)
    // Layer 1: Doors (Middle)
    // Layer 2: Hologram Content (Top)

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 1.5 } },
        exit: { opacity: 0, scale: 0.95, transition: { duration: 0.5 } }
    };

    const successVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
        exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden font-sans bg-black">

            {/* LAYER 0: ACTUAL DASHBOARD CLONE (Revealed when doors open) */}
            {/* This mimics layout.tsx EXACTLY to ensure seamless transition */}
            <div className="absolute inset-0 z-0 bg-[#FDFDFD] overflow-hidden">
                {/* Background Textures from layout.tsx */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-50/50 via-transparent to-transparent opacity-50 pointer-events-none" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.015] pointer-events-none mix-blend-multiply" />

                {/* Sidebar - Positioned exactly as in layout (fixed) */}
                <div className="absolute left-0 top-0 bottom-0 z-20 hidden lg:block">
                    {/* We use specific dimensions instead of <Sidebar> to avoid running its logic/hooks */}
                    <div className="w-[260px] h-full border-r border-slate-200 bg-white p-4 flex flex-col gap-6">
                        {/* Logo Area */}
                        <div className="h-8 w-32 bg-slate-900 rounded-md opacity-10 animate-pulse" />

                        {/* Nav Items */}
                        <div className="space-y-1">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="h-10 w-full rounded-lg bg-slate-50 border border-slate-100" />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Mobile Nav Header - Positioned exactly as in layout */}
                <div className="absolute top-0 left-0 right-0 h-14 border-b border-slate-200 bg-white lg:hidden z-20 flex items-center px-4 gap-4">
                    <div className="w-8 h-8 rounded-md bg-slate-100" />
                    <div className="h-6 w-32 bg-slate-100 rounded" />
                </div>

                {/* Main Content Area */}
                <div className="lg:pl-[260px] pt-14 lg:pt-0 w-full h-full relative z-10">
                    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
                        {/* Dashboard Header Skeleton */}
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
                                <div className="h-4 w-64 bg-slate-100 rounded" />
                            </div>
                            <div className="h-10 w-10 rounded-full bg-slate-100" />
                        </div>

                        {/* Stats Grid Skeleton */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-32 bg-white border border-slate-100 rounded-xl shadow-sm p-6 space-y-4">
                                    <div className="h-4 w-8 bg-slate-100 rounded" />
                                    <div className="h-8 w-24 bg-slate-100 rounded" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* LIGHT BURST EFFECT (When doors open) */}
            <AnimatePresence>
                {isExiting && (
                    <motion.div
                        initial={{ width: "0px", opacity: 0 }}
                        animate={{ width: "100%", opacity: [0, 1, 0] }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute inset-y-0 left-1/2 -translate-x-1/2 z-[45] bg-white blur-3xl pointer-events-none mix-blend-overlay"
                    />
                )}
            </AnimatePresence>

            {/* LAYER 1: THE DOORS */}
            {/* Left Door */}
            <motion.div
                initial={{ x: "0%" }}
                animate={isExiting ? { x: "-100%" } : { x: "0%" }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute left-0 top-0 bottom-0 w-[50.5%] bg-black z-40 shadow-[10px_0_50px_rgba(0,0,0,0.8)]"
            >
                {/* Subtle texture for realism */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/5" />
            </motion.div>

            {/* Right Door */}
            <motion.div
                initial={{ x: "0%" }}
                animate={isExiting ? { x: "100%" } : { x: "0%" }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute right-0 top-0 bottom-0 w-[50.5%] bg-black z-40 shadow-[-10px_0_50px_rgba(0,0,0,0.8)]"
            >
                {/* Subtle texture for realism */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/5" />
            </motion.div>

            {/* Ambient Aura (Attached to Doors/Front Layer) */}
            <motion.div
                animate={isExiting ? { opacity: 0 } : { opacity: [0.2, 0.4, 0.2], scale: [1, 1.1, 1] }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute z-50 top-[-20%] left-[-20%] w-[140%] h-[140%] opacity-20 blur-[120px] rounded-full mix-blend-screen pointer-events-none"
                // Use 'ambient' color instead of primary to control the mudiness
                style={{ backgroundColor: theme.ambient }}
            />

            {/* LAYER 2: CONTENT (The Hologram) */}
            <AnimatePresence mode="wait">
                {!isCompleted ? (
                    <motion.div
                        key="building"
                        className="relative z-[60] flex flex-col items-center justify-center h-full w-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)", transition: { duration: 0.5 } }}
                    >
                        {/* HEADER TEXT */}
                        <motion.div
                            className="absolute top-[10%] text-center z-20 w-full px-4"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h3 className="text-white/40 text-[10px] md:text-xs tracking-[0.4em] uppercase font-medium mb-4 flex items-center justify-center gap-4">
                                <span className="w-12 h-px bg-white/10" />
                                CONFIGURATION {theme.name.toUpperCase()}
                                <span className="w-12 h-px bg-white/10" />
                            </h3>
                            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight drop-shadow-2xl">
                                {storeName}
                            </h2>
                        </motion.div>

                        {/* PHONE SIMULATION */}
                        <div className="relative w-[360px] h-[720px] flex items-center justify-center perspective-[2500px] mt-8">

                            {/* Scanning Beam */}
                            <motion.div
                                initial={{ top: "0%", opacity: 0 }}
                                animate={{ top: ["0%", "100%", "0%"], opacity: 1 }}
                                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                                className="absolute w-[150%] h-[2px] z-50 blur-[5px] shadow-[0_0_40px_currentColor] mix-blend-screen"
                                style={{ color: theme.primary, backgroundColor: theme.primary }}
                            />

                            {/* Phone Body */}
                            <motion.div
                                className={`relative w-[320px] h-[640px] rounded-[3.5rem] border-[8px] border-slate-900 bg-slate-950 shadow-2xl flex flex-col overflow-hidden ${theme.glow}`}
                                initial={{ rotateY: 25, rotateX: 5, scale: 0.9 }}
                                animate={{
                                    rotateY: [25, -25, 0],
                                    rotateX: [5, -5, 0],
                                    scale: 1
                                }}
                                transition={{ duration: 7.5, ease: "easeInOut" }}
                                style={{ transformStyle: "preserve-3d" }}
                            >
                                {/* Glossy Reflection on Glass */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none z-50 rounded-[3rem]" />

                                {/* Dynamic Reflection moving across screen */}
                                <motion.div
                                    animate={{ left: ["-100%", "200%"] }}
                                    transition={{ duration: 3, repeat: Infinity, delay: 1, ease: "easeInOut" }}
                                    className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none z-50 blur-sm"
                                />

                                {/* SIMULATED SCREEN CONTENT */}
                                <div className="absolute inset-0 bg-white flex flex-col" style={{ backgroundColor: theme.bg }}>

                                    {/* 1. HEADER BAR */}
                                    <motion.div
                                        initial={{ y: -80, opacity: 0 }}
                                        animate={{ y: currentStep >= 1 ? 0 : -80, opacity: currentStep >= 1 ? 1 : 0 }}
                                        transition={{ type: "spring", stiffness: 70, damping: 15 }}
                                        className="h-24 pt-10 px-6 flex items-end justify-between pb-4 z-20 relative"
                                        style={{ backgroundColor: templateId === 'minimal' ? '#ffffff' : theme.bg }}
                                    >
                                        <Menu className={`w-6 h-6 ${theme.text}`} strokeWidth={1.5} />
                                        <div className={`font-bold text-lg tracking-tight ${theme.font}`} style={{ color: theme.primary }}>
                                            {storeName}
                                        </div>
                                        <div className="flex gap-4">
                                            <Search className={`w-5 h-5 ${theme.text} opacity-60`} strokeWidth={2} />
                                            <ShoppingBag className={`w-5 h-5 ${theme.text}`} strokeWidth={2} />
                                        </div>
                                    </motion.div>

                                    {/* 2. HERO SECTION */}
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
                                        animate={{ scale: currentStep >= 2 ? 1 : 0.8, opacity: currentStep >= 2 ? 1 : 0, filter: "blur(0px)" }}
                                        transition={{ duration: 0.8, ease: "circOut" }}
                                        className={`relative h-56 mx-5 rounded-[2rem] overflow-hidden flex flex-col justify-end p-6 shadow-lg`}
                                    >
                                        <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient}`} />
                                        {/* Noise texture overlay */}
                                        <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                                        {/* Fake Hero Content */}
                                        <div className="relative z-10 w-full space-y-3">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: "60%" }}
                                                transition={{ delay: 0.5, duration: 0.8 }}
                                                className="h-2 bg-white/60 rounded-full"
                                            />
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: "80%" }}
                                                transition={{ delay: 0.6, duration: 0.8 }}
                                                className="h-6 bg-white rounded-lg shadow-sm w-3/4"
                                            />
                                            <motion.div
                                                initial={{ width: 0, opacity: 0 }}
                                                animate={{ width: "auto", opacity: 1 }}
                                                transition={{ delay: 0.8 }}
                                                className={`mt-2 inline-flex h-8 px-4 items-center bg-black/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider ${theme.buttonStyle}`}
                                            >
                                                Découvrir
                                            </motion.div>
                                        </div>
                                    </motion.div>

                                    {/* 3. PRODUCT GRID */}
                                    <div className="flex-1 p-5 grid grid-cols-2 gap-4 overflow-hidden">
                                        {[1, 2, 3, 4].map((i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ y: 50, opacity: 0 }}
                                                animate={{ y: currentStep >= 3 ? 0 : 50, opacity: currentStep >= 3 ? 1 : 0 }}
                                                transition={{ delay: 0.2 + (i * 0.1), type: "spring", stiffness: 100, damping: 15 }}
                                                className={`flex flex-col gap-3 group`}
                                            >
                                                {/* Image Placeholder */}
                                                <div className={`w-full aspect-[4/5] ${theme.productRadius} bg-gray-100 relative overflow-hidden shadow-sm`} style={{ backgroundColor: templateId === 'street' ? '#18181b' : templateId === 'luxe' ? '#292524' : '#f1f5f9' }}>
                                                    <div className={`absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center ${templateId === 'minimal' ? 'bg-white shadow-sm' : 'bg-white/10'}`}>
                                                        <div className={`w-3 h-3 ${templateId === 'minimal' ? 'bg-slate-200' : 'bg-white/50'} rounded-full`} />
                                                    </div>
                                                </div>

                                                {/* Product Info */}
                                                <div className="px-1 space-y-2">
                                                    <div className={`h-3 w-full rounded-sm ${templateId === 'luxe' ? 'bg-white/10' : 'bg-slate-200'}`} />
                                                    <div className="flex justify-between items-center">
                                                        <div className={`h-3 w-12 rounded-sm ${templateId === 'luxe' ? 'bg-white/30' : 'bg-slate-300'}`} />
                                                        <div
                                                            className={`h-5 w-12 flex items-center justify-center rounded text-[8px] font-bold text-white uppercase tracking-wider`}
                                                            style={{ backgroundColor: theme.primary }}
                                                        >
                                                            ADD
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Bottom Nav Simulation */}
                                    <motion.div
                                        initial={{ y: 100 }}
                                        animate={{ y: currentStep >= 1 ? 0 : 100 }}
                                        className="h-16 border-t flex items-center justify-around px-6 relative z-20"
                                        style={{
                                            backgroundColor: theme.bg,
                                            borderColor: templateId === 'street' ? '#27272a' : templateId === 'luxe' ? '#44403c' : '#e2e8f0'
                                        }}
                                    >
                                        <div className="w-12 h-1 rounded-full bg-current opacity-20" />
                                    </motion.div>

                                </div>
                            </motion.div>
                        </div>

                        {/* Progress Status Bar - Refined */}
                        <div className="absolute bottom-12 w-full max-w-[280px] flex flex-col gap-2">
                            <div className="flex justify-between text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest">
                                <span>{STEPS[currentStep]?.label}</span>
                                <span>{Math.min(100, Math.round(((currentStep + 1) / STEPS.length) * 100))}%</span>
                            </div>
                            <div className="h-[2px] w-full bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-white shadow-[0_0_15px_white]"
                                    initial={{ width: "0%" }}
                                    animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                        </div>

                    </motion.div>
                ) : (
                    <motion.div
                        key="success"
                        className="relative z-[70] flex flex-col items-center justify-center text-center max-w-4xl p-8"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {/* 👑 MAJESTIC REVEAL - Refined */}
                        <motion.div
                            variants={successVariants}
                            className="relative w-32 h-32 mb-10 flex items-center justify-center"
                        >
                            <div className="absolute inset-0 rounded-full animate-ping opacity-25 duration-1000" style={{ backgroundColor: theme.primary }} />
                            <div className="absolute inset-0 rounded-full opacity-50 blur-xl" style={{ backgroundColor: theme.primary }} />

                            <div
                                className="w-24 h-24 rounded-[2rem] flex items-center justify-center shadow-2xl relative z-10 border border-white/20"
                                style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` }}
                            >
                                <Crown className="w-12 h-12 text-white drop-shadow-md" strokeWidth={1.5} />
                            </div>
                        </motion.div>

                        <motion.h1
                            variants={successVariants}
                            className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter drop-shadow-2xl"
                        >
                            {storeName}
                        </motion.h1>

                        <motion.div
                            variants={successVariants}
                            className="flex items-center gap-6 text-white/70 text-sm md:text-lg mb-14 font-light border border-white/10 px-8 py-3 rounded-full bg-white/5 backdrop-blur-md"
                        >
                            <span className="flex items-center gap-3">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: theme.primary }}></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3" style={{ backgroundColor: theme.primary }}></span>
                                </span>
                                Thème {theme.name}
                            </span>
                            <span className="w-px h-4 bg-white/20" />
                            <span className="uppercase tracking-widest text-xs font-bold opacity-80">{category}</span>
                        </motion.div>

                        <motion.button
                            onClick={handleStartTransition}
                            variants={successVariants}
                            whileHover={{ scale: 1.05, boxShadow: `0 0 50px ${theme.primary}50` }}
                            whileTap={{ scale: 0.95 }}
                            className="group relative px-12 py-5 bg-white text-black font-bold text-sm tracking-[0.2em] uppercase rounded-full flex items-center gap-4 hover:bg-white transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                        >
                            <Zap className="w-4 h-4 mr-2" fill="currentColor" />
                            Ouvrir le Dashboard
                        </motion.button>

                        <motion.p
                            variants={successVariants}
                            className="mt-8 text-white/20 text-xs font-mono tracking-widest uppercase"
                        >
                            Architecture V2.1 Ready
                        </motion.p>

                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
