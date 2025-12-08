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
            <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-0">
                {/* Animated gradient header */}
                <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 px-6 py-6 text-center relative overflow-hidden">
                    {/* Shine animation overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />

                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors z-10"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    {/* Crown with pulse */}
                    <div className="relative inline-flex items-center justify-center h-16 w-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-3">
                        <Crown className="h-8 w-8 text-yellow-300 animate-pulse" />
                        <div className="absolute -top-1 -right-1 h-4 w-4 bg-yellow-400 rounded-full animate-ping" />
                    </div>

                    <DialogHeader className="space-y-1">
                        <DialogTitle className="text-2xl font-black text-white tracking-tight">
                            🔥 Offre Spéciale Pro
                        </DialogTitle>
                        <DialogDescription className="text-white/90 text-sm">
                            Pour débloquer <span className="font-bold text-yellow-300">{templateName}</span>
                        </DialogDescription>
                    </DialogHeader>

                    {/* Urgency countdown */}
                    <div className="mt-4 inline-flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2">
                        <Clock className="h-4 w-4 text-yellow-300" />
                        <span className="text-white font-mono font-bold">
                            {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                        </span>
                        <span className="text-white/70 text-xs">restantes</span>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 py-5 space-y-4 bg-gradient-to-b from-slate-50 to-white">
                    {/* Social proof banner */}
                    <div className="flex items-center justify-center gap-2 text-sm text-slate-600 bg-amber-50 rounded-lg py-2 border border-amber-100">
                        <Users className="h-4 w-4 text-amber-600" />
                        <span><span className="font-bold text-amber-700">+500</span> boutiques utilisent Pro</span>
                        <div className="flex -space-x-1">
                            {["🇹🇳", "🇩🇿", "🇲🇦"].map((flag, i) => (
                                <span key={i} className="text-sm">{flag}</span>
                            ))}
                        </div>
                    </div>

                    {/* Comparison table */}
                    <div className="border rounded-xl overflow-hidden">
                        <div className="grid grid-cols-3 text-xs font-semibold bg-slate-100">
                            <div className="px-3 py-2"></div>
                            <div className="px-3 py-2 text-center text-slate-500">Gratuit</div>
                            <div className="px-3 py-2 text-center text-purple-600 bg-purple-50">PRO ⭐</div>
                        </div>
                        {freeVsPro.map((row, i) => (
                            <div key={i} className="grid grid-cols-3 text-xs border-t">
                                <div className="px-3 py-2 text-slate-700">{row.feature}</div>
                                <div className="px-3 py-2 text-center">
                                    {row.free ? <Check className="h-4 w-4 text-slate-400 mx-auto" /> : <X className="h-4 w-4 text-slate-300 mx-auto" />}
                                </div>
                                <div className="px-3 py-2 text-center bg-purple-50/50">
                                    <Check className="h-4 w-4 text-purple-600 mx-auto" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pricing with savings */}
                    <div className="relative bg-gradient-to-br from-purple-600 to-fuchsia-600 rounded-2xl p-4 text-center text-white overflow-hidden">
                        <div className="absolute top-0 right-0 bg-yellow-400 text-purple-900 text-[10px] font-black px-3 py-1 rounded-bl-lg">
                            -40%
                        </div>
                        <p className="text-white/70 text-sm line-through">99 TND/mois</p>
                        <div className="flex items-baseline justify-center gap-1">
                            <span className="text-5xl font-black">{price}</span>
                            <span className="text-lg font-medium">TND</span>
                            <span className="text-white/70">/mois</span>
                        </div>
                        <p className="text-xs text-white/80 mt-1 flex items-center justify-center gap-1">
                            <Shield className="h-3 w-3" />
                            Satisfait ou remboursé 14 jours
                        </p>
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
