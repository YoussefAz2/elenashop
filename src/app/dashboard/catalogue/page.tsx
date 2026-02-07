import { createClient } from "@/utils/supabase/server";
import { getCurrentStore } from "@/utils/get-current-store";
import type { Product, Category } from "@/types";
import Link from "next/link";
import { Plus, Package, FolderOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CataloguePage() {
    const store = await getCurrentStore();
    const supabase = await createClient();

    const [productsRes, categoriesRes] = await Promise.all([
        supabase.from("products").select("*").eq("store_id", store.id).order("created_at", { ascending: false }),
        supabase.from("categories").select("*").eq("store_id", store.id).order("position"),
    ]);

    const products = (productsRes.data as Product[]) || [];
    const categories = (categoriesRes.data as Category[]) || [];

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 pb-8">
                <div>
                    <h1 className="text-4xl font-serif font-bold italic tracking-tight text-zinc-900 leading-tight">Catalogue</h1>
                    <p className="text-zinc-500 mt-2 text-lg font-medium">Gérez vos produits et catégories.</p>
                </div>
                <Link
                    href="/dashboard/products"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Nouveau produit
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
                <Link href="/dashboard/products" className="bg-white rounded-2xl border border-zinc-100 p-6 hover:shadow-lg hover:shadow-zinc-100 transition-all group">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                            <Package className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-3xl font-black text-zinc-900">{products.length}</p>
                            <p className="text-zinc-500 font-medium">Produits</p>
                        </div>
                    </div>
                </Link>
                <Link href="/dashboard/categories" className="bg-white rounded-2xl border border-zinc-100 p-6 hover:shadow-lg hover:shadow-zinc-100 transition-all group">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                            <FolderOpen className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-3xl font-black text-zinc-900">{categories.length}</p>
                            <p className="text-zinc-500 font-medium">Catégories</p>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Recent Products */}
            <div className="bg-white rounded-3xl border border-zinc-100 overflow-hidden">
                <div className="p-6 border-b border-zinc-50 flex items-center justify-between">
                    <h2 className="font-bold text-zinc-900 text-lg">Produits récents</h2>
                    <Link href="/dashboard/products" className="text-sm font-bold text-indigo-600 hover:text-indigo-700">
                        Voir tout →
                    </Link>
                </div>
                {products.length === 0 ? (
                    <div className="p-12 text-center">
                        <Package className="h-12 w-12 text-zinc-200 mx-auto mb-4" />
                        <p className="text-zinc-500">Aucun produit pour le moment</p>
                    </div>
                ) : (
                    <div className="divide-y divide-zinc-50">
                        {products.slice(0, 5).map((product) => (
                            <div key={product.id} className="p-4 flex items-center gap-4 hover:bg-zinc-50/50">
                                <div className="w-16 h-16 bg-zinc-100 rounded-xl overflow-hidden">
                                    {product.images && product.images[0] ? (
                                        <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Package className="h-6 w-6 text-zinc-300" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-zinc-900">{product.title}</p>
                                    <p className="text-sm text-zinc-500">{Number(product.price).toFixed(2)} TND</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-500'}`}>
                                    {product.is_active ? 'Actif' : 'Inactif'}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
