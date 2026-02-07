import { createClient } from "@/utils/supabase/server";
import { getCurrentStore } from "@/utils/get-current-store";
import type { Category } from "@/types";
import { FolderOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
    const store = await getCurrentStore();
    const supabase = await createClient();

    const { data } = await supabase
        .from("categories")
        .select("*")
        .eq("store_id", store.id)
        .order("position");

    const categories = (data as Category[]) || [];

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="border-b border-zinc-100 pb-8">
                <h1 className="text-4xl font-serif font-bold italic tracking-tight text-zinc-900 leading-tight">Catégories</h1>
                <p className="text-zinc-500 mt-2 text-lg font-medium">Organisez vos produits par catégorie.</p>
            </div>

            {/* Categories List */}
            {categories.length === 0 ? (
                <div className="bg-white rounded-3xl border border-zinc-100 p-12 text-center">
                    <div className="w-20 h-20 bg-zinc-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-zinc-100">
                        <FolderOpen className="h-10 w-10 text-zinc-300" />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 mb-2">Aucune catégorie</h3>
                    <p className="text-zinc-500 max-w-md mx-auto">
                        Créez des catégories pour organiser vos produits.
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-zinc-100 overflow-hidden divide-y divide-zinc-50">
                    {categories.map((category) => (
                        <div key={category.id} className="p-6 hover:bg-zinc-50/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                                    <FolderOpen className="h-6 w-6 text-purple-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-zinc-900">{category.name}</p>
                                    {category.description && (
                                        <p className="text-sm text-zinc-500 mt-1">{category.description}</p>
                                    )}
                                </div>
                                <span className="text-sm text-zinc-400 font-mono">
                                    Position: {category.position}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
