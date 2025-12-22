"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft,
    Phone,
    Clock,
    MessageCircle,
    Users,
    AlertTriangle,
    TrendingDown,
} from "lucide-react";
import type { Profile, Lead } from "@/types";

interface LeadsClientProps {
    seller: Profile;
    leads: Lead[];
    totalLeads: number;
}

export function LeadsClient({ seller, leads, totalLeads }: LeadsClientProps) {
    const convertedCount = totalLeads - leads.length;
    const conversionRate = totalLeads > 0 ? Math.round((convertedCount / totalLeads) * 100) : 0;

    return (
        <div className="space-y-6">
            {/* Metric Cards - Solid Premium Look */}
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl border border-zinc-100 p-8 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-4 rounded-2xl bg-zinc-50 text-zinc-900 border border-zinc-100 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                            <TrendingDown className="h-6 w-6" />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2">Abandons</p>
                        <p className="text-4xl font-serif font-bold italic text-zinc-900 mb-1">{leads.length}</p>
                        <p className="text-sm font-medium text-zinc-400">paniers non finalisés</p>
                    </div>
                </div>
                <div className="bg-white rounded-3xl border border-zinc-100 p-8 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-4 rounded-2xl bg-zinc-50 text-zinc-900 border border-zinc-100 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                            <Users className="h-6 w-6" />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2">Conversion</p>
                        <p className="text-4xl font-serif font-bold italic text-zinc-900 mb-1">{conversionRate}%</p>
                        <p className="text-sm font-medium text-zinc-400">{convertedCount} convertis</p>
                    </div>
                </div>
            </div>

            {leads.length > 0 && (
                <div className="flex items-start gap-4 rounded-2xl bg-amber-50/50 border border-amber-100 p-4">
                    <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-bold text-amber-900">💰 Opportunité de récupération</p>
                        <p className="text-sm text-amber-700 mt-1 font-medium">
                            Ces clients ont montré de l&apos;intérêt mais n&apos;ont pas finalisé. Un simple message WhatsApp peut les convertir !
                        </p>
                    </div>
                </div>
            )}

            {/* Leads List */}
            {leads.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-zinc-200">
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-50 shadow-sm border border-zinc-100">
                        <Users className="h-8 w-8 text-zinc-400" />
                    </div>
                    <h2 className="text-xl font-serif font-bold italic text-zinc-900 mb-2">Aucun panier abandonné</h2>
                    <p className="text-zinc-500 font-medium max-w-sm">Tous vos leads ont finalisé leur commande. Excellent travail ! 🎉</p>
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-zinc-100 overflow-hidden shadow-sm">
                    <div className="divide-y divide-zinc-50">
                        {leads.map((lead) => (
                            <LeadCard key={lead.id} lead={lead} storeName={seller.store_name} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function LeadCard({ lead, storeName }: { lead: Lead; storeName: string }) {
    const getRelativeTime = (date: string) => {
        const now = new Date();
        const leadDate = new Date(date);
        const diffMs = now.getTime() - leadDate.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "À l'instant";
        if (diffMins < 60) return `Il y a ${diffMins}min`;
        if (diffHours < 24) return `Il y a ${diffHours}h`;
        if (diffDays < 7) return `Il y a ${diffDays}j`;
        return leadDate.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
    };

    const cleanPhone = lead.customer_phone.replace(/[\s+]/g, "");
    const customerName = lead.customer_name || "cher(e) client(e)";
    const whatsappMessage = encodeURIComponent(
        `Bonjour ${customerName}, j'ai vu que vous n'avez pas validé votre commande sur ${storeName}. Un souci avec la livraison ? Je suis là pour vous aider 😊`
    );
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappMessage}`;

    return (
        <div className="p-6 hover:bg-zinc-50/50 transition-colors">
            <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 border border-zinc-200 text-zinc-500 font-serif font-bold italic text-lg shadow-sm">
                            {(lead.customer_name?.[0] || "A").toUpperCase()}
                        </div>
                        <div>
                            <p className="font-bold text-zinc-900 text-lg mb-0.5">{lead.customer_name || "Anonyme"}</p>
                            <div className="flex items-center gap-2 text-sm text-zinc-500 font-medium">
                                <Phone className="h-3.5 w-3.5" />
                                {lead.customer_phone}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row items-end md:items-center gap-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400 bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-100">
                        <Clock className="h-3.5 w-3.5" />
                        {getRelativeTime(lead.created_at)}
                    </div>
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-[#25D366]/20 transition-all hover:scale-105 active:scale-95"
                    >
                        <MessageCircle className="h-5 w-5" />
                        Relancer
                    </a>
                </div>
            </div>
        </div>
    );
}
