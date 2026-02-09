import { LoginForm } from "@/components/auth/login-form";

interface PageProps {
    searchParams: Promise<{ mode?: string }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
    const params = await searchParams;

    // Middleware handles redirect if already logged in (via getUser)
    // No need to call getUser() here — saves ~500ms

    // Check if we should start in signup mode
    const defaultMode = params.mode === "signup" ? "signup" : "login";

    return (
        <div className="min-h-screen relative flex flex-col items-center justify-center bg-slate-50 overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {/* Aurora Background - Subtle & Premium */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                {/* Spotlight - Single moving light source */}
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-100/40 via-transparent to-transparent blur-[100px] animate-spin-slow duration-[30000ms]"></div>

                {/* Subtle Noise for texture (very low opacity) */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-plus-lighter"></div>
            </div>

            {/* Content Container */}
            <div className="w-full max-w-[420px] px-4 relative z-10 flex flex-col items-center">

                {/* Minimal Logo */}
                <a href="/" className="mb-12 group transition-opacity hover:opacity-80">
                    <span className="text-2xl font-black tracking-tight text-slate-900">ElenaShop.</span>
                </a>

                {/* Form Component */}
                <LoginForm defaultMode={defaultMode} />

                {/* Minimal Footer */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-slate-400 font-medium">
                        © 2025 ElenaShop Inc. <a href="#" className="hover:text-indigo-600 transition-colors mx-2">Aide</a> <a href="#" className="hover:text-indigo-600 transition-colors">Confidentialité</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
