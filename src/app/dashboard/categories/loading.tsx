"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function CategoriesLoading() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-10 w-40" variant="rounded" />
            </div>

            {/* Categories list */}
            <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-50">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-10 w-10" variant="rounded" />
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-8 w-8" variant="rounded" />
                            <Skeleton className="h-8 w-8" variant="rounded" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
