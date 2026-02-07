import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    // Clear the current store cookie
    const cookieStore = await cookies();
    cookieStore.delete("current_store_id");

    // Get the origin from the request
    const url = new URL(request.url);
    const redirectUrl = new URL("/stores", url.origin);

    // Create response with redirect
    const response = NextResponse.redirect(redirectUrl);

    // Also set cookie deletion in response headers to be extra sure
    response.cookies.delete("current_store_id");

    return response;
}
