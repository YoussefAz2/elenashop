import { createClient } from "@/utils/supabase/server";
import type { Lead } from "@/types";
import { LeadsClient } from "@/components/dashboard/leads-client";
import { getCurrentStore } from "@/utils/get-current-store";

// Cache for smoother navigation
export const revalidate = 60;

export default async function LeadsPage() {
    const currentStore = await getCurrentStore();
    const supabase = await createClient();

    // Fetch leads for this store
    const { data: leads } = await supabase
        .from("leads")
        .select("*")
        .eq("store_id", currentStore.id)
        .order("created_at", { ascending: false });

    // Fetch orders to filter out converted leads
    const { data: orders } = await supabase
        .from("orders")
        .select("customer_phone")
        .eq("store_id", currentStore.id);

    const allLeads = (leads as Lead[]) || [];
    const orderPhones = new Set(
        (orders || []).map((o: { customer_phone: string }) => o.customer_phone)
    );

    // Filter out leads that have converted to orders
    const abandonedLeads = allLeads.filter(
        (lead) => !orderPhones.has(lead.customer_phone)
    );

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
                seller={currentStore as any}
                leads={abandonedLeads}
                totalLeads={allLeads.length}
            />
        </div>
    );
}
