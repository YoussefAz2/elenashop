import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { LoginForm } from "@/components/auth/login-form";

interface PageProps {
    searchParams: Promise<{ mode?: string }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
    const supabase = await createClient();
    const params = await searchParams;

    // If already logged in, redirect to dashboard
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        redirect("/dashboard");
    }

    // Check if we should start in signup mode
    const defaultMode = params.mode === "signup" ? "signup" : "login";

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 px-4">
            <LoginForm defaultMode={defaultMode} />
        </div>
    );
}
