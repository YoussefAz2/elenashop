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
            // Check if user has any stores
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                // Check store_members for existing store membership
                const { data: membership } = await supabase
                    .from("store_members")
                    .select("store_id")
                    .eq("user_id", user.id)
                    .limit(1)
                    .single();

                // Redirect based on store membership
                const hasStore = !!membership?.store_id;
                const redirectUrl = hasStore ? "/dashboard" : "/onboarding";
                return NextResponse.redirect(`${origin}${redirectUrl}`);
            }

            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    // Return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/login?error=auth`);
}

