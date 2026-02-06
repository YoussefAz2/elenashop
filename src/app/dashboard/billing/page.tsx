import { BillingClient } from "@/components/dashboard/billing-client";
import { getCurrentStore } from "@/utils/get-current-store";

export default async function BillingPage() {
    const currentStore = await getCurrentStore();

    return <BillingClient seller={currentStore as any} />;
}
