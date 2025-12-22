"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
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
import { Plus, FileText, Trash2, Loader2, ExternalLink, Edit } from "lucide-react";
import type { Profile, Page } from "@/types";

interface PagesPanelProps {
    seller: Profile;
    pages: Page[];
}

export function PagesPanel({ seller, pages: initialPages }: PagesPanelProps) {
    const [pages, setPages] = useState(initialPages);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [editingPage, setEditingPage] = useState<Page | null>(null);
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [content, setContent] = useState("");

    const router = useRouter();
    const supabase = createClient();

    const resetForm = () => {
        setTitle("");
        setSlug("");
        setContent("");
        setEditingPage(null);
    };

    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (editingPage) {
                const { data, error } = await supabase
                    .from("pages")
                    .update({ title, slug, content })
                    .eq("id", editingPage.id)
                    .select()
                    .single();

                if (error) throw error;
                setPages(pages.map((p) => (p.id === editingPage.id ? (data as Page) : p)));
            } else {
                const { data, error } = await supabase
                    .from("pages")
                    .insert({ store_id: seller.id, title, slug, content })
                    .select()
                    .single();

                if (error) throw error;
                setPages([data as Page, ...pages]);
            }

            setIsOpen(false);
            resetForm();
            router.refresh();
        } catch {
            alert("Erreur lors de la sauvegarde");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (page: Page) => {
        setEditingPage(page);
        setTitle(page.title);
        setSlug(page.slug);
        setContent(page.content || "");
        setIsOpen(true);
    };

    const handleDelete = async (pageId: string) => {
        if (!confirm("Supprimer cette page ?")) return;

        try {
            await supabase.from("pages").delete().eq("id", pageId);
            setPages(pages.filter((p) => p.id !== pageId));
            router.refresh();
        } catch {
            alert("Erreur");
        }
    };

    return (
    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-sm text-zinc-900 uppercase tracking-wide">Mes Pages</h3>
                    <p className="text-xs text-zinc-500 mt-1 font-medium">Créez des pages supplémentaires</p>
                </div>
                <Dialog
                    open={isOpen}
                    onOpenChange={(open) => {
                        setIsOpen(open);
                        if (!open) resetForm();
                    }}
                >
                    <DialogTrigger asChild>
                        <Button size="sm" className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl h-9 px-4 shadow-lg shadow-zinc-900/20 transition-all active:scale-95">
                            <Plus className="h-4 w-4 mr-2" />
                            Créer une page
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] rounded-3xl border-0 shadow-2xl p-6">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-serif font-bold italic text-zinc-900">
                                {editingPage ? "Modifier la page" : "Nouvelle page"}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-bold text-zinc-700">Titre</Label>
                                <Input
                                    value={title}
                                    onChange={(e) => {
                                        setTitle(e.target.value);
                                        if (!editingPage) setSlug(generateSlug(e.target.value));
                                    }}
                                    placeholder="Ex: À propos"
                                    className="h-11 rounded-xl border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900/10"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-bold text-zinc-700">URL</Label>
                                <div className="flex items-center gap-1">
                                    <span className="text-sm font-mono text-zinc-400">/{seller.store_name}/</span>
                                    <Input
                                        value={slug}
                                        onChange={(e) => setSlug(generateSlug(e.target.value))}
                                        className="h-11 flex-1 rounded-xl border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900/10 font-mono text-sm"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-bold text-zinc-700">Contenu</Label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Écrivez le contenu de votre page..."
                                    className="w-full h-48 rounded-xl border border-zinc-200 p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 placeholder:text-zinc-300"
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full h-12 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-bold text-base"
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Enregistrer la page"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {pages.length === 0 ? (
                <div className="border-2 border-dashed border-zinc-200 rounded-2xl p-8 text-center bg-zinc-50/50">
                    <div className="h-12 w-12 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-3">
                        <FileText className="h-6 w-6 text-zinc-400" />
                    </div>
                    <p className="text-sm font-bold text-zinc-900">Aucune page créée</p>
                    <p className="text-xs text-zinc-500 mt-1">Créez des pages comme FAQ, À propos, Mentions légales...</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {pages.map((page) => (
                        <div key={page.id} className="p-4 rounded-2xl bg-white border border-zinc-100 shadow-sm hover:shadow-md hover:border-zinc-200 transition-all group">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:text-zinc-900 group-hover:bg-zinc-100 transition-colors">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-zinc-900">{page.title}</p>
                                        <p className="text-xs text-zinc-400 font-mono mt-0.5">/{seller.store_name}/{page.slug}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900" asChild>
                                        <a href={`/${seller.store_name}/${page.slug}`} target="_blank">
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900" onClick={() => handleEdit(page)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-red-50 text-zinc-400 hover:text-red-600" onClick={() => handleDelete(page.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Quick link to products */}
            <div className="pt-6 border-t border-zinc-100">
                <a
                    href="/dashboard/products"
                    className="flex items-center justify-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors group"
                >
                    <ExternalLink className="h-4 w-4 group-hover:-translate-y-0.5 transition-transform" />
                    Gérer mes produits et collections
                </a>
            </div>
        </div>
    );
}
