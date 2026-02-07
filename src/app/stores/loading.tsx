import { Loader2 } from "lucide-react";

export default function StoresLoading() {
    return (
        <div className="min-h-dvh bg-stone-50 flex flex-col items-center justify-center p-4 sm:p-6 font-sans selection:bg-zinc-200 selection:text-zinc-900 overflow-hidden">
            {/* Subtle Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-stone-100/50 via-transparent to-transparent blur-[100px] opacity-60"></div>
            </div>

            {/* Loading Content */}
            <div className="relative z-10 w-full max-w-5xl">
                {/* Header - appears instantly */}
                <div className="text-center mb-6 sm:mb-16 animate-in fade-in duration-300">
                    <div className="inline-block mb-4 sm:mb-8 text-xl sm:text-2xl font-black tracking-tight text-zinc-900">
                        ElenaShop.
                    </div>
                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif italic font-medium text-zinc-900 mb-3 sm:mb-6">
                        Chargement...
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-zinc-400">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <p className="text-sm sm:text-base font-medium">
                            Préparation de vos boutiques
                        </p>
                    </div>
                </div>

                {/* Skeleton Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-zinc-100 animate-pulse"
                            style={{
                                animationDelay: `${i * 100}ms`,
                                animationDuration: '1s'
                            }}
                        >
                            {/* Cover skeleton */}
                            <div className="h-20 sm:h-36 w-full bg-zinc-100" />

                            {/* Content skeleton */}
                            <div className="pt-6 sm:pt-10 p-4 sm:p-7 pb-4 sm:pb-8">
                                <div className="h-6 bg-zinc-100 rounded-lg w-3/4 mb-2"></div>
                                <div className="h-4 bg-zinc-100 rounded w-1/2"></div>
                                <div className="mt-5 flex items-center gap-4">
                                    <div className="h-3 bg-zinc-100 rounded w-16"></div>
                                    <div className="h-3 bg-zinc-100 rounded w-16"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
