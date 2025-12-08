import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/onboarding";

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            // Check if user has completed onboarding
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("store_name")
                    .eq("id", user.id)
                    .single();

                const hasCompletedOnboarding = profile?.store_name && profile.store_name.trim() !== "";

                // Redirect based on onboarding status
                const redirectUrl = hasCompletedOnboarding ? "/dashboard" : "/onboarding";
                return NextResponse.redirect(`${origin}${redirectUrl}`);
            }

            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    // Return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/login?error=auth`);
}
