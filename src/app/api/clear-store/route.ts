import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET() {
    // Clear the current store cookie
    const cookieStore = await cookies();
    cookieStore.delete("current_store_id");

    // Redirect to store selection page
    redirect("/stores");
}
