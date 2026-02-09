import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 animate-fade-in-up">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-slate-400 animate-spin" />
            </div>
            <p className="text-sm text-slate-400 font-medium">Chargement...</p>
        </div>
    );
}
