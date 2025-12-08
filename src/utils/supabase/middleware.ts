import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // Get user
    const { data: { user } } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;

    // Public routes that don't require auth
    const publicRoutes = ["/", "/login"];
    const isPublicRoute = publicRoutes.includes(pathname);

    // Store routes (dynamic [store_name])
    const isStoreRoute = pathname.match(/^\/[a-z0-9]+$/i) &&
        !pathname.startsWith("/dashboard") &&
        !pathname.startsWith("/login") &&
        !pathname.startsWith("/onboarding") &&
        pathname !== "/";

    // If accessing dashboard or onboarding without being logged in
    if (!user && (pathname.startsWith("/dashboard") || pathname.startsWith("/onboarding"))) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    // If user is logged in, check if they have completed onboarding
    if (user && !isPublicRoute && !isStoreRoute) {
        // Check if user has a store_name (completed onboarding)
        const { data: profile } = await supabase
            .from("profiles")
            .select("store_name")
            .eq("id", user.id)
            .single();

        const hasCompletedOnboarding = profile?.store_name && profile.store_name.trim() !== "";

        // If trying to access dashboard without completing onboarding
        if (pathname.startsWith("/dashboard") && !hasCompletedOnboarding) {
            const url = request.nextUrl.clone();
            url.pathname = "/onboarding";
            return NextResponse.redirect(url);
        }

        // If trying to access onboarding but already completed
        if (pathname.startsWith("/onboarding") && hasCompletedOnboarding) {
            const url = request.nextUrl.clone();
            url.pathname = "/dashboard";
            return NextResponse.redirect(url);
        }
    }

    // If logged in user tries to access login page
    if (user && pathname === "/login") {
        // Check if they have completed onboarding
        const { data: profile } = await supabase
            .from("profiles")
            .select("store_name")
            .eq("id", user.id)
            .single();

        const hasCompletedOnboarding = profile?.store_name && profile.store_name.trim() !== "";

        const url = request.nextUrl.clone();
        url.pathname = hasCompletedOnboarding ? "/dashboard" : "/onboarding";
        return NextResponse.redirect(url);
    }

    return supabaseResponse;
}
