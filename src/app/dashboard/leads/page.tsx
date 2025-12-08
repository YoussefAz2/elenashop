import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import type { Profile, Lead, Order } from "@/types";
import { LeadsClient } from "@/components/dashboard/leads-client";

export default async function LeadsPage() {
    const supabase = await createClient();

    // Check authentication
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        redirect("/login");
    }

    // Fetch seller profile
    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (!profile) {
        redirect("/login");
    }

    const seller = profile as Profile;

    // Fetch leads for this seller
    const { data: leads } = await supabase
        .from("leads")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    // Fetch orders to filter out converted leads
    const { data: orders } = await supabase
        .from("orders")
        .select("customer_phone")
        .eq("user_id", user.id);

    const allLeads = (leads as Lead[]) || [];
    const orderPhones = new Set(
        (orders || []).map((o: { customer_phone: string }) => o.customer_phone)
    );

    // Filter out leads that have converted to orders
    const abandonedLeads = allLeads.filter(
        (lead) => !orderPhones.has(lead.customer_phone)
    );

    return (
        <LeadsClient
            seller={seller}
            leads={abandonedLeads}
            totalLeads={allLeads.length}
        />
    );
}
