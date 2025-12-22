"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Check, CreditCard, Zap, X, Shield, Users, Clock } from "lucide-react";

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    templateName: string;
    price: number;
}

export function UpgradeModal({ isOpen, onClose, templateName, price }: UpgradeModalProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

    // Countdown timer for urgency
    useEffect(() => {
        if (!isOpen) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isOpen]);

    const handleUpgrade = async () => {
        setIsProcessing(true);
        setTimeout(() => {
            router.push("/dashboard/billing");
        }, 1000);
    };

    const freeVsPro = [
        { feature: "Thèmes Premium", free: false, pro: true },
        { feature: "Logo personnalisé", free: true, pro: true },
        { feature: "Sans pub ElenaShop", free: false, pro: true },
        { feature: "Support prioritaire", free: false, pro: true },
        { feature: "Analytics avancés", free: false, pro: true },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-0 rounded-[2.5rem] shadow-2xl shadow-zinc-900/40">
                {/* Animated gradient header */}
                <div className="bg-zinc-900 px-8 py-8 text-center relative overflow-hidden group">
                    {/* Shine animation overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/50 to-black/50" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors z-10 p-2 hover:bg-white/10 rounded-full"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    {/* Crown with pulse */}
                    <div className="relative inline-flex items-center justify-center h-20 w-20 bg-gradient-to-br from-amber-200 to-yellow-500 rounded-3xl mb-6 shadow-xl shadow-amber-900/20 transform group-hover:scale-105 transition-transform duration-500">
                        <Crown className="h-10 w-10 text-zinc-900 drop-shadow-sm" />
                        <div className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-white rounded-full flex items-center justify-center shadow-lg">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
                        </div>
                    </div>

                    <DialogHeader className="space-y-2 relative z-10">
                        <DialogTitle className="text-3xl font-serif font-bold italic text-white tracking-wide">
                            L'Expérience Premium
                        </DialogTitle>
                        <DialogDescription className="text-zinc-400 text-base font-medium">
                            Débloquez <span className="text-white font-bold border-b border-amber-500/50 pb-0.5">{templateName}</span> et boostez votre image
                        </DialogDescription>
                    </DialogHeader>

                    {/* Urgency countdown */}
                    <div className="mt-6 inline-flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-5 py-2.5">
                        <Clock className="h-4 w-4 text-amber-400" />
                        <span className="text-white font-mono font-bold tracking-widest text-lg">
                            {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                        </span>
                        <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">restant</span>
                    </div>
                </div>

                {/* Content */}
                <div className="px-8 py-8 space-y-6 bg-white">
                    {/* Social proof banner */}
                    <div className="flex items-center justify-center gap-3 text-sm text-zinc-600 bg-zinc-50 rounded-2xl py-3 px-4 border border-zinc-100">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="h-6 w-6 rounded-full bg-zinc-200 border-2 border-white" />
                            ))}
                        </div>
                        <span className="font-medium"><span className="font-bold text-zinc-900">+500</span> boutiques Elite</span>
                    </div>

                    {/* Comparison table */}
                    <div className="border border-zinc-100 rounded-2xl overflow-hidden shadow-sm">
                        <div className="grid grid-cols-3 text-[10px] font-bold uppercase tracking-widest bg-zinc-50/50">
                            <div className="px-4 py-3 text-zinc-400">Fonctionnalité</div>
                            <div className="px-4 py-3 text-center text-zinc-400">Gratuit</div>
                            <div className="px-4 py-3 text-center text-zinc-900 bg-amber-50/30">Premium ⭐</div>
                        </div>
                        {freeVsPro.map((row, i) => (
                            <div key={i} className="grid grid-cols-3 text-xs border-t border-zinc-100 items-center">
                                <div className="px-4 py-3 text-zinc-600 font-medium">{row.feature}</div>
                                <div className="px-4 py-3 text-center">
                                    {row.free ? <Check className="h-4 w-4 text-zinc-400 mx-auto" /> : <div className="h-1 w-1 bg-zinc-200 rounded-full mx-auto" />}
                                </div>
                                <div className="px-4 py-3 text-center bg-amber-50/10 h-full flex items-center justify-center">
                                    <Check className="h-4 w-4 text-amber-600 font-bold mx-auto" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pricing with savings */}
                    <div className="relative bg-zinc-900 rounded-3xl p-6 text-center text-white overflow-hidden shadow-xl shadow-zinc-200">
                        <div className="absolute top-0 right-0 bg-white text-zinc-900 text-[10px] font-black px-4 py-1.5 rounded-bl-2xl">
                            -40% LIMITED
                        </div>
                        <p className="text-zinc-500 text-sm line-through font-medium mb-1">99 TND/mois</p>
                        <div className="flex items-baseline justify-center gap-1 mb-2">
                            <span className="text-5xl font-serif italic font-bold text-white">{price}</span>
                            <span className="text-xl font-bold text-zinc-400">TND</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-amber-500 uppercase tracking-widest bg-amber-500/10 rounded-full py-1.5 px-3 w-fit mx-auto">
                            <Shield className="h-3 w-3" />
                            Garantie 14 jours
                        </div>
                    </div>

                    {/* CTA Button with shine */}
                    <Button
                        onClick={handleUpgrade}
                        disabled={isProcessing}
                        className="relative w-full h-14 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 hover:from-yellow-500 hover:via-amber-600 hover:to-orange-600 text-slate-900 font-black text-lg shadow-xl shadow-amber-500/30 overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        {isProcessing ? (
                            <div className="flex items-center gap-2">
                                <div className="h-5 w-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                                Redirection...
                            </div>
                        ) : (
                            <>
                                <Zap className="h-5 w-5 mr-2 animate-pulse" />
                                Débloquer Pro Maintenant
                            </>
                        )}
                    </Button>

                    {/* Trust elements */}
                    <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1">
                            <CreditCard className="h-3 w-3" />
                            Paiement sécurisé
                        </span>
                        <span>•</span>
                        <span>Annulez quand vous voulez</span>
                    </div>

                    {/* Secondary action - less visible */}
                    <button
                        onClick={onClose}
                        className="w-full text-xs text-slate-400 hover:text-slate-500 transition-colors py-1"
                    >
                        Non merci, rester en gratuit
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
