"use client";

import Link from "next/link";
import Image from "next/image";
import type { ThemeConfig, Page } from "@/types";
import { Store, Heart, Truck, Shield, Star, Menu, X, ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";

interface AboutPageProps {
    config: ThemeConfig;
    storeName: string;
    pages?: Page[];
}

const iconMap: Record<string, React.ReactNode> = {
    heart: <Heart className="w-6 h-6" />,
    truck: <Truck className="w-6 h-6" />,
    shield: <Shield className="w-6 h-6" />,
    star: <Star className="w-6 h-6" />,
};

export function AboutPage({ config, storeName, pages = [] }: AboutPageProps) {
    const { global, aboutPageContent } = config;
    const { colors, typography, spacing } = global;
    const content = aboutPageContent;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const sectionPaddingClass = {
        compact: "py-12 md:py-16",
        normal: "py-16 md:py-24",
        spacious: "py-24 md:py-32",
    }[spacing.sectionPadding];

    return (
        <div
            className="flex flex-col"
            style={{
                minHeight: "100vh",
                backgroundColor: colors.background,
                color: colors.text,
                fontFamily: `"${global.font}", system-ui, sans-serif`,
            }}
        >
            {/* Header */}
            <header
                data-editable="container"
                data-editable-id="about-header"
                data-editable-label="Header À propos"
                className="sticky top-0 z-50 py-4 px-6 border-b backdrop-blur-md"
                style={{ backgroundColor: `${colors.background}ee`, borderColor: `${colors.text}15` }}
            >
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <Link href={`/${storeName}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div data-editable="icon" data-editable-id="about-header-logo" data-editable-label="Logo Header" className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.primary}15` }}>
                            <Store className="w-4 h-4" style={{ color: colors.primary }} />
                        </div>
                        <span data-editable="title" data-editable-id="about-header-store-name" data-editable-label="Nom Boutique" className="font-medium" style={{ color: colors.text }}>{storeName}</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6">
                        {pages.map((page) => (
                            <Link key={page.id} href={`/${storeName}/${page.slug}`} data-editable="button" data-editable-id={`about-nav-${page.slug}`} data-editable-label={`Lien ${page.title}`} className="text-sm hover:opacity-70 transition-opacity" style={{ color: colors.text }}>{page.title}</Link>
                        ))}
                    </nav>

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

            {/* Main content - flex-grow to fill available space */}
            <main className="flex-grow" style={{ backgroundColor: colors.background }}>
                {/* Hero Section with gradient overlay */}
                <section
                    data-editable="container"
                    data-editable-id="about-hero"
                    data-editable-label="Hero À propos"
                    className={`${sectionPaddingClass} px-6 relative overflow-hidden`}
                    style={{ background: `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.background} 50%, ${colors.primary}08 100%)` }}
                >
                    <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `radial-gradient(${colors.primary} 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />
                    <div className="max-w-3xl mx-auto text-center relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${colors.primary}15` }}>
                            <Sparkles className="w-4 h-4" style={{ color: colors.primary }} />
                            <span className="text-sm font-medium" style={{ color: colors.primary }}>Notre Histoire</span>
                        </div>
                        <h1
                            data-editable="title"
                            data-editable-id="about-hero-title"
                            data-editable-label="Titre Principal"
                            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
                            style={{ fontFamily: `"${global.headingFont}", serif`, textTransform: typography.headingTransform === "none" ? undefined : typography.headingTransform as React.CSSProperties["textTransform"] }}
                        >
                            {content.title}
                        </h1>
                        <p data-editable="paragraph" data-editable-id="about-hero-subtitle" data-editable-label="Sous-titre" className="text-lg md:text-xl opacity-70 max-w-2xl mx-auto">{content.subtitle}</p>
                    </div>
                </section>

                {/* Story Section */}
                <section
                    data-editable="container"
                    data-editable-id="about-story-section"
                    data-editable-label="Section Histoire"
                    className={`${sectionPaddingClass} px-6`}
                    style={{ backgroundColor: `${colors.text}05` }}
                >
                    <div className="max-w-5xl mx-auto">
                        <div className={`grid ${content.story.imageUrl ? "md:grid-cols-2" : "grid-cols-1"} gap-12 items-center`}>
                            <div>
                                <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>
                                    NOTRE PARCOURS
                                </div>
                                <h2 data-editable="title" data-editable-id="about-story-title" data-editable-label="Titre Histoire" className="text-2xl md:text-3xl font-bold mb-6" style={{ fontFamily: `"${global.headingFont}", serif` }}>
                                    {content.story.title}
                                </h2>
                                <p data-editable="paragraph" data-editable-id="about-story-text" data-editable-label="Texte Histoire" className="leading-relaxed opacity-80 whitespace-pre-line text-base md:text-lg">{content.story.text}</p>
                            </div>
                            {content.story.imageUrl && (
                                <div data-editable="image" data-editable-id="about-story-image" data-editable-label="Image Histoire" className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
                                    <Image src={content.story.imageUrl} alt="Notre histoire" fill className="object-cover" />
                                    <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${colors.primary}20 0%, transparent 50%)` }} />
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                {content.values.visible && content.values.items.length > 0 && (
                    <section
                        data-editable="container"
                        data-editable-id="about-values-section"
                        data-editable-label="Section Valeurs"
                        className={`${sectionPaddingClass} px-6`}
                        style={{ backgroundColor: colors.background }}
                    >
                        <div className="max-w-5xl mx-auto">
                            <div className="text-center mb-12">
                                <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>
                                    CE QUI NOUS DÉFINIT
                                </div>
                                <h2 data-editable="title" data-editable-id="about-values-title" data-editable-label="Titre Valeurs" className="text-2xl md:text-3xl font-bold" style={{ fontFamily: `"${global.headingFont}", serif` }}>
                                    {content.values.title}
                                </h2>
                            </div>
                            <div className="grid md:grid-cols-3 gap-6">
                                {content.values.items.map((item, index) => (
                                    <div
                                        key={index}
                                        data-editable="container"
                                        data-editable-id={`about-value-card-${index}`}
                                        data-editable-label={`Valeur ${index + 1}`}
                                        className="text-center p-8 rounded-2xl transition-all hover:scale-105 hover:shadow-lg"
                                        style={{ backgroundColor: `${colors.primary}08`, border: `1px solid ${colors.primary}15` }}
                                    >
                                        <div data-editable="icon" data-editable-id={`about-value-icon-${index}`} data-editable-label={`Icône Valeur ${index + 1}`} className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>
                                            {iconMap[item.icon] || <Star className="w-7 h-7" />}
                                        </div>
                                        <h3 data-editable="title" data-editable-id={`about-value-title-${index}`} data-editable-label={`Titre Valeur ${index + 1}`} className="font-bold text-lg mb-3">{item.title}</h3>
                                        <p data-editable="paragraph" data-editable-id={`about-value-text-${index}`} data-editable-label={`Texte Valeur ${index + 1}`} className="text-sm opacity-70 leading-relaxed">{item.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Team Section */}
                {content.team.visible && content.team.members.length > 0 && (
                    <section
                        data-editable="container"
                        data-editable-id="about-team-section"
                        data-editable-label="Section Équipe"
                        className={`${sectionPaddingClass} px-6`}
                        style={{ backgroundColor: `${colors.text}05` }}
                    >
                        <div className="max-w-5xl mx-auto">
                            <div className="text-center mb-12">
                                <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>
                                    NOTRE ÉQUIPE
                                </div>
                                <h2 data-editable="title" data-editable-id="about-team-title" data-editable-label="Titre Équipe" className="text-2xl md:text-3xl font-bold" style={{ fontFamily: `"${global.headingFont}", serif` }}>
                                    {content.team.title}
                                </h2>
                            </div>
                            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
                                {content.team.members.map((member, index) => (
                                    <div key={index} data-editable="container" data-editable-id={`about-team-member-${index}`} data-editable-label={`Membre ${index + 1}`} className="text-center group">
                                        <div className="w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-slate-200 transition-all group-hover:ring-8" style={{ backgroundColor: `${colors.primary}10` }}>
                                            {member.imageUrl ? (
                                                <Image src={member.imageUrl} alt={member.name} width={112} height={112} className="object-cover w-full h-full" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-3xl font-bold" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>
                                                    {member.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <h3 data-editable="title" data-editable-id={`about-member-name-${index}`} data-editable-label={`Nom Membre ${index + 1}`} className="font-bold text-lg">{member.name}</h3>
                                        <p data-editable="paragraph" data-editable-id={`about-member-role-${index}`} data-editable-label={`Rôle Membre ${index + 1}`} className="text-sm opacity-70">{member.role}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* CTA Section */}
                <section
                    data-editable="container"
                    data-editable-id="about-cta-section"
                    data-editable-label="Section CTA"
                    className={`${sectionPaddingClass} px-6`}
                    style={{ background: `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.primary}08 100%)` }}
                >
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 data-editable="title" data-editable-id="about-cta-title" data-editable-label="Titre CTA" className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: `"${global.headingFont}", serif` }}>
                            Prêt à découvrir notre collection ?
                        </h2>
                        <p data-editable="paragraph" data-editable-id="about-cta-text" data-editable-label="Texte CTA" className="opacity-70 mb-8 text-lg">
                            Explorez nos produits sélectionnés avec soin pour vous
                        </p>
                        <Link
                            href={`/${storeName}`}
                            data-editable="button"
                            data-editable-id="about-cta-button"
                            data-editable-label="Bouton CTA"
                            className="inline-flex items-center gap-2 py-4 px-8 rounded-xl font-semibold transition-all hover:scale-105 hover:shadow-lg"
                            style={{
                                backgroundColor: global.buttons.backgroundColor,
                                color: global.buttons.textColor,
                                borderRadius: global.borderRadius,
                            }}
                        >
                            Voir la boutique
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer
                data-editable="container"
                data-editable-id="about-footer"
                data-editable-label="Footer À propos"
                className="py-8 px-6 border-t"
                style={{ backgroundColor: colors.background, borderColor: `${colors.text}10` }}
            >
                <div className="max-w-5xl mx-auto text-center">
                    <Link href={`/${storeName}`} data-editable="button" data-editable-id="about-footer-link" data-editable-label="Lien Retour" className="text-sm opacity-60 hover:opacity-100 transition-opacity">
                        ← Retour à la boutique
                    </Link>
                </div>
            </footer>
        </div>
    );
}
