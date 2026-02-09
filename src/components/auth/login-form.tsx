"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Store, Loader2, Mail, Lock, Sparkles, ArrowRight, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

interface LoginFormProps {
    defaultMode?: "login" | "signup";
}

export function LoginForm({ defaultMode = "login" }: LoginFormProps) {
    const [mode, setMode] = useState<Mode>(defaultMode);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

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
                    // Hard redirect — faster than router.push + refresh for auth transitions
                    window.location.href = "/dashboard";
                }
            } else {
                // Signup with name metadata
                const { data: authData, error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            first_name: firstName,
                            last_name: lastName,
                            full_name: `${firstName} ${lastName}`.trim(),
                        },
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                    },
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
                        window.location.href = "/onboarding";
                    } else {
                        // Email confirmation required - show success message
                        setSuccess("✅ Compte créé ! Vérifiez votre boîte mail pour confirmer votre inscription.");
                        // Clear form
                        setFirstName("");
                        setLastName("");
                        setEmail("");
                        setPassword("");
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
        <div className="w-full backdrop-blur-3xl bg-white/60 shadow-2xl shadow-indigo-500/10 rounded-[2.5rem] border border-white/50 p-8 sm:p-12 relative overflow-hidden group hover:shadow-indigo-500/20 transition-all duration-500">

            {/* Ambient Glow inside card */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-60"></div>

            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
                    {mode === "login" ? "Bon retour ! 👋" : "Créez votre boutique"}
                </h2>
                <p className="text-slate-500 text-lg">
                    {mode === "login"
                        ? "Heureux de vous revoir"
                        : "L'aventure commence ici"
                    }
                </p>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={mode}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                >
                    {error && (
                        <div className="rounded-2xl bg-red-50/50 p-4 text-sm text-red-600 border border-red-100 flex items-center gap-2 backdrop-blur-sm">
                            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="rounded-2xl bg-emerald-50/50 p-4 text-sm text-emerald-600 border border-emerald-100 flex items-center gap-2 backdrop-blur-sm">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            {success}
                        </div>
                    )}

                    {/* Google Login Button (Primary Action) */}
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full h-14 rounded-2xl border-2 border-slate-100 hover:border-indigo-200 bg-white hover:bg-indigo-50/50 text-slate-700 font-bold text-base transition-all shadow-sm hover:shadow-md group/google"
                        onClick={handleGoogleLogin}
                        disabled={isGoogleLoading || isLoading}
                    >
                        {isGoogleLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                <GoogleIcon className="h-5 w-5 mr-3 group-hover/google:scale-110 transition-transform" />
                                Continuer avec Google
                            </>
                        )}
                    </Button>

                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-200/60" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-wider">
                            <span className="bg-transparent px-4 text-slate-400 font-medium backdrop-blur-sm">ou par email</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {mode === "signup" && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName" className="text-sm font-semibold text-slate-700 ml-1">Prénom</Label>
                                    <Input
                                        id="firstName"
                                        type="text"
                                        placeholder="Jean"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="h-14 px-5 rounded-2xl border-0 bg-slate-100/50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium placeholder:text-slate-400"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName" className="text-sm font-semibold text-slate-700 ml-1">Nom</Label>
                                    <Input
                                        id="lastName"
                                        type="text"
                                        placeholder="Dupont"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="h-14 px-5 rounded-2xl border-0 bg-slate-100/50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium placeholder:text-slate-400"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-semibold text-slate-700 ml-1">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="hello@exemple.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-14 px-5 rounded-2xl border-0 bg-slate-100/50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium placeholder:text-slate-400 text-base"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-semibold text-slate-700 ml-1">Mot de passe</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-14 px-5 rounded-2xl border-0 bg-slate-100/50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium placeholder:text-slate-400 text-base"
                                required
                                minLength={6}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98]"
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
                                    Créer un compte
                                </>
                            )}
                        </Button>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={toggleMode}
                                className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors py-2"
                            >
                                {mode === "login" ? (
                                    <>Pas encore de compte ? <span className="text-indigo-600 ml-1">S&apos;inscrire</span></>
                                ) : (
                                    <>Déjà inscrit ? <span className="text-indigo-600 ml-1">Se connecter</span></>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
