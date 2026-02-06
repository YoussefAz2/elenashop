"use client";

import { Skeleton, SkeletonStatCard } from "@/components/ui/skeleton";

export default function StatsLoading() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-36" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-10 w-32" variant="rounded" />
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SkeletonStatCard />
                <SkeletonStatCard />
                <SkeletonStatCard />
                <SkeletonStatCard />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-slate-100 p-6">
                    <Skeleton className="h-6 w-40 mb-4" />
                    <Skeleton className="h-64 w-full" variant="rounded" />
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-6">
                    <Skeleton className="h-6 w-40 mb-4" />
                    <Skeleton className="h-64 w-full" variant="rounded" />
                </div>
            </div>
        </div>
    );
}
