"use client";

import { useDashboard } from "@/contexts/DashboardContext";
import { LeadsClient } from "@/components/dashboard/leads-client";

export default function LeadsPage() {
    const { store, leads, orders } = useDashboard();

    // Filter out leads that have converted to orders
    const orderPhones = new Set(orders.map(o => o.customer_phone));
    const abandonedLeads = leads.filter(lead => !orderPhones.has(lead.customer_phone));

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header - Editorial Premium */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 pb-8">
                <div>
                    <h1 className="text-4xl font-serif font-bold italic tracking-tight text-zinc-900 leading-tight">
                        Paniers Abandonnés
                    </h1>
                    <p className="text-zinc-500 mt-2 text-lg font-medium">
                        Relancez vos visiteurs et convertissez-les en clients.
                    </p>
                </div>
            </div>

            <LeadsClient
                seller={store as any}
                leads={abandonedLeads}
                totalLeads={leads.length}
            />
        </div>
    );
}
