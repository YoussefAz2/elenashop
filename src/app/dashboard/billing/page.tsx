import { BillingClient } from "@/components/dashboard/billing-client";
import { getCurrentStore } from "@/utils/get-current-store";

// Enable ISR for faster navigation
export const revalidate = 30;

export default async function BillingPage() {
    const currentStore = await getCurrentStore();

    return <BillingClient seller={currentStore as any} />;
}
