"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQ_ITEMS = [
    {
        question: "ElenaShop est-il vraiment gratuit ?",
        answer: "Oui ! Vous pouvez créer votre boutique et commencer à vendre gratuitement. L'abonnement Pro (49 TND/mois) débloque les thèmes premium et retire le watermark ElenaShop."
    },
    {
        question: "Comment mes clients paient-ils ?",
        answer: "Vos clients peuvent payer à la livraison (Cash on Delivery) ou par carte bancaire. Vous choisissez quelles options activer pour votre boutique. C'est flexible !"
    },
    {
        question: "Comment suis-je notifié des commandes ?",
        answer: "Chaque nouvelle commande apparaît dans votre dashboard. Vous pouvez contacter le client en un clic via WhatsApp avec un message pré-rempli contenant tous les détails."
    },
    {
        question: "Puis-je personnaliser ma boutique ?",
        answer: "Absolument ! L'éditeur visuel vous permet de changer les couleurs, polices, images et le contenu de chaque section. Pas besoin de savoir coder."
    },
    {
        question: "Quelle est l'URL de ma boutique ?",
        answer: "Votre boutique sera accessible sur elenashop.tn/votre-nom. Simple et facile à partager sur Instagram ou TikTok."
    },
    {
        question: "Puis-je accepter les paiements par carte ?",
        answer: "Oui ! Nous supportons maintenant le paiement par carte bancaire en plus du paiement à la livraison. Vos clients auront le choix au moment de commander."
    },
];

function FAQItem({ question, answer, isOpen, onClick }: {
    question: string;
    answer: string;
    isOpen: boolean;
    onClick: () => void;
}) {
    return (
        <div
            className={`bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden ${isOpen
                    ? "border-emerald-200 shadow-lg shadow-emerald-100/50"
                    : "border-slate-100 hover:border-slate-200 hover:shadow-md"
                }`}
        >
            <button
                onClick={onClick}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
            >
                <span className={`font-semibold pr-4 transition-colors ${isOpen ? "text-emerald-700" : "text-slate-900"
                    }`}>
                    {question}
                </span>
                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen
                        ? "bg-emerald-100 text-emerald-600 rotate-180"
                        : "bg-slate-100 text-slate-400"
                    }`}>
                    <ChevronDown className="h-5 w-5" />
                </div>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-out ${isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <div className="px-6 pb-5 text-slate-600 leading-relaxed">
                    {answer}
                </div>
            </div>
        </div>
    );
}

export function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const handleClick = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-emerald-100 text-emerald-600 mb-6">
                        <HelpCircle className="h-7 w-7" />
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                        Questions fréquentes
                    </h2>
                    <p className="text-lg text-slate-600">
                        Tout ce que vous devez savoir pour démarrer
                    </p>
                </div>

                <div className="space-y-4">
                    {FAQ_ITEMS.map((item, index) => (
                        <FAQItem
                            key={index}
                            question={item.question}
                            answer={item.answer}
                            isOpen={openIndex === index}
                            onClick={() => handleClick(index)}
                        />
                    ))}
                </div>

                {/* CTA under FAQ */}
                <div className="mt-12 text-center">
                    <p className="text-slate-600 mb-4">
                        Vous avez d&apos;autres questions ?
                    </p>
                    <a
                        href="mailto:contact@elenashop.tn"
                        className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
                    >
                        Contactez-nous →
                    </a>
                </div>
            </div>
        </section>
    );
}
