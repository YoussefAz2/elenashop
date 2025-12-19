import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import type { Store } from "@/types";
import { BillingClient } from "@/components/dashboard/billing-client";
import Link from "next/link";

export default async function BillingPage() {
    const supabase = await createClient();
    const cookieStore = await cookies();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Get current store from cookie
    const currentStoreId = cookieStore.get("current_store_id")?.value;

    if (!currentStoreId) {
        redirect("/dashboard");
    }

    // Fetch store
    const { data: store, error: storeError } = await supabase
        .from("stores")
        .select("*")
        .eq("id", currentStoreId)
        .single();

    if (storeError || !store) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
                <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
                    <h1 className="text-2xl font-bold text-slate-900 mb-4">
                        Boutique introuvable
                    </h1>
                    <Link
                        href="/dashboard"
                        className="inline-block px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                        Retour au dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return <BillingClient seller={store as any} />;
}
