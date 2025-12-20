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
                console.log("Creating category with store_id:", seller.id);
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
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                <Layers className="h-4 w-4" />
                                Catégories
                            </h3>
                            <button
                                onClick={openNewCategoryDialog}
                                className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                                title="Ajouter une catégorie"
                            >
                                <Plus className="h-4 w-4 text-slate-500" />
                            </button>
                        </div>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {/* All products */}
                        <button
                            onClick={() => setSelectedCategoryId(null)}
                            className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${selectedCategoryId === null ? "bg-slate-50 text-slate-900 font-medium" : "text-slate-600 hover:bg-slate-50"
                                }`}
                        >
                            <span>Tous les produits</span>
                            <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full">{products.length}</span>
                        </button>

                        {/* Category list */}
                        {categories.map(category => (
                            <div
                                key={category.id}
                                className={`flex items-center justify-between px-4 py-3 transition-colors group ${selectedCategoryId === category.id ? "bg-slate-50" : "hover:bg-slate-50"
                                    }`}
                            >
                                <button
                                    onClick={() => setSelectedCategoryId(category.id)}
                                    className={`flex-1 text-left ${selectedCategoryId === category.id ? "text-slate-900 font-medium" : "text-slate-600"
                                        }`}
                                >
                                    {category.name}
                                </button>
                                <div className="flex items-center gap-1">
                                    <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full">
                                        {getProductCountForCategory(category.id)}
                                    </span>
                                    <button
                                        onClick={() => openEditCategoryDialog(category)}
                                        className="p-1 hover:bg-slate-200 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Pencil className="h-3 w-3 text-slate-400" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteCategory(category.id)}
                                        className="p-1 hover:bg-red-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="h-3 w-3 text-red-400" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {categories.length === 0 && (
                            <div className="p-4 text-center">
                                <FolderOpen className="h-8 w-8 text-slate-200 mx-auto mb-2" />
                                <p className="text-xs text-slate-400">Aucune catégorie</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
                {/* Products header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">
                            {selectedCategoryId ? getCategoryName(selectedCategoryId) : "Tous les produits"}
                        </h2>
                        <p className="text-sm text-slate-500">{filteredProducts.length} produit{filteredProducts.length !== 1 ? "s" : ""}</p>
                    </div>
                    <Button onClick={openNewProductDialog} className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl">
                        <Plus className="h-4 w-4 mr-2" />
                        Nouveau produit
                    </Button>
                </div>

                {/* Products list */}
                {filteredProducts.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShoppingBag className="h-8 w-8 text-slate-300" />
                        </div>
                        <h3 className="font-semibold text-slate-900 mb-2">Aucun produit</h3>
                        <p className="text-slate-500 mb-6">
                            {selectedCategoryId ? "Aucun produit dans cette catégorie" : "Ajoutez votre premier produit"}
                        </p>
                        <Button onClick={openNewProductDialog} className="bg-slate-900 hover:bg-slate-800 text-white">
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
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {editingCategory ? "Modifier la catégorie" : "Nouvelle catégorie"}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCategorySubmit} className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label htmlFor="categoryName">Nom de la catégorie</Label>
                            <Input
                                id="categoryName"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                placeholder="Ex: Robes, Accessoires..."
                                required
                            />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCategoryDialogOpen(false)}
                                className="flex-1"
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                disabled={isCategoryLoading || !categoryName.trim()}
                                className="flex-1 bg-slate-900 hover:bg-slate-800"
                            >
                                {isCategoryLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enregistrer"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Product Dialog */}
            <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingProduct ? "Modifier le produit" : "Ajouter un produit"}</DialogTitle>
                        <DialogDescription>
                            {editingProduct ? "Modifiez les informations du produit" : "Remplissez les informations de votre produit"}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleProductSubmit} className="space-y-4 mt-4">
                        {error && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</div>}

                        {/* Images Gallery */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Images du produit</Label>
                                <span className="text-xs text-slate-400">{allPreviews.length}/5</span>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                {existingImages.map((url, idx) => (
                                    <div
                                        key={`existing-${idx}`}
                                        className={`relative aspect-square rounded-lg overflow-hidden bg-slate-100 cursor-pointer transition-all ${idx === 0 ? "ring-2 ring-emerald-500" : "hover:ring-2 hover:ring-blue-400"}`}
                                        onClick={() => setAsMainImage(idx)}
                                        title={idx === 0 ? "Image principale" : "Cliquez pour définir comme principale"}
                                    >
                                        <Image src={url} alt={`Image ${idx + 1}`} fill className="object-cover" />
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); removeExistingImage(idx); }}
                                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 z-10"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                        {idx === 0 && (
                                            <span className="absolute bottom-1 left-1 text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded">
                                                ⭐ Principal
                                            </span>
                                        )}
                                    </div>
                                ))}

                                {imagePreviews.map((url, idx) => (
                                    <div key={`new-${idx}`} className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 ring-2 ring-emerald-400">
                                        <Image src={url} alt={`Nouvelle ${idx + 1}`} fill className="object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeNewImage(idx)}
                                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                        <span className="absolute bottom-1 left-1 text-[10px] bg-blue-500 text-white px-1.5 py-0.5 rounded">
                                            Nouveau
                                        </span>
                                    </div>
                                ))}

                                {allPreviews.length < 5 && (
                                    <div
                                        className="aspect-square border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 transition-colors"
                                        onClick={() => document.getElementById("image-input-catalogue")?.click()}
                                    >
                                        <ImagePlus className="h-6 w-6 text-slate-300" />
                                        <span className="text-xs text-slate-400 mt-1">Ajouter</span>
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
                            <p className="text-xs text-slate-400">La première image sera l&apos;image principale</p>

                            {/* Image Position */}
                            <div className="space-y-2 mt-3">
                                <Label>Position de l&apos;image</Label>
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
                                            className={`flex-1 flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-colors ${imagePosition === value
                                                ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                                : "border-slate-200 hover:border-slate-300"
                                                }`}
                                        >
                                            <Icon className="h-5 w-5" />
                                            <span className="text-xs">{label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title">Titre du produit *</Label>
                            <Input id="title" placeholder="Ex: Robe d'été fleurie" value={title} onChange={(e) => setTitle(e.target.value)} className="h-12 rounded-xl" required />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Décrivez votre produit..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className="rounded-xl"
                            />
                        </div>

                        {/* Price & Stock */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="price">Prix (TND) *</Label>
                                <Input id="price" type="number" placeholder="99" value={price} onChange={(e) => setPrice(e.target.value)} className="h-12 rounded-xl" min="0" step="0.01" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="stock">Stock *</Label>
                                <Input id="stock" type="number" placeholder="1" value={stock} onChange={(e) => setStock(e.target.value)} className="h-12 rounded-xl" min="0" required />
                            </div>
                        </div>

                        {/* Category */}
                        {categories.length > 0 && (
                            <div className="space-y-2">
                                <Label>Catégorie</Label>
                                <Select value={categoryId} onValueChange={setCategoryId}>
                                    <SelectTrigger className="h-12 rounded-xl">
                                        <SelectValue placeholder="Choisir une catégorie..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(cat => (
                                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Visibility */}
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                            <div>
                                <Label className="text-sm font-medium">Visible sur la boutique</Label>
                                <p className="text-xs text-slate-500">Les visiteurs peuvent voir ce produit</p>
                            </div>
                            <Switch checked={isActive} onCheckedChange={setIsActive} />
                        </div>

                        {/* Submit */}
                        <Button type="submit" className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold" disabled={isProductLoading}>
                            {isProductLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : editingProduct ? "Enregistrer les modifications" : "Ajouter le produit"}
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
        <Card className={`bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all ${!product.is_active ? "opacity-60" : ""}`}>
            {/* Image */}
            <div className="relative aspect-square bg-slate-100 group">
                {allImages.length > 0 ? (
                    <>
                        <Image
                            src={allImages[currentImageIndex]}
                            alt={product.title}
                            fill
                            className="object-cover"
                        />
                        {allImages.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                                    {allImages.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`w-1.5 h-1.5 rounded-full ${idx === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <Package className="h-12 w-12 text-slate-300" />
                    </div>
                )}
                {!product.is_active && (
                    <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
                        <EyeOff className="h-6 w-6 text-white" />
                    </div>
                )}
            </div>

            {/* Info */}
            <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-slate-900 truncate">{product.title}</h3>
                        {product.category_id && (
                            <p className="text-xs text-slate-400">{getCategoryName(product.category_id)}</p>
                        )}
                    </div>
                    <p className="text-lg font-bold text-slate-900 ml-2">{product.price} TND</p>
                </div>

                <div className="flex items-center justify-between mt-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${product.stock > 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                        Stock: {product.stock}
                    </span>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => onToggleVisibility(product)} className="h-8 w-8 p-0" title={product.is_active ? "Masquer" : "Afficher"}>
                            {product.is_active ? <Eye className="h-4 w-4 text-slate-400" /> : <EyeOff className="h-4 w-4 text-slate-400" />}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => onEdit(product)} className="h-8 w-8 p-0" title="Modifier">
                            <Pencil className="h-4 w-4 text-blue-500" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => onDelete(product.id)} disabled={deletingId === product.id} className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0" title="Supprimer">
                            {deletingId === product.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
