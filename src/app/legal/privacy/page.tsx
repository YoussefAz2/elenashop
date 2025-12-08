import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Store } from "lucide-react";

export default function PrivacyPage() {
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
                    Politique de Confidentialité
                </h1>

                <div className="prose prose-slate max-w-none">
                    <p className="text-slate-600 mb-6">
                        Dernière mise à jour : Décembre 2024
                    </p>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">1. Introduction</h2>
                        <p className="text-slate-600 mb-4">
                            Chez ElenaShop, nous prenons la protection de vos données personnelles très au sérieux.
                            Cette politique de confidentialité explique comment nous collectons, utilisons et
                            protégeons vos informations.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">2. Données collectées</h2>
                        <p className="text-slate-600 mb-4">
                            Nous collectons les données suivantes :
                        </p>
                        <ul className="list-disc pl-6 text-slate-600 space-y-2">
                            <li>Informations de compte : email, nom de boutique, numéro de téléphone</li>
                            <li>Données de boutique : produits, commandes, clients</li>
                            <li>Données techniques : adresse IP, navigateur, appareil</li>
                            <li>Données d&apos;utilisation : pages visitées, fonctionnalités utilisées</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">3. Utilisation des données</h2>
                        <p className="text-slate-600 mb-4">
                            Vos données sont utilisées pour :
                        </p>
                        <ul className="list-disc pl-6 text-slate-600 space-y-2">
                            <li>Fournir et améliorer nos services</li>
                            <li>Traiter les commandes et paiements</li>
                            <li>Vous contacter concernant votre compte</li>
                            <li>Envoyer des notifications importantes</li>
                            <li>Analyser et améliorer notre plateforme</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">4. Partage des données</h2>
                        <p className="text-slate-600 mb-4">
                            Nous ne vendons jamais vos données personnelles. Nous pouvons partager vos
                            informations avec :
                        </p>
                        <ul className="list-disc pl-6 text-slate-600 space-y-2">
                            <li>Nos fournisseurs de services (hébergement, paiement)</li>
                            <li>Les autorités légales si requis par la loi</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">5. Sécurité des données</h2>
                        <p className="text-slate-600 mb-4">
                            Nous utilisons des mesures de sécurité techniques et organisationnelles pour
                            protéger vos données, incluant le chiffrement SSL, l&apos;authentification sécurisée
                            et des sauvegardes régulières.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">6. Vos droits</h2>
                        <p className="text-slate-600 mb-4">
                            Vous avez le droit de :
                        </p>
                        <ul className="list-disc pl-6 text-slate-600 space-y-2">
                            <li>Accéder à vos données personnelles</li>
                            <li>Corriger vos données inexactes</li>
                            <li>Demander la suppression de vos données</li>
                            <li>Exporter vos données</li>
                            <li>Retirer votre consentement</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">7. Cookies</h2>
                        <p className="text-slate-600 mb-4">
                            Nous utilisons des cookies essentiels pour le fonctionnement du site et des
                            cookies analytiques pour améliorer nos services. Vous pouvez gérer vos
                            préférences de cookies dans les paramètres de votre navigateur.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">8. Conservation des données</h2>
                        <p className="text-slate-600 mb-4">
                            Nous conservons vos données aussi longtemps que votre compte est actif ou
                            selon les exigences légales. Après suppression de votre compte, les données
                            sont effacées dans un délai de 30 jours.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">9. Contact</h2>
                        <p className="text-slate-600 mb-4">
                            Pour toute question concernant cette politique ou vos données personnelles, contactez-nous à :
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
