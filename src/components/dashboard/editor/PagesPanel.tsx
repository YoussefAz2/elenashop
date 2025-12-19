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
        <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-medium text-sm text-slate-900">Mes Pages</h3>
                    <p className="text-xs text-slate-500">Créez des pages supplémentaires</p>
                </div>
                <Dialog
                    open={isOpen}
                    onOpenChange={(open) => {
                        setIsOpen(open);
                        if (!open) resetForm();
                    }}
                >
                    <DialogTrigger asChild>
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg h-8 px-3">
                            <Plus className="h-4 w-4 mr-1" />
                            Créer
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>
                                {editingPage ? "Modifier la page" : "Nouvelle page"}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label>Titre</Label>
                                <Input
                                    value={title}
                                    onChange={(e) => {
                                        setTitle(e.target.value);
                                        if (!editingPage) setSlug(generateSlug(e.target.value));
                                    }}
                                    placeholder="À propos"
                                    className="h-10"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>URL</Label>
                                <div className="flex items-center gap-1">
                                    <span className="text-sm text-slate-500">/{seller.store_name}/</span>
                                    <Input
                                        value={slug}
                                        onChange={(e) => setSlug(generateSlug(e.target.value))}
                                        className="h-10 flex-1"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Contenu</Label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Écrivez le contenu de votre page..."
                                    className="w-full h-40 rounded-lg border p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full h-10 bg-emerald-600 hover:bg-emerald-700"
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enregistrer"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {pages.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="py-8 text-center">
                        <FileText className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm text-slate-500">Aucune page créée</p>
                        <p className="text-xs text-slate-400">Créez des pages comme FAQ, À propos...</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-2">
                    {pages.map((page) => (
                        <Card key={page.id} className="p-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-slate-400" />
                                    <div>
                                        <p className="text-sm font-medium">{page.title}</p>
                                        <p className="text-xs text-slate-500">/{seller.store_name}/{page.slug}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                                        <a href={`/${seller.store_name}/${page.slug}`} target="_blank">
                                            <ExternalLink className="h-4 w-4 text-slate-400" />
                                        </a>
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEdit(page)}>
                                        <Edit className="h-4 w-4 text-slate-400" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500" onClick={() => handleDelete(page.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Quick link to products */}
            <div className="pt-4 border-t">
                <a
                    href="/dashboard/products"
                    className="flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-600"
                >
                    <ExternalLink className="h-4 w-4" />
                    Gérer mes produits →
                </a>
            </div>
        </div>
    );
}
