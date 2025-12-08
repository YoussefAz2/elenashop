export function ProductCardSkeleton() {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-pulse">
            <div className="aspect-square bg-slate-200 dark:bg-slate-700" />
            <div className="p-4 space-y-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
            </div>
        </div>
    );
}

export function OrderCardSkeleton() {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 animate-pulse">
            <div className="flex items-start justify-between mb-4">
                <div className="space-y-2">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-32" />
                </div>
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-20" />
            </div>
            <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-slate-200 dark:bg-slate-700 rounded-lg" />
                <div className="flex-1 space-y-2">
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                </div>
            </div>
        </div>
    );
}

export function DashboardStatSkeleton() {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 animate-pulse">
            <div className="flex items-center justify-between mb-3">
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-20" />
                <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded-lg" />
            </div>
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-16 mb-1" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-24" />
        </div>
    );
}

export function TableRowSkeleton() {
    return (
        <tr className="animate-pulse">
            <td className="px-4 py-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20" />
            </td>
            <td className="px-4 py-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32" />
            </td>
            <td className="px-4 py-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24" />
            </td>
            <td className="px-4 py-3">
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-16" />
            </td>
        </tr>
    );
}
