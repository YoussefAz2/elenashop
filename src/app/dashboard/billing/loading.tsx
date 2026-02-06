"use client";

import { Skeleton, SkeletonStatCard } from "@/components/ui/skeleton";

export default function BillingLoading() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-4 w-64" />
            </div>

            {/* Current plan card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <div className="flex items-center justify-between mb-6">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-8 w-24" variant="rounded" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <SkeletonStatCard />
                    <SkeletonStatCard />
                    <SkeletonStatCard />
                </div>
            </div>

            {/* Plans */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6">
                        <Skeleton className="h-6 w-24 mb-4" />
                        <Skeleton className="h-10 w-32 mb-6" />
                        <div className="space-y-3">
                            {[1, 2, 3, 4].map((j) => (
                                <div key={j} className="flex items-center gap-3">
                                    <Skeleton className="h-4 w-4" variant="circle" />
                                    <Skeleton className="h-4 w-48" />
                                </div>
                            ))}
                        </div>
                        <Skeleton className="h-10 w-full mt-6" variant="rounded" />
                    </div>
                ))}
            </div>
        </div>
    );
}
