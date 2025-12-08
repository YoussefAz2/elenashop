import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Store } from "lucide-react";

export default function CGUPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="border-b border-slate-200 bg-white">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                            <Store className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-bold text-lg text-slate-900">ElenaShop</span>
                    </Link>
                    <Link href="/">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Retour
                        </Button>
                    </Link>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">
                    Conditions Générales d&apos;Utilisation
                </h1>

                <div className="prose prose-slate max-w-none">
                    <p className="text-slate-600 mb-6">
                        Dernière mise à jour : Décembre 2024
                    </p>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">1. Acceptation des conditions</h2>
                        <p className="text-slate-600 mb-4">
                            En utilisant ElenaShop, vous acceptez d&apos;être lié par les présentes conditions générales d&apos;utilisation.
                            Si vous n&apos;acceptez pas ces conditions, veuillez ne pas utiliser notre service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">2. Description du service</h2>
                        <p className="text-slate-600 mb-4">
                            ElenaShop est une plateforme SaaS permettant aux vendeurs de créer et gérer une boutique en ligne.
                            Le service inclut la création de boutique, la gestion des produits, le traitement des commandes et
                            des outils de personnalisation.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">3. Inscription et compte</h2>
                        <p className="text-slate-600 mb-4">
                            Pour utiliser ElenaShop, vous devez créer un compte avec des informations exactes et à jour.
                            Vous êtes responsable de la confidentialité de vos identifiants de connexion.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">4. Utilisation acceptable</h2>
                        <p className="text-slate-600 mb-4">
                            Vous vous engagez à utiliser ElenaShop de manière légale et éthique. Il est interdit de :
                        </p>
                        <ul className="list-disc pl-6 text-slate-600 space-y-2">
                            <li>Vendre des produits illégaux ou contrefaits</li>
                            <li>Utiliser le service pour des activités frauduleuses</li>
                            <li>Violer les droits de propriété intellectuelle</li>
                            <li>Harceler ou nuire à d&apos;autres utilisateurs</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">5. Paiement et abonnement</h2>
                        <p className="text-slate-600 mb-4">
                            L&apos;utilisation de base d&apos;ElenaShop est gratuite. L&apos;abonnement Pro à 49 TND/mois
                            donne accès aux fonctionnalités premium. L&apos;abonnement est renouvelé automatiquement
                            sauf annulation.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">6. Propriété intellectuelle</h2>
                        <p className="text-slate-600 mb-4">
                            ElenaShop et son contenu sont protégés par les droits de propriété intellectuelle.
                            Vous conservez tous les droits sur le contenu que vous publiez sur votre boutique.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">7. Limitation de responsabilité</h2>
                        <p className="text-slate-600 mb-4">
                            ElenaShop est fourni &quot;tel quel&quot;. Nous ne garantissons pas que le service sera
                            ininterrompu ou exempt d&apos;erreurs. Notre responsabilité est limitée au montant
                            payé pour le service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">8. Résiliation</h2>
                        <p className="text-slate-600 mb-4">
                            Vous pouvez résilier votre compte à tout moment. Nous nous réservons le droit
                            de suspendre ou résilier votre compte en cas de violation des présentes conditions.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">9. Contact</h2>
                        <p className="text-slate-600 mb-4">
                            Pour toute question concernant ces conditions, contactez-nous à :
                            <a href="mailto:contact@elenashop.tn" className="text-emerald-600 hover:underline ml-1">
                                contact@elenashop.tn
                            </a>
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
}
