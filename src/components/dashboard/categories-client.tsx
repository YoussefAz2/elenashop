"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import type { Profile, Category } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    ArrowLeft,
    Plus,
    FolderOpen,
    Pencil,
    Trash2,
    GripVertical,
    Loader2,
} from "lucide-react";
import Link from "next/link";

interface CategoriesClientProps {
    seller: Profile;
    categories: Category[];
}

export function CategoriesClient({ seller, categories: initialCategories }: CategoriesClientProps) {
    const [categories, setCategories] = useState(initialCategories);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const supabase = createClient();

    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsLoading(true);
        setError(null);

        try {
            if (editingCategory) {
                // Update existing category
                const { error: updateError } = await supabase
                    .from("categories")
                    .update({ name: name.trim(), slug: generateSlug(name) })
                    .eq("id", editingCategory.id);

                if (updateError) throw updateError;

                setCategories(categories.map(c =>
                    c.id === editingCategory.id ? { ...c, name: name.trim(), slug: generateSlug(name) } : c
                ));
            } else {
                // Create new category
                const { data: newCategory, error: insertError } = await supabase
                    .from("categories")
                    .insert({
                        store_id: seller.id,
                        name: name.trim(),
                        slug: generateSlug(name),
                        position: categories.length,
                    })
                    .select()
                    .single();

                if (insertError) throw insertError;
                setCategories([...categories, newCategory as Category]);
            }

            setName("");
            setEditingCategory(null);
            setIsDialogOpen(false);
            router.refresh();
        } catch (err) {
            setError("Erreur lors de la sauvegarde");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Supprimer cette catégorie ? Les produits associés ne seront pas supprimés.")) return;

        try {
            const { error } = await supabase.from("categories").delete().eq("id", id);
            if (error) throw error;
            setCategories(categories.filter(c => c.id !== id));
            router.refresh();
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la suppression");
        }
    };

    const openEditDialog = (category: Category) => {
        setEditingCategory(category);
        setName(category.name);
        setIsDialogOpen(true);
    };

    const openNewDialog = () => {
        setEditingCategory(null);
        setName("");
        setIsDialogOpen(true);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Catégories</h1>
                    <p className="text-slate-500">{categories.length} catégorie{categories.length !== 1 ? "s" : ""}</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openNewDialog} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4">
                            <Plus className="h-4 w-4 mr-2" />
                            Nouvelle catégorie
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>
                                {editingCategory ? "Modifier la catégorie" : "Nouvelle catégorie"}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                            {error && (
                                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                                    {error}
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="name">Nom de la catégorie</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ex: Robes, Accessoires..."
                                    required
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsDialogOpen(false)}
                                    className="flex-1"
                                >
                                    Annuler
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isLoading || !name.trim()}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                                >
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enregistrer"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Content */}
            {categories.length === 0 ? (
                <div className="text-center py-16">
                    <FolderOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h2 className="text-lg font-medium text-slate-600 mb-2">Aucune catégorie</h2>
                    <p className="text-sm text-slate-400 mb-6">
                        Créez des catégories pour organiser vos produits
                    </p>
                    <Button onClick={openNewDialog} className="bg-emerald-600 hover:bg-emerald-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Créer une catégorie
                    </Button>
                </div>
            ) : (
                <div className="bg-white rounded-xl border overflow-hidden">
                    {categories.map((category, index) => (
                        <div
                            key={category.id}
                            className={`flex items-center justify-between px-4 py-3 ${index > 0 ? "border-t" : ""}`}
                        >
                            <div className="flex items-center gap-3">
                                <GripVertical className="h-4 w-4 text-slate-300 cursor-grab" />
                                <div>
                                    <p className="font-medium text-slate-900">{category.name}</p>
                                    <p className="text-xs text-slate-400">/{category.slug}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => openEditDialog(category)}
                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    <Pencil className="h-4 w-4 text-slate-500" />
                                </button>
                                <button
                                    onClick={() => handleDelete(category.id)}
                                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
