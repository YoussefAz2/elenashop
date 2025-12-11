"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ThemeConfig, Product, Page, Promo, Category } from "@/types";
import { ProductCard } from "../ProductCard";
import { FloatingWhatsApp, PromoPopup } from "../common";
import { Testimonials } from "../common/Testimonials";
import { getDiscountedPrice, getPopupPromo } from "@/lib/promo";
import { ShoppingBag, Instagram, Facebook, Phone, Store, Menu, X } from "lucide-react";
import type { EditorStateReturn } from "@/hooks/useEditorState";

interface TemplateMinimalProps {
    config: ThemeConfig;
    products: Product[];
    categories?: Category[];
    sellerId: string;
    storeName: string;
    pages?: Page[];
    promos?: Promo[];
    // Visual Editor V2
    editor?: EditorStateReturn;
}

export function TemplateMinimal({
    config,
    products,
    categories = [],
    sellerId,
    storeName,
    pages = [],
    promos = [],
    editor,
}: TemplateMinimalProps) {
    const { global, homeContent } = config;
    const { header, announcement, hero, productGrid, testimonials, about, footer } = homeContent;
    const { typography, spacing, animations } = global;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const popupPromo = getPopupPromo(promos);

    // Typography classes
    const headingSizeClass = {
        small: "text-2xl md:text-3xl",
        medium: "text-3xl md:text-4xl",
        large: "text-4xl md:text-5xl lg:text-6xl",
        xlarge: "text-5xl md:text-6xl lg:text-7xl",
    }[typography.headingSize];

    const bodySizeClass = {
        small: "text-sm",
        medium: "text-base",
        large: "text-lg",
    }[typography.bodySize];

    // Spacing classes
    const sectionPaddingClass = {
        compact: "py-10 md:py-14",
        normal: "py-16 md:py-24",
        spacious: "py-24 md:py-36",
    }[spacing.sectionPadding];

    // Hero height
    const heroHeightClass = {
        compact: "py-16 md:py-20",
        normal: "py-20 md:py-32",
        large: "py-32 md:py-48",
        fullscreen: "min-h-screen flex items-center",
    }[global.hero.height];

    // Hero alignment
    const heroAlignClass = {
        left: "text-left items-start",
        center: "text-center items-center",
        right: "text-right items-end",
    }[global.hero.contentAlign];

    // Image filter
    const imageFilterStyle = {
        none: "",
        grayscale: "grayscale(100%)",
        sepia: "sepia(80%)",
        blur: "blur(3px)",
    }[global.hero.imageFilter];

    // Animation speed
    const animationDuration = {
        slow: "500ms",
        normal: "300ms",
        fast: "150ms",
    }[animations.animationSpeed];

    // Grid gap
    const gapClass = {
        small: "gap-3 md:gap-4",
        medium: "gap-4 md:gap-6",
        large: "gap-6 md:gap-8",
    }[productGrid.gap];

    const getOverlayStyle = (): React.CSSProperties => {
        if (!hero.imageUrl) return {};
        if (hero.gradientEnabled) {
            const dirs = { left: "to right", right: "to left", top: "to bottom", bottom: "to top" };
            return { background: `linear-gradient(${dirs[hero.gradientDirection]}, rgba(0,0,0,${hero.overlayOpacity}) 0%, transparent 60%)` };
        }
        return { backgroundColor: `rgba(0, 0, 0, ${hero.overlayOpacity})` };
    };

    const textTransform = typography.headingTransform === "none" ? undefined : typography.headingTransform;

    // Sticky wrapper for announcement + header
    const stickyClass = (announcement.enabled && announcement.sticky) || header.sticky ? "sticky top-0 z-50" : "";

    return (
        <div
            className={`min-h-screen ${bodySizeClass}`}
            style={{
                backgroundColor: global.colors.background,
                color: global.colors.text,
                fontFamily: `"${global.font}", system-ui, sans-serif`,
            }}
        >
            {/* Sticky wrapper for announcement + header */}
            <div className={stickyClass}>
                {/* Announcement Banner */}
                {announcement.enabled && (
                    <div data-editable="container" data-editable-id="announcement-bar" data-editable-label="Barre d'annonce" className="py-2 px-4 text-center text-sm" style={{ backgroundColor: announcement.backgroundColor, color: announcement.textColor }}>
                        {announcement.link ? <a href={announcement.link} className="hover:underline">{announcement.text}</a> : announcement.text}
                    </div>
                )}

                {/* Header */}
                {header.visible && (
                    <header
                        data-editable="container" data-editable-id="header-section" data-editable-label="Section Header"
                        className="py-4 px-6 border-b backdrop-blur-md"
                        style={{ backgroundColor: `${global.colors.background}ee`, borderColor: `${global.colors.text}15` }}
                    >
                        <div className="max-w-6xl mx-auto flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {header.logoUrl ? (
                                    <img src={header.logoUrl} alt={storeName} style={{ width: header.logoSize || 40, height: header.logoSize || 40 }} className="object-contain rounded" />
                                ) : (
                                    <div data-editable="icon" data-editable-id="header-logo-icon" data-editable-label="Icône Logo" className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity" style={{ backgroundColor: `${global.colors.primary}15` }}>
                                        <Store className="w-4 h-4" style={{ color: global.colors.primary }} />
                                    </div>
                                )}
                                {header.showStoreName && <span data-editable="title" data-editable-id="header-store-name" data-editable-label="Nom de la boutique" className="font-medium hover:opacity-80 transition-opacity cursor-pointer" style={{ color: global.colors.text }}>{storeName}</span>}
                            </div>

                            {/* Navigation Links - Desktop */}
                            {pages.length > 0 && (
                                <nav className="hidden md:flex items-center gap-6">
                                    {pages.map((page) => (
                                        <Link
                                            key={page.id}
                                            href={`/${storeName}/${page.slug}`}
                                            className="text-sm hover:opacity-70 transition-opacity"
                                            style={{ color: global.colors.text }}
                                        >
                                            {page.title}
                                        </Link>
                                    ))}
                                </nav>
                            )}

                            <div className="flex items-center gap-4">
                                {header.showProductCount && <span data-editable="title" data-editable-id="header-product-count" data-editable-label="Compteur produits" className="text-sm hidden sm:inline cursor-pointer hover:opacity-80 transition-opacity" style={{ color: global.colors.text, opacity: 0.6 }}>{products.length} produits</span>}

                                {/* Mobile menu button */}
                                {pages.length > 0 && (
                                    <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ color: global.colors.text }}>
                                        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Mobile Navigation */}
                        {mobileMenuOpen && pages.length > 0 && (
                            <nav className="md:hidden pt-4 pb-2 border-t mt-4" style={{ borderColor: `${global.colors.text}15` }}>
                                <div className="flex flex-col gap-3">
                                    {pages.map((page) => (
                                        <Link
                                            key={page.id}
                                            href={`/${storeName}/${page.slug}`}
                                            className="text-sm py-2 hover:opacity-70 transition-opacity"
                                            style={{ color: global.colors.text }}
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {page.title}
                                        </Link>
                                    ))}
                                </div>
                            </nav>
                        )}
                    </header>
                )}
            </div>

            {/* Section Divider */}
            {(spacing.showSectionDividers || editor?.isEditing) && <div data-editable="divider" data-editable-id="divider-header" data-editable-label="Séparateur Header" className="h-px" style={{ backgroundColor: `${global.colors.text}15` }} />}

            {/* Hero */}
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
                                filter: imageFilterStyle || undefined,
                            }}
                        />
                    )}
                    {/* Overlay */}
                    {hero.imageUrl && <div className="absolute inset-0" style={getOverlayStyle()} />}
                    {/* Content - no filter */}
                    <div
                        className={`relative px-6 ${heroHeightClass}`}
                        style={{ backgroundColor: "transparent" }}
                    >
                        <div className={`mx-auto max-w-2xl flex flex-col ${heroAlignClass}`}>
                            <div className="w-12 h-px mb-8" style={{ backgroundColor: hero.imageUrl ? "#fff" : global.hero.buttonBg }} />
                            <span data-editable="title" data-editable-id="hero-title" className={`${headingSizeClass} font-light tracking-tight mb-4`} style={{ color: hero.imageUrl ? "#fff" : global.hero.textColor, fontFamily: `"${global.headingFont}", system-ui, sans-serif`, textTransform }}>
                                {hero.title || storeName}
                            </span>
                            {(hero.subtitle || editor?.isEditing) && (
                                <span data-editable="paragraph" data-editable-id="hero-subtitle" className="text-lg md:text-xl font-light mb-10 max-w-lg" style={{ color: hero.imageUrl ? "rgba(255,255,255,0.85)" : global.hero.textColor, opacity: hero.imageUrl ? 1 : 0.7 }}>
                                    {hero.subtitle || "[Sous-titre]"}
                                </span>
                            )}
                            {(hero.buttonText || editor?.isEditing) && (
                                <div data-editable="button" data-editable-id="hero-button">
                                    <HoverButton
                                        href={hero.buttonUrl || "#products"}
                                        text={hero.buttonText || "[Bouton]"}
                                        bgColor={editor?.overrides?.["hero-button"]?.backgroundColor || (hero.imageUrl ? "#fff" : global.hero.buttonBg)}
                                        textColor={editor?.overrides?.["hero-button"]?.color || (hero.imageUrl ? global.colors.text : global.hero.buttonText)}
                                        hoverBg={global.buttons.hoverBg}
                                        borderRadius={editor?.overrides?.["hero-button"]?.borderRadius || global.borderRadius}
                                        buttonStyle={global.buttons.style}
                                        buttonSize={global.buttons.size}
                                        duration={animationDuration}
                                        borderColor={global.colors.text}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Section Divider */}
            {(spacing.showSectionDividers || editor?.isEditing) && <div data-editable="divider" data-editable-id="divider-hero" data-editable-label="Séparateur Hero" className="h-px" style={{ backgroundColor: `${global.colors.text}15` }} />}

            {/* Products - Grouped by Category */}
            <section id="products" data-editable="container" data-editable-id="products-section" data-editable-label="Section Produits" className={`${sectionPaddingClass} px-4`}>
                <div className="mx-auto max-w-6xl">
                    {productGrid.title && (
                        <div className={`mb-12 ${global.hero.contentAlign === "center" ? "text-center" : ""}`}>
                            <span data-editable="title" data-editable-id="products-title" className={`${headingSizeClass} font-light tracking-tight`} style={{ color: global.colors.text, fontFamily: `"${global.headingFont}", system-ui, sans-serif`, textTransform }}>
                                {productGrid.title}
                            </span>
                            <div className="w-8 h-px mt-4 mx-auto" style={{ backgroundColor: global.colors.primary }} />
                        </div>
                    )}

                    {/* Product Cards Style Editor - only visible in edit mode */}
                    {editor?.isEditing && (
                        <div
                            data-editable="productCard"
                            data-editable-id="product-cards-style"
                            data-editable-label="Style des cartes produit"
                            className="mb-6 p-3 text-center"
                        >
                            <span className="text-sm text-slate-500 flex items-center justify-center gap-2">
                                🛍️ Cliquez pour personnaliser le style de toutes les cartes produit
                            </span>
                        </div>
                    )}
                    {products.length === 0 ? (
                        <div className="text-center py-20">
                            <ShoppingBag className="h-12 w-12 mx-auto mb-4" style={{ color: global.colors.text, opacity: 0.2 }} />
                            <p style={{ color: global.colors.text, opacity: 0.5 }}>Aucun produit disponible</p>
                        </div>
                    ) : categories.length > 0 ? (
                        // Group products by category
                        <div className="space-y-16">
                            {categories.map((category) => {
                                const categoryProducts = products.filter(p => p.category_id === category.id);
                                if (categoryProducts.length === 0) return null;
                                return (
                                    <div key={category.id} id={`category-${category.slug}`}>
                                        <h3
                                            className="text-xl md:text-2xl font-medium mb-6"
                                            style={{ color: global.colors.text, fontFamily: `"${global.headingFont}", system-ui, sans-serif` }}
                                        >
                                            {category.name}
                                        </h3>
                                        <div className={`grid ${gapClass} ${productGrid.columns === 4 ? "grid-cols-2 lg:grid-cols-4" : productGrid.columns === 3 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"}`}>
                                            {categoryProducts.map((product) => {
                                                const priceInfo = getDiscountedPrice(product, promos);
                                                return (
                                                    <ProductCard
                                                        key={product.id}
                                                        product={product}
                                                        sellerId={sellerId}
                                                        storeName={storeName}
                                                        styles={global}
                                                        showDescription={productGrid.showDescription}
                                                        showPrice={productGrid.showPrice}
                                                        aspectRatio={productGrid.aspectRatio}
                                                        textAlign="left"
                                                        variant="minimal"
                                                        showShadow={productGrid.cardShadow}
                                                        discountedPrice={priceInfo.discountedPrice}
                                                        hasDiscount={priceInfo.hasDiscount}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                            {/* Uncategorized products */}
                            {(() => {
                                const uncategorized = products.filter(p => !p.category_id);
                                if (uncategorized.length === 0) return null;
                                return (
                                    <div>
                                        {categories.length > 0 && (
                                            <h3
                                                className="text-xl md:text-2xl font-medium mb-6"
                                                style={{ color: global.colors.text, fontFamily: `"${global.headingFont}", system-ui, sans-serif` }}
                                            >
                                                Autres produits
                                            </h3>
                                        )}
                                        <div className={`grid ${gapClass} ${productGrid.columns === 4 ? "grid-cols-2 lg:grid-cols-4" : productGrid.columns === 3 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"}`}>
                                            {uncategorized.map((product) => {
                                                const priceInfo = getDiscountedPrice(product, promos);
                                                return (
                                                    <ProductCard
                                                        key={product.id}
                                                        product={product}
                                                        sellerId={sellerId}
                                                        storeName={storeName}
                                                        styles={global}
                                                        showDescription={productGrid.showDescription}
                                                        showPrice={productGrid.showPrice}
                                                        aspectRatio={productGrid.aspectRatio}
                                                        textAlign="left"
                                                        variant="minimal"
                                                        showShadow={productGrid.cardShadow}
                                                        discountedPrice={priceInfo.discountedPrice}
                                                        hasDiscount={priceInfo.hasDiscount}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    ) : (
                        // No categories - show all products in single grid
                        <div className={`grid ${gapClass} ${productGrid.columns === 4 ? "grid-cols-2 lg:grid-cols-4" : productGrid.columns === 3 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"}`}>
                            {products.map((product) => {
                                const priceInfo = getDiscountedPrice(product, promos);
                                return (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        sellerId={sellerId}
                                        storeName={storeName}
                                        styles={global}
                                        showDescription={productGrid.showDescription}
                                        showPrice={productGrid.showPrice}
                                        aspectRatio={productGrid.aspectRatio}
                                        textAlign="left"
                                        variant="minimal"
                                        showShadow={productGrid.cardShadow}
                                        discountedPrice={priceInfo.discountedPrice}
                                        hasDiscount={priceInfo.hasDiscount}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* Section Divider */}
            {(spacing.showSectionDividers || editor?.isEditing) && testimonials.visible && <div data-editable="divider" data-editable-id="divider-products" data-editable-label="Séparateur Produits" className="h-px" style={{ backgroundColor: `${global.colors.text}15` }} />}

            {/* Testimonials Section */}
            <Testimonials content={testimonials} styles={global} />

            {/* Section Divider */}
            {spacing.showSectionDividers && (about.visible || editor?.isEditing) && <div data-editable="divider" data-editable-id="divider-testimonials" data-editable-label="Séparateur Témoignages" className="h-px" style={{ backgroundColor: `${global.colors.text}15` }} />}

            {/* About Section */}
            {(about.visible || editor?.isEditing) && (
                <section data-editable="container" data-editable-id="about-section" data-editable-label="Section À Propos" className={`${sectionPaddingClass} px-4`} style={{ backgroundColor: `${global.colors.text}05` }}>
                    <div className="mx-auto max-w-6xl">
                        <div className={`grid md:grid-cols-2 gap-12 items-center`}>
                            {about.imageUrl && about.imagePosition === "left" && (
                                <div data-editable="image" data-editable-id="about-image" data-editable-label="Image À Propos" className="relative aspect-square rounded-lg overflow-hidden" style={{ borderRadius: global.borderRadius }}>
                                    <Image src={about.imageUrl} alt={about.title} fill className="object-cover" />
                                </div>
                            )}
                            <div className={about.imagePosition === "left" ? "" : "order-first md:order-none"}>
                                <span data-editable="title" data-editable-id="about-title" className={`${headingSizeClass} font-light tracking-tight mb-6 block`} style={{ color: global.colors.text, fontFamily: `"${global.headingFont}", system-ui, sans-serif`, textTransform }}>
                                    {about.title || "[Titre À Propos]"}
                                </span>
                                <span data-editable="paragraph" data-editable-id="about-text" className={`${bodySizeClass} leading-relaxed block`} style={{ color: global.colors.text, opacity: 0.7 }}>
                                    {about.text || "[Texte À Propos]"}
                                </span>
                            </div>
                            {about.imageUrl && about.imagePosition === "right" && (
                                <div data-editable="image" data-editable-id="about-image" data-editable-label="Image À Propos" className="relative aspect-square rounded-lg overflow-hidden" style={{ borderRadius: global.borderRadius }}>
                                    <Image src={about.imageUrl} alt={about.title} fill className="object-cover" />
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Section Divider */}
            {(spacing.showSectionDividers || editor?.isEditing) && <div data-editable="divider" data-editable-id="divider-about" data-editable-label="Séparateur À propos" className="h-px" style={{ backgroundColor: `${global.colors.text}15` }} />}

            {/* Footer */}
            <footer data-editable="container" data-editable-id="footer-section" data-editable-label="Section Footer" className="py-12" style={{ backgroundColor: global.footer.backgroundColor, borderTop: `1px solid ${global.colors.text}10` }}>
                <div className="mx-auto max-w-6xl px-4 text-center">
                    {footer.showSocials && (footer.instagram || footer.facebook || footer.tiktok || footer.whatsapp) && (
                        <div data-editable="icon" data-editable-id="footer-social-icons" data-editable-label="Icônes réseaux" className="flex justify-center gap-6 mb-6">
                            {footer.instagram && <a href={`https://instagram.com/${footer.instagram}`} target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-60" style={{ color: global.footer.accentColor }}><Instagram className="h-5 w-5" /></a>}
                            {footer.facebook && <a href={`https://facebook.com/${footer.facebook}`} target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-60" style={{ color: global.footer.accentColor }}><Facebook className="h-5 w-5" /></a>}
                            {footer.tiktok && <a href={`https://tiktok.com/@${footer.tiktok}`} target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-60 font-bold text-sm" style={{ color: global.footer.accentColor }}>TikTok</a>}
                            {footer.whatsapp && <a href={`https://wa.me/${footer.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-60" style={{ color: global.footer.accentColor }}><Phone className="h-5 w-5" /></a>}
                        </div>
                    )}
                    <span data-editable="paragraph" data-editable-id="footer-text" className="text-sm" style={{ color: global.footer.textColor }}>
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

function HoverButton({
    href, text, bgColor, textColor, hoverBg, borderRadius, buttonStyle, buttonSize, duration, borderColor,
}: {
    href: string; text: string; bgColor: string; textColor: string; hoverBg: string; borderRadius: string;
    buttonStyle: "solid" | "outline" | "ghost"; buttonSize: "small" | "medium" | "large"; duration: string; borderColor: string;
}) {
    const [isHovered, setIsHovered] = useState(false);
    const sizeClasses = { small: "px-4 py-2 text-xs", medium: "px-6 py-3 text-sm", large: "px-8 py-4 text-base" }[buttonSize];

    const getStyles = (): React.CSSProperties => {
        if (buttonStyle === "outline") {
            return { backgroundColor: isHovered ? bgColor : "transparent", color: isHovered ? textColor : bgColor, border: `2px solid ${bgColor}`, borderRadius, transition: `all ${duration}` };
        }
        if (buttonStyle === "ghost") {
            return { backgroundColor: isHovered ? `${bgColor}15` : "transparent", color: bgColor, borderRadius, transition: `all ${duration}` };
        }
        return { backgroundColor: isHovered ? hoverBg : bgColor, color: textColor, borderRadius, transition: `all ${duration}` };
    };

    return (
        <a href={href} className={`inline-block ${sizeClasses} font-medium tracking-wide`} style={getStyles()} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            {text}
        </a>
    );
}
