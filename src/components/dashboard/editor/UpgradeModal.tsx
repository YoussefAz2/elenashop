"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Check, CreditCard, Sparkles, Zap, Globe, X } from "lucide-react";

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    templateName: string;
    price: number;
}

export function UpgradeModal({ isOpen, onClose, templateName, price }: UpgradeModalProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const router = useRouter();

    const handleUpgrade = async () => {
        setIsProcessing(true);

        // Simulate payment processing (redirect to billing page)
        setTimeout(() => {
            router.push("/dashboard/billing");
        }, 1000);
    };

    const benefits = [
        { icon: <Sparkles className="h-4 w-4" />, text: "Thèmes Premium illimités" },
        { icon: <Zap className="h-4 w-4" />, text: "Sans Watermark ElenaShop" },
        { icon: <Check className="h-4 w-4" />, text: "Support prioritaire" },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden">
                {/* Header with gradient */}
                <div className="bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 px-6 py-8 text-center relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                    <div className="inline-flex items-center justify-center h-16 w-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
                        <Crown className="h-8 w-8 text-white" />
                    </div>
                    <DialogHeader className="space-y-2">
                        <DialogTitle className="text-2xl font-bold text-white">
                            Passez Pro
                        </DialogTitle>
                        <DialogDescription className="text-white/90 text-base">
                            Pour utiliser le thème <span className="font-semibold">{templateName}</span>
                        </DialogDescription>
                    </DialogHeader>
                </div>

                {/* Content */}
                <div className="px-6 py-6 space-y-6">
                    {/* Benefits */}
                    <div className="space-y-3">
                        <p className="text-sm font-medium text-slate-700">
                            Débloquez tout avec Pro :
                        </p>
                        <ul className="space-y-2">
                            {benefits.map((benefit, index) => (
                                <li key={index} className="flex items-center gap-3 text-slate-600">
                                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-emerald-100 text-emerald-600">
                                        {benefit.icon}
                                    </div>
                                    <span className="text-sm">{benefit.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Pricing */}
                    <div className="bg-slate-50 rounded-2xl p-4 text-center">
                        <div className="flex items-baseline justify-center gap-1">
                            <span className="text-4xl font-bold text-slate-900">{price}</span>
                            <span className="text-lg text-slate-600">TND</span>
                            <span className="text-slate-500">/ mois</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            Annulez à tout moment
                        </p>
                    </div>

                    {/* CTA Button */}
                    <Button
                        onClick={handleUpgrade}
                        disabled={isProcessing}
                        className="w-full h-14 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold text-lg shadow-lg shadow-amber-500/25"
                    >
                        {isProcessing ? (
                            <div className="flex items-center gap-2">
                                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Redirection...
                            </div>
                        ) : (
                            <>
                                <CreditCard className="h-5 w-5 mr-2" />
                                Payer par Carte Bancaire
                            </>
                        )}
                    </Button>

                    {/* Secondary action */}
                    <button
                        onClick={onClose}
                        className="w-full text-sm text-slate-500 hover:text-slate-700 transition-colors"
                    >
                        Continuer avec le thème gratuit
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
