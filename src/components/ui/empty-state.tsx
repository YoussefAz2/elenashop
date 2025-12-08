"use client";

import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6">
                <Icon className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                {title}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6">
                {description}
            </p>
            {actionLabel && onAction && (
                <Button
                    onClick={onAction}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
