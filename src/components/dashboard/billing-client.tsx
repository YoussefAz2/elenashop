"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Crown,
    Check,
    ArrowLeft,
    Sparkles,
    Zap,
    Globe,
    CreditCard,
    Loader2,
    PartyPopper,
} from "lucide-react";
import type { Profile } from "@/types";

interface BillingClientProps {
    seller: Profile;
}

const PRO_BENEFITS = [
    { icon: <Sparkles className="h-5 w-5" />, text: "Tous les thèmes Premium", description: "Luxe, Street et futurs thèmes" },
    { icon: <Zap className="h-5 w-5" />, text: "Sans Watermark ElenaShop", description: "Branding 100% à vous" },
    { icon: <Crown className="h-5 w-5" />, text: "Support prioritaire", description: "Réponse en 24h" },
];

export function BillingClient({ seller }: BillingClientProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleUpgrade = async () => {
        setIsProcessing(true);

        // Simulate payment processing
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Update subscription status to "pro"
        const { error } = await supabase
            .from("profiles")
            .update({ subscription_status: "pro" })
            .eq("id", seller.id);

        if (!error) {
            setSuccess(true);
            setTimeout(() => {
                router.push("/dashboard/editor");
                router.refresh();
            }, 2000);
        } else {
            alert("Erreur lors de la mise à jour. Veuillez réessayer.");
            setIsProcessing(false);
        }
    };

    const isPro = seller.subscription_status === "pro";

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center h-24 w-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mb-6 animate-bounce">
                        <PartyPopper className="h-12 w-12 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        🎉 Bienvenue dans Pro !
                    </h1>
                    <p className="text-lg text-slate-600 mb-4">
                        Tous les thèmes premium sont maintenant débloqués.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-slate-500">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Redirection vers l&apos;éditeur...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span>Retour</span>
                    </button>
                    <h1 className="font-bold text-slate-900">Abonnement</h1>
                    <div className="w-20" />
                </div>
            </header>

            <div className="max-w-2xl mx-auto px-4 py-12">
                {/* Current Status */}
                {isPro && (
                    <div className="mb-8 p-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl border border-amber-200">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                                <Crown className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <p className="font-bold text-amber-900">Vous êtes Pro ! 🎉</p>
                                <p className="text-sm text-amber-700">Tous les avantages premium sont activés.</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Pricing Card */}
                <Card className="border-2 border-amber-200 shadow-xl shadow-amber-100/50">
                    <CardHeader className="text-center pb-2 bg-gradient-to-br from-amber-50 to-orange-50 rounded-t-lg">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-orange-500/25">
                            <Crown className="h-8 w-8 text-white" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-slate-900">
                            ElenaShop Pro
                        </CardTitle>
                        <CardDescription className="text-slate-600">
                            Débloquez tout le potentiel de votre boutique
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        {/* Price */}
                        <div className="text-center py-4 bg-slate-50 rounded-2xl">
                            <div className="flex items-baseline justify-center gap-1">
                                <span className="text-5xl font-bold text-slate-900">49</span>
                                <span className="text-xl text-slate-600">TND</span>
                                <span className="text-slate-500">/ mois</span>
                            </div>
                            <p className="text-sm text-slate-500 mt-1">
                                Annulez à tout moment • Sans engagement
                            </p>
                        </div>

                        {/* Benefits */}
                        <div className="space-y-4">
                            {PRO_BENEFITS.map((benefit, index) => (
                                <div key={index} className="flex items-start gap-4">
                                    <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-emerald-100 text-emerald-600 shrink-0">
                                        {benefit.icon}
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">{benefit.text}</p>
                                        <p className="text-sm text-slate-500">{benefit.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        {!isPro && (
                            <Button
                                onClick={handleUpgrade}
                                disabled={isProcessing}
                                className="w-full h-14 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold text-lg shadow-lg shadow-amber-500/25"
                            >
                                {isProcessing ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Traitement en cours...
                                    </div>
                                ) : (
                                    <>
                                        <CreditCard className="h-5 w-5 mr-2" />
                                        Passer à Pro maintenant
                                    </>
                                )}
                            </Button>
                        )}

                        {isPro && (
                            <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                <div className="flex items-center justify-center gap-2 text-emerald-600 font-medium">
                                    <Check className="h-5 w-5" />
                                    Votre abonnement est actif
                                </div>
                            </div>
                        )}

                        {/* Note */}
                        <p className="text-xs text-center text-slate-500 pt-2">
                            💳 Paiement sécurisé • Facturation mensuelle
                        </p>
                    </CardContent>
                </Card>

                {/* FAQ */}
                <div className="mt-12 space-y-4">
                    <h2 className="text-lg font-bold text-slate-900">Questions fréquentes</h2>
                    <div className="space-y-3">
                        <div className="p-4 bg-white rounded-xl border border-slate-200">
                            <p className="font-medium text-slate-900">Puis-je annuler à tout moment ?</p>
                            <p className="text-sm text-slate-600 mt-1">
                                Oui, vous pouvez annuler votre abonnement quand vous voulez. Vous garderez l&apos;accès Pro jusqu&apos;à la fin de votre période de facturation.
                            </p>
                        </div>
                        <div className="p-4 bg-white rounded-xl border border-slate-200">
                            <p className="font-medium text-slate-900">Comment fonctionne le paiement ?</p>
                            <p className="text-sm text-slate-600 mt-1">
                                Vous serez débité de 49 TND chaque mois. Le paiement est sécurisé et vous pouvez utiliser votre carte bancaire.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
