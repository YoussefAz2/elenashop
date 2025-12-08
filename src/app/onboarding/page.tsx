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

    // Check if user already has a store_name (already onboarded)
    const { data: profile } = await supabase
        .from("profiles")
        .select("store_name")
        .eq("id", user.id)
        .single();

    // If already has store_name, redirect to dashboard
    if (profile?.store_name) {
        redirect("/dashboard");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-12">
            <OnboardingForm userId={user.id} userEmail={user.email || ""} />
        </div>
    );
}
