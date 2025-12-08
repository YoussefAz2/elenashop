"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Store, Loader2, Mail, Lock, Sparkles, ArrowRight } from "lucide-react";

type Mode = "login" | "signup";

// Google Icon SVG Component
function GoogleIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
            />
            <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
            />
            <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
            />
            <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
            />
        </svg>
    );
}

export function LoginForm() {
    const [mode, setMode] = useState<Mode>("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const router = useRouter();
    const supabase = createClient();

    const handleGoogleLogin = async () => {
        setIsGoogleLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) {
                setError("Erreur de connexion Google. Veuillez réessayer.");
                setIsGoogleLoading(false);
            }
        } catch {
            setError("Une erreur est survenue");
            setIsGoogleLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            if (mode === "login") {
                // Login
                const { data: { user }, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) {
                    setError(error.message === "Invalid login credentials"
                        ? "Email ou mot de passe incorrect"
                        : error.message
                    );
                    return;
                }

                if (user) {
                    // Check if user has completed onboarding
                    const { data: profile } = await supabase
                        .from("profiles")
                        .select("store_name")
                        .eq("id", user.id)
                        .single();

                    const hasCompletedOnboarding = profile?.store_name && profile.store_name.trim() !== "";

                    // Redirect based on onboarding status
                    router.push(hasCompletedOnboarding ? "/dashboard" : "/onboarding");
                    router.refresh();
                }
            } else {
                // Signup - Just create auth user, onboarding will handle profile
                const { data: authData, error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                });

                if (signUpError) {
                    if (signUpError.message.includes("already registered")) {
                        setError("Cet email est déjà utilisé");
                    } else {
                        setError(signUpError.message);
                    }
                    return;
                }

                if (authData.user) {
                    // Check if email confirmation is required
                    if (authData.session) {
                        // No confirmation needed, redirect to onboarding
                        router.push("/onboarding");
                        router.refresh();
                    } else {
                        // Email confirmation required
                        setSuccess("Compte créé ! Vérifiez votre email pour confirmer, puis connectez-vous.");
                        setMode("login");
                    }
                }
            }
        } catch {
            setError("Une erreur est survenue");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setMode(mode === "login" ? "signup" : "login");
        setError(null);
        setSuccess(null);
    };

    return (
        <Card className="w-full max-w-md border-slate-200/50 shadow-2xl">
            <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-600/25">
                    <Store className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900">
                    {mode === "login" ? "Bon retour ! 👋" : "Créez votre boutique"}
                </CardTitle>
                <CardDescription className="text-slate-600">
                    {mode === "login"
                        ? "Connectez-vous à votre espace vendeur"
                        : "Rejoignez +150 vendeurs en Tunisie"
                    }
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {error && (
                        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-600 border border-emerald-100">
                            {success}
                        </div>
                    )}

                    {/* Google Login Button */}
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full h-14 rounded-xl border-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-base"
                        onClick={handleGoogleLogin}
                        disabled={isGoogleLoading || isLoading}
                    >
                        {isGoogleLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                <GoogleIcon className="h-5 w-5 mr-3" />
                                Continuer avec Google
                            </>
                        )}
                    </Button>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-4 text-slate-500">ou</span>
                        </div>
                    </div>

                    {/* Email Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="votre@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-14 pl-12 rounded-xl border-2 border-slate-200 bg-slate-50/50 focus:border-emerald-500 text-lg"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium">Mot de passe</Label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-14 pl-12 rounded-xl border-2 border-slate-200 bg-slate-50/50 focus:border-emerald-500 text-lg"
                                    required
                                    minLength={6}
                                />
                            </div>
                            {mode === "signup" && (
                                <p className="text-xs text-slate-500">Minimum 6 caractères</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-14 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-semibold text-lg shadow-lg shadow-emerald-600/25"
                            disabled={isLoading || isGoogleLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : mode === "login" ? (
                                <>
                                    Se connecter
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-5 w-5 mr-2" />
                                    Créer mon compte
                                </>
                            )}
                        </Button>

                        <div className="text-center pt-2">
                            <button
                                type="button"
                                onClick={toggleMode}
                                className="text-sm text-slate-500 hover:text-emerald-600 transition-colors"
                            >
                                {mode === "login" ? (
                                    <>Pas encore de compte ? <span className="font-semibold text-emerald-600">S&apos;inscrire</span></>
                                ) : (
                                    <>Déjà un compte ? <span className="font-semibold text-emerald-600">Se connecter</span></>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </CardContent>
        </Card>
    );
}
