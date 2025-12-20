import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import type { Store } from "@/types";
import Link from "next/link";
import {
    Settings,
    Truck,
    CreditCard,
    Bell,
    Globe,
    Palette,
    ExternalLink,
} from "lucide-react";

// Cache for smoother navigation
export const revalidate = 60;

export default async function SettingsPage() {
    const supabase = await createClient();
    const cookieStore = await cookies();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
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
        redirect("/dashboard");
    }

    const currentStore = store as Store;

    interface SettingsItem {
        icon: React.ElementType;
        label: string;
        description: string;
        href: string;
        external?: boolean;
        comingSoon?: boolean;
    }

    interface SettingsSection {
        title: string;
        items: SettingsItem[];
    }

    const settingsSections: SettingsSection[] = [
        {
            title: "Boutique",
            items: [
                {
                    icon: Palette,
                    label: "Personnaliser ma boutique",
                    description: "Logo, couleurs, mise en page",
                    href: "/editor",
                },
                {
                    icon: Globe,
                    label: "Voir ma boutique",
                    description: `/${currentStore.slug}`,
                    href: `/${currentStore.slug}`,
                    external: true,
                },
            ],
        },
        {
            title: "Vente",
            items: [
                {
                    icon: Truck,
                    label: "Livraison",
                    description: "Zones et tarifs de livraison",
                    href: "/dashboard/settings/delivery",
                    comingSoon: true,
                },
                {
                    icon: CreditCard,
                    label: "Facturation",
                    description: "Abonnement et paiements",
                    href: "/dashboard/billing",
                },
            ],
        },
        {
            title: "Notifications",
            items: [
                {
                    icon: Bell,
                    label: "Alertes",
                    description: "Notifications de commandes",
                    href: "/dashboard/settings/notifications",
                    comingSoon: true,
                },
            ],
        },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">Réglages</h1>
                <p className="text-slate-500 mt-2 text-lg">Configurez votre boutique et vos préférences.</p>
            </div>

            {/* Settings Sections */}
            {settingsSections.map((section) => (
                <div key={section.title} className="space-y-4">
                    <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-1">
                        {section.title}
                    </h2>
                    <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden divide-y divide-slate-50">
                        {section.items.map((item) => {
                            const Icon = item.icon;
                            const content = (
                                <div className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                                        <Icon className="h-5 w-5 text-slate-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-slate-900">{item.label}</p>
                                            {item.comingSoon && (
                                                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-full">
                                                    Bientôt
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-500">{item.description}</p>
                                    </div>
                                    {item.external ? (
                                        <ExternalLink className="h-4 w-4 text-slate-400" />
                                    ) : (
                                        <span className="text-slate-400">→</span>
                                    )}
                                </div>
                            );

                            if (item.comingSoon) {
                                return (
                                    <div key={item.label} className="opacity-60 cursor-not-allowed">
                                        {content}
                                    </div>
                                );
                            }

                            if (item.external) {
                                return (
                                    <a
                                        key={item.label}
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {content}
                                    </a>
                                );
                            }

                            return (
                                <Link key={item.label} href={item.href}>
                                    {content}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            ))}

            {/* Store Info */}
            <div className="bg-slate-50 rounded-xl p-4 text-center text-sm text-slate-500">
                <p>Boutique: <span className="font-medium text-slate-700">{currentStore.name}</span></p>
                <p>URL: <span className="font-mono text-slate-600">elenashop.vercel.app/{currentStore.slug}</span></p>
            </div>
        </div>
    );
}
