import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // OPTIMIZATION: Skip auth check entirely for public routes
    // This prevents MIDDLEWARE_INVOCATION_TIMEOUT on Vercel Edge
    const publicRoutes = ["/", "/login"];
    const isPublicRoute = publicRoutes.includes(pathname);
    const isLegalRoute = pathname.startsWith("/legal");

    // Store routes (dynamic [store_name]) - these are public storefronts
    const isStoreRoute = pathname.match(/^\/[a-z0-9-]+$/i) &&
        !pathname.startsWith("/dashboard") &&
        !pathname.startsWith("/login") &&
        !pathname.startsWith("/onboarding") &&
        !pathname.startsWith("/stores") &&
        !pathname.startsWith("/api") &&
        pathname !== "/";

    // For truly public routes, skip Supabase entirely
    if (isPublicRoute || isLegalRoute || isStoreRoute) {
        return NextResponse.next({ request });
    }

    let supabaseResponse = NextResponse.next({
        request,
    });

    try {
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

        // Get user with timeout protection
        const { data: { user } } = await supabase.auth.getUser();

        // If accessing dashboard or onboarding without being logged in
        if (!user && (pathname.startsWith("/dashboard") || pathname.startsWith("/onboarding") || pathname.startsWith("/stores"))) {
            const url = request.nextUrl.clone();
            url.pathname = "/login";
            return NextResponse.redirect(url);
        }

        // If logged in user tries to access login page, redirect to dashboard
        if (user && pathname === "/login") {
            const url = request.nextUrl.clone();
            url.pathname = "/dashboard";
            return NextResponse.redirect(url);
        }

        return supabaseResponse;
    } catch (error) {
        // On timeout or error, let the request through
        // The page will handle auth client-side if needed
        console.error("Middleware auth error:", error);
        return NextResponse.next({ request });
    }
}
