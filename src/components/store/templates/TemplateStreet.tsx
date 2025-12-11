"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ThemeConfig, Product, Page, Promo, Category } from "@/types";
import { ProductCard } from "../ProductCard";
import { FloatingWhatsApp, PromoPopup } from "../common";
import { Testimonials } from "../common/Testimonials";
import { getDiscountedPrice, getPopupPromo } from "@/lib/promo";
import { ShoppingBag, Zap, Store, Menu, X } from "lucide-react";
import type { EditorStateReturn } from "@/hooks/useEditorState";

interface TemplateStreetProps {
    config: ThemeConfig;
    products: Product[];
    categories?: Category[];
    sellerId: string;
    storeName: string;
    pages?: Page[];
    promos?: Promo[];
    editor?: EditorStateReturn;
}

export function TemplateStreet({ config, products, categories = [], sellerId, storeName, pages = [], promos = [], editor }: TemplateStreetProps) {
    const { global, homeContent } = config;
    const { header, announcement, hero, productGrid, testimonials, about, footer } = homeContent;
    const { typography, spacing, animations } = global;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const popupPromo = getPopupPromo(promos);

    const headingSizeClass = { small: "text-3xl md:text-5xl", medium: "text-4xl md:text-6xl lg:text-7xl", large: "text-5xl md:text-7xl lg:text-8xl", xlarge: "text-6xl md:text-8xl lg:text-[10rem]" }[typography.headingSize];
    const bodySizeClass = { small: "text-sm", medium: "text-base", large: "text-lg" }[typography.bodySize];
    const sectionPaddingClass = { compact: "py-8 md:py-12", normal: "py-10 md:py-16", spacious: "py-16 md:py-24" }[spacing.sectionPadding];
    const heroHeightClass = { compact: "py-10 md:py-14", normal: "py-12 md:py-20", large: "py-20 md:py-32", fullscreen: "min-h-screen flex items-center" }[global.hero.height];
    const heroAlignClass = { left: "text-left", center: "text-center mx-auto", right: "text-right ml-auto" }[global.hero.contentAlign];
    const imageFilterStyle = { none: "", grayscale: "grayscale(100%)", sepia: "sepia(80%)", blur: "blur(3px)" }[global.hero.imageFilter];
    const animationDuration = { slow: "300ms", normal: "200ms", fast: "100ms" }[animations.animationSpeed];
    const gapClass = { small: "gap-2", medium: "gap-4", large: "gap-6" }[productGrid.gap];
    const textTransform = typography.headingTransform === "none" ? undefined : typography.headingTransform;

    const stickyClass = (announcement.enabled && announcement.sticky) || header.sticky ? "sticky top-0 z-50" : "";

    const getOverlayStyle = (): React.CSSProperties => {
        if (!hero.imageUrl) return {};
        if (hero.gradientEnabled) {
            const dirs = { left: "to right", right: "to left", top: "to bottom", bottom: "to top" };
            return { background: `linear-gradient(${dirs[hero.gradientDirection]}, ${global.colors.background}${Math.round(hero.overlayOpacity * 255).toString(16).padStart(2, "0")} 0%, transparent 60%)` };
        }
        return { backgroundColor: `rgba(0, 0, 0, ${hero.overlayOpacity})` };
    };

    return (
        <div className={`min-h-screen ${bodySizeClass}`} style={{ backgroundColor: global.colors.background, color: global.colors.text, fontFamily: `"${global.font}", Impact, sans-serif` }}>
            <div className={stickyClass}>
                {announcement.enabled && (
                    <div data-editable="container" data-editable-id="announcement-bar" data-editable-label="Barre d'annonce" className="py-2 px-4 text-center text-sm font-black uppercase tracking-wider" style={{ backgroundColor: announcement.backgroundColor, color: announcement.textColor }}>
                        {announcement.link ? <a href={announcement.link} className="hover:underline">{announcement.text}</a> : announcement.text}
                    </div>
                )}

                {header.visible && (
                    <header data-editable="container" data-editable-id="header-section" data-editable-label="Section Header" className="py-4 px-6" style={{ backgroundColor: global.colors.background, borderBottom: `3px solid ${global.colors.text}` }}>
                        <div className="max-w-6xl mx-auto flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {header.logoUrl ? (
                                    <img src={header.logoUrl} alt={storeName} style={{ width: header.logoSize || 44, height: header.logoSize || 44, boxShadow: `3px 3px 0 ${global.colors.text}` }} className="object-contain" />
                                ) : (
                                    <div data-editable="icon" data-editable-id="header-logo-icon" data-editable-label="Icône Logo" className="w-10 h-10 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity" style={{ backgroundColor: global.colors.primary, boxShadow: `3px 3px 0 ${global.colors.text}` }}>
                                        <Store className="w-5 h-5" style={{ color: global.colors.background }} />
                                    </div>
                                )}
                                {header.showStoreName && <span data-editable="title" data-editable-id="header-store-name" data-editable-label="Nom de la boutique" className="text-xl font-black uppercase hover:opacity-80 transition-opacity cursor-pointer" style={{ color: global.colors.text }}>{storeName}</span>}
                            </div>

                            {/* Navigation - Desktop */}
                            {pages.length > 0 && (
                                <nav className="hidden md:flex items-center gap-6">
                                    {pages.map((page) => (
                                        <Link key={page.id} href={`/${storeName}/${page.slug}`} className="text-sm font-bold uppercase hover:opacity-70 transition-opacity px-3 py-1" style={{ backgroundColor: `${global.colors.primary}30`, color: global.colors.text }}>{page.title}</Link>
                                    ))}
                                </nav>
                            )}

                            <div className="flex items-center gap-3">
                                {header.showProductCount && <span data-editable="button" data-editable-id="header-product-count" data-editable-label="Compteur drops" className="text-sm font-bold uppercase px-3 py-1 hidden sm:inline cursor-pointer hover:opacity-80 transition-opacity" style={{ backgroundColor: global.colors.text, color: global.colors.background }}>{products.length} drops</span>}
                                {pages.length > 0 && (
                                    <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ backgroundColor: global.colors.primary, color: global.colors.background }}>
                                        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Mobile Navigation */}
                        {mobileMenuOpen && pages.length > 0 && (
                            <nav className="md:hidden pt-4 mt-4 border-t-2" style={{ borderColor: global.colors.text }}>
                                <div className="flex flex-col gap-2">
                                    {pages.map((page) => (
                                        <Link key={page.id} href={`/${storeName}/${page.slug}`} className="text-sm font-bold uppercase py-3 px-2 hover:opacity-70 transition-opacity" style={{ backgroundColor: `${global.colors.primary}30`, color: global.colors.text }} onClick={() => setMobileMenuOpen(false)}>{page.title}</Link>
                                    ))}
                                </div>
                            </nav>
                        )}
                    </header>
                )}
            </div>

            {spacing.showSectionDividers && <div className="h-1" style={{ backgroundColor: global.colors.primary }} />}

            {hero.visible && (
                <section data-editable="container" data-editable-id="hero-section" data-editable-label="Section Hero" className="relative overflow-hidden">
                    {/* Background image with filter - separate from content */}
                    {hero.imageUrl && (
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundImage: `url(${hero.imageUrl})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                filter: imageFilterStyle || undefined
                            }}
                        />
                    )}
                    {hero.imageUrl && <div className="absolute inset-0" style={getOverlayStyle()} />}
                    <div className={`relative px-4 ${heroHeightClass}`} style={{ backgroundColor: "transparent" }}>
                        <div className={`mx-auto max-w-5xl ${heroAlignClass}`}>
                            <div className="mb-4 flex items-center gap-2">
                                <Zap className="h-6 w-6" style={{ color: global.colors.primary }} />
                                <span className="text-sm font-black uppercase tracking-wider" style={{ color: global.colors.primary }}>New Drop</span>
                            </div>
                            <span data-editable="title" data-editable-id="hero-title" className={`${headingSizeClass} font-black uppercase leading-[0.85] tracking-tighter mb-4`} style={{ color: hero.imageUrl ? "#fff" : global.hero.textColor, textShadow: `4px 4px 0 ${global.colors.primary}`, fontFamily: `"${global.headingFont}", Impact, sans-serif`, textTransform: textTransform || "uppercase" }}>
                                {hero.title || storeName}
                            </span>
                            {hero.subtitle && (
                                <span data-editable="paragraph" data-editable-id="hero-subtitle" className="text-xl md:text-2xl font-bold uppercase mb-8 max-w-xl" style={{ color: hero.imageUrl ? "#fff" : global.hero.textColor, opacity: 0.8 }}>
                                    {hero.subtitle}
                                </span>
                            )}
                            {hero.buttonText && (
                                <div data-editable="button" data-editable-id="hero-button">
                                    <HoverButton href={hero.buttonUrl || "#products"} text={hero.buttonText} bgColor={global.hero.buttonBg} textColor={global.hero.buttonText} hoverBg={global.buttons.hoverBg} borderColor={global.colors.text} borderRadius={global.borderRadius} buttonStyle={global.buttons.style} buttonSize={global.buttons.size} duration={animationDuration} />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="h-2" style={{ backgroundColor: global.colors.primary }} />
                </section>
            )}

            {spacing.showSectionDividers && <div className="h-1" style={{ backgroundColor: global.colors.primary }} />}

            <section id="products" data-editable="container" data-editable-id="products-section" data-editable-label="Section Produits" className={`${sectionPaddingClass} px-4`}>
                <div className="mx-auto max-w-6xl">
                    {productGrid.title && (
                        <div className="mb-8">
                            <div className="inline-block">
                                <span data-editable="title" data-editable-id="products-title" className={`${headingSizeClass} font-black uppercase tracking-tight`} style={{ color: global.colors.text, fontFamily: `"${global.headingFont}", Impact, sans-serif`, textTransform: textTransform || "uppercase" }}>
                                    {productGrid.title}
                                </span>
                                <div className="h-1 mt-2" style={{ backgroundColor: global.colors.primary }} />
                            </div>
                        </div>
                    )}

                    {/* Product Cards Style Editor - only visible in edit mode */}
                    {editor?.isEditing && (
                        <div
                            data-editable="productCard"
                            data-editable-id="product-cards-style"
                            data-editable-label="Style des cartes produit"
                            className="mb-6 p-3 text-center"
                            style={{ border: `3px dashed ${global.colors.primary}`, backgroundColor: `${global.colors.primary}10` }}
                        >
                            <span className="text-sm font-bold uppercase flex items-center justify-center gap-2" style={{ color: global.colors.primary }}>
                                🛍️ Cliquez pour personnaliser le style de toutes les cartes produit
                            </span>
                        </div>
                    )}

                    {products.length === 0 ? (
                        <div className="text-center py-16" style={{ border: `4px solid ${global.colors.text}`, boxShadow: `8px 8px 0 ${global.colors.primary}` }}>
                            <ShoppingBag className="h-20 w-20 mx-auto mb-4" style={{ color: global.colors.primary }} />
                            <p className="text-2xl font-black uppercase" style={{ color: global.colors.text }}>Coming Soon</p>
                        </div>
                    ) : (
                        <div className={`grid ${gapClass} ${productGrid.columns === 4 ? "grid-cols-2 lg:grid-cols-4" : productGrid.columns === 3 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"}`}>
                            {products.map((product) => {
                                const priceInfo = getDiscountedPrice(product, promos);
                                return <ProductCard key={product.id} product={product} sellerId={sellerId} storeName={storeName} styles={global} showDescription={productGrid.showDescription} showPrice={productGrid.showPrice} aspectRatio={productGrid.aspectRatio} textAlign="left" variant="street" showShadow={productGrid.cardShadow} discountedPrice={priceInfo.discountedPrice} hasDiscount={priceInfo.hasDiscount} />;
                            })}
                        </div>
                    )}
                </div>
            </section>

            {spacing.showSectionDividers && testimonials.visible && <div className="h-1" style={{ backgroundColor: global.colors.primary }} />}

            {/* Testimonials Section */}
            <Testimonials content={testimonials} styles={global} />

            {spacing.showSectionDividers && about.visible && <div className="h-1" style={{ backgroundColor: global.colors.primary }} />}

            {about.visible && (
                <section data-editable="container" data-editable-id="about-section" data-editable-label="Section À Propos" className={`${sectionPaddingClass} px-4`} style={{ backgroundColor: global.colors.primary }}>
                    <div className="mx-auto max-w-6xl">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            {about.imageUrl && about.imagePosition === "left" && <div data-editable="image" data-editable-id="about-image" data-editable-label="Image À Propos" className="relative aspect-square overflow-hidden" style={{ border: `4px solid ${global.colors.text}`, boxShadow: `8px 8px 0 ${global.colors.text}` }}><Image src={about.imageUrl} alt={about.title} fill className="object-cover" /></div>}
                            <div className={about.imagePosition === "left" ? "" : "order-first md:order-none"}>
                                <span data-editable="title" data-editable-id="about-title" className={`${headingSizeClass} font-black uppercase tracking-tight mb-6 block`} style={{ color: global.colors.background, fontFamily: `"${global.headingFont}", Impact, sans-serif`, textTransform: textTransform || "uppercase" }}>
                                    {about.title}
                                </span>
                                <p data-editable="paragraph" data-editable-id="about-text" className={`${bodySizeClass} font-medium leading-relaxed`} style={{ color: global.colors.background, opacity: 0.9 }}>{about.text}</p>
                            </div>
                            {about.imageUrl && about.imagePosition === "right" && <div data-editable="image" data-editable-id="about-image" data-editable-label="Image À Propos" className="relative aspect-square overflow-hidden" style={{ border: `4px solid ${global.colors.text}`, boxShadow: `8px 8px 0 ${global.colors.text}` }}><Image src={about.imageUrl} alt={about.title} fill className="object-cover" /></div>}
                        </div>
                    </div>
                </section>
            )}

            {spacing.showSectionDividers && <div className="h-1" style={{ backgroundColor: global.colors.primary }} />}

            <footer data-editable="container" data-editable-id="footer-section" data-editable-label="Section Footer" className="py-10" style={{ borderTop: `4px solid ${global.colors.text}`, backgroundColor: global.footer.backgroundColor }}>
                <div className="mx-auto max-w-6xl px-4">
                    <div className="flex flex-wrap items-center justify-between gap-6">
                        <p className="text-2xl font-black uppercase tracking-tight" style={{ color: global.footer.textColor }}>{storeName}</p>
                        {footer.showSocials && (
                            <div className="flex gap-4 flex-wrap">
                                {footer.instagram && <a href={`https://instagram.com/${footer.instagram}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-sm font-black uppercase transition-all hover:scale-105" style={{ backgroundColor: global.footer.accentColor, color: global.footer.backgroundColor }}>@{footer.instagram}</a>}
                                {footer.facebook && <a href={`https://facebook.com/${footer.facebook}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-sm font-black uppercase transition-all hover:scale-105" style={{ backgroundColor: global.footer.accentColor, color: global.footer.backgroundColor }}>Facebook</a>}
                                {footer.tiktok && <a href={`https://tiktok.com/@${footer.tiktok}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-sm font-black uppercase transition-all hover:scale-105" style={{ backgroundColor: global.footer.accentColor, color: global.footer.backgroundColor }}>TikTok</a>}
                                {footer.whatsapp && <a href={`https://wa.me/${footer.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-sm font-black uppercase transition-all hover:scale-105" style={{ backgroundColor: "#25D366", color: "#fff" }}>WhatsApp</a>}
                            </div>
                        )}
                    </div>
                    <span data-editable="paragraph" data-editable-id="footer-text" className="text-xs uppercase tracking-wider mt-6 block" style={{ color: global.footer.textColor, opacity: 0.7 }}>
                        {footer.text || `© ${new Date().getFullYear()} ${storeName} — All Rights Reserved`}
                    </span>
                </div>
            </footer>

            {/* Floating WhatsApp */}
            {config.floatingWhatsApp?.enabled && config.floatingWhatsApp?.phoneNumber && (
                <FloatingWhatsApp
                    phoneNumber={config.floatingWhatsApp.phoneNumber}
                    message={config.floatingWhatsApp.message}
                    position={config.floatingWhatsApp.position}
                />
            )}

            {/* Promo Popup */}
            {popupPromo && (
                <PromoPopup
                    config={{
                        enabled: true,
                        title: popupPromo.popup_title || `🎉 ${popupPromo.name}`,
                        message: popupPromo.popup_message || `Profitez de ${popupPromo.discount_type === "percentage" ? `-${popupPromo.discount_value}%` : `-${popupPromo.discount_value} TND`} !`,
                        buttonText: "J'en profite",
                        buttonUrl: "#products",
                        showOnce: true,
                    }}
                    storeId={sellerId}
                    primaryColor={global.colors.primary}
                />
            )}
        </div>
    );
}

function HoverButton({ href, text, bgColor, textColor, hoverBg, borderColor, borderRadius, buttonStyle, buttonSize, duration }: { href: string; text: string; bgColor: string; textColor: string; hoverBg: string; borderColor: string; borderRadius: string; buttonStyle: "solid" | "outline" | "ghost"; buttonSize: "small" | "medium" | "large"; duration: string }) {
    const [isHovered, setIsHovered] = useState(false);
    const sizeClasses = { small: "px-6 py-3 text-sm", medium: "px-8 py-4 text-base", large: "px-10 py-5 text-lg" }[buttonSize];

    const getStyles = (): React.CSSProperties => {
        const base: React.CSSProperties = { border: `3px solid ${borderColor}`, boxShadow: `6px 6px 0 ${borderColor}`, borderRadius, transition: `all ${duration}` };
        if (buttonStyle === "outline") return { ...base, backgroundColor: isHovered ? bgColor : "transparent", color: isHovered ? textColor : bgColor };
        if (buttonStyle === "ghost") return { ...base, backgroundColor: isHovered ? `${bgColor}30` : "transparent", color: bgColor, boxShadow: "none", border: "none" };
        return { ...base, backgroundColor: isHovered ? hoverBg : bgColor, color: textColor };
    };

    return <a href={href} className={`inline-block ${sizeClasses} font-black uppercase tracking-wider hover:scale-105 active:scale-95`} style={getStyles()} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>{text}</a>;
}
