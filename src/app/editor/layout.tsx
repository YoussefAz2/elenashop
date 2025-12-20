import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

// Standalone editor layout - fullscreen, no dashboard navigation
export default async function EditorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const cookieStore = await cookies();

    // Check authentication
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        redirect("/login");
    }

    // Check for store
    const currentStoreId = cookieStore.get("current_store_id")?.value;
    if (!currentStoreId) {
        redirect("/dashboard");
    }

    return (
        <div className="min-h-screen bg-slate-100">
            {children}
        </div>
    );
}
