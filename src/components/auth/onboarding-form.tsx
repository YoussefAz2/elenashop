"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Store,
    Loader2,
    Phone,
    Sparkles,
    Check,
    X,
    ArrowRight,
    PartyPopper,
    ShoppingBag,
    Palette,
    Laptop,
    Heart,
    Shirt,
} from "lucide-react";

interface OnboardingFormProps {
    userId: string;
    userEmail: string;
}

const STORE_CATEGORIES = [
    { id: "mode", label: "Mode & Vêtements", icon: <Shirt className="h-5 w-5" /> },
    { id: "beaute", label: "Beauté & Cosmétiques", icon: <Heart className="h-5 w-5" /> },
    { id: "tech", label: "Tech & Électronique", icon: <Laptop className="h-5 w-5" /> },
    { id: "maison", label: "Maison & Déco", icon: <Palette className="h-5 w-5" /> },
    { id: "autre", label: "Autre", icon: <ShoppingBag className="h-5 w-5" /> },
];

export function OnboardingForm({ userId, userEmail }: OnboardingFormProps) {
    const [storeName, setStoreName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [category, setCategory] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);

    const router = useRouter();
    const supabase = createClient();

    // Debounced store name availability check
    const checkAvailability = useCallback(async (name: string) => {
        if (name.length < 3) {
            setIsAvailable(null);
            return;
        }

        setIsChecking(true);
        try {
            const { data } = await supabase
                .from("profiles")
                .select("store_name")
                .eq("store_name", name.toLowerCase())
                .single();

            setIsAvailable(!data);
        } catch {
            // No match found means available
            setIsAvailable(true);
        } finally {
            setIsChecking(false);
        }
    }, [supabase]);

    // Check availability when store name changes
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (storeName.length >= 3) {
                checkAvailability(storeName);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [storeName, checkAvailability]);

    const handleStoreNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Only allow lowercase letters, numbers, no spaces or special chars
        const value = e.target.value
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "")
            .slice(0, 20);
        setStoreName(value);
        setIsAvailable(null);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Only allow numbers
        const value = e.target.value.replace(/\D/g, "").slice(0, 8);
        setPhoneNumber(value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Final availability check
            const { data: existingStore } = await supabase
                .from("profiles")
                .select("store_name")
                .eq("store_name", storeName.toLowerCase())
                .single();

            if (existingStore) {
                setError("Ce nom de boutique vient d'être pris. Veuillez en choisir un autre.");
                setIsLoading(false);
                return;
            }

            // Check if profile exists (user might have signed up but profile wasn't created)
            const { data: existingProfile } = await supabase
                .from("profiles")
                .select("id")
                .eq("id", userId)
                .single();

            if (existingProfile) {
                // Update existing profile
                const { error: updateError } = await supabase
                    .from("profiles")
                    .update({
                        store_name: storeName.toLowerCase(),
                        phone_number: phoneNumber ? `+216${phoneNumber}` : null,
                    })
                    .eq("id", userId);

                if (updateError) throw updateError;
            } else {
                // Create new profile
                const { error: insertError } = await supabase
                    .from("profiles")
                    .insert({
                        id: userId,
                        store_name: storeName.toLowerCase(),
                        phone_number: phoneNumber ? `+216${phoneNumber}` : null,
                    });

                if (insertError) throw insertError;
            }

            // Show confetti animation
            setShowConfetti(true);

            // Wait for animation then redirect
            setTimeout(() => {
                router.push("/dashboard");
                router.refresh();
            }, 2000);

        } catch (err) {
            console.error("Onboarding error:", err);
            setError("Une erreur est survenue. Veuillez réessayer.");
            setIsLoading(false);
        }
    };

    const isFormValid = storeName.length >= 3 && isAvailable === true;

    // Confetti celebration screen
    if (showConfetti) {
        return (
            <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
                <div className="text-center animate-bounce">
                    <div className="inline-flex items-center justify-center h-24 w-24 bg-emerald-100 rounded-full mb-6">
                        <PartyPopper className="h-12 w-12 text-emerald-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        🎉 Félicitations !
                    </h1>
                    <p className="text-lg text-slate-600 mb-4">
                        Votre boutique <span className="font-semibold text-emerald-600">{storeName}</span> est créée !
                    </p>
                    <div className="flex items-center justify-center gap-2 text-slate-500">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Redirection vers votre dashboard...</span>
                    </div>
                </div>
                {/* Simple confetti effect */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute animate-fall"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: "-20px",
                                animationDelay: `${Math.random() * 2}s`,
                                animationDuration: `${2 + Math.random() * 2}s`,
                            }}
                        >
                            <div
                                className="w-3 h-3 rounded-sm"
                                style={{
                                    backgroundColor: ["#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6"][Math.floor(Math.random() * 5)],
                                    transform: `rotate(${Math.random() * 360}deg)`,
                                }}
                            />
                        </div>
                    ))}
                </div>
                <style jsx>{`
                    @keyframes fall {
                        to {
                            transform: translateY(100vh) rotate(720deg);
                            opacity: 0;
                        }
                    }
                    .animate-fall {
                        animation: fall 3s ease-in forwards;
                    }
                `}</style>
            </div>
        );
    }

    return (
        <Card className="w-full max-w-lg border-slate-200/50 shadow-2xl">
            <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-600/25">
                    <Store className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900">
                    Créons votre boutique ! ✨
                </CardTitle>
                <CardDescription className="text-slate-600">
                    Plus que quelques infos et vous êtes prêt à vendre.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100">
                            {error}
                        </div>
                    )}

                    {/* Store Name */}
                    <div className="space-y-2">
                        <Label htmlFor="storeName" className="text-sm font-semibold text-slate-700">
                            Nom de votre boutique *
                        </Label>
                        <div className="relative">
                            <div className="absolute left-0 top-0 bottom-0 flex items-center pl-4 pointer-events-none">
                                <span className="text-slate-400 text-sm">elenashop.tn/</span>
                            </div>
                            <Input
                                id="storeName"
                                type="text"
                                placeholder="mamari"
                                value={storeName}
                                onChange={handleStoreNameChange}
                                className={`h-14 pl-28 pr-12 rounded-xl text-lg font-medium border-2 transition-colors ${isAvailable === true
                                        ? "border-emerald-500 bg-emerald-50/50"
                                        : isAvailable === false
                                            ? "border-red-500 bg-red-50/50"
                                            : "border-slate-200 bg-slate-50/50"
                                    }`}
                                required
                                minLength={3}
                                maxLength={20}
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                {isChecking && <Loader2 className="h-5 w-5 text-slate-400 animate-spin" />}
                                {!isChecking && isAvailable === true && (
                                    <Check className="h-5 w-5 text-emerald-500" />
                                )}
                                {!isChecking && isAvailable === false && (
                                    <X className="h-5 w-5 text-red-500" />
                                )}
                            </div>
                        </div>
                        <p className={`text-xs ${isAvailable === true
                                ? "text-emerald-600"
                                : isAvailable === false
                                    ? "text-red-600"
                                    : "text-slate-500"
                            }`}>
                            {storeName.length < 3
                                ? "Minimum 3 caractères"
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

                    {/* Phone Number */}
                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-semibold text-slate-700">
                            Votre numéro WhatsApp
                            <span className="text-slate-400 font-normal ml-1">(optionnel)</span>
                        </Label>
                        <div className="relative">
                            <div className="absolute left-0 top-0 bottom-0 flex items-center pl-4 pointer-events-none">
                                <span className="text-slate-400 text-sm">+216</span>
                            </div>
                            <Phone className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="XX XXX XXX"
                                value={phoneNumber}
                                onChange={handlePhoneChange}
                                className="h-14 pl-16 pr-12 rounded-xl text-lg border-2 border-slate-200 bg-slate-50/50"
                                maxLength={8}
                            />
                        </div>
                        <p className="text-xs text-slate-500">
                            Pour recevoir les notifications de commande
                        </p>
                    </div>

                    {/* Category */}
                    <div className="space-y-3">
                        <Label className="text-sm font-semibold text-slate-700">
                            Que vendez-vous ?
                            <span className="text-slate-400 font-normal ml-1">(optionnel)</span>
                        </Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {STORE_CATEGORIES.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setCategory(category === cat.id ? "" : cat.id)}
                                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${category === cat.id
                                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                            : "border-slate-200 hover:border-slate-300 text-slate-600"
                                        }`}
                                >
                                    {cat.icon}
                                    <span className="text-xs font-medium">{cat.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full h-14 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-semibold text-lg shadow-lg shadow-emerald-600/25 transition-all disabled:opacity-50"
                        disabled={isLoading || !isFormValid}
                    >
                        {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                <Sparkles className="h-5 w-5 mr-2" />
                                Créer ma boutique
                                <ArrowRight className="h-5 w-5 ml-2" />
                            </>
                        )}
                    </Button>

                    {/* Terms */}
                    <p className="text-xs text-center text-slate-500">
                        En créant votre boutique, vous acceptez nos conditions d&apos;utilisation
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}
