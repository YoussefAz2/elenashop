import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const storeId = searchParams.get("store");

    if (!storeId) {
        redirect("/stores");
    }

    // Verify authentication and store access
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Verify user has access to this store
    const { data: membership } = await supabase
        .from("store_members")
        .select("store_id")
        .eq("user_id", user.id)
        .eq("store_id", storeId)
        .single();

    if (!membership) {
        // User doesn't have access to this store
        redirect("/stores");
    }

    // Set the cookie - user is authenticated and authorized
    const cookieStore = await cookies();
    cookieStore.set("current_store_id", storeId, {
        path: "/",
        maxAge: 31536000, // 1 year
        httpOnly: true,
        sameSite: "lax"
    });

    // Redirect to dashboard
    redirect("/dashboard");
}
