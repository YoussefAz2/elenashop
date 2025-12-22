"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Package,
    Plus,
    Trash2,
    Loader2,
    ImagePlus,
    ShoppingBag,
    Pencil,
    Eye,
    EyeOff,
    X,
    ChevronLeft,
    ChevronRight,
    FolderOpen,
    Layers,
    AlignVerticalJustifyStart,
    AlignVerticalJustifyCenter,
    AlignVerticalJustifyEnd,
} from "lucide-react";
import Image from "next/image";
import type { Profile, Product, Category } from "@/types";

interface CatalogueClientProps {
    seller: Profile;
    products: Product[];
    categories: Category[];
}

export function CatalogueClient({ seller, products: initialProducts, categories: initialCategories }: CatalogueClientProps) {
    const [products, setProducts] = useState(initialProducts);
    const [categories, setCategories] = useState(initialCategories);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

    // Product dialog state
    const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isProductLoading, setIsProductLoading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Category dialog state
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [isCategoryLoading, setIsCategoryLoading] = useState(false);
    const [categoryName, setCategoryName] = useState("");

    // Product form state
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [stock, setStock] = useState("1");
    const [categoryId, setCategoryId] = useState<string>("");
    const [isActive, setIsActive] = useState(true);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [imagePosition, setImagePosition] = useState<"center" | "top" | "bottom">("center");
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const supabase = createClient();

    // Filter products by selected category
    const filteredProducts = selectedCategoryId
        ? products.filter(p => p.category_id === selectedCategoryId)
        : products;

    // Category helpers
    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    };

    const getProductCountForCategory = (categoryId: string) => {
        return products.filter(p => p.category_id === categoryId).length;
    };

    // Reset product form
    const resetProductForm = () => {
        setTitle("");
        setPrice("");
        setDescription("");
        setStock("1");
        setCategoryId("");
        setIsActive(true);
        setImageFiles([]);
        setImagePreviews([]);
        setExistingImages([]);
        setImagePosition("center");
        setEditingProduct(null);
        setError(null);
    };

    // Open new product dialog
    const openNewProductDialog = () => {
        resetProductForm();
        if (selectedCategoryId) setCategoryId(selectedCategoryId);
        setIsProductDialogOpen(true);
    };

    // Open edit product dialog
    const openEditProductDialog = (product: Product) => {
        setEditingProduct(product);
        setTitle(product.title);
        setPrice(String(product.price));
        setDescription(product.description || "");
        setStock(String(product.stock));
        setCategoryId(product.category_id || "");
        setIsActive(product.is_active);

        const allImages: string[] = [];
        if (product.image_url) allImages.push(product.image_url);
        if (product.images && Array.isArray(product.images)) {
            allImages.push(...product.images);
        }
        setExistingImages(allImages);
        setImagePosition((product.image_position as "center" | "top" | "bottom") || "center");
        setImagePreviews([]);
        setImageFiles([]);
        setIsProductDialogOpen(true);
    };

    // Handle image upload
    const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const totalImages = existingImages.length + imagePreviews.length + files.length;
        if (totalImages > 5) {
            setError("Maximum 5 images par produit");
            return;
        }

        setImageFiles([...imageFiles, ...files]);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews([...imagePreviews, ...newPreviews]);
    };

    const removeExistingImage = (index: number) => {
        setExistingImages(existingImages.filter((_, i) => i !== index));
    };

    const removeNewImage = (index: number) => {
        setImageFiles(imageFiles.filter((_, i) => i !== index));
        setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    };

    const setAsMainImage = (index: number) => {
        if (index === 0) return;
        const newOrder = [...existingImages];
        const [moved] = newOrder.splice(index, 1);
        newOrder.unshift(moved);
        setExistingImages(newOrder);
    };

    // Upload images
    const uploadImages = async (): Promise<{ mainImage: string | null; additionalImages: string[] }> => {
        const allImageUrls: string[] = [...existingImages];

        for (const file of imageFiles) {
            const fileExt = file.name.split(".").pop();
            const fileName = `${seller.id}/${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from("products")
                .upload(fileName, file);

            if (uploadError) throw new Error("Erreur lors de l'upload");

            const { data: urlData } = supabase.storage.from("products").getPublicUrl(fileName);
            allImageUrls.push(urlData.publicUrl);
        }

        const mainImage = allImageUrls[0] || null;
        const additionalImages = allImageUrls.slice(1);

        return { mainImage, additionalImages };
    };

    // Submit product
    const handleProductSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProductLoading(true);
        setError(null);

        try {
            const { mainImage, additionalImages } = await uploadImages();

            const productData = {
                title: title.trim(),
                price: parseFloat(price),
                description: description.trim() || null,
                stock: parseInt(stock),
                category_id: categoryId || null,
                is_active: isActive,
                image_url: mainImage,
                images: additionalImages,
                image_position: imagePosition,
            };

            if (editingProduct) {
                const { error: updateError } = await supabase
                    .from("products")
                    .update(productData)
                    .eq("id", editingProduct.id);

                if (updateError) throw new Error("Erreur lors de la mise à jour");

                setProducts(products.map(p =>
                    p.id === editingProduct.id ? { ...p, ...productData } : p
                ));
            } else {
                const { data: newProduct, error: insertError } = await supabase
                    .from("products")
                    .insert({ ...productData, store_id: seller.id })
                    .select()
                    .single();

                if (insertError) throw new Error("Erreur lors de l'ajout du produit");
                setProducts([newProduct as Product, ...products]);
            }

            resetProductForm();
            setIsProductDialogOpen(false);
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur inconnue");
        } finally {
            setIsProductLoading(false);
        }
    };

    // Delete product
    const handleDeleteProduct = async (productId: string) => {
        if (!confirm("Supprimer ce produit ?")) return;
        setDeletingId(productId);

        try {
            const { error } = await supabase.from("products").delete().eq("id", productId);
            if (error) throw error;
            setProducts(products.filter(p => p.id !== productId));
            router.refresh();
        } catch {
            alert("Erreur lors de la suppression");
        } finally {
            setDeletingId(null);
        }
    };

    // Toggle product visibility
    const toggleProductVisibility = async (product: Product) => {
        try {
            await supabase.from("products").update({ is_active: !product.is_active }).eq("id", product.id);
            setProducts(products.map(p => p.id === product.id ? { ...p, is_active: !p.is_active } : p));
        } catch {
            alert("Erreur");
        }
    };

    // Category handlers
    const openNewCategoryDialog = () => {
        setEditingCategory(null);
        setCategoryName("");
        setIsCategoryDialogOpen(true);
    };

    const openEditCategoryDialog = (category: Category) => {
        setEditingCategory(category);
        setCategoryName(category.name);
        setIsCategoryDialogOpen(true);
    };

    const handleCategorySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!categoryName.trim()) return;

        setIsCategoryLoading(true);

        try {
            if (editingCategory) {
                const { error: updateError } = await supabase
                    .from("categories")
                    .update({ name: categoryName.trim(), slug: generateSlug(categoryName) })
                    .eq("id", editingCategory.id);

                if (updateError) throw updateError;

                setCategories(categories.map(c =>
                    c.id === editingCategory.id ? { ...c, name: categoryName.trim(), slug: generateSlug(categoryName) } : c
                ));
            } else {
                const { data: newCategory, error: insertError } = await supabase
                    .from("categories")
                    .insert({
                        store_id: seller.id,
                        name: categoryName.trim(),
                        slug: generateSlug(categoryName),
                        position: categories.length,
                    })
                    .select()
                    .single();

                if (insertError) {
                    console.error("Category insert error:", insertError);
                    throw insertError;
                }
                setCategories([...categories, newCategory as Category]);
            }

            setCategoryName("");
            setEditingCategory(null);
            setIsCategoryDialogOpen(false);
            router.refresh();
        } catch (err: any) {
            console.error("Full error:", err);
            alert(`Erreur: ${err?.message || "Erreur inconnue"}`);
        } finally {
            setIsCategoryLoading(false);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!confirm("Supprimer cette catégorie ? Les produits associés ne seront pas supprimés.")) return;

        try {
            const { error } = await supabase.from("categories").delete().eq("id", id);
            if (error) throw error;
            setCategories(categories.filter(c => c.id !== id));
            if (selectedCategoryId === id) setSelectedCategoryId(null);
            router.refresh();
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la suppression");
        }
    };

    const getCategoryName = (id: string | null) => categories.find(c => c.id === id)?.name || "";

    const allPreviews = [...existingImages, ...imagePreviews];

    return (
        <div className="flex gap-6">
            {/* Categories Sidebar */}
            <div className="w-64 flex-shrink-0">
                <div className="bg-white/50 backdrop-blur-xl rounded-3xl border border-zinc-200/50 shadow-sm overflow-hidden sticky top-8">
                    <div className="p-6 border-b border-zinc-100">
                        <div className="flex items-center justify-between">
                            <h3 className="font-serif font-bold italic text-zinc-900 flex items-center gap-2 text-lg">
                                <Layers className="h-4 w-4" />
                                Catégories
                            </h3>
                            <button
                                onClick={openNewCategoryDialog}
                                className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-400 hover:text-zinc-900"
                                title="Ajouter une catégorie"
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                    <div className="divide-y divide-zinc-50 p-2">
                        {/* All products */}
                        <button
                            onClick={() => setSelectedCategoryId(null)}
                            className={`w-full flex items-center justify-between px-4 py-3 text-left transition-all rounded-xl mb-1 ${selectedCategoryId === null ? "bg-zinc-900 text-white shadow-md shadow-zinc-900/10" : "text-zinc-600 hover:bg-zinc-50"
                                }`}
                        >
                            <span className="font-medium">Tous les produits</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${selectedCategoryId === null ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-500"}`}>{products.length}</span>
                        </button>

                        {/* Category list */}
                        {categories.map(category => (
                            <div
                                key={category.id}
                                className={`flex items-center justify-between px-4 py-3 transition-all rounded-xl group mb-1 ${selectedCategoryId === category.id ? "bg-zinc-100 text-zinc-900" : "hover:bg-zinc-50"
                                    }`}
                            >
                                <button
                                    onClick={() => setSelectedCategoryId(category.id)}
                                    className={`flex-1 text-left ${selectedCategoryId === category.id ? "font-bold" : "text-zinc-600"
                                        }`}
                                >
                                    {category.name}
                                </button>
                                <div className="flex items-center gap-1">
                                    <span className={`text-xs px-2 py-0.5 rounded-full transition-colors ${selectedCategoryId === category.id ? "bg-zinc-200 text-zinc-900" : "bg-zinc-50 text-zinc-400 group-hover:bg-zinc-100"}`}>
                                        {getProductCountForCategory(category.id)}
                                    </span>
                                    <button
                                        onClick={() => openEditCategoryDialog(category)}
                                        className="p-1.5 hover:bg-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                    >
                                        <Pencil className="h-3 w-3 text-zinc-400 hover:text-zinc-900" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteCategory(category.id)}
                                        className="p-1.5 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="h-3 w-3 text-red-300 hover:text-red-500" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {categories.length === 0 && (
                            <div className="p-8 text-center">
                                <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <FolderOpen className="h-5 w-5 text-zinc-300" />
                                </div>
                                <p className="text-xs text-zinc-400 font-medium">Aucune catégorie</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
                {/* Products header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-serif font-bold italic text-zinc-900">
                            {selectedCategoryId ? getCategoryName(selectedCategoryId) : "Tous les produits"}
                        </h2>
                        <p className="text-sm text-zinc-500 font-medium mt-1">{filteredProducts.length} produit{filteredProducts.length !== 1 ? "s" : ""}</p>
                    </div>
                    <Button onClick={openNewProductDialog} className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl shadow-lg shadow-zinc-900/20 px-6">
                        <Plus className="h-4 w-4 mr-2" />
                        Nouveau produit
                    </Button>
                </div>

                {/* Products list */}
                {filteredProducts.length === 0 ? (
                    <div className="bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-zinc-200 p-16 text-center">
                        <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <ShoppingBag className="h-8 w-8 text-zinc-300" />
                        </div>
                        <h3 className="font-serif font-bold text-xl text-zinc-900 mb-2 italic">Votre catalogue est vide</h3>
                        <p className="text-zinc-500 mb-8 max-w-sm mx-auto">
                            {selectedCategoryId ? "Aucun produit ne correspond à cette catégorie pour le moment." : "Commencez par ajouter votre premier produit pour lancer votre boutique."}
                        </p>
                        <Button onClick={openNewProductDialog} className="bg-zinc-900 hover:bg-zinc-800 text-white px-8 rounded-xl h-12">
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter un produit
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                getCategoryName={getCategoryName}
                                onEdit={openEditProductDialog}
                                onDelete={handleDeleteProduct}
                                onToggleVisibility={toggleProductVisibility}
                                deletingId={deletingId}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Category Dialog */}
            <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                <DialogContent className="sm:max-w-md bg-white rounded-3xl border-zinc-100 shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="font-serif font-bold italic text-2xl text-zinc-900">
                            {editingCategory ? "Modifier la catégorie" : "Nouvelle catégorie"}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCategorySubmit} className="space-y-6 mt-4">
                        <div className="space-y-3">
                            <Label htmlFor="categoryName" className="text-zinc-700 font-medium">Nom de la catégorie</Label>
                            <Input
                                id="categoryName"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                placeholder="Ex: Robes, Accessoires..."
                                className="h-12 rounded-xl border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900/10"
                                required
                            />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCategoryDialogOpen(false)}
                                className="flex-1 h-12 rounded-xl border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                disabled={isCategoryLoading || !categoryName.trim()}
                                className="flex-1 h-12 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-medium shadow-lg shadow-zinc-900/20"
                            >
                                {isCategoryLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enregistrer"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Product Dialog */}
            <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-3xl border-zinc-100 shadow-2xl p-0 gap-0">
                    <div className="p-6 pb-0">
                        <DialogHeader>
                            <DialogTitle className="font-serif font-bold italic text-2xl text-zinc-900">
                                {editingProduct ? "Modifier le produit" : "Ajouter un produit"}
                            </DialogTitle>
                            <DialogDescription className="text-zinc-500">
                                {editingProduct ? "Modifiez les informations du produit" : "Remplissez les informations de votre produit"}
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                    <form onSubmit={handleProductSubmit} className="space-y-6 p-6">
                        {error && <div className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-100 flex items-center gap-2"><X className="h-4 w-4" />{error}</div>}

                        {/* Images Gallery */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="text-zinc-700 font-medium">Images du produit</Label>
                                <span className="text-xs font-medium bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full">{allPreviews.length}/5</span>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                {existingImages.map((url, idx) => (
                                    <div
                                        key={`existing-${idx}`}
                                        className={`relative aspect-square rounded-2xl overflow-hidden bg-zinc-50 cursor-pointer transition-all ${idx === 0 ? "ring-2 ring-zinc-900 shadow-md" : "hover:ring-2 hover:ring-zinc-200"}`}
                                        onClick={() => setAsMainImage(idx)}
                                        title={idx === 0 ? "Image principale" : "Cliquez pour définir comme principale"}
                                    >
                                        <Image src={url} alt={`Image ${idx + 1}`} fill className="object-cover" />
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); removeExistingImage(idx); }}
                                            className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-sm text-zinc-900 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 z-10 shadow-sm transition-colors"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                        {idx === 0 && (
                                            <span className="absolute bottom-2 left-2 text-[10px] font-bold bg-zinc-900/90 backdrop-blur-sm text-white px-2 py-1 rounded-lg shadow-sm">
                                                Principal
                                            </span>
                                        )}
                                    </div>
                                ))}

                                {imagePreviews.map((url, idx) => (
                                    <div key={`new-${idx}`} className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-50 ring-2 ring-emerald-500/50">
                                        <Image src={url} alt={`Nouvelle ${idx + 1}`} fill className="object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeNewImage(idx)}
                                            className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-sm text-zinc-900 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 shadow-sm transition-colors"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                        <span className="absolute bottom-2 left-2 text-[10px] font-bold bg-emerald-500 text-white px-2 py-1 rounded-lg shadow-sm">
                                            Nouveau
                                        </span>
                                    </div>
                                ))}

                                {allPreviews.length < 5 && (
                                    <div
                                        className="aspect-square border-2 border-dashed border-zinc-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-zinc-400 hover:bg-zinc-50 transition-all group"
                                        onClick={() => document.getElementById("image-input-catalogue")?.click()}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center mb-2 group-hover:bg-zinc-200 transition-colors">
                                            <ImagePlus className="h-5 w-5 text-zinc-400 group-hover:text-zinc-600" />
                                        </div>
                                        <span className="text-xs font-semibold text-zinc-500">Ajouter</span>
                                    </div>
                                )}
                            </div>
                            <input
                                id="image-input-catalogue"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleAddImages}
                                className="hidden"
                            />
                            <p className="text-xs text-zinc-400">La première image sera l&apos;image principale de la fiche produit.</p>

                            {/* Image Position */}
                            <div className="space-y-3 mt-3">
                                <Label className="text-zinc-700 font-medium">Alignement de l&apos;image</Label>
                                <div className="flex gap-2">
                                    {[
                                        { value: "top", icon: AlignVerticalJustifyStart, label: "Haut" },
                                        { value: "center", icon: AlignVerticalJustifyCenter, label: "Centre" },
                                        { value: "bottom", icon: AlignVerticalJustifyEnd, label: "Bas" },
                                    ].map(({ value, icon: Icon, label }) => (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => setImagePosition(value as "center" | "top" | "bottom")}
                                            className={`flex-1 flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${imagePosition === value
                                                ? "border-zinc-900 bg-zinc-900 text-white shadow-md"
                                                : "border-zinc-100 text-zinc-500 hover:border-zinc-300 hover:bg-zinc-50"
                                                }`}
                                        >
                                            <Icon className="h-5 w-5" />
                                            <span className="text-xs font-medium">{label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-zinc-700 font-medium">Titre du produit *</Label>
                            <Input
                                id="title"
                                placeholder="Ex: Robe d'été fleurie"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="h-12 rounded-xl border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900/10"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-zinc-700 font-medium">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Décrivez votre produit..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className="rounded-xl border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900/10 min-h-[100px]"
                            />
                        </div>

                        {/* Price & Stock */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price" className="text-zinc-700 font-medium">Prix (TND) *</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    placeholder="99"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="h-12 rounded-xl border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900/10 font-bold"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="stock" className="text-zinc-700 font-medium">Stock *</Label>
                                <Input
                                    id="stock"
                                    type="number"
                                    placeholder="1"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                    className="h-12 rounded-xl border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900/10"
                                    min="0"
                                    required
                                />
                            </div>
                        </div>

                        {/* Category */}
                        {categories.length > 0 && (
                            <div className="space-y-2">
                                <Label className="text-zinc-700 font-medium">Catégorie</Label>
                                <Select value={categoryId} onValueChange={setCategoryId}>
                                    <SelectTrigger className="h-12 rounded-xl border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900/10">
                                        <SelectValue placeholder="Choisir une catégorie..." />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-zinc-100">
                                        {categories.map(cat => (
                                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Visibility */}
                        <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                            <div>
                                <Label className="text-sm font-bold text-zinc-900">Catalogue en ligne</Label>
                                <p className="text-xs text-zinc-500 font-medium">Ce produit sera visible par vos clients</p>
                            </div>
                            <Switch checked={isActive} onCheckedChange={setIsActive} className="data-[state=checked]:bg-zinc-900" />
                        </div>

                        {/* Submit */}
                        <Button type="submit" className="w-full h-14 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-lg shadow-lg shadow-zinc-900/20 mt-4" disabled={isProductLoading}>
                            {isProductLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : editingProduct ? "Mettre à jour" : "Créer le produit"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// Product Card component
function ProductCard({
    product,
    getCategoryName,
    onEdit,
    onDelete,
    onToggleVisibility,
    deletingId,
}: {
    product: Product;
    getCategoryName: (id: string | null) => string;
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
    onToggleVisibility: (product: Product) => void;
    deletingId: string | null;
}) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const allImages: string[] = [];
    if (product.image_url) allImages.push(product.image_url);
    if (product.images && Array.isArray(product.images)) {
        allImages.push(...product.images);
    }

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

    return (
        <Card className={`group bg-white rounded-3xl border border-zinc-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-zinc-200/50 hover:-translate-y-1 transition-all duration-300 ${!product.is_active ? "opacity-60 grayscale" : ""}`}>
            {/* Image */}
            <div className="relative aspect-[4/5] bg-zinc-50 overflow-hidden">
                {allImages.length > 0 ? (
                    <>
                        <Image
                            src={allImages[currentImageIndex]}
                            alt={product.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                        {allImages.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0 shadow-lg border border-white/20"
                                >
                                    <ChevronLeft className="h-4 w-4 text-zinc-900" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 shadow-lg border border-white/20"
                                >
                                    <ChevronRight className="h-4 w-4 text-zinc-900" />
                                </button>
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 p-1 px-2 rounded-full bg-black/20 backdrop-blur-md">
                                    {allImages.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentImageIndex ? "bg-white scale-125" : "bg-white/50"}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <Package className="h-12 w-12 text-zinc-200" />
                    </div>
                )}
                {!product.is_active && (
                    <div className="absolute top-3 right-3 bg-zinc-900/90 backdrop-blur-md text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-lg shadow-zinc-900/20">
                        <EyeOff className="h-3 w-3" />
                        Masqué
                    </div>
                )}
            </div>

            {/* Info */}
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4 gap-4">
                    <div className="flex-1 min-w-0 space-y-1">
                        <h3 className="font-bold text-zinc-900 truncate text-lg leading-tight">{product.title}</h3>
                        {product.category_id && (
                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{getCategoryName(product.category_id)}</p>
                        )}
                    </div>
                    <div className="text-right">
                        <p className="text-xl font-serif font-bold italic text-zinc-900">{product.price}</p>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">TND</p>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${product.stock > 0 ? "bg-zinc-100 text-zinc-900 border-zinc-200" : "bg-zinc-50 text-zinc-400 border-zinc-100 decoration-slice line-through"}`}>
                        Stock: {product.stock}
                    </span>
                    <span className="text-xs font-mono text-zinc-300">#{product.id.slice(0, 4)}</span>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-50">
                    <div className="flex gap-2">
                        <button
                            onClick={() => onEdit(product)}
                            className="p-2 hover:bg-zinc-100 rounded-xl transition-colors text-zinc-400 hover:text-zinc-900 border border-transparent hover:border-zinc-200"
                            title="Modifier"
                        >
                            <Pencil className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => onToggleVisibility(product)}
                            className={`p-2 rounded-xl transition-colors border ${!product.is_active ? "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 border-transparent hover:border-zinc-200" : "text-zinc-900 bg-zinc-100 hover:bg-zinc-200 border-zinc-200"}`}
                            title={product.is_active ? "Masquer du catalogue" : "Rendre visible"}
                        >
                            {product.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                    </div>
                    <button
                        onClick={() => onDelete(product.id)}
                        disabled={deletingId === product.id}
                        className="p-2 hover:bg-red-50 text-zinc-300 hover:text-red-500 rounded-xl transition-colors border border-transparent hover:border-red-100"
                        title="Supprimer"
                    >
                        {deletingId === product.id ? (
                            <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                        ) : (
                            <Trash2 className="h-4 w-4" />
                        )}
                    </button>
                </div>
            </CardContent>
        </Card>
    );
}
