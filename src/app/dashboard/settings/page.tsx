import { getCurrentStore } from "@/utils/get-current-store";
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

export const dynamic = "force-dynamic";

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

export default async function SettingsPage() {
    const store = await getCurrentStore();

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
                    description: `/${store.slug}`,
                    href: `/${store.slug}`,
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
        <div className="max-w-4xl mx-auto space-y-12">
            {/* Header */}
            <div className="border-b border-zinc-100 pb-8">
                <h1 className="text-2xl sm:text-4xl font-serif font-bold italic tracking-tight text-zinc-900 leading-tight">Réglages</h1>
                <p className="text-zinc-500 mt-1 sm:mt-2 text-sm sm:text-lg font-medium">Configurez votre boutique et vos préférences.</p>
            </div>

            {/* Settings Sections */}
            <div className="grid gap-10">
                {settingsSections.map((section) => (
                    <div key={section.title} className="space-y-6">
                        <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest px-2">
                            {section.title}
                        </h2>
                        <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden divide-y divide-zinc-50">
                            {section.items.map((item) => {
                                const Icon = item.icon;
                                const content = (
                                    <div className="flex items-center gap-4 sm:gap-6 p-4 sm:p-6 hover:bg-zinc-50/80 transition-all group">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-zinc-50 rounded-xl sm:rounded-2xl flex items-center justify-center border border-zinc-100 group-hover:bg-zinc-900 group-hover:border-zinc-900 transition-colors shadow-sm shrink-0">
                                            <Icon className="h-6 w-6 text-zinc-500 group-hover:text-white transition-colors" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <p className="font-bold text-base sm:text-lg text-zinc-900">{item.label}</p>
                                                {item.comingSoon && (
                                                    <span className="px-2.5 py-0.5 bg-zinc-100 text-zinc-500 text-xs font-bold uppercase tracking-wide rounded-full border border-zinc-200">
                                                        Bientôt
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm sm:text-base text-zinc-500 font-medium">{item.description}</p>
                                        </div>
                                        {item.external ? (
                                            <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
                                                <ExternalLink className="h-4 w-4 text-zinc-400 group-hover:text-zinc-900" />
                                            </div>
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
                                                <span className="text-zinc-400 group-hover:text-zinc-900 text-lg">→</span>
                                            </div>
                                        )}
                                    </div>
                                );

                                if (item.comingSoon) {
                                    return (
                                        <div key={item.label} className="opacity-60 cursor-not-allowed grayscale">
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
            </div>

            {/* Store Info */}
            <div className="bg-zinc-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center text-zinc-400 shadow-xl shadow-zinc-900/10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-800 mb-4 border border-zinc-700 shadow-inner">
                    <Settings className="h-8 w-8 text-zinc-100" />
                </div>
                <h3 className="text-white font-serif font-bold italic text-xl mb-1">{store.name}</h3>
                <p className="text-zinc-500 font-mono text-sm mb-4">ID: {store.id}</p>
                <div className="inline-block bg-zinc-800 rounded-xl px-4 py-2 border border-zinc-700">
                    <p className="text-sm">
                        <span className="text-zinc-500">URL Publique: </span>
                        <a href={`https://elenashop.vercel.app/${store.slug}`} target="_blank" className="font-bold text-zinc-200 hover:text-white transition-colors">
                            elenashop.vercel.app/{store.slug}
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
