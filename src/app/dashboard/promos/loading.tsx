"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function PromosLoading() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-36" />
                    <Skeleton className="h-4 w-56" />
                </div>
                <Skeleton className="h-10 w-40" variant="rounded" />
            </div>

            {/* Promos grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-6 w-16" variant="rounded" />
                        </div>
                        <Skeleton className="h-4 w-48 mb-3" />
                        <Skeleton className="h-4 w-32 mb-4" />
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-8 w-20" variant="rounded" />
                            <Skeleton className="h-8 w-20" variant="rounded" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
