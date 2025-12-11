"use client";

import { useState, useRef } from "react";
import { ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import type { Product, GlobalStyles } from "@/types";
import { CartDrawer } from "./CartDrawer";

interface ProductCardProps {
    product: Product;
    sellerId: string;
    storeName: string;
    styles: GlobalStyles;
    showDescription?: boolean;
    showPrice?: boolean;
    aspectRatio?: "square" | "portrait" | "landscape";
    textAlign?: "left" | "center";
    variant?: "minimal" | "luxe" | "street";
    showShadow?: boolean;
    discountedPrice?: number;
    hasDiscount?: boolean;
}

export function ProductCard({
    product,
    sellerId,
    storeName,
    styles,
    showDescription = false,
    showPrice = true,
    aspectRatio = "square",
    textAlign = "left",
    variant = "minimal",
    showShadow = true,
    discountedPrice,
    hasDiscount = false,
}: ProductCardProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const { cards, buttons, animations } = styles;

    // Touch swipe handling
    const touchStartX = useRef<number>(0);
    const touchEndX = useRef<number>(0);

    // Combine main image and additional images
    const allImages: string[] = [];
    if (product.image_url) allImages.push(product.image_url);
    if (product.images && Array.isArray(product.images)) {
        allImages.push(...product.images);
    }

    const hasMultipleImages = allImages.length > 1;

    const nextImage = (e?: React.MouseEvent | React.TouchEvent) => {
        e?.stopPropagation();
        e?.preventDefault();
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    };

    const prevImage = (e?: React.MouseEvent | React.TouchEvent) => {
        e?.stopPropagation();
        e?.preventDefault();
        setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

    // Touch handlers for swipe
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (!hasMultipleImages) return;

        const swipeThreshold = 50;
        const diff = touchStartX.current - touchEndX.current;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextImage();
            } else {
                prevImage();
            }
        }
    };

    const goToImage = (index: number) => {
        setCurrentImageIndex(index);
    };

    const aspectClass =
        aspectRatio === "square"
            ? "aspect-square"
            : aspectRatio === "portrait"
                ? "aspect-[3/4]"
                : "aspect-[4/3]";

    const isCenter = textAlign === "center";

    const getCardStyle = (): React.CSSProperties => {
        const animDuration = animations?.animationSpeed === "slow" ? "0.5s"
            : animations?.animationSpeed === "fast" ? "0.15s" : "0.3s";

        const base: React.CSSProperties = {
            backgroundColor: cards.backgroundColor,
            borderRadius: variant === "street" ? "0" : styles.borderRadius,
            transition: animations?.enableAnimations ? `all ${animDuration} ease` : "none",
        };

        // Apply hover effects
        let hoverStyles: React.CSSProperties = {};
        if (isHovered && animations?.enableAnimations) {
            switch (cards.hoverEffect) {
                case "lift":
                    hoverStyles = { transform: "translateY(-8px)", boxShadow: "0 12px 24px rgba(0,0,0,0.15)" };
                    break;
                case "zoom":
                    hoverStyles = { transform: "scale(1.03)" };
                    break;
                case "glow":
                    hoverStyles = { boxShadow: `0 0 24px ${styles.colors.primary}40` };
                    break;
                case "border":
                    hoverStyles = { borderColor: styles.colors.primary };
                    break;
            }
        }

        if (variant === "street") {
            return {
                ...base,
                border: `3px solid ${cards.borderColor}`,
                boxShadow: showShadow ? `4px 4px 0 ${cards.borderColor}` : "none",
                ...hoverStyles,
            };
        }

        if (variant === "luxe") {
            return {
                ...base,
                border: `1px solid ${cards.borderColor}`,
                boxShadow: showShadow ? "0 8px 32px rgba(0,0,0,0.12)" : "none",
                ...hoverStyles,
            };
        }

        return {
            ...base,
            border: cards.borderColor !== "transparent" ? `1px solid ${cards.borderColor}` : "none",
            boxShadow: showShadow ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
            ...hoverStyles,
        };
    };

    return (
        <div
            className="group overflow-hidden"
            style={getCardStyle()}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            data-editable-card="product-cards-style"
        >
            {/* Product Image with Carousel */}
            <div
                className={`relative ${aspectClass} overflow-hidden touch-pan-y`}
                style={{ backgroundColor: `${cards.textColor}08` }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {allImages.length > 0 ? (
                    <>
                        <Image
                            src={allImages[currentImageIndex]}
                            alt={product.title}
                            fill
                            className={`object-cover transition-transform duration-500 ${animations?.enableAnimations && isHovered ? "scale-110" : ""
                                }`}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            style={{ objectPosition: product.image_position || "center" }}
                            draggable={false}
                        />
                        {hasMultipleImages && (
                            <>
                                {/* Navigation arrows - visible on mobile, hover on desktop */}
                                <button
                                    onClick={prevImage}
                                    className="absolute left-1 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-70 md:opacity-0 md:group-hover:opacity-100 transition-opacity shadow-lg active:scale-95"
                                    style={{ color: cards.textColor }}
                                    aria-label="Image précédente"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-70 md:opacity-0 md:group-hover:opacity-100 transition-opacity shadow-lg active:scale-95"
                                    style={{ color: cards.textColor }}
                                    aria-label="Image suivante"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                                {/* Dots indicator - clickable */}
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 bg-black/20 backdrop-blur-sm rounded-full px-2 py-1">
                                    {allImages.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={(e) => { e.stopPropagation(); goToImage(idx); }}
                                            className={`rounded-full transition-all ${idx === currentImageIndex ? "bg-white w-4 h-2" : "bg-white/60 w-2 h-2"}`}
                                            aria-label={`Image ${idx + 1}`}
                                        />
                                    ))}
                                </div>
                                {/* Image counter badge */}
                                <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                                    {currentImageIndex + 1}/{allImages.length}
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <ShoppingBag
                            className="h-16 w-16"
                            style={{ color: cards.textColor, opacity: 0.15 }}
                        />
                    </div>
                )}
                {product.stock === 0 && (
                    <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ backgroundColor: `${cards.textColor}90` }}
                    >
                        <span
                            className="px-4 py-2 text-sm font-bold"
                            style={{
                                backgroundColor: cards.priceColor,
                                color: "#fff",
                                borderRadius: variant === "street" ? "0" : styles.borderRadius,
                            }}
                        >
                            ÉPUISÉ
                        </span>
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div
                className={`p-4 ${isCenter ? "text-center" : ""}`}
                style={{ backgroundColor: cards.backgroundColor }}
                data-card-info-box="product-cards-style"
            >
                <h3
                    className={`mb-1 line-clamp-2 ${variant === "luxe" ? "font-normal tracking-wide" : variant === "street" ? "font-black uppercase text-base" : "font-medium text-base"}`}
                    style={{ color: cards.textColor, fontFamily: variant === "luxe" ? `"${styles.headingFont}", serif` : undefined }}
                    data-card-title="product-cards-style"
                >
                    {product.title}
                </h3>

                {showDescription && product.description && (
                    <p
                        className="mb-2 text-sm line-clamp-2"
                        style={{ color: cards.textColor, opacity: 0.6 }}
                        data-card-description="product-cards-style"
                    >
                        {product.description}
                    </p>
                )}

                {showPrice && (
                    <div className={`mb-4 flex items-baseline gap-2 ${isCenter ? "justify-center" : ""}`}>
                        {hasDiscount && discountedPrice !== undefined ? (
                            <>
                                <span
                                    className={`font-bold ${variant === "street" ? "text-3xl" : "text-2xl"}`}
                                    style={{ color: cards.priceColor }}
                                    data-card-price="product-cards-style"
                                >
                                    {discountedPrice.toFixed(0)}
                                </span>
                                <span
                                    className="text-base line-through opacity-50"
                                    style={{ color: cards.textColor }}
                                >
                                    {product.price.toFixed(0)}
                                </span>
                                <span
                                    className="text-sm font-medium"
                                    style={{ color: cards.textColor, opacity: 0.5 }}
                                >
                                    TND
                                </span>
                            </>
                        ) : (
                            <>
                                <span
                                    className={`font-bold ${variant === "street" ? "text-3xl" : "text-2xl"}`}
                                    style={{ color: cards.priceColor }}
                                    data-card-price="product-cards-style"
                                >
                                    {product.price.toFixed(0)}
                                </span>
                                <span
                                    className="text-sm font-medium"
                                    style={{ color: cards.textColor, opacity: 0.5 }}
                                >
                                    TND
                                </span>
                            </>
                        )}
                    </div>
                )}

                <CartDrawer
                    product={product}
                    sellerId={sellerId}
                    storeName={storeName}
                    buttonStyles={buttons}
                    borderRadius={styles.borderRadius}
                />
            </div>
        </div>
    );
}
