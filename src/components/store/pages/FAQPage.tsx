"use client";

import { useState } from "react";
import Link from "next/link";
import type { ThemeConfig, Page } from "@/types";
import { Store, ChevronDown, Menu, X } from "lucide-react";

interface FAQPageProps {
    config: ThemeConfig;
    storeName: string;
    pages?: Page[];
}

export function FAQPage({ config, storeName, pages = [] }: FAQPageProps) {
    const { global, faqPageContent } = config;
    const { colors, typography, spacing } = global;
    const content = faqPageContent;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openItems, setOpenItems] = useState<Set<string>>(new Set());

    const toggleItem = (id: string) => {
        const newOpenItems = new Set(openItems);
        if (newOpenItems.has(id)) {
            newOpenItems.delete(id);
        } else {
            newOpenItems.add(id);
        }
        setOpenItems(newOpenItems);
    };

    const sectionPaddingClass = {
        compact: "py-12 md:py-16",
        normal: "py-16 md:py-24",
        spacious: "py-24 md:py-32",
    }[spacing.sectionPadding];

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

            {/* FAQ Accordion */}
            <section className={`${sectionPaddingClass} px-6`} style={{ backgroundColor: `${colors.text}05` }}>
                <div className="max-w-3xl mx-auto">
                    <div className="space-y-4">
                        {content.items.map((item) => (
                            <div
                                key={item.id}
                                className="rounded-xl overflow-hidden transition-all"
                                style={{ backgroundColor: colors.background, boxShadow: `0 2px 10px ${colors.text}08` }}
                            >
                                <button
                                    onClick={() => toggleItem(item.id)}
                                    className="w-full flex items-center justify-between p-5 text-left hover:opacity-80 transition-opacity"
                                >
                                    <span className="font-medium pr-4">{item.question}</span>
                                    <ChevronDown
                                        className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${openItems.has(item.id) ? "rotate-180" : ""}`}
                                        style={{ color: colors.primary }}
                                    />
                                </button>
                                <div
                                    className={`overflow-hidden transition-all duration-300 ${openItems.has(item.id) ? "max-h-96" : "max-h-0"}`}
                                >
                                    <div className="px-5 pb-5 pt-0">
                                        <div className="pt-4 border-t" style={{ borderColor: `${colors.text}10` }}>
                                            <p className="opacity-70 leading-relaxed whitespace-pre-line">{item.answer}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {content.items.length === 0 && (
                        <div className="text-center py-12 opacity-60">
                            <p>Aucune question pour le moment.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className={`${sectionPaddingClass} px-6 text-center`}>
                <div className="max-w-xl mx-auto">
                    <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: `"${global.headingFont}", serif` }}>
                        Vous n'avez pas trouvé votre réponse ?
                    </h2>
                    <p className="opacity-70 mb-6">N'hésitez pas à nous contacter directement</p>
                    <Link
                        href={`/${storeName}/contact`}
                        className="inline-block py-3 px-8 rounded-lg font-medium transition-all hover:opacity-90"
                        style={{
                            backgroundColor: global.buttons.backgroundColor,
                            color: global.buttons.textColor,
                            borderRadius: global.borderRadius,
                        }}
                    >
                        Contactez-nous
                    </Link>
                </div>
            </section>

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
