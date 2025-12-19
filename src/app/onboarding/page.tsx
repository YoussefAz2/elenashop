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

    // Simple check - try to get store memberships
    let hasStores = false;
    try {
        const { data, error } = await supabase
            .from("store_members")
            .select("store_id")
            .eq("user_id", user.id)
            .limit(1);

        hasStores = !error && data && data.length > 0;
    } catch (e) {
        // Query failed - assume no stores
        console.error("store_members query failed:", e);
        hasStores = false;
    }

    // If user has stores, show link to dashboard (no redirect to avoid loops)
    if (hasStores) {
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

    // User has no stores - show onboarding form
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-12">
            <OnboardingForm userId={user.id} userEmail={user.email || ""} />
        </div>
    );
}
