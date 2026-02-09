export default function LoginLoading() {
    return (
        <div className="min-h-screen relative flex flex-col items-center justify-center bg-slate-50 overflow-hidden">
            {/* Background shimmer */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-100/40 via-transparent to-transparent blur-[100px] animate-spin-slow" />
            </div>

            <div className="w-full max-w-[420px] px-4 relative z-10 flex flex-col items-center">
                {/* Logo placeholder */}
                <div className="mb-12">
                    <div className="h-8 w-32 bg-slate-200 rounded-lg animate-pulse" />
                </div>

                {/* Card skeleton */}
                <div className="w-full bg-white/60 rounded-[2.5rem] border border-white/50 p-8 sm:p-12 space-y-6">
                    {/* Title */}
                    <div className="text-center space-y-2 mb-8">
                        <div className="h-8 w-48 bg-slate-100 rounded-lg mx-auto animate-pulse" />
                        <div className="h-5 w-32 bg-slate-100 rounded-lg mx-auto animate-pulse" />
                    </div>

                    {/* Google button skeleton */}
                    <div className="h-14 w-full bg-slate-100 rounded-2xl animate-pulse" />

                    {/* Divider */}
                    <div className="h-px w-full bg-slate-100" />

                    {/* Input skeletons */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="h-4 w-12 bg-slate-100 rounded animate-pulse" />
                            <div className="h-14 w-full bg-slate-100 rounded-2xl animate-pulse" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
                            <div className="h-14 w-full bg-slate-100 rounded-2xl animate-pulse" />
                        </div>
                    </div>

                    {/* Submit button skeleton */}
                    <div className="h-14 w-full bg-indigo-100 rounded-2xl animate-pulse" />
                </div>
            </div>
        </div>
    );
}
