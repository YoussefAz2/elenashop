import type { Product, Promo } from "@/types";

/**
 * Calculate the discounted price for a product based on active promos
 */
export function getDiscountedPrice(
    product: Product,
    promos: Promo[]
): { originalPrice: number; discountedPrice: number; discount: number; hasDiscount: boolean } {
    const originalPrice = product.price;

    // Find applicable promo (priority: product > category > global)
    const productPromo = promos.find(
        p => p.is_active && p.scope === "product" && p.product_ids?.includes(product.id)
    );

    const categoryPromo = promos.find(
        p => p.is_active && p.scope === "category" && p.category_id === product.category_id
    );

    const globalPromo = promos.find(
        p => p.is_active && p.scope === "global"
    );

    const activePromo = productPromo || categoryPromo || globalPromo;

    if (!activePromo) {
        return { originalPrice, discountedPrice: originalPrice, discount: 0, hasDiscount: false };
    }

    let discountedPrice: number;
    let discount: number;

    if (activePromo.discount_type === "percentage") {
        discount = (originalPrice * activePromo.discount_value) / 100;
        discountedPrice = originalPrice - discount;
    } else {
        discount = activePromo.discount_value;
        discountedPrice = Math.max(0, originalPrice - discount);
    }

    return {
        originalPrice,
        discountedPrice: Math.round(discountedPrice * 100) / 100,
        discount: Math.round(discount * 100) / 100,
        hasDiscount: true,
    };
}

/**
 * Get the active promo that should show a popup
 */
export function getPopupPromo(promos: Promo[]): Promo | null {
    return promos.find(p => p.is_active && p.show_popup) || null;
}

/**
 * Format discount display text
 */
export function formatDiscount(promo: Promo): string {
    if (promo.discount_type === "percentage") {
        return `-${promo.discount_value}%`;
    }
    return `-${promo.discount_value} TND`;
}
