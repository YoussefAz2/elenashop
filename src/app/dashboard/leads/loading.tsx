"use client";

import { Skeleton, SkeletonTableRow } from "@/components/ui/skeleton";

export default function LeadsLoading() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-28" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-10 w-32" variant="rounded" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-xl border border-slate-100 p-4">
                        <Skeleton className="h-3 w-20 mb-2" />
                        <Skeleton className="h-6 w-16" />
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <SkeletonTableRow key={i} columns={4} />
                    ))}
                </div>
            </div>
        </div>
    );
}
