/**
 * Skeleton Loading Components
 * Reusable skeleton UI components for loading states
 */

// Base skeleton element with pulse animation
export function Skeleton({
    className = "",
    variant = "default"
}: {
    className?: string;
    variant?: "default" | "rounded" | "circle";
}) {
    const baseClasses = "animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]";
    const variantClasses = {
        default: "rounded",
        rounded: "rounded-xl",
        circle: "rounded-full"
    };

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={{ animation: "shimmer 1.5s infinite linear" }}
        />
    );
}

// Card skeleton
export function SkeletonCard({ className = "" }: { className?: string }) {
    return (
        <div className={`bg-white rounded-2xl border border-slate-100 p-6 ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-8 w-8" variant="circle" />
            </div>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-20" />
        </div>
    );
}

// Stat card skeleton
export function SkeletonStatCard() {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-10 w-10" variant="rounded" />
            </div>
            <Skeleton className="h-8 w-24 mb-2" />
            <Skeleton className="h-3 w-16" />
        </div>
    );
}

// Table row skeleton
export function SkeletonTableRow({ columns = 4 }: { columns?: number }) {
    return (
        <div className="flex items-center gap-4 p-4 border-b border-slate-50">
            {Array.from({ length: columns }).map((_, i) => (
                <Skeleton
                    key={i}
                    className={`h-4 ${i === 0 ? "w-8" : i === 1 ? "w-32" : "w-20"}`}
                />
            ))}
        </div>
    );
}

// Product card skeleton
export function SkeletonProductCard() {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <Skeleton className="h-40 w-full rounded-none" />
            <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex justify-between items-center pt-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-8 w-8" variant="circle" />
                </div>
            </div>
        </div>
    );
}

// Order row skeleton
export function SkeletonOrderRow() {
    return (
        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100">
            <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10" variant="rounded" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                </div>
            </div>
            <div className="flex items-center gap-6">
                <Skeleton className="h-6 w-16" variant="rounded" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-8" variant="rounded" />
            </div>
        </div>
    );
}

// Full dashboard page skeleton
export function SkeletonDashboard() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-10 w-32" variant="rounded" />
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SkeletonStatCard />
                <SkeletonStatCard />
                <SkeletonStatCard />
            </div>

            {/* Content area */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <div className="flex items-center justify-between mb-6">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-8 w-24" variant="rounded" />
                </div>
                <div className="space-y-3">
                    <SkeletonTableRow columns={5} />
                    <SkeletonTableRow columns={5} />
                    <SkeletonTableRow columns={5} />
                    <SkeletonTableRow columns={5} />
                </div>
            </div>
        </div>
    );
}

// Products page skeleton
export function SkeletonProducts() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-10 w-36" variant="rounded" />
            </div>

            {/* Search & filters */}
            <div className="flex gap-4">
                <Skeleton className="h-10 w-64" variant="rounded" />
                <Skeleton className="h-10 w-32" variant="rounded" />
            </div>

            {/* Product grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                    <SkeletonProductCard key={i} />
                ))}
            </div>
        </div>
    );
}

// Orders page skeleton
export function SkeletonOrders() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-36" />
                    <Skeleton className="h-4 w-56" />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-9 w-24" variant="rounded" />
                ))}
            </div>

            {/* Orders list */}
            <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <SkeletonOrderRow key={i} />
                ))}
            </div>
        </div>
    );
}

// Settings page skeleton
export function SkeletonSettings() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-4 w-64" />
            </div>

            {/* Settings cards */}
            <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6">
                        <Skeleton className="h-6 w-40 mb-4" />
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-8 w-48" variant="rounded" />
                            </div>
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-4 w-40" />
                                <Skeleton className="h-8 w-48" variant="rounded" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Editor skeleton
export function SkeletonEditor() {
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-80 border-r border-slate-200 bg-white p-4 space-y-4">
                <Skeleton className="h-10 w-full" variant="rounded" />
                <div className="space-y-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" variant="rounded" />
                    ))}
                </div>
            </div>

            {/* Preview */}
            <div className="flex-1 bg-slate-100 p-8">
                <div className="bg-white rounded-2xl h-full shadow-lg p-6">
                    <Skeleton className="h-8 w-48 mb-6" />
                    <Skeleton className="h-64 w-full mb-4" variant="rounded" />
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            </div>
        </div>
    );
}
