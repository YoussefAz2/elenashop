import { createClient } from "@/utils/supabase/server";
import { getCurrentStore } from "@/utils/get-current-store";
import type { Lead } from "@/types";
import { Users, Phone, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
    const store = await getCurrentStore();
    const supabase = await createClient();

    const { data } = await supabase
        .from("leads")
        .select("*")
        .eq("store_id", store.id)
        .order("created_at", { ascending: false });

    const leads = (data as Lead[]) || [];

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="border-b border-zinc-100 pb-8">
                <h1 className="text-4xl font-serif font-bold italic tracking-tight text-zinc-900 leading-tight">Paniers abandonnés</h1>
                <p className="text-zinc-500 mt-2 text-lg font-medium">Clients potentiels qui n&apos;ont pas finalisé leur achat.</p>
            </div>

            {/* Leads List */}
            {leads.length === 0 ? (
                <div className="bg-white rounded-3xl border border-zinc-100 p-12 text-center">
                    <div className="w-20 h-20 bg-zinc-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-zinc-100">
                        <Users className="h-10 w-10 text-zinc-300" />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 mb-2">Aucun panier abandonné</h3>
                    <p className="text-zinc-500 max-w-md mx-auto">
                        Les clients qui abandonnent leur panier apparaîtront ici.
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-zinc-100 overflow-hidden divide-y divide-zinc-50">
                    {leads.map((lead) => (
                        <div key={lead.id} className="p-6 hover:bg-zinc-50/50 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                                        <Users className="h-6 w-6 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-zinc-900">{lead.customer_name || "Anonyme"}</p>
                                        <div className="flex items-center gap-4 text-sm text-zinc-500 mt-1">
                                            {lead.customer_phone && (
                                                <span className="flex items-center gap-1">
                                                    <Phone className="h-3 w-3" />
                                                    {lead.customer_phone}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1 text-sm text-zinc-400">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(lead.created_at).toLocaleDateString("fr-FR")}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
