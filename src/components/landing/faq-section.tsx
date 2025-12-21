"use client";

import { useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FAQ_ITEMS = [
    {
        question: "ElenaShop est-il vraiment gratuit ?",
        answer: "Oui ! Vous pouvez créer votre boutique et commencer à vendre gratuitement. L'abonnement Pro débloque les thèmes premium et retire les filigranes."
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
        answer: "Oui ! Nous supportons le paiement par carte bancaire et le paiement à la livraison. Vos clients auront le choix au moment de commander."
    },
];

function FAQItem({ question, answer, isOpen, onClick, index }: {
    question: string;
    answer: string;
    isOpen: boolean;
    onClick: () => void;
    index: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`group rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen
                ? "bg-white border-indigo-100 shadow-xl shadow-indigo-100/50 ring-1 ring-indigo-50"
                : "bg-white border-slate-100 hover:border-indigo-100/50 hover:shadow-lg hover:shadow-indigo-50/40"
                }`}
        >
            <button
                onClick={onClick}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
            >
                <span className={`font-semibold text-lg pr-4 transition-colors ${isOpen ? "text-indigo-600" : "text-slate-900 group-hover:text-indigo-900"
                    }`}>
                    {question}
                </span>
                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen
                    ? "bg-indigo-100 text-indigo-600 rotate-180"
                    : "bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500"
                    }`}>
                    <ChevronDown className="h-5 w-5" />
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-50 pt-4">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const handleClick = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Gradient Mesh (Light Mode) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none opacity-40">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl mix-blend-multiply animate-blob"></div>
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000"></div>
            </div>

            <div className="max-w-3xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 text-xs font-semibold mb-6"
                    >
                        <Sparkles className="h-3 w-3" />
                        <span>FAQ</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight"
                    >
                        Questions fréquentes
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-slate-500"
                    >
                        Tout ce que vous devez savoir pour démarrer.
                    </motion.p>
                </div>

                <div className="space-y-4">
                    {FAQ_ITEMS.map((item, index) => (
                        <FAQItem
                            key={index}
                            index={index}
                            question={item.question}
                            answer={item.answer}
                            isOpen={openIndex === index}
                            onClick={() => handleClick(index)}
                        />
                    ))}
                </div>

                {/* CTA under FAQ */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="mt-16 text-center"
                >
                    <p className="text-slate-500 mb-4">
                        Vous avez d&apos;autres questions ?
                    </p>
                    <a
                        href="mailto:contact@elenashop.tn"
                        className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors bg-white hover:bg-indigo-50 px-6 py-3 rounded-full border border-slate-200 hover:border-indigo-100 shadow-sm hover:shadow"
                    >
                        Contactez-nous
                        <span className="text-lg">👋</span>
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
