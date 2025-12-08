"use client";

import dynamic from "next/dynamic";
import type { Profile, Product, Category } from "@/types";
import { Loader2 } from "lucide-react";

const ProductsClient = dynamic(
    () => import("@/components/dashboard/products-client").then(mod => mod.ProductsClient),
    {
        ssr: false,
        loading: () => (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
        )
    }
);

interface ProductsWrapperProps {
    seller: Profile;
    products: Product[];
    categories: Category[];
}

export function ProductsWrapper({ seller, products, categories }: ProductsWrapperProps) {
    return <ProductsClient seller={seller} products={products} categories={categories} />;
}

