import { createClient } from "@/utils/supabase/server";
import { getCurrentStore } from "@/utils/get-current-store";
import type { Promo } from "@/types";
import { Tag, Percent, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PromosPage() {
    const store = await getCurrentStore();
    const supabase = await createClient();

    const { data } = await supabase
        .from("promos")
        .select("*")
        .eq("store_id", store.id)
        .order("created_at", { ascending: false });

    const promos = (data as Promo[]) || [];

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="border-b border-zinc-100 pb-8">
                <h1 className="text-4xl font-serif font-bold italic tracking-tight text-zinc-900 leading-tight">Promotions</h1>
                <p className="text-zinc-500 mt-2 text-lg font-medium">Gérez vos codes promo et réductions.</p>
            </div>

            {/* Promos List */}
            {promos.length === 0 ? (
                <div className="bg-white rounded-3xl border border-zinc-100 p-12 text-center">
                    <div className="w-20 h-20 bg-zinc-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-zinc-100">
                        <Tag className="h-10 w-10 text-zinc-300" />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 mb-2">Aucune promotion</h3>
                    <p className="text-zinc-500 max-w-md mx-auto">
                        Créez des codes promo pour attirer plus de clients.
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-zinc-100 overflow-hidden divide-y divide-zinc-50">
                    {promos.map((promo) => (
                        <div key={promo.id} className="p-6 hover:bg-zinc-50/50 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                                        <Percent className="h-6 w-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-zinc-900 font-mono">{promo.code}</p>
                                        <p className="text-sm text-zinc-500 mt-1">
                                            {promo.discount_type === "percentage" ? `${promo.discount_value}%` : `${promo.discount_value} TND`} de réduction
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${promo.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-500'}`}>
                                        {promo.is_active ? 'Actif' : 'Inactif'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
