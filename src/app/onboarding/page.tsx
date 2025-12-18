import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { OnboardingForm } from "@/components/auth/onboarding-form";

export default async function OnboardingPage() {
    const supabase = await createClient();

    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Check if user already has any stores (already onboarded)
    const { data: storeMemberships } = await supabase
        .from("store_members")
        .select("store_id")
        .eq("user_id", user.id)
        .limit(1);

    // If user has at least one store, redirect to dashboard
    if (storeMemberships && storeMemberships.length > 0) {
        redirect("/dashboard");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-12">
            <OnboardingForm userId={user.id} userEmail={user.email || ""} />
        </div>
    );
}
