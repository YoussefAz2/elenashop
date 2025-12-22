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
                    .insert({ ...promoData, store_id: seller.id })
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
        <div className="space-y-6">
            {/* Dialog for creating/editing promos */}
            <div className="flex justify-end">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openNewDialog} className="bg-zinc-900 hover:bg-zinc-800 rounded-xl px-4 font-bold shadow-lg shadow-zinc-900/20">
                            <Plus className="h-4 w-4 mr-2" />
                            Nouvelle promo
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-3xl border-zinc-100 shadow-2xl p-0 gap-0">
                        <div className="p-6 pb-0">
                            <DialogHeader>
                                <DialogTitle className="font-serif font-bold italic text-2xl text-zinc-900">
                                    {editingPromo ? "Modifier la promo" : "Nouvelle promotion"}
                                </DialogTitle>
                            </DialogHeader>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6 p-6">
                            {error && <div className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-100 flex items-center gap-2">{error}</div>}

                            <div className="space-y-3">
                                <Label className="text-zinc-700 font-medium">Nom de la promo</Label>
                                <Input
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="Ex: Soldes d'été"
                                    className="h-12 rounded-xl border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900/10"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <Label className="text-zinc-700 font-medium">Type de réduction</Label>
                                    <Select value={discountType} onValueChange={(v) => setDiscountType(v as "percentage" | "fixed")}>
                                        <SelectTrigger className="h-12 rounded-xl border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900/10"><SelectValue /></SelectTrigger>
                                        <SelectContent className="rounded-xl border-zinc-100">
                                            <SelectItem value="percentage"><Percent className="h-4 w-4 inline mr-2 text-zinc-400" />Pourcentage</SelectItem>
                                            <SelectItem value="fixed"><BadgeDollarSign className="h-4 w-4 inline mr-2 text-zinc-400" />Montant fixe</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-zinc-700 font-medium">Valeur</Label>
                                    <Input
                                        type="number"
                                        value={discountValue}
                                        onChange={e => setDiscountValue(e.target.value)}
                                        placeholder={discountType === "percentage" ? "10" : "5"}
                                        className="h-12 rounded-xl border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900/10 font-bold"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-zinc-700 font-medium">S&apos;applique à</Label>
                                <Select value={scope} onValueChange={(v) => setScope(v as "global" | "category" | "product")}>
                                    <SelectTrigger className="h-12 rounded-xl border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900/10"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-xl border-zinc-100">
                                        <SelectItem value="global">🌍 Tous les produits</SelectItem>
                                        <SelectItem value="category">📂 Une catégorie</SelectItem>
                                        <SelectItem value="product">🎯 Produits spécifiques</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {scope === "category" && (
                                <div className="space-y-3">
                                    <Label className="text-zinc-700 font-medium">Catégorie</Label>
                                    <Select value={categoryId} onValueChange={setCategoryId}>
                                        <SelectTrigger className="h-12 rounded-xl border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900/10"><SelectValue placeholder="Choisir..." /></SelectTrigger>
                                        <SelectContent className="rounded-xl border-zinc-100">
                                            {categories.map(c => (
                                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {scope === "product" && (
                                <div className="space-y-3">
                                    <Label className="text-zinc-700 font-medium">Produits ({selectedProducts.length} sélectionnés)</Label>
                                    <div className="max-h-40 overflow-y-auto border border-zinc-200 rounded-xl p-2 space-y-1">
                                        {products.map(p => (
                                            <label key={p.id} className="flex items-center gap-3 p-2 hover:bg-zinc-50 rounded-lg cursor-pointer transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedProducts.includes(p.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) setSelectedProducts([...selectedProducts, p.id]);
                                                        else setSelectedProducts(selectedProducts.filter(id => id !== p.id));
                                                    }}
                                                    className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                                                />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-zinc-900">{p.title}</p>
                                                    <p className="text-xs text-zinc-500">{p.price} TND</p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="border-t border-zinc-100 pt-6 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label className="text-base font-bold text-zinc-900">Afficher une popup</Label>
                                        <p className="text-xs text-zinc-500 font-medium">Annoncez la promo aux visiteurs de la boutique</p>
                                    </div>
                                    <Switch checked={showPopup} onCheckedChange={setShowPopup} className="data-[state=checked]:bg-zinc-900" />
                                </div>

                                {showPopup && (
                                    <>
                                        <div className="space-y-3">
                                            <Label className="text-zinc-700 font-medium">Titre de la popup</Label>
                                            <Input
                                                value={popupTitle}
                                                onChange={e => setPopupTitle(e.target.value)}
                                                placeholder="🎉 Offre spéciale !"
                                                className="h-12 rounded-xl border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900/10"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-zinc-700 font-medium">Message</Label>
                                            <Input
                                                value={popupMessage}
                                                onChange={e => setPopupMessage(e.target.value)}
                                                placeholder="Profitez de -10% aujourd'hui !"
                                                className="h-12 rounded-xl border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900/10"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="flex items-center justify-between border-t border-zinc-100 pt-6">
                                <Label className="text-base font-bold text-zinc-900">Promo active</Label>
                                <Switch checked={isActive} onCheckedChange={setIsActive} className="data-[state=checked]:bg-zinc-900" />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsDialogOpen(false)}
                                    className="flex-1 h-12 rounded-xl border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
                                >
                                    Annuler
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 h-12 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-medium shadow-lg shadow-zinc-900/20"
                                >
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enregistrer"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Promos List */}
            {promos.length === 0 ? (
                <div className="bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-zinc-200 p-16 text-center">
                    <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <Gift className="h-8 w-8 text-zinc-300" />
                    </div>
                    <h3 className="font-serif font-bold text-xl text-zinc-900 mb-2 italic">Aucune promotion</h3>
                    <p className="text-zinc-500 mb-8 max-w-sm mx-auto">Créez des promotions pour attirer plus de clients</p>
                    <Button onClick={openNewDialog} className="bg-zinc-900 hover:bg-zinc-800 rounded-xl px-6 py-6 font-bold text-lg shadow-lg shadow-zinc-900/20">
                        <Plus className="h-5 w-5 mr-2" />
                        Créer une promotion
                    </Button>
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-zinc-100 overflow-hidden shadow-sm">
                    <div className="divide-y divide-zinc-50">
                        {promos.map(promo => (
                            <div key={promo.id} className={`p-6 hover:bg-zinc-50/50 transition-colors ${!promo.is_active ? "opacity-60 grayscale" : ""}`}>
                                <div className="flex items-start justify-between gap-6">
                                    <div className="flex items-center gap-5">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-sm ${promo.is_active ? "bg-zinc-900 border-zinc-900 text-white" : "bg-zinc-50 border-zinc-100 text-zinc-300"}`}>
                                            <Tag className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-zinc-900 text-lg mb-1">{promo.name}</h3>
                                            <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500">
                                                <span className="font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded-lg border border-zinc-200">{formatDiscount(promo)}</span>
                                                <span className="w-1 h-1 rounded-full bg-zinc-300" />
                                                <span>
                                                    {promo.scope === "global" && "Tous les produits"}
                                                    {promo.scope === "category" && `Catégorie: ${getCategoryName(promo.category_id)}`}
                                                    {promo.scope === "product" && `${promo.product_ids?.length || 0} produit(s)`}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-50 rounded-lg border border-zinc-100">
                                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{promo.is_active ? "Active" : "Inactive"}</span>
                                            <Switch
                                                checked={promo.is_active}
                                                onCheckedChange={() => toggleActive(promo)}
                                                className="data-[state=checked]:bg-zinc-900 scale-90"
                                            />
                                        </div>
                                        <div className="flex gap-1 pl-2 border-l border-zinc-100">
                                            <button
                                                onClick={() => openEditDialog(promo)}
                                                className="p-2 hover:bg-zinc-100 rounded-xl text-zinc-400 hover:text-zinc-900 transition-colors"
                                                title="Modifier"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(promo.id)}
                                                className="p-2 hover:bg-red-50 rounded-xl text-zinc-300 hover:text-red-500 transition-colors"
                                                title="Supprimer"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {promo.show_popup && (
                                    <div className="mt-4 pt-4 border-t border-zinc-50 flex items-center gap-2 text-xs font-medium text-zinc-500">
                                        <Gift className="h-3.5 w-3.5 text-zinc-400" />
                                        Popup active: <span className="text-zinc-900">&quot;{promo.popup_title}&quot;</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
