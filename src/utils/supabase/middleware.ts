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

    // Legal routes
    const isLegalRoute = pathname.startsWith("/legal");

    // If accessing dashboard or onboarding without being logged in
    if (!user && (pathname.startsWith("/dashboard") || pathname.startsWith("/onboarding"))) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    // Allow dashboard and onboarding pages to handle their own logic
    // No more middleware redirects between them - this prevents redirect loops
    // The pages themselves will show appropriate content based on store_members

    // If logged in user tries to access login page, redirect to dashboard
    if (user && pathname === "/login") {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
    }

    return supabaseResponse;
}
