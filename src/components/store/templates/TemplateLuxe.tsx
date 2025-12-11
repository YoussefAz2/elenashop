"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ThemeConfig, Product, Page, Promo, Category } from "@/types";
import { ProductCard } from "../ProductCard";
import { FloatingWhatsApp, PromoPopup } from "../common";
import { Testimonials } from "../common/Testimonials";
import { getDiscountedPrice, getPopupPromo } from "@/lib/promo";
import { ShoppingBag, Store, Menu, X } from "lucide-react";
import type { EditorStateReturn } from "@/hooks/useEditorState";

interface TemplateLuxeProps {
    config: ThemeConfig;
    products: Product[];
    categories?: Category[];
    sellerId: string;
    storeName: string;
    pages?: Page[];
    promos?: Promo[];
    editor?: EditorStateReturn;
}

export function TemplateLuxe({ config, products, categories = [], sellerId, storeName, pages = [], promos = [], editor }: TemplateLuxeProps) {
    const { global, homeContent } = config;
    const { header, announcement, hero, productGrid, testimonials, about, footer } = homeContent;
    const { typography, spacing, animations } = global;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const popupPromo = getPopupPromo(promos);

    const headingSizeClass = { small: "text-2xl md:text-4xl", medium: "text-3xl md:text-5xl", large: "text-4xl md:text-6xl lg:text-7xl", xlarge: "text-5xl md:text-7xl lg:text-8xl" }[typography.headingSize];
    const bodySizeClass = { small: "text-sm", medium: "text-base", large: "text-lg" }[typography.bodySize];
    const sectionPaddingClass = { compact: "py-14 md:py-20", normal: "py-20 md:py-32", spacious: "py-28 md:py-40" }[spacing.sectionPadding];
    const heroHeightClass = { compact: "min-h-[50vh]", normal: "min-h-[70vh]", large: "min-h-[85vh]", fullscreen: "min-h-screen" }[global.hero.height];
    const heroAlignClass = { left: "text-left items-start", center: "text-center items-center", right: "text-right items-end" }[global.hero.contentAlign];
    const imageFilterStyle = { none: "", grayscale: "grayscale(100%)", sepia: "sepia(80%)", blur: "blur(3px)" }[global.hero.imageFilter];
    const animationDuration = { slow: "500ms", normal: "300ms", fast: "150ms" }[animations.animationSpeed];
    const gapClass = { small: "gap-4 md:gap-6", medium: "gap-6 md:gap-8", large: "gap-8 md:gap-10" }[productGrid.gap];
    const textTransform = typography.headingTransform === "none" ? undefined : typography.headingTransform;

    const stickyClass = (announcement.enabled && announcement.sticky) || header.sticky ? "sticky top-0 z-50" : "";

    const getOverlayStyle = (): React.CSSProperties => {
        if (!hero.imageUrl) return { backgroundColor: global.hero.backgroundColor };
        if (hero.gradientEnabled) {
            const dirs = { left: "to right", right: "to left", top: "to bottom", bottom: "to top" };
            return { background: `linear-gradient(${dirs[hero.gradientDirection]}, rgba(0,0,0,${hero.overlayOpacity}) 0%, transparent 60%)` };
        }
        return { background: `radial-gradient(ellipse at center, rgba(0,0,0,${hero.overlayOpacity * 0.5}) 0%, rgba(0,0,0,${hero.overlayOpacity}) 100%)` };
    };

    return (
        <div className={`min-h-screen ${bodySizeClass}`} style={{ backgroundColor: global.colors.background, color: global.colors.text, fontFamily: `"${global.font}", Georgia, serif` }}>
            <div className={stickyClass}>
                {announcement.enabled && (
                    <div data-editable="container" data-editable-id="announcement-bar" data-editable-label="Barre d'annonce" className="py-2 px-4 text-center text-sm tracking-widest uppercase" style={{ backgroundColor: announcement.backgroundColor, color: announcement.textColor }}>
                        {announcement.link ? <a href={announcement.link} className="hover:opacity-80 transition-opacity">{announcement.text}</a> : announcement.text}
                    </div>
                )}

                {header.visible && (
                    <header data-editable="container" data-editable-id="header-section" data-editable-label="Section Header" className="py-6 px-8 backdrop-blur-md" style={{ backgroundColor: `${global.colors.background}ee`, borderBottom: `1px solid ${global.colors.primary}20` }}>
                        <div className="max-w-6xl mx-auto flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                {header.logoUrl ? (
                                    <img src={header.logoUrl} alt={storeName} style={{ width: header.logoSize || 48, height: header.logoSize || 48 }} className="object-contain" />
                                ) : (
                                    <Store data-editable="icon" data-editable-id="header-logo-icon" data-editable-label="Icône Logo" className="w-5 h-5 cursor-pointer hover:opacity-80 transition-opacity" style={{ color: global.colors.primary }} />
                                )}
                                {header.showStoreName && <span data-editable="title" data-editable-id="header-store-name" data-editable-label="Nom de la boutique" className="text-lg italic hover:opacity-80 transition-opacity cursor-pointer" style={{ color: global.colors.text, fontFamily: `"${global.headingFont}", Georgia, serif` }}>{storeName}</span>}
                            </div>

                            {/* Navigation - Desktop */}
                            {pages.length > 0 && (
                                <nav className="hidden md:flex items-center gap-8">
                                    {pages.map((page) => (
                                        <Link key={page.id} href={`/${storeName}/${page.slug}`} className="text-sm uppercase tracking-[0.15em] hover:opacity-70 transition-opacity" style={{ color: global.colors.text }}>{page.title}</Link>
                                    ))}
                                </nav>
                            )}

                            <div className="flex items-center gap-4">
                                {header.showProductCount && <span data-editable="title" data-editable-id="header-product-count" data-editable-label="Compteur produits" className="text-xs uppercase tracking-[0.2em] hidden sm:inline cursor-pointer hover:opacity-80 transition-opacity" style={{ color: global.colors.primary }}>{products.length} pièces</span>}
                                {pages.length > 0 && (
                                    <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ color: global.colors.primary }}>
                                        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Mobile Navigation */}
                        {mobileMenuOpen && pages.length > 0 && (
                            <nav className="md:hidden pt-6 pb-2 border-t mt-6" style={{ borderColor: `${global.colors.primary}20` }}>
                                <div className="flex flex-col gap-4 text-center">
                                    {pages.map((page) => (
                                        <Link key={page.id} href={`/${storeName}/${page.slug}`} className="text-sm uppercase tracking-[0.15em] py-2 hover:opacity-70 transition-opacity" style={{ color: global.colors.text }} onClick={() => setMobileMenuOpen(false)}>{page.title}</Link>
                                    ))}
                                </div>
                            </nav>
                        )}
                    </header>
                )}
            </div>

            {spacing.showSectionDividers && <div className="h-px" style={{ backgroundColor: `${global.colors.primary}30` }} />}

            {hero.visible && (
                <section data-editable="container" data-editable-id="hero-section" data-editable-label="Section Hero" className={`relative ${heroHeightClass} flex items-center justify-center overflow-hidden`}>
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
                    <div className="absolute top-8 left-8 right-8 bottom-8 pointer-events-none" style={{ border: `1px solid ${global.colors.primary}40` }} />
                    <div className={`relative z-10 mx-auto max-w-4xl px-8 flex flex-col ${heroAlignClass}`}>
                        <div className="mb-8">
                            <span data-editable="button" data-editable-id="hero-badge" data-editable-label="Badge Collection" className="inline-block px-6 py-1 text-xs uppercase tracking-[0.3em] font-medium cursor-pointer hover:opacity-80 transition-opacity" style={{ border: `1px solid ${hero.imageUrl ? "rgba(255,255,255,0.3)" : global.colors.primary}`, color: hero.imageUrl ? "#fff" : global.colors.primary }}>Collection</span>
                        </div>
                        <span data-editable="title" data-editable-id="hero-title" className={`${headingSizeClass} font-normal italic mb-6 tracking-tight`} style={{ color: hero.imageUrl ? "#fff" : global.hero.textColor, fontFamily: `"${global.headingFont}", Georgia, serif`, textTransform }}>
                            {hero.title || storeName}
                        </span>
                        {hero.subtitle && (
                            <span data-editable="paragraph" data-editable-id="hero-subtitle" className="text-xl md:text-2xl font-light italic mb-12 max-w-2xl" style={{ color: hero.imageUrl ? "rgba(255,255,255,0.8)" : global.hero.textColor, opacity: hero.imageUrl ? 1 : 0.7 }}>
                                {hero.subtitle}
                            </span>
                        )}
                        {hero.buttonText && (
                            <div data-editable="button" data-editable-id="hero-button">
                                <HoverButton href={hero.buttonUrl || "#products"} text={hero.buttonText} bgColor={global.hero.buttonBg} textColor={global.hero.buttonText} hoverBg={global.buttons.hoverBg} accentColor={global.colors.primary} buttonStyle={global.buttons.style} buttonSize={global.buttons.size} duration={animationDuration} />
                            </div>
                        )}
                    </div>
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2"><div className="w-px h-16 animate-pulse" style={{ backgroundColor: hero.imageUrl ? "rgba(255,255,255,0.3)" : `${global.colors.text}30` }} /></div>
                </section>
            )}

            {spacing.showSectionDividers && <div className="h-px" style={{ backgroundColor: `${global.colors.primary}30` }} />}

            <section id="products" data-editable="container" data-editable-id="products-section" data-editable-label="Section Produits" className={`${sectionPaddingClass} px-4`}>
                <div className="mx-auto max-w-6xl">
                    {productGrid.title && (
                        <div className={`mb-16 ${global.hero.contentAlign === "center" ? "text-center" : ""}`}>
                            <span data-editable="paragraph" data-editable-id="products-label" data-editable-label="Label Produits" className="text-sm uppercase tracking-[0.3em] mb-4 block cursor-pointer hover:opacity-80 transition-opacity" style={{ color: global.colors.primary }}>Découvrez</span>
                            <span data-editable="title" data-editable-id="products-title" className={`${headingSizeClass} font-normal italic tracking-tight`} style={{ color: global.colors.text, fontFamily: `"${global.headingFont}", Georgia, serif`, textTransform }}>
                                {productGrid.title}
                            </span>
                        </div>
                    )}

                    {/* Product Cards Style Editor - only visible in edit mode */}
                    {editor?.isEditing && (
                        <div
                            data-editable="productCard"
                            data-editable-id="product-cards-style"
                            data-editable-label="Style des cartes produit"
                            className="mb-6 p-3 text-center"
                            style={{ border: `1px dashed ${global.colors.primary}40` }}
                        >
                            <span className="text-sm flex items-center justify-center gap-2" style={{ color: global.colors.primary }}>
                                🛍️ Cliquez pour personnaliser le style de toutes les cartes produit
                            </span>
                        </div>
                    )}

                    {products.length === 0 ? (
                        <div className="text-center py-24" style={{ border: `1px solid ${global.colors.primary}30`, backgroundColor: `${global.colors.primary}05` }}>
                            <ShoppingBag className="h-16 w-16 mx-auto mb-4" style={{ color: global.colors.primary, opacity: 0.5 }} />
                            <p className="text-xl italic" style={{ color: global.colors.text, opacity: 0.6 }}>Collection à venir...</p>
                        </div>
                    ) : (
                        <div className={`grid ${gapClass} ${productGrid.columns === 4 ? "grid-cols-2 lg:grid-cols-4" : productGrid.columns === 3 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"}`}>
                            {products.map((product) => {
                                const priceInfo = getDiscountedPrice(product, promos);
                                return <ProductCard key={product.id} product={product} sellerId={sellerId} storeName={storeName} styles={global} showDescription={productGrid.showDescription} showPrice={productGrid.showPrice} aspectRatio={productGrid.aspectRatio} textAlign="center" variant="luxe" showShadow={productGrid.cardShadow} discountedPrice={priceInfo.discountedPrice} hasDiscount={priceInfo.hasDiscount} />;
                            })}
                        </div>
                    )}
                </div>
            </section>

            {spacing.showSectionDividers && testimonials.visible && <div className="h-px" style={{ backgroundColor: `${global.colors.primary}30` }} />}

            {/* Testimonials Section */}
            <Testimonials content={testimonials} styles={global} />

            {spacing.showSectionDividers && about.visible && <div className="h-px" style={{ backgroundColor: `${global.colors.primary}30` }} />}

            {about.visible && (
                <section data-editable="container" data-editable-id="about-section" data-editable-label="Section À Propos" className={`${sectionPaddingClass} px-4`} style={{ borderTop: `1px solid ${global.colors.primary}20` }}>
                    <div className="mx-auto max-w-6xl">
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            {about.imageUrl && about.imagePosition === "left" && <div data-editable="image" data-editable-id="about-image" data-editable-label="Image À Propos" className="relative aspect-[4/5] overflow-hidden" style={{ border: `1px solid ${global.colors.primary}30` }}><Image src={about.imageUrl} alt={about.title} fill className="object-cover" /></div>}
                            <div className={about.imagePosition === "left" ? "" : "order-first md:order-none"}>
                                <p className="text-sm uppercase tracking-[0.3em] mb-4" style={{ color: global.colors.primary }}>Notre Histoire</p>
                                <span data-editable="title" data-editable-id="about-title" className={`${headingSizeClass} font-normal italic tracking-tight mb-8 block`} style={{ color: global.colors.text, fontFamily: `"${global.headingFont}", Georgia, serif`, textTransform }}>
                                    {about.title}
                                </span>
                                <p data-editable="paragraph" data-editable-id="about-text" className={`${bodySizeClass} leading-relaxed italic`} style={{ color: global.colors.text, opacity: 0.7 }}>{about.text}</p>
                            </div>
                            {about.imageUrl && about.imagePosition === "right" && <div data-editable="image" data-editable-id="about-image" data-editable-label="Image À Propos" className="relative aspect-[4/5] overflow-hidden" style={{ border: `1px solid ${global.colors.primary}30` }}><Image src={about.imageUrl} alt={about.title} fill className="object-cover" /></div>}
                        </div>
                    </div>
                </section>
            )}

            {spacing.showSectionDividers && <div className="h-px" style={{ backgroundColor: `${global.colors.primary}30` }} />}

            <footer data-editable="container" data-editable-id="footer-section" data-editable-label="Section Footer" className="py-16" style={{ backgroundColor: global.footer.backgroundColor, borderTop: `1px solid ${global.colors.primary}30` }}>
                <div className="mx-auto max-w-6xl px-4 text-center">
                    <span data-editable="title" data-editable-id="footer-store-name" data-editable-label="Nom boutique footer" className="text-2xl italic mb-6 block cursor-pointer hover:opacity-80 transition-opacity" style={{ color: global.footer.accentColor, fontFamily: `"${global.headingFont}", Georgia, serif` }}>{storeName}</span>
                    {footer.showSocials && (footer.instagram || footer.facebook || footer.tiktok || footer.whatsapp) && (
                        <div data-editable="paragraph" data-editable-id="footer-social-links" data-editable-label="Liens réseaux" className="flex justify-center gap-8 mb-8 flex-wrap cursor-pointer hover:opacity-80 transition-opacity">
                            {footer.instagram && <a href={`https://instagram.com/${footer.instagram}`} target="_blank" rel="noopener noreferrer" className="text-sm uppercase tracking-[0.2em] transition-all hover:opacity-60" style={{ color: global.footer.textColor }}>Instagram</a>}
                            {footer.facebook && <a href={`https://facebook.com/${footer.facebook}`} target="_blank" rel="noopener noreferrer" className="text-sm uppercase tracking-[0.2em] transition-all hover:opacity-60" style={{ color: global.footer.textColor }}>Facebook</a>}
                            {footer.tiktok && <a href={`https://tiktok.com/@${footer.tiktok}`} target="_blank" rel="noopener noreferrer" className="text-sm uppercase tracking-[0.2em] transition-all hover:opacity-60" style={{ color: global.footer.textColor }}>TikTok</a>}
                            {footer.whatsapp && <a href={`https://wa.me/${footer.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-sm uppercase tracking-[0.2em] transition-all hover:opacity-60" style={{ color: global.footer.textColor }}>WhatsApp</a>}
                        </div>
                    )}
                    <span data-editable="paragraph" data-editable-id="footer-text" className="text-xs uppercase tracking-[0.2em]" style={{ color: global.footer.textColor, opacity: 0.6 }}>
                        {footer.text || `© ${new Date().getFullYear()} ${storeName}`}
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

function HoverButton({ href, text, bgColor, textColor, hoverBg, accentColor, buttonStyle, buttonSize, duration }: { href: string; text: string; bgColor: string; textColor: string; hoverBg: string; accentColor: string; buttonStyle: "solid" | "outline" | "ghost"; buttonSize: "small" | "medium" | "large"; duration: string }) {
    const [isHovered, setIsHovered] = useState(false);
    const sizeClasses = { small: "px-8 py-3 text-xs", medium: "px-10 py-4 text-sm", large: "px-12 py-5 text-base" }[buttonSize];

    const getStyles = (): React.CSSProperties => {
        const base: React.CSSProperties = { transition: `all ${duration}`, boxShadow: `0 0 40px ${accentColor}50` };
        if (buttonStyle === "outline") return { ...base, backgroundColor: isHovered ? bgColor : "transparent", color: isHovered ? textColor : bgColor, border: `1px solid ${bgColor}` };
        if (buttonStyle === "ghost") return { ...base, backgroundColor: isHovered ? `${bgColor}15` : "transparent", color: bgColor, boxShadow: "none" };
        return { ...base, backgroundColor: isHovered ? hoverBg : bgColor, color: textColor };
    };

    return <a href={href} className={`inline-block ${sizeClasses} uppercase tracking-[0.2em] font-medium`} style={getStyles()} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>{text}</a>;
}
