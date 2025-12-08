import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { BillingClient } from "@/components/dashboard/billing-client";

export default async function BillingPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (!profile?.store_name) {
        redirect("/onboarding");
    }

    return <BillingClient seller={profile} />;
}
