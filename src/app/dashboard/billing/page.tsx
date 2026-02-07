"use client";

import { useDashboard } from "@/contexts/DashboardContext";
import { BillingClient } from "@/components/dashboard/billing-client";

export default function BillingPage() {
    const { store } = useDashboard();

    return <BillingClient seller={store as any} />;
}
