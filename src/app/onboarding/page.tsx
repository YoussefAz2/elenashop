import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { OnboardingForm } from "@/components/auth/onboarding-form";
import Link from "next/link";

export default async function OnboardingPage() {
    const supabase = await createClient();

    // Check if user is logged in
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // Not logged in - redirect to login
    if (authError || !user) {
        redirect("/login");
    }

    // Check store count for limit enforcement
    const MAX_STORES = 3; // TODO: Make this configurable per subscription tier
    let storeCount = 0;

    try {
        const { data, error, count } = await supabase
            .from("store_members")
            .select("store_id", { count: 'exact' })
            .eq("user_id", user.id);

        if (!error && data) {
            storeCount = data.length;
        }
    } catch (e) {
        console.error("store_members query failed:", e);
        storeCount = 0;
    }

    // If user has reached store limit, show limit message
    if (storeCount >= MAX_STORES) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4 font-sans">
                <div className="text-center p-10 bg-white rounded-3xl shadow-xl shadow-zinc-200/50 max-w-md border border-zinc-100">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-50 rounded-2xl mb-6">
                        <span className="text-3xl">🔒</span>
                    </div>
                    <h1 className="text-2xl font-bold text-zinc-900 mb-4 tracking-tight">
                        Limite atteinte
                    </h1>
                    <p className="text-zinc-500 mb-8 leading-relaxed">
                        Vous avez atteint la limite de <strong>{MAX_STORES} boutiques</strong>.
                        Passez à un plan supérieur pour créer plus de boutiques.
                    </p>
                    <div className="flex flex-col gap-3">
                        <Link
                            href="/stores"
                            className="inline-block px-6 py-3 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-colors"
                        >
                            Retour aux boutiques
                        </Link>
                        <Link
                            href="/dashboard/billing"
                            className="inline-block px-6 py-3 bg-zinc-100 text-zinc-700 font-bold rounded-xl hover:bg-zinc-200 transition-colors"
                        >
                            Voir les abonnements
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // User can create a store (0 stores, or less than MAX) - show onboarding form
    return (
        <div className="min-h-dvh flex flex-col items-center justify-center bg-stone-50 px-4 py-4 sm:py-12 font-sans">
            {/* Back link if user already has stores */}
            {storeCount > 0 && (
                <div className="w-full max-w-md mb-6">
                    <Link
                        href="/stores"
                        className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
                    >
                        <span>←</span>
                        Retour aux boutiques ({storeCount}/{MAX_STORES})
                    </Link>
                </div>
            )}
            <OnboardingForm userId={user.id} userEmail={user.email || ""} />
        </div>
    );
}
