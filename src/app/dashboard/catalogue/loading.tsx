"use client";

import { Skeleton, SkeletonProductCard } from "@/components/ui/skeleton";

export default function CatalogueLoading() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-4 w-56" />
                </div>
                <Skeleton className="h-10 w-36" variant="rounded" />
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-9 w-28" variant="rounded" />
                ))}
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
