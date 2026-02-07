import { getCurrentStore } from "@/utils/get-current-store";
import { CreditCard, CheckCircle, Star } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BillingPage() {
    const store = await getCurrentStore();

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="border-b border-zinc-100 pb-8">
                <h1 className="text-4xl font-serif font-bold italic tracking-tight text-zinc-900 leading-tight">Facturation</h1>
                <p className="text-zinc-500 mt-2 text-lg font-medium">Gérez votre abonnement et vos paiements.</p>
            </div>

            {/* Current Plan */}
            <div className="bg-white rounded-3xl border border-zinc-100 p-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center">
                        <Star className="h-7 w-7 text-emerald-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-zinc-900">Plan Gratuit</h2>
                        <p className="text-zinc-500">Vous utilisez actuellement le plan gratuit</p>
                    </div>
                </div>

                <div className="grid gap-3 mb-8">
                    {[
                        "1 boutique",
                        "Produits illimités",
                        "Commandes illimitées",
                        "Support par email",
                    ].map((feature) => (
                        <div key={feature} className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-emerald-500" />
                            <span className="text-zinc-700">{feature}</span>
                        </div>
                    ))}
                </div>

                <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100">
                    <p className="text-zinc-600 text-center">
                        Plus de fonctionnalités arrivent bientôt ! 🚀
                    </p>
                </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-3xl border border-zinc-100 p-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center">
                        <CreditCard className="h-7 w-7 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-zinc-900">Moyens de paiement</h2>
                        <p className="text-zinc-500">Aucun moyen de paiement enregistré</p>
                    </div>
                </div>

                <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100 text-center">
                    <CreditCard className="h-8 w-8 text-zinc-300 mx-auto mb-3" />
                    <p className="text-zinc-500">
                        Vous n&apos;avez pas encore ajouté de moyen de paiement.
                    </p>
                </div>
            </div>
        </div>
    );
}
