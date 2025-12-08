"use client";

import { useState } from "react";
import Link from "next/link";
import type { ThemeConfig, Page } from "@/types";
import { Store, Mail, Phone, MapPin, MessageCircle, Send, Menu, X, Loader2 } from "lucide-react";

interface ContactPageProps {
    config: ThemeConfig;
    storeName: string;
    sellerId: string;
    pages?: Page[];
}

export function ContactPage({ config, storeName, sellerId, pages = [] }: ContactPageProps) {
    const { global, contactPageContent } = config;
    const { colors, typography, spacing, buttons } = global;
    const content = contactPageContent;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Form state
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const sectionPaddingClass = {
        compact: "py-12 md:py-16",
        normal: "py-16 md:py-24",
        spacious: "py-24 md:py-32",
    }[spacing.sectionPadding];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // TODO: Implement actual form submission (save to leads table or send email)
        // For now, simulate a delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setSubmitted(true);
        setIsSubmitting(false);
    };

    const openWhatsApp = () => {
        if (content.whatsapp) {
            const message = encodeURIComponent("Bonjour, je vous contacte depuis votre boutique en ligne.");
            window.open(`https://wa.me/${content.whatsapp.replace(/\D/g, "")}?text=${message}`, "_blank");
        }
    };

    return (
        <div
            className="min-h-screen"
            style={{
                backgroundColor: colors.background,
                color: colors.text,
                fontFamily: `"${global.font}", system-ui, sans-serif`,
            }}
        >
            {/* Header */}
            <header
                className="sticky top-0 z-50 py-4 px-6 border-b backdrop-blur-md"
                style={{ backgroundColor: `${colors.background}ee`, borderColor: `${colors.text}15` }}
            >
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <Link href={`/${storeName}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.primary}15` }}>
                            <Store className="w-4 h-4" style={{ color: colors.primary }} />
                        </div>
                        <span className="font-medium" style={{ color: colors.text }}>{storeName}</span>
                    </Link>

                    {pages.length > 0 && (
                        <nav className="hidden md:flex items-center gap-6">
                            {pages.map((page) => (
                                <Link key={page.id} href={`/${storeName}/${page.slug}`} className="text-sm hover:opacity-70 transition-opacity" style={{ color: colors.text }}>{page.title}</Link>
                            ))}
                        </nav>
                    )}

                    {pages.length > 0 && (
                        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ color: colors.text }}>
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    )}
                </div>

                {mobileMenuOpen && pages.length > 0 && (
                    <nav className="md:hidden pt-4 pb-2 border-t mt-4" style={{ borderColor: `${colors.text}15` }}>
                        <div className="flex flex-col gap-3">
                            {pages.map((page) => (
                                <Link key={page.id} href={`/${storeName}/${page.slug}`} className="text-sm py-2 hover:opacity-70 transition-opacity" style={{ color: colors.text }} onClick={() => setMobileMenuOpen(false)}>{page.title}</Link>
                            ))}
                        </div>
                    </nav>
                )}
            </header>

            {/* Hero Section */}
            <section className={`${sectionPaddingClass} px-6`}>
                <div className="max-w-3xl mx-auto text-center">
                    <h1
                        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
                        style={{ fontFamily: `"${global.headingFont}", serif`, textTransform: typography.headingTransform === "none" ? undefined : typography.headingTransform }}
                    >
                        {content.title}
                    </h1>
                    <p className="text-lg opacity-70">{content.subtitle}</p>
                </div>
            </section>

            {/* Contact Info + Form Grid */}
            <section className={`${sectionPaddingClass} px-6`} style={{ backgroundColor: `${colors.text}05` }}>
                <div className="max-w-5xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Contact Info */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold mb-8" style={{ fontFamily: `"${global.headingFont}", serif` }}>
                                Nos coordonnées
                            </h2>

                            {content.email && (
                                <a href={`mailto:${content.email}`} className="flex items-center gap-4 p-4 rounded-lg hover:opacity-80 transition-opacity" style={{ backgroundColor: `${colors.primary}08` }}>
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.primary}15`, color: colors.primary }}>
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm opacity-60">Email</p>
                                        <p className="font-medium">{content.email}</p>
                                    </div>
                                </a>
                            )}

                            {content.phone && (
                                <a href={`tel:${content.phone}`} className="flex items-center gap-4 p-4 rounded-lg hover:opacity-80 transition-opacity" style={{ backgroundColor: `${colors.primary}08` }}>
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.primary}15`, color: colors.primary }}>
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm opacity-60">Téléphone</p>
                                        <p className="font-medium">{content.phone}</p>
                                    </div>
                                </a>
                            )}

                            {content.whatsapp && (
                                <button onClick={openWhatsApp} className="w-full flex items-center gap-4 p-4 rounded-lg hover:opacity-80 transition-opacity text-left" style={{ backgroundColor: "#25D36608" }}>
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "#25D36620", color: "#25D366" }}>
                                        <MessageCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm opacity-60">WhatsApp</p>
                                        <p className="font-medium">{content.whatsapp}</p>
                                    </div>
                                </button>
                            )}

                            {content.address && (
                                <div className="flex items-start gap-4 p-4 rounded-lg" style={{ backgroundColor: `${colors.primary}08` }}>
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${colors.primary}15`, color: colors.primary }}>
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm opacity-60">Adresse</p>
                                        <p className="font-medium whitespace-pre-line">{content.address}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Contact Form */}
                        {content.formEnabled && (
                            <div className="p-6 md:p-8 rounded-xl" style={{ backgroundColor: colors.background, boxShadow: `0 4px 20px ${colors.text}10` }}>
                                <h2 className="text-xl font-bold mb-6" style={{ fontFamily: `"${global.headingFont}", serif` }}>
                                    {content.formTitle}
                                </h2>

                                {submitted ? (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.primary}15`, color: colors.primary }}>
                                            <Send className="w-7 h-7" />
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2">Message envoyé !</h3>
                                        <p className="text-sm opacity-70">Nous vous répondrons dans les plus brefs délais.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Nom</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                                                style={{ borderColor: `${colors.text}20`, backgroundColor: `${colors.text}05` }}
                                                placeholder="Votre nom"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Email</label>
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                                                style={{ borderColor: `${colors.text}20`, backgroundColor: `${colors.text}05` }}
                                                placeholder="votre@email.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Téléphone (optionnel)</label>
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                                                style={{ borderColor: `${colors.text}20`, backgroundColor: `${colors.text}05` }}
                                                placeholder="+216 XX XXX XXX"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Message</label>
                                            <textarea
                                                required
                                                rows={4}
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all resize-none"
                                                style={{ borderColor: `${colors.text}20`, backgroundColor: `${colors.text}05` }}
                                                placeholder="Votre message..."
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full py-3 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                                            style={{
                                                backgroundColor: buttons.backgroundColor,
                                                color: buttons.textColor,
                                                borderRadius: global.borderRadius,
                                            }}
                                        >
                                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> Envoyer</>}
                                        </button>
                                    </form>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Map Section */}
            {content.showMap && content.mapUrl && (
                <section className="h-80 relative">
                    <iframe
                        src={content.mapUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </section>
            )}

            {/* Footer */}
            <footer className="py-8 px-6 border-t" style={{ borderColor: `${colors.text}10` }}>
                <div className="max-w-5xl mx-auto text-center">
                    <Link href={`/${storeName}`} className="text-sm opacity-60 hover:opacity-100 transition-opacity">
                        ← Retour à la boutique
                    </Link>
                </div>
            </footer>
        </div>
    );
}
