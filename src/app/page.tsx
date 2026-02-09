"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedCounter } from "@/components/landing/animated-counter";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Store,
  Zap,
  MessageCircle,
  MapPin,
  ArrowRight,
  Check,
  Smartphone,
  Truck,
  Shield,
  Star,
  CreditCard,
  Sparkles,
  TrendingUp,
  Globe,
  Bell,
  Instagram,
  Facebook,
  Linkedin,
  ShieldCheck,
  Rocket
} from "lucide-react";

// Lazy-load FAQ section (heavy, below fold)
const FAQSection = dynamic(() => import("@/components/landing/faq-section").then(mod => ({ default: mod.FAQSection })), {
  loading: () => <div className="h-96 animate-pulse bg-slate-50 rounded-3xl" />,
});

// Simple CSS-based section wrapper (replaces heavy framer-motion scroll observers)
const ParallaxSection = ({ children, className, id }: { children: React.ReactNode, className?: string, id?: string }) => {
  return (
    <section id={id} className={`relative z-10 ${className}`}>
      {children}
    </section>
  );
};

export default function Home() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Scroll to top on page load/refresh
  if (typeof window !== "undefined") {
    window.history.scrollRestoration = "manual";
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Global Fixed Grid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-slate-100 opacity-[0.4]"></div>
      </div>
      {/* Navigation - Glassmorphism */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-xl border-b border-indigo-50/50 supports-[backdrop-filter]:bg-white/40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2.5"
            >
              {/* User Logo */}
              <div className="relative group cursor-pointer">
                <div className="absolute -inset-2 bg-indigo-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
                <img src="/elena_logo.png" alt="ElenaShop" className="h-20 w-auto relative z-10" />
              </div>
            </motion.div>
            <div className="flex items-center gap-6">
              <Link href="/login">
                <span className="text-slate-600 font-medium hover:text-indigo-600 transition-colors relative group text-sm cursor-pointer">
                  Se connecter
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                </span>
              </Link>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/login?mode=signup">
                  <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-6 py-6 font-semibold shadow-xl shadow-indigo-500/20 transition-all relative overflow-hidden group">
                    <span className="relative z-10 flex items-center gap-2">
                      Commencer
                      <Sparkles className="h-4 w-4 text-indigo-400" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Alive & Dynamic */}
      <section className="pt-32 pb-40 px-4 sm:px-6 lg:px-8 relative overflow-hidden snap-start">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
            className="absolute -top-[20%] -right-[10%] w-[60rem] h-[60rem] bg-gradient-to-br from-indigo-200/20 to-purple-200/20 rounded-full blur-3xl mix-blend-multiply"
          />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              x: [0, 50, 0],
              opacity: [0.3, 0.4, 0.3]
            }}
            transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
            className="absolute top-[20%] -left-[10%] w-[50rem] h-[50rem] bg-gradient-to-tr from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left - Content */}
            <motion.div
              style={{ y: heroY, opacity: heroOpacity }}
              className="text-center lg:text-left flex flex-col items-center lg:items-start z-10"
            >
              {/* Animated Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full border border-indigo-100 shadow-sm mb-8 hover:border-indigo-200 transition-colors cursor-default group"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500 group-hover:bg-indigo-600 transition-colors"></span>
                </span>
                <span className="text-sm font-semibold text-slate-600">
                  Nouveau : <span className="text-indigo-600 font-bold">Paiement Carte Bancaire 💳</span>
                </span>
              </motion.div>

              {/* Staggered Title Animation */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] sm:leading-[1.05] mb-8 tracking-tight perspective-lg">
                <motion.span
                  initial={{ opacity: 0, y: 50, rotateX: 20 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="block"
                >
                  Votre boutique
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 50, rotateX: 20 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                  className="block relative"
                >
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 animate-gradient-x bg-[length:200%_auto]">
                    en ligne
                  </span>
                  <motion.svg
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                    className="absolute w-full h-3 -bottom-1 left-0 text-indigo-200 -z-10"
                    viewBox="0 0 100 10"
                    preserveAspectRatio="none"
                  >
                    <path d="M0 5 Q 50 10 100 5 L 100 10 L 0 10 Z" fill="currentColor" />
                  </motion.svg>
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 50, rotateX: 20 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                  className="block"
                >
                  en 2 min.
                </motion.span>
              </h1>

              {/* Paragraph */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-xl sm:text-2xl text-slate-600 mb-10 max-w-xl leading-relaxed font-medium"
              >
                Lancez votre marque <span className="text-slate-900 font-semibold">gratuitement</span>.
                Paiement à la livraison, carte bancaire, et tout l'écosystème pour réussir en Tunisie.
              </motion.p>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.4 }}
                className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto"
              >
                <Link href="/login?mode=signup" className="w-full sm:w-auto">
                  <Button size="lg" className="group w-full sm:w-auto h-14 sm:h-16 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-2xl px-6 sm:px-10 text-base sm:text-lg font-bold shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-1 transition-all duration-300 ring-4 ring-indigo-500/10">
                    Lancer ma boutique
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="#how-it-works" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 sm:h-16 rounded-2xl px-6 sm:px-10 text-base sm:text-lg border-2 border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/50 hover:text-indigo-700 transition-all font-semibold bg-white/50 backdrop-blur-sm">
                    Voir la démo
                  </Button>
                </Link>
              </motion.div>

              {/* Infinite Social Proof Marquee - Platforms */}
              <div className="mt-12 w-full max-w-[90vw] sm:max-w-md mx-auto lg:mx-0 overflow-hidden">
                <p className="text-xs font-bold text-slate-400 mb-4 tracking-widest uppercase text-center lg:text-left">Compatible avec vos réseaux préférés</p>
                <div className="relative fade-mask-x w-full">
                  <div className="flex gap-12 animate-marquee whitespace-nowrap items-center">
                    {[
                      { name: 'Instagram', icon: <Instagram className="w-5 h-5" />, color: 'text-pink-600' },
                      { name: 'TikTok', icon: <span className="text-lg">🎵</span>, color: 'text-black' },
                      { name: 'WhatsApp', icon: <MessageCircle className="w-5 h-5" />, color: 'text-green-600' },
                      { name: 'Facebook', icon: <Facebook className="w-5 h-5" />, color: 'text-blue-600' },
                      { name: 'Snapchat', icon: <span className="text-lg">👻</span>, color: 'text-yellow-500' }
                    ].map((platform, i) => (
                      <div key={`a-${i}`} className="flex items-center gap-2 opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
                        <div className={`p-2 bg-white rounded-full shadow-sm ${platform.color}`}>
                          {platform.icon}
                        </div>
                        <span className="font-bold text-slate-700">{platform.name}</span>
                      </div>
                    ))}
                    {[
                      { name: 'Instagram', icon: <Instagram className="w-5 h-5" />, color: 'text-pink-600' },
                      { name: 'TikTok', icon: <span className="text-lg">🎵</span>, color: 'text-black' },
                      { name: 'WhatsApp', icon: <MessageCircle className="w-5 h-5" />, color: 'text-green-600' },
                      { name: 'Facebook', icon: <Facebook className="w-5 h-5" />, color: 'text-blue-600' },
                      { name: 'Snapchat', icon: <span className="text-lg">👻</span>, color: 'text-yellow-500' }
                    ].map((platform, i) => (
                      <div key={`b-${i}`} className="flex items-center gap-2 opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
                        <div className={`p-2 bg-white rounded-full shadow-sm ${platform.color}`}>
                          {platform.icon}
                        </div>
                        <span className="font-bold text-slate-700">{platform.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right - 3D Phone Mockup (Enhanced) */}
            <div className="relative flex justify-center lg:justify-end perspective-1000 group">
              {/* Glow Behind */}
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl -z-10"
              />

              <motion.div
                initial={{ rotateY: 10, rotateX: 5, y: 30, opacity: 0 }}
                animate={{ rotateY: -5, rotateX: 0, y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                whileHover={{ rotateY: 0, rotateX: 0, scale: 1.02, transition: { duration: 0.3 } }}
                className="relative preserve-3d"
              >

                {/* Floating Cards - Floating further out for clean look */}
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="hidden lg:block absolute -right-28 top-20 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl shadow-indigo-500/10 border border-white/50 z-30 w-48"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                      <MessageCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-medium whitespace-nowrap">Nouvelle commande !</p>
                      <p className="text-sm font-bold text-slate-900">+ 149.000 TND</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 20, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="hidden lg:block absolute -left-28 bottom-40 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl shadow-purple-500/10 border border-white/50 z-30 w-48"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                      <TrendingUp className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-medium whitespace-nowrap">Visiteurs en direct</p>
                      <p className="text-sm font-bold text-slate-900">42 personnes</p>
                    </div>
                  </div>
                </motion.div>

                {/* The Phone */}
                <div className="relative w-[320px] h-[640px] bg-[#0f172a] rounded-[3.5rem] p-3 shadow-[0_0_0_12px_#1e293b,0_0_0_14px_#334155,50px_50px_100px_-20px_rgba(79,70,229,0.4)]">
                  <div className="w-full h-full bg-slate-50 rounded-[3rem] overflow-hidden relative flex flex-col">

                    {/* Dynamic Island */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-8 bg-black rounded-b-3xl z-40 flex items-center justify-center">
                      <div className="w-20 h-5 bg-white/5 rounded-full blur-[2px]"></div>
                    </div>

                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto no-scrollbar relative z-10">

                      {/* App Header */}
                      <div className="pt-14 px-5 pb-4 bg-white sticky top-0 z-20 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-black flex items-center justify-center shrink-0">
                              <span className="text-white font-bold text-xs">S</span>
                            </div>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1">
                                <span className="font-bold text-sm text-slate-900 leading-none">Sneakers TN</span>
                                <div className="h-3 w-3 bg-blue-500 rounded-full flex items-center justify-center">
                                  <Check className="h-2 w-2 text-white" />
                                </div>
                              </div>
                              <span className="text-[10px] text-indigo-500 font-medium leading-tight">Powered by ElenaShop</span>
                            </div>
                          </div>
                          <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center relative border border-slate-100">
                            <Bell className="h-4 w-4 text-slate-400" />
                            <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                          </div>
                        </div>
                        <div className="h-10 bg-slate-100 rounded-xl w-full flex items-center px-4 gap-2">
                          <span className="text-slate-400">🔍</span>
                          <div className="h-2 w-24 bg-slate-200 rounded-full"></div>
                        </div>
                      </div>

                      {/* App Content */}
                      <div className="p-5 space-y-6 pb-24">
                        {/* Categories */}
                        <div className="flex gap-2 overflow-x-auto no-scrollbar">
                          {['Tout', 'Nouveautés', 'Promos'].map((cat, i) => (
                            <div key={i} className={`px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap ${i === 0 ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-100'}`}>
                              {cat}
                            </div>
                          ))}
                        </div>

                        {/* Hero Product Card */}
                        <div className="aspect-[4/5] bg-white rounded-2xl overflow-hidden relative shadow-sm border border-slate-100">
                          <div className="absolute top-3 left-3 bg-black text-white text-[10px] font-bold px-2 py-1 rounded-full z-10">
                            NOUVEAU
                          </div>
                          <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                            <div className="relative w-32 h-32">
                              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full blur-xl opacity-20"></div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-6xl">👟</span>
                              </div>
                            </div>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-sm">
                            <h4 className="font-bold text-slate-900 text-sm mb-1">Urban Runner X</h4>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-green-100 text-green-700">LIVRAISON GRATUITE</span>
                              <span className="flex items-center text-[8px] text-amber-500 font-bold"><Star className="h-2 w-2 fill-current mr-0.5" /> 4.9</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-indigo-600 font-bold text-sm">149.000 DT</span>
                              <div className="h-6 w-6 bg-black rounded-full flex items-center justify-center text-white text-xs">+</div>
                            </div>
                          </div>
                        </div>

                        {/* Best Sellers */}
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <h5 className="font-bold text-slate-900 text-xs">Best Sellers 🔥</h5>
                            <span className="text-[10px] text-indigo-600 font-bold">Voir tout</span>
                          </div>
                          <div className="flex gap-3 overflow-x-auto no-scrollbar">
                            {[1, 2].map(i => (
                              <div key={i} className="w-28 shrink-0 bg-white rounded-xl border border-slate-100 p-2 flex flex-col gap-2">
                                <div className="aspect-square bg-slate-50 rounded-lg flex items-center justify-center text-2xl">
                                  {i === 1 ? '🧢' : '🎒'}
                                </div>
                                <div>
                                  <p className="font-bold text-[10px] text-slate-900 leading-tight mb-0.5">{i === 1 ? 'Casquette NY' : 'Sac Urban'}</p>
                                  <p className="font-bold text-[10px] text-indigo-600">49.000 DT</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Nav - Fixed */}
                    <div className="h-16 bg-white/90 backdrop-blur border-t border-slate-100 flex items-center justify-around px-2 absolute bottom-0 left-0 right-0 z-30">
                      <div className="w-12 h-full flex flex-col items-center justify-center gap-1 text-indigo-600">
                        <Store className="h-5 w-5" />
                        <div className="h-1 w-1 bg-current rounded-full"></div>
                      </div>
                      <div className="w-12 h-full flex flex-col items-center justify-center gap-1 text-slate-300">
                        <Globe className="h-5 w-5" />
                      </div>
                      <div className="w-12 h-full flex flex-col items-center justify-center gap-1 text-slate-300">
                        <div className="h-5 w-5 bg-slate-200 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges - Clean Minimal Strip */}
      <section className="py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto px-4"
        >
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <div className="flex items-center gap-2 text-slate-500">
              <Truck className="h-5 w-5 text-indigo-500" />
              <span className="text-sm font-semibold">Livraison Tunisie</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <CreditCard className="h-5 w-5 text-indigo-500" />
              <span className="text-sm font-semibold">Paiement Sécurisé</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <Shield className="h-5 w-5 text-indigo-500" />
              <span className="text-sm font-semibold">100% Gratuit</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <Zap className="h-5 w-5 text-indigo-500" />
              <span className="text-sm font-semibold">Lancement Rapide</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section - Deep Indigo Style */}
      <ParallaxSection className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden snap-start bg-white">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-100 to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Pourquoi choisir ElenaShop ?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Tout ce dont vous avez besoin pour vendre en ligne, sans la complexité technique.
            </p>
          </motion.div>

          {/* Features Bento Grid */}
          <div className="grid md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
            {/* Feature 1: Ultra Rapide (Large) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className="md:col-span-2 bg-gradient-to-br from-white to-indigo-50/50 rounded-[2rem] p-8 border border-white/50 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all group overflow-hidden relative"
            >
              {/* Background Tech Pulse */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse-slow"></div>

              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="h-14 w-14 rounded-2xl bg-indigo-600 flex items-center justify-center mb-6 shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform duration-300">
                      <Zap className="h-7 w-7 text-white fill-indigo-100" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">Performance Extrême</h3>
                    <p className="text-slate-500 leading-relaxed max-w-md">Optimisé spécialement pour les réseaux bas débit (3G/4G). Vos clients n'attendent pas.</p>
                  </div>

                  {/* Speedometer Animation */}
                  <div className="hidden sm:block relative w-32 h-32">
                    <svg viewBox="0 0 100 60" className="w-full h-full overflow-visible">
                      {/* Gauge BG */}
                      <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#e2e8f0" strokeWidth="8" strokeLinecap="round" />
                      {/* Gauge Value */}
                      <motion.path
                        d="M 10 50 A 40 40 0 0 1 90 50"
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="8"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                      {/* Needle Group - Rotating from Center */}
                      <motion.g
                        initial={{ rotate: -90 }}
                        whileInView={{ rotate: 90 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        style={{ translateX: 50, translateY: 50 }}
                      >
                        {/* The needle itself, drawn from (0,0) upwards */}
                        <line x1="0" y1="0" x2="0" y2="-35" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
                        <circle cx="0" cy="0" r="4" fill="#334155" />
                      </motion.g>
                      <text x="50" y="75" textAnchor="middle" className="text-[12px] font-bold fill-indigo-600">100/100</text>
                    </svg>
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-4 text-sm font-semibold text-indigo-700 bg-indigo-50/80 p-3 rounded-xl w-fit backdrop-blur-sm border border-indigo-100">
                  <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div> Accessible 24h/24</span>
                  <div className="h-4 w-px bg-indigo-200"></div>
                  <span className="flex items-center gap-1.5"><Rocket className="h-3.5 w-3.5" /> Chargement Instantané</span>
                </div>
              </div>
            </motion.div>

            {/* Feature 2: WhatsApp (Vertical - Restored) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className="md:row-span-2 bg-[#25D366]/5 rounded-[2rem] p-8 border border-[#25D366]/10 shadow-sm hover:shadow-xl hover:shadow-[#25D366]/10 transition-all group relative overflow-hidden flex flex-col"
            >
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#25D366]/10 rounded-full blur-2xl translate-y-1/3 translate-x-1/3"></div>

              <div className="h-full flex flex-col">
                <div className="h-14 w-14 rounded-2xl bg-[#25D366]/20 flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
                  <MessageCircle className="h-7 w-7 text-[#25D366]" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">WhatsApp First</h3>
                <p className="text-slate-600 leading-relaxed mb-8 flex-1">
                  Ne changez pas vos habitudes. Recevez chaque commande comme un message WhatsApp pré-rempli.
                </p>

                {/* Animated Chat UI */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-xs space-y-3 transform group-hover:translate-y-[-5px] transition-transform relative z-10">
                  {/* Message 1 (Customer) */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="flex gap-2"
                  >
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-indigo-500">C</div>
                    <div className="bg-indigo-50 p-3 rounded-r-2xl rounded-bl-2xl text-slate-700 max-w-[80%]">
                      Sahby, commande #123 confirmée ?
                    </div>
                  </motion.div>

                  {/* Message 2 (Store) */}
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="flex gap-2 justify-end"
                  >
                    <div className="bg-[#dcf8c6] p-3 rounded-l-2xl rounded-br-2xl text-slate-900 shadow-sm max-w-[80%] font-medium">
                      Oui ! Livraison demain 🚚
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Feature 3: Tunisian Market (Config Toggles) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-rose-500/5 transition-all group relative overflow-hidden"
            >
              {/* Background Shapes */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

              <div className="h-14 w-14 rounded-2xl bg-rose-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative z-10">
                <MapPin className="h-7 w-7 text-rose-600" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-slate-900">100% Tunisien</h3>
                  <span className="bg-rose-100 text-rose-600 text-[10px] font-bold px-2 py-0.5 rounded-full">TN</span>
                </div>
                <p className="text-slate-500 text-sm mb-6">Tout est pré-configuré pour la Tunisie. Activez votre boutique en 1 clic.</p>

                {/* Config Toggles Animation (SaaS Style) */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                  {/* Toggle 1: Currency */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600">Devise (TND)</span>
                    <motion.div
                      className="w-8 h-4 bg-slate-200 rounded-full relative"
                      whileInView={{ backgroundColor: "#10b981" }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                    >
                      <motion.div className="absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow-sm" whileInView={{ x: 16 }} viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.3 }} />
                    </motion.div>
                  </div>
                  {/* Toggle 2: Governorates */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600">24 Gouvernorats</span>
                    <motion.div
                      className="w-8 h-4 bg-slate-200 rounded-full relative"
                      whileInView={{ backgroundColor: "#10b981" }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                    >
                      <motion.div className="absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow-sm" whileInView={{ x: 16 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.3 }} />
                    </motion.div>
                  </div>
                  {/* Toggle 3: Instant Site */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600">Site Instantané</span>
                    <motion.div
                      className="w-8 h-4 bg-slate-200 rounded-full relative"
                      whileInView={{ backgroundColor: "#10b981" }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                    >
                      <motion.div className="absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow-sm" whileInView={{ x: 16 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.3 }} />
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Feature 4: Dashboard (Live Analytics) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className="md:col-span-1 bg-slate-900 rounded-[2rem] p-8 shadow-xl shadow-indigo-900/10 group relative overflow-hidden flex flex-col justify-between h-full min-h-[400px]"
            >
              {/* Content Container (Z-Index High) */}
              <div className="relative z-20 flex flex-col gap-6">
                {/* Header: Icon + Live Badge */}
                <div className="flex justify-between items-start">
                  <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <TrendingUp className="h-6 w-6 text-indigo-400" />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">Live</span>
                  </div>
                </div>

                {/* Text Section */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Statistiques</h3>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-[90%]">
                    Suivez vos ventes et votre croissance en temps réel.
                  </p>
                </div>

                {/* Metric Section (Moved Up) */}
                <div>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Revenus (Ce mois)</p>
                  <h3 className="text-4xl font-bold text-white tracking-tight flex items-baseline gap-2">
                    7,240<span className="text-2xl text-white/90">.00</span> <span className="text-sm font-medium text-white/90">TND</span>
                  </h3>
                </div>
              </div>

              {/* Chart Container (positioned absolutely at bottom) */}
              <div className="absolute bottom-0 left-0 right-0 h-40 w-full z-10 translate-y-2 opacity-80">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10"></div>

                <svg viewBox="0 0 400 150" className="w-full h-full overflow-visible preserve-3d">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Area Fill */}
                  <motion.path
                    d="M0 150 C 50 150, 50 100, 100 110 C 150 120, 150 60, 200 70 C 250 80, 250 40, 300 50 C 350 60, 350 10, 400 20 V 200 H 0 Z"
                    fill="url(#chartGradient)"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                  />

                  {/* Line Path */}
                  <motion.path
                    d="M0 150 C 50 150, 50 100, 100 110 C 150 120, 150 60, 200 70 C 250 80, 250 40, 300 50 C 350 60, 350 10, 400 20"
                    fill="none"
                    stroke="#818cf8"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />

                  {/* Interactive Points */}
                  {[
                    { cx: 100, cy: 110, delay: 0.2, val: "+120" },
                    { cx: 300, cy: 50, delay: 0.4, val: "+890" },
                  ].map((point, i) => (
                    <g key={i}>
                      <motion.circle
                        cx={point.cx} cy={point.cy} r="4" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.2, delay: point.delay }}
                      />
                      {/* Floating Tooltips */}
                      <motion.foreignObject x={point.cx - 20} y={point.cy - 30} width="40" height="24"
                        initial={{ opacity: 0, y: 5 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.2, delay: point.delay + 0.05 }}
                      >
                        <div className="bg-indigo-500/90 backdrop-blur-[2px] text-[10px] font-bold text-white px-1.5 py-0.5 rounded text-center shadow-lg transform -translate-x-1">
                          {point.val}
                        </div>
                      </motion.foreignObject>
                    </g>
                  ))}
                </svg>
              </div>
            </motion.div>
          </div>

          {/* Payment Methods Banner - Tech Style */}
          <div className="mt-20 relative overflow-hidden rounded-3xl bg-[#0f172a]">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-left max-w-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-indigo-400" />
                  </div>
                  <span className="text-indigo-400 font-bold uppercase tracking-wider text-xs">Paiement Sécurisé</span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">
                  Acceptez la <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Carte Bancaire</span> et le Cash.
                </h3>
                <p className="text-slate-400 text-lg">
                  Offrez le choix à vos clients. Konnect ou Flouci pour le paiement en ligne, et bien sûr le paiement à la livraison.
                </p>
              </div>
              <div className="flex flex-col gap-3 min-w-[200px]">
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3 px-4 backdrop-blur-sm">
                  <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                  <span className="text-white font-medium">Cash on Delivery</span>
                </div>
                <div className="flex items-center gap-3 bg-indigo-600/20 border border-indigo-500/30 rounded-xl p-3 px-4 backdrop-blur-sm shadow-[0_0_30px_rgba(79,70,229,0.15)]">
                  <div className="h-2 w-2 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.5)]"></div>
                  <span className="text-white font-medium">Carte Bancaire</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ParallaxSection>

      {/* How It Works - Clean Flow */}
      <ParallaxSection className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden snap-start bg-white">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
              Lancez votre empire <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">en 3 étapes simples</span>
            </h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Pas de code. Pas de stress. Juste vous et votre business.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-indigo-100 via-indigo-200 to-indigo-100 -z-10"></div>

            {[
              {
                step: "01",
                icon: <Smartphone className="h-6 w-6" />,
                title: "Création Instantanée",
                description: "Inscrivez-vous en 30 secondes. Aucune carte bancaire requise pour démarrer.",
                bg: "bg-blue-50",
                text: "text-blue-600"
              },
              {
                step: "02",
                icon: <Store className="h-6 w-6" />,
                title: "Personnalisation",
                description: "Ajoutez vos produits, votre logo et vos couleurs. Votre boutique, votre style.",
                bg: "bg-indigo-50",
                text: "text-indigo-600"
              },
              {
                step: "03",
                icon: <Truck className="h-6 w-6" />,
                title: "Vente & Profit",
                description: "Partagez votre lien. Recevez les commandes sur WhatsApp. Encaissez.",
                bg: "bg-violet-50",
                text: "text-violet-600"
              },
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 hover:-translate-y-2 h-full flex flex-col items-center text-center">

                  {/* Icon Bubble */}
                  <div className={`h-20 w-20 rounded-2xl ${item.bg} flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform duration-500 relative z-10`}>
                    <div className={`h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-lg ${item.text}`}>
                      {item.icon}
                    </div>
                  </div>

                  <span className={`text-8xl font-black ${item.text} absolute -top-12 right-6 z-0 select-none opacity-30 font-serif transform rotate-6`}>
                    {item.step}
                  </span>

                  <h3 className="text-xl font-bold text-slate-900 mb-4 relative z-10">{item.title}</h3>
                  <p className="text-slate-500 leading-relaxed relative z-10">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ParallaxSection>

      {/* Testimonials - Light Premium (Apple Style) */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-slate-50 relative snap-start">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
              Adoré par les créateurs
            </h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              Rejoignez la communauté des entrepreneurs qui changent la donne en Tunisie.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarra M.",
                role: "Fondatrice, Mode & Style",
                text: "Avant je galérais avec les DMs Instagram. Maintenant, tout est automatisé. J'ai triplé mon chiffre d'affaires en 2 mois.",
                emoji: "https://ui-avatars.com/api/?name=Sarra+M&background=6366f1&color=fff&bold=true&size=128",
                stats: "+300% de ventes"
              },
              {
                name: "Ahmed K.",
                role: "Tech Store TN",
                text: "Le game changer pour moi c'est le paiement par carte. Mes clients achètent plus, et plus vite. Le support est incroyable.",
                emoji: "https://ui-avatars.com/api/?name=Ahmed+K&background=8b5cf6&color=fff&bold=true&size=128",
                stats: "Top Vendeur"
              },
              {
                name: "Ines B.",
                role: "Cosmétiques Bio",
                text: "J'avais peur de la technique, mais l'app est tellement simple. C'est beau, c'est rapide, et mes clientes adorent.",
                emoji: "https://ui-avatars.com/api/?name=Ines+B&background=ec4899&color=fff&bold=true&size=128",
                stats: "4.9/5 Avis"
              },
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -8 }}
                className="bg-white rounded-[2rem] p-10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100 relative group overflow-hidden"
              >
                {/* Decorative Gradient Blob */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-bl-[4rem] -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700"></div>

                <div className="flex items-center gap-4 mb-8 relative z-10">
                  <div className="h-14 w-14 rounded-full p-1 bg-white shadow-sm ring-1 ring-slate-100">
                    <img src={testimonial.emoji} alt={testimonial.name} className="h-full w-full rounded-full" loading="lazy" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg leading-tight">{testimonial.name}</h4>
                    <p className="text-slate-500 text-sm font-medium">{testimonial.role}</p>
                  </div>
                </div>

                <div className="mb-8 relative z-10">
                  <div className="flex gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    &quot;{testimonial.text}&quot;
                  </p>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-50 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">Vérifié</span>
                  </div>
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                    {testimonial.stats}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Teaser - Dark Card on Light Background */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden snap-start bg-[#0f172a]">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#020617] rounded-[3rem] p-12 sm:p-24 relative overflow-hidden text-center shadow-2xl shadow-indigo-900/20 isolate">
            {/* Inner Glow Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-[80px] -z-10 pointer-events-none"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light -z-10"></div>

            <div className="max-w-3xl mx-auto relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-indigo-300 text-sm font-semibold mb-8 backdrop-blur-md">
                <Sparkles className="h-4 w-4" />
                <span>Offre de lancement</span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-8 tracking-tight leading-tight">
                Commencez <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">gratuitement</span>.<br />
                Sans engagement.
              </h2>
              <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                Créez votre boutique en quelques minutes. Aucune carte bancaire requise pour démarrer.
                Upgradez uniquement quand votre business décolle.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link href="/login?mode=signup" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto h-16 bg-white hover:bg-indigo-50 text-indigo-950 rounded-full px-10 text-lg font-bold shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.4)] transition-all hover:-translate-y-1 hover:scale-105">
                    Créer ma boutique
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Simple. Rapide. Efficace.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section should interact with the theme */}
      <section className="snap-start bg-white">
        <FAQSection />
      </section>

      {/* Footer - Floating Purity Premium */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <footer className="max-w-[85rem] mx-auto bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-12 lg:p-16 relative overflow-hidden snap-start">
          <div className="grid md:grid-cols-12 gap-12 lg:gap-8">

            {/* Brand - Span 4 */}
            <div className="md:col-span-4 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-900/10">
                    <Store className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-bold text-xl text-slate-900 tracking-tight">ElenaShop</span>
                </div>
                <p className="text-slate-500 text-base leading-relaxed font-medium max-w-xs">
                  La plateforme e-commerce tout-en-un pour les créateurs tunisiens.
                </p>
              </div>

              <div className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-400 mt-8">
                <span>© 2025 ElenaShop Inc.</span>
              </div>
            </div>

            {/* Navigation - Span 8 */}
            <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div>
                <h4 className="font-semibold text-slate-900 mb-6 text-sm">Produit</h4>
                <ul className="space-y-4 text-sm font-medium text-slate-500">
                  <li><Link href="#features" className="hover:text-indigo-600 transition-colors">Fonctionnalités</Link></li>
                  <li><Link href="/pricing" className="hover:text-indigo-600 transition-colors">Tarifs</Link></li>
                  <li><Link href="/showcase" className="hover:text-indigo-600 transition-colors">Exemples</Link></li>
                  <li><Link href="/changelog" className="hover:text-indigo-600 transition-colors">Nouveautés</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-6 text-sm">Ressources</h4>
                <ul className="space-y-4 text-sm font-medium text-slate-500">
                  <li><Link href="/help" className="hover:text-indigo-600 transition-colors">Centre d&apos;aide</Link></li>
                  <li><Link href="/blog" className="hover:text-indigo-600 transition-colors">Blog</Link></li>
                  <li><Link href="/community" className="hover:text-indigo-600 transition-colors">Communauté</Link></li>
                  <li><Link href="/status" className="hover:text-indigo-600 transition-colors flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Status
                  </Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-6 text-sm">Nous suivre</h4>
                <div className="flex gap-4 mb-6">
                  <a href="#" aria-label="Suivez-nous sur Instagram" className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all">
                    <Instagram className="h-4 w-4" />
                  </a>
                  <a href="#" aria-label="Suivez-nous sur Facebook" className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all">
                    <Facebook className="h-4 w-4" />
                  </a>
                  <a href="#" aria-label="Suivez-nous sur LinkedIn" className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all">
                    <Linkedin className="h-4 w-4" />
                  </a>
                </div>
                <div className="space-y-2 text-xs font-medium text-slate-400">
                  <p><Link href="/legal/privacy" className="hover:text-slate-600">Confidentialité</Link></p>
                  <p><Link href="/legal/terms" className="hover:text-slate-600">Conditions Générales</Link></p>
                </div>
              </div>
            </div>

            <div className="md:hidden col-span-full pt-8 border-t border-slate-100 flex flex-col items-center gap-4">
              <p className="text-sm font-medium text-slate-400">© 2025 ElenaShop Inc.</p>
            </div>
          </div>
        </footer>
      </section>
    </div>
  );
}
