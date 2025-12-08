"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import type { Profile, Category, Promo, Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ArrowLeft,
    Plus,
    Gift,
    Pencil,
    Trash2,
    Loader2,
    Percent,
    BadgeDollarSign,
    Tag,
} from "lucide-react";
import Link from "next/link";

interface PromosClientProps {
    seller: Profile;
    promos: Promo[];
    categories: Category[];
    products: Pick<Product, "id" | "title" | "price" | "image_url">[];
}

export function PromosClient({ seller, promos: initialPromos, categories, products }: PromosClientProps) {
    const [promos, setPromos] = useState(initialPromos);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingPromo, setEditingPromo] = useState<Promo | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [name, setName] = useState("");
    const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
    const [discountValue, setDiscountValue] = useState("");
    const [scope, setScope] = useState<"global" | "category" | "product">("global");
    const [categoryId, setCategoryId] = useState<string>("");
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState("");
    const [popupMessage, setPopupMessage] = useState("");
    const [isActive, setIsActive] = useState(true);

    const router = useRouter();
    const supabase = createClient();

    const resetForm = () => {
        setName("");
        setDiscountType("percentage");
        setDiscountValue("");
        setScope("global");
        setCategoryId("");
        setSelectedProducts([]);
        setShowPopup(false);
        setPopupTitle("");
        setPopupMessage("");
        setIsActive(true);
        setEditingPromo(null);
        setError(null);
    };

    const openNewDialog = () => {
        resetForm();
        setIsDialogOpen(true);
    };

    const openEditDialog = (promo: Promo) => {
        setEditingPromo(promo);
        setName(promo.name);
        setDiscountType(promo.discount_type);
        setDiscountValue(String(promo.discount_value));
        setScope(promo.scope);
        setCategoryId(promo.category_id || "");
        setSelectedProducts(promo.product_ids || []);
        setShowPopup(promo.show_popup);
        setPopupTitle(promo.popup_title || "");
        setPopupMessage(promo.popup_message || "");
        setIsActive(promo.is_active);
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !discountValue) return;

        setIsLoading(true);
        setError(null);

        const promoData = {
            name: name.trim(),
            discount_type: discountType,
            discount_value: parseFloat(discountValue),
            scope,
            category_id: scope === "category" ? categoryId : null,
            product_ids: scope === "product" ? selectedProducts : [],
            show_popup: showPopup,
            popup_title: showPopup ? popupTitle : null,
            popup_message: showPopup ? popupMessage : null,
            is_active: isActive,
        };

        try {
            if (editingPromo) {
                const { error: updateError } = await supabase
                    .from("promos")
                    .update(promoData)
                    .eq("id", editingPromo.id);

                if (updateError) throw updateError;

                setPromos(promos.map(p =>
                    p.id === editingPromo.id ? { ...p, ...promoData } as Promo : p
                ));
            } else {
                const { data: newPromo, error: insertError } = await supabase
                    .from("promos")
                    .insert({ ...promoData, user_id: seller.id })
                    .select()
                    .single();

                if (insertError) throw insertError;
                setPromos([newPromo as Promo, ...promos]);
            }

            resetForm();
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
        if (!confirm("Supprimer cette promotion ?")) return;

        try {
            await supabase.from("promos").delete().eq("id", id);
            setPromos(promos.filter(p => p.id !== id));
            router.refresh();
        } catch (err) {
            console.error(err);
        }
    };

    const toggleActive = async (promo: Promo) => {
        try {
            await supabase.from("promos").update({ is_active: !promo.is_active }).eq("id", promo.id);
            setPromos(promos.map(p => p.id === promo.id ? { ...p, is_active: !p.is_active } : p));
        } catch (err) {
            console.error(err);
        }
    };

    const getCategoryName = (id: string | null) => categories.find(c => c.id === id)?.name || "";

    const formatDiscount = (promo: Promo) => {
        if (promo.discount_type === "percentage") return `-${promo.discount_value}%`;
        return `-${promo.discount_value} TND`;
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="p-2 hover:bg-slate-100 rounded-full">
                            <ArrowLeft className="h-5 w-5 text-slate-600" />
                        </Link>
                        <h1 className="text-xl font-semibold text-slate-900">Promotions</h1>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={openNewDialog} className="bg-emerald-600 hover:bg-emerald-700 rounded-full px-4">
                                <Plus className="h-4 w-4 mr-2" />
                                Nouvelle promo
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>{editingPromo ? "Modifier la promo" : "Nouvelle promotion"}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                                {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

                                <div className="space-y-2">
                                    <Label>Nom de la promo</Label>
                                    <Input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Soldes d'été" required />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <Label>Type de réduction</Label>
                                        <Select value={discountType} onValueChange={(v) => setDiscountType(v as "percentage" | "fixed")}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="percentage"><Percent className="h-3 w-3 inline mr-1" />Pourcentage</SelectItem>
                                                <SelectItem value="fixed"><BadgeDollarSign className="h-3 w-3 inline mr-1" />Montant fixe</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Valeur</Label>
                                        <Input type="number" value={discountValue} onChange={e => setDiscountValue(e.target.value)} placeholder={discountType === "percentage" ? "10" : "5"} required />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>S'applique à</Label>
                                    <Select value={scope} onValueChange={(v) => setScope(v as "global" | "category" | "product")}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="global">🌍 Tous les produits</SelectItem>
                                            <SelectItem value="category">📂 Une catégorie</SelectItem>
                                            <SelectItem value="product">🎯 Produits spécifiques</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {scope === "category" && (
                                    <div className="space-y-2">
                                        <Label>Catégorie</Label>
                                        <Select value={categoryId} onValueChange={setCategoryId}>
                                            <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                                            <SelectContent>
                                                {categories.map(c => (
                                                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                {scope === "product" && (
                                    <div className="space-y-2">
                                        <Label>Produits ({selectedProducts.length} sélectionnés)</Label>
                                        <div className="max-h-40 overflow-y-auto border rounded-lg p-2 space-y-1">
                                            {products.map(p => (
                                                <label key={p.id} className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedProducts.includes(p.id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) setSelectedProducts([...selectedProducts, p.id]);
                                                            else setSelectedProducts(selectedProducts.filter(id => id !== p.id));
                                                        }}
                                                        className="rounded"
                                                    />
                                                    <span className="text-sm">{p.title} - {p.price} TND</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="border-t pt-4 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>Afficher une popup</Label>
                                            <p className="text-xs text-slate-400">Popup d'annonce sur la boutique</p>
                                        </div>
                                        <Switch checked={showPopup} onCheckedChange={setShowPopup} />
                                    </div>

                                    {showPopup && (
                                        <>
                                            <div className="space-y-2">
                                                <Label>Titre de la popup</Label>
                                                <Input value={popupTitle} onChange={e => setPopupTitle(e.target.value)} placeholder="🎉 Offre spéciale !" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Message</Label>
                                                <Input value={popupMessage} onChange={e => setPopupMessage(e.target.value)} placeholder="Profitez de -10% aujourd'hui !" />
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="flex items-center justify-between border-t pt-4">
                                    <Label>Promo active</Label>
                                    <Switch checked={isActive} onCheckedChange={setIsActive} />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">Annuler</Button>
                                    <Button type="submit" disabled={isLoading} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enregistrer"}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-6">
                {promos.length === 0 ? (
                    <div className="text-center py-16">
                        <Gift className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <h2 className="text-lg font-medium text-slate-600 mb-2">Aucune promotion</h2>
                        <p className="text-sm text-slate-400 mb-6">Créez des promotions pour attirer plus de clients</p>
                        <Button onClick={openNewDialog} className="bg-emerald-600 hover:bg-emerald-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Créer une promotion
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {promos.map(promo => (
                            <div key={promo.id} className={`bg-white rounded-xl border p-4 ${!promo.is_active ? "opacity-60" : ""}`}>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${promo.is_active ? "bg-emerald-100" : "bg-slate-100"}`}>
                                            <Tag className={`h-5 w-5 ${promo.is_active ? "text-emerald-600" : "text-slate-400"}`} />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-slate-900">{promo.name}</h3>
                                            <p className="text-sm text-slate-500">
                                                <span className="font-semibold text-emerald-600">{formatDiscount(promo)}</span>
                                                {" • "}
                                                {promo.scope === "global" && "Tous les produits"}
                                                {promo.scope === "category" && `Catégorie: ${getCategoryName(promo.category_id)}`}
                                                {promo.scope === "product" && `${promo.product_ids?.length || 0} produit(s)`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Switch checked={promo.is_active} onCheckedChange={() => toggleActive(promo)} />
                                        <button onClick={() => openEditDialog(promo)} className="p-2 hover:bg-slate-100 rounded-lg">
                                            <Pencil className="h-4 w-4 text-slate-500" />
                                        </button>
                                        <button onClick={() => handleDelete(promo.id)} className="p-2 hover:bg-red-50 rounded-lg">
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </button>
                                    </div>
                                </div>
                                {promo.show_popup && (
                                    <div className="mt-3 pt-3 border-t flex items-center gap-2 text-xs text-slate-500">
                                        <Gift className="h-3 w-3" />
                                        Popup active: "{promo.popup_title}"
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
