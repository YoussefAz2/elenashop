"use client";

import Link from "next/link";
import Image from "next/image";
import type { ThemeConfig, Page } from "@/types";
import { Store, Heart, Truck, Shield, Star, Menu, X } from "lucide-react";
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
            className="min-h-screen"
            style={{
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

                    {/* Navigation - Desktop */}
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

                {/* Mobile Navigation */}
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
            <section data-editable="container" data-editable-id="about-hero" data-editable-label="Hero À propos" className={`${sectionPaddingClass} px-6`}>
                <div className="max-w-3xl mx-auto text-center">
                    <h1
                        data-editable="title"
                        data-editable-id="about-hero-title"
                        data-editable-label="Titre Principal"
                        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
                        style={{ fontFamily: `"${global.headingFont}", serif`, textTransform: typography.headingTransform === "none" ? undefined : typography.headingTransform }}
                    >
                        {content.title}
                    </h1>
                    <p data-editable="paragraph" data-editable-id="about-hero-subtitle" data-editable-label="Sous-titre" className="text-lg opacity-70">{content.subtitle}</p>
                </div>
            </section>

            {/* Story Section */}
            <section data-editable="container" data-editable-id="about-story-section" data-editable-label="Section Histoire" className={`${sectionPaddingClass} px-6`} style={{ backgroundColor: `${colors.text}05` }}>
                <div className="max-w-5xl mx-auto">
                    <div className={`grid ${content.story.imageUrl ? "md:grid-cols-2" : "grid-cols-1"} gap-12 items-center`}>
                        <div>
                            <h2 data-editable="title" data-editable-id="about-story-title" data-editable-label="Titre Histoire" className="text-2xl md:text-3xl font-bold mb-6" style={{ fontFamily: `"${global.headingFont}", serif` }}>
                                {content.story.title}
                            </h2>
                            <p data-editable="paragraph" data-editable-id="about-story-text" data-editable-label="Texte Histoire" className="leading-relaxed opacity-80 whitespace-pre-line">{content.story.text}</p>
                        </div>
                        {content.story.imageUrl && (
                            <div data-editable="image" data-editable-id="about-story-image" data-editable-label="Image Histoire" className="relative aspect-square rounded-lg overflow-hidden">
                                <Image src={content.story.imageUrl} alt="Notre histoire" fill className="object-cover" />
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Values Section */}
            {content.values.visible && content.values.items.length > 0 && (
                <section data-editable="container" data-editable-id="about-values-section" data-editable-label="Section Valeurs" className={`${sectionPaddingClass} px-6`}>
                    <div className="max-w-5xl mx-auto">
                        <h2 data-editable="title" data-editable-id="about-values-title" data-editable-label="Titre Valeurs" className="text-2xl md:text-3xl font-bold mb-12 text-center" style={{ fontFamily: `"${global.headingFont}", serif` }}>
                            {content.values.title}
                        </h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {content.values.items.map((item, index) => (
                                <div key={index} data-editable="container" data-editable-id={`about-value-card-${index}`} data-editable-label={`Valeur ${index + 1}`} className="text-center p-6 rounded-lg" style={{ backgroundColor: `${colors.primary}08` }}>
                                    <div data-editable="icon" data-editable-id={`about-value-icon-${index}`} data-editable-label={`Icône Valeur ${index + 1}`} className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.primary}15`, color: colors.primary }}>
                                        {iconMap[item.icon] || <Star className="w-6 h-6" />}
                                    </div>
                                    <h3 data-editable="title" data-editable-id={`about-value-title-${index}`} data-editable-label={`Titre Valeur ${index + 1}`} className="font-semibold text-lg mb-2">{item.title}</h3>
                                    <p data-editable="paragraph" data-editable-id={`about-value-text-${index}`} data-editable-label={`Texte Valeur ${index + 1}`} className="text-sm opacity-70">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Team Section */}
            {content.team.visible && content.team.members.length > 0 && (
                <section data-editable="container" data-editable-id="about-team-section" data-editable-label="Section Équipe" className={`${sectionPaddingClass} px-6`} style={{ backgroundColor: `${colors.text}05` }}>
                    <div className="max-w-5xl mx-auto">
                        <h2 data-editable="title" data-editable-id="about-team-title" data-editable-label="Titre Équipe" className="text-2xl md:text-3xl font-bold mb-12 text-center" style={{ fontFamily: `"${global.headingFont}", serif` }}>
                            {content.team.title}
                        </h2>
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
                            {content.team.members.map((member, index) => (
                                <div key={index} data-editable="container" data-editable-id={`about-team-member-${index}`} data-editable-label={`Membre ${index + 1}`} className="text-center">
                                    <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-slate-200">
                                        {member.imageUrl ? (
                                            <Image src={member.imageUrl} alt={member.name} width={96} height={96} className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-2xl font-bold" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>
                                                {member.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <h3 data-editable="title" data-editable-id={`about-member-name-${index}`} data-editable-label={`Nom Membre ${index + 1}`} className="font-semibold">{member.name}</h3>
                                    <p data-editable="paragraph" data-editable-id={`about-member-role-${index}`} data-editable-label={`Rôle Membre ${index + 1}`} className="text-sm opacity-70">{member.role}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer data-editable="container" data-editable-id="about-footer" data-editable-label="Footer À propos" className="py-8 px-6 border-t" style={{ borderColor: `${colors.text}10` }}>
                <div className="max-w-5xl mx-auto text-center">
                    <Link href={`/${storeName}`} data-editable="button" data-editable-id="about-footer-link" data-editable-label="Lien Retour" className="text-sm opacity-60 hover:opacity-100 transition-opacity">
                        ← Retour à la boutique
                    </Link>
                </div>
            </footer>
        </div>
    );
}
