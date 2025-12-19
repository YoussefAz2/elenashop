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
    Package,
    Plus,
    Trash2,
    Loader2,
    ImagePlus,
    ArrowLeft,
    ShoppingBag,
    Pencil,
    Eye,
    EyeOff,
    X,
    ChevronLeft,
    ChevronRight,
    AlignVerticalJustifyStart,
    AlignVerticalJustifyCenter,
    AlignVerticalJustifyEnd,
} from "lucide-react";
import Image from "next/image";
import type { Profile, Product, Category } from "@/types";

interface ProductsClientProps {
    seller: Profile;
    products: Product[];
    categories: Category[];
}

export function ProductsClient({ seller, products: initialProducts, categories }: ProductsClientProps) {
    const [products, setProducts] = useState(initialProducts);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Form state
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

    const resetForm = () => {
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

    const openNewDialog = () => {
        resetForm();
        setIsDialogOpen(true);
    };

    const openEditDialog = (product: Product) => {
        setEditingProduct(product);
        setTitle(product.title);
        setPrice(String(product.price));
        setDescription(product.description || "");
        setStock(String(product.stock));
        setCategoryId(product.category_id || "");
        setIsActive(product.is_active);

        // Combine main image and additional images
        const allImages: string[] = [];
        if (product.image_url) allImages.push(product.image_url);
        if (product.images && Array.isArray(product.images)) {
            allImages.push(...product.images);
        }
        setExistingImages(allImages);
        setImagePosition((product.image_position as "center" | "top" | "bottom") || "center");
        setImagePreviews([]);
        setImageFiles([]);
        setIsDialogOpen(true);
    };

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

    // Set an existing image as the main (first) image
    const setAsMainImage = (index: number) => {
        if (index === 0) return; // Already main
        const newOrder = [...existingImages];
        const [moved] = newOrder.splice(index, 1);
        newOrder.unshift(moved);
        setExistingImages(newOrder);
    };

    // Move a new image to be the main image (before existing images)
    const setNewAsMain = (index: number) => {
        // Move the new image preview to the front of existing images
        const url = imagePreviews[index];
        const file = imageFiles[index];

        // Remove from new images
        setImagePreviews(imagePreviews.filter((_, i) => i !== index));
        setImageFiles(imageFiles.filter((_, i) => i !== index));

        // Create temp marker - we'll need to upload this first
        // For simplicity, we'll just reorder - new images go after existing
        // But user can upload and then reorder after save
        setError("Enregistrez d'abord, puis vous pourrez réordonner les images");
    };

    const uploadImages = async (): Promise<{ mainImage: string | null; additionalImages: string[] }> => {
        const allImageUrls: string[] = [...existingImages];

        // Upload new images
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

        // First image is main, rest are additional
        const mainImage = allImageUrls[0] || null;
        const additionalImages = allImageUrls.slice(1);

        return { mainImage, additionalImages };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
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

            resetForm();
            setIsDialogOpen(false);
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur inconnue");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (productId: string) => {
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

    const toggleVisibility = async (product: Product) => {
        try {
            await supabase.from("products").update({ is_active: !product.is_active }).eq("id", product.id);
            setProducts(products.map(p => p.id === product.id ? { ...p, is_active: !p.is_active } : p));
        } catch {
            alert("Erreur");
        }
    };

    const getCategoryName = (id: string | null) => categories.find(c => c.id === id)?.name || "";

    const getImageCount = (product: Product) => {
        let count = product.image_url ? 1 : 0;
        if (product.images && Array.isArray(product.images)) {
            count += product.images.length;
        }
        return count;
    };

    const allPreviews = [...existingImages, ...imagePreviews];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
                <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
                    <div className="flex items-center gap-3">
                        <a href="/dashboard" className="text-slate-500 hover:text-slate-700">
                            <ArrowLeft className="h-5 w-5" />
                        </a>
                        <div className="flex items-center gap-2">
                            <Package className="h-5 w-5 text-emerald-600" />
                            <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">Mes Produits</h1>
                        </div>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={openNewDialog} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-4">
                                <Plus className="h-4 w-4 mr-2" />
                                Nouveau
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>{editingProduct ? "Modifier le produit" : "Ajouter un produit"}</DialogTitle>
                                <DialogDescription>
                                    {editingProduct ? "Modifiez les informations du produit" : "Remplissez les informations de votre produit"}
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                                {error && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</div>}

                                {/* Images Gallery */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label>Images du produit</Label>
                                        <span className="text-xs text-slate-400">{allPreviews.length}/5</span>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2">
                                        {/* Existing images */}
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
                                                {idx === 0 ? (
                                                    <span className="absolute bottom-1 left-1 text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded flex items-center gap-1">
                                                        ⭐ Principal
                                                    </span>
                                                ) : (
                                                    <span className="absolute bottom-1 left-1 text-[10px] bg-slate-800/70 text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100">
                                                        Cliquez = principal
                                                    </span>
                                                )}
                                            </div>
                                        ))}

                                        {/* New image previews */}
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

                                        {/* Add button */}
                                        {allPreviews.length < 5 && (
                                            <div
                                                className="aspect-square border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 transition-colors"
                                                onClick={() => document.getElementById("image-input")?.click()}
                                            >
                                                <ImagePlus className="h-6 w-6 text-slate-300" />
                                                <span className="text-xs text-slate-400 mt-1">Ajouter</span>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        id="image-input"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleAddImages}
                                        className="hidden"
                                    />
                                    <p className="text-xs text-slate-400">La première image sera l'image principale</p>

                                    {/* Image Position */}
                                    <div className="space-y-2 mt-3">
                                        <Label>Position de l'image dans la carte</Label>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setImagePosition("top")}
                                                className={`flex-1 flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-colors ${imagePosition === "top"
                                                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                                    : "border-slate-200 hover:border-slate-300"
                                                    }`}
                                            >
                                                <AlignVerticalJustifyStart className="h-5 w-5" />
                                                <span className="text-xs">Haut</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setImagePosition("center")}
                                                className={`flex-1 flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-colors ${imagePosition === "center"
                                                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                                    : "border-slate-200 hover:border-slate-300"
                                                    }`}
                                            >
                                                <AlignVerticalJustifyCenter className="h-5 w-5" />
                                                <span className="text-xs">Centre</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setImagePosition("bottom")}
                                                className={`flex-1 flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-colors ${imagePosition === "bottom"
                                                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                                    : "border-slate-200 hover:border-slate-300"
                                                    }`}
                                            >
                                                <AlignVerticalJustifyEnd className="h-5 w-5" />
                                                <span className="text-xs">Bas</span>
                                            </button>
                                        </div>
                                        <p className="text-xs text-slate-400">Contrôle quelle partie de l'image est visible dans les cartes produit</p>
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
                                <Button type="submit" className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : editingProduct ? "Enregistrer les modifications" : "Ajouter le produit"}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </header>

            <main className="mx-auto max-w-4xl px-4 py-6">
                {products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                            <ShoppingBag className="h-10 w-10 text-slate-300" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900">Aucun produit</h2>
                        <p className="mt-1 text-sm text-slate-500">Ajoutez votre premier produit pour commencer à vendre</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {products.map((product) => (
                            <ProductListItem
                                key={product.id}
                                product={product}
                                getCategoryName={getCategoryName}
                                getImageCount={getImageCount}
                                onEdit={openEditDialog}
                                onDelete={handleDelete}
                                onToggleVisibility={toggleVisibility}
                                deletingId={deletingId}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

// Sub-component for product list item with image carousel
function ProductListItem({
    product,
    getCategoryName,
    getImageCount,
    onEdit,
    onDelete,
    onToggleVisibility,
    deletingId,
}: {
    product: Product;
    getCategoryName: (id: string | null) => string;
    getImageCount: (product: Product) => number;
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
        <Card className={`border-0 shadow-sm overflow-hidden ${!product.is_active ? "opacity-60" : ""}`}>
            <div className="flex">
                {/* Image with carousel */}
                <div className="relative w-28 h-28 flex-shrink-0 bg-slate-100 group">
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
                                        className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
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
                            <Package className="h-8 w-8 text-slate-300" />
                        </div>
                    )}
                    {!product.is_active && (
                        <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
                            <EyeOff className="h-5 w-5 text-white" />
                        </div>
                    )}
                </div>

                {/* Info */}
                <CardContent className="flex-1 p-3 flex flex-col justify-between">
                    <div>
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="font-medium text-slate-900 line-clamp-1">{product.title}</h3>
                                <div className="flex items-center gap-2 mt-0.5">
                                    {product.category_id && (
                                        <span className="text-xs text-slate-400">{getCategoryName(product.category_id)}</span>
                                    )}
                                    {allImages.length > 1 && (
                                        <span className="text-xs text-blue-500">{allImages.length} photos</span>
                                    )}
                                </div>
                            </div>
                            <p className="text-lg font-bold text-emerald-600">{product.price} TND</p>
                        </div>
                        {product.description && (
                            <p className="text-xs text-slate-500 mt-1 line-clamp-1">{product.description}</p>
                        )}
                    </div>
                    <div className="flex items-center justify-between mt-2">
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
            </div>
        </Card>
    );
}
