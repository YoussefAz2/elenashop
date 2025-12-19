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
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Abandons</p>
                            <p className="text-3xl font-bold text-slate-900">{leads.length}</p>
                            <p className="text-sm text-slate-400 mt-1">paniers non finalisés</p>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 text-slate-900 border border-slate-100">
                            <TrendingDown className="h-5 w-5" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Conversion</p>
                            <p className="text-3xl font-bold text-slate-900">{conversionRate}%</p>
                            <p className="text-sm text-slate-400 mt-1">{convertedCount} convertis</p>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 text-slate-900 border border-slate-100">
                            <Users className="h-5 w-5" />
                        </div>
                    </div>
                </div>
            </div>

            {leads.length > 0 && (
                <div className="flex items-start gap-3 rounded-xl bg-amber-50 border border-amber-200 p-4">
                    <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-amber-800">💰 Opportunité de récupération</p>
                        <p className="text-xs text-amber-700 mt-1">
                            Ces clients ont montré de l&apos;intérêt mais n&apos;ont pas finalisé. Un simple message WhatsApp peut les convertir !
                        </p>
                    </div>
                </div>
            )}

            {/* Leads List */}
            {leads.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-slate-200">
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 border border-emerald-100">
                        <Users className="h-10 w-10 text-emerald-500" />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900">Aucun panier abandonné</h2>
                    <p className="mt-1 text-sm text-slate-500">Tous vos leads ont finalisé leur commande 🎉</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-50 overflow-hidden">
                    {leads.map((lead) => (
                        <LeadCard key={lead.id} lead={lead} storeName={seller.store_name} />
                    ))}
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
        <Card className="border-0 shadow-sm overflow-hidden">
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                                <Phone className="h-5 w-5 text-slate-500" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-900">{lead.customer_name || "Anonyme"}</p>
                                <p className="text-sm text-slate-500">{lead.customer_phone}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                            <Clock className="h-3 w-3" />
                            {getRelativeTime(lead.created_at)}
                        </div>
                        <Button asChild size="sm" className="bg-green-500 hover:bg-green-600 text-white rounded-full px-4 shadow-lg shadow-green-500/25">
                            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                                <MessageCircle className="h-4 w-4 mr-1" />
                                Relancer
                            </a>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
