"use client";

import { useState } from "react";
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
    // Promo display
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
    const { cards, buttons } = styles;

    // Combine main image and additional images
    const allImages: string[] = [];
    if (product.image_url) allImages.push(product.image_url);
    if (product.images && Array.isArray(product.images)) {
        allImages.push(...product.images);
    }

    const hasMultipleImages = allImages.length > 1;

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

    const aspectClass =
        aspectRatio === "square"
            ? "aspect-square"
            : aspectRatio === "portrait"
                ? "aspect-[3/4]"
                : "aspect-[4/3]";

    const isCenter = textAlign === "center";

    // Variant-specific shadow/border styling
    const getCardStyle = () => {
        const base: React.CSSProperties = {
            backgroundColor: cards.backgroundColor,
            borderRadius: variant === "street" ? "0" : styles.borderRadius,
        };

        if (variant === "street") {
            return {
                ...base,
                border: `3px solid ${cards.borderColor}`,
                boxShadow: showShadow ? `4px 4px 0 ${cards.borderColor}` : "none",
            };
        }

        if (variant === "luxe") {
            return {
                ...base,
                border: `1px solid ${cards.borderColor}`,
                boxShadow: showShadow ? "0 8px 32px rgba(0,0,0,0.12)" : "none",
            };
        }

        // minimal
        return {
            ...base,
            border: cards.borderColor !== "transparent" ? `1px solid ${cards.borderColor}` : "none",
            boxShadow: showShadow ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
        };
    };

    return (
        <div
            className="group overflow-hidden transition-all duration-300 hover:-translate-y-1"
            style={getCardStyle()}
        >
            {/* Product Image with Carousel */}
            <div
                className={`relative ${aspectClass} overflow-hidden`}
                style={{ backgroundColor: `${cards.textColor}08` }}
            >
                {allImages.length > 0 ? (
                    <>
                        <Image
                            src={allImages[currentImageIndex]}
                            alt={product.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            style={{ objectPosition: product.image_position || "center" }}
                        />
                        {hasMultipleImages && (
                            <>
                                {/* Navigation arrows */}
                                <button
                                    onClick={prevImage}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                    style={{ color: cards.textColor }}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                    style={{ color: cards.textColor }}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                                {/* Dots indicator */}
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                                    {allImages.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentImageIndex ? "bg-white w-3" : "bg-white/60"}`}
                                        />
                                    ))}
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
            >
                <h3
                    className={`mb-1 line-clamp-2 ${variant === "luxe" ? "font-normal tracking-wide" : variant === "street" ? "font-black uppercase text-base" : "font-medium text-base"}`}
                    style={{ color: cards.textColor, fontFamily: variant === "luxe" ? `"${styles.headingFont}", serif` : undefined }}
                >
                    {product.title}
                </h3>

                {showDescription && product.description && (
                    <p
                        className="mb-2 text-sm line-clamp-2"
                        style={{ color: cards.textColor, opacity: 0.6 }}
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
