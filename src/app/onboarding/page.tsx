import { createClient } from "@/utils/supabase/server";
import { OnboardingForm } from "@/components/auth/onboarding-form";
import Link from "next/link";

export default async function OnboardingPage() {
    const supabase = await createClient();

    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4">
                <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
                    <h1 className="text-2xl font-bold text-slate-900 mb-4">
                        Connexion requise
                    </h1>
                    <p className="text-slate-600 mb-6">
                        Vous devez être connecté pour créer une boutique.
                    </p>
                    <Link
                        href="/login"
                        className="inline-block px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                        Se connecter
                    </Link>
                </div>
            </div>
        );
    }

    // Check if user already has any stores
    const { data: storeMemberships, error } = await supabase
        .from("store_members")
        .select("store_id")
        .eq("user_id", user.id)
        .limit(1);

    // If user already has stores, show a page with link to dashboard (NO redirect)
    if (!error && storeMemberships && storeMemberships.length > 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4">
                <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-6">
                        <span className="text-3xl">🎉</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-4">
                        Vous avez déjà une boutique !
                    </h1>
                    <p className="text-slate-600 mb-6">
                        Accédez à votre tableau de bord pour gérer votre boutique.
                    </p>
                    <Link
                        href="/dashboard"
                        className="inline-block px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                        Aller au dashboard
                    </Link>
                </div>
            </div>
        );
    }

    // User has no stores, show onboarding form
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-12">
            <OnboardingForm userId={user.id} userEmail={user.email || ""} />
        </div>
    );
}
