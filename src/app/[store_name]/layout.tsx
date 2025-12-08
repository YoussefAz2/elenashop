import type { Profile } from "@/types";

interface StoreLayoutProps {
    children: React.ReactNode;
    params: Promise<{ store_name: string }>;
}

export default async function StoreLayout({
    children,
}: StoreLayoutProps) {
    return <>{children}</>;
}
