"use client";

import { useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    folder?: string;
    className?: string;
}

export function ImageUpload({ value, onChange, folder = "logos", className = "" }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            setError("Veuillez sélectionner une image");
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            setError("Image trop lourde (max 2MB)");
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            const fileExt = file.name.split(".").pop();
            const fileName = `${folder}/${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from("assets")
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from("assets")
                .getPublicUrl(fileName);

            onChange(publicUrl);
        } catch (err) {
            setError("Erreur lors de l'upload");
            console.error(err);
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemove = () => {
        onChange("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className={`space-y-2 ${className}`}>
            <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                ref={fileInputRef}
                className="hidden"
            />

            {value ? (
                <div className="relative inline-block">
                    <img
                        src={value}
                        alt="Logo"
                        className="w-20 h-20 object-contain rounded-lg border bg-slate-50"
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="h-20 w-full border-dashed"
                >
                    {isUploading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <div className="flex flex-col items-center gap-1">
                            <Upload className="w-5 h-5" />
                            <span className="text-xs">Télécharger logo</span>
                        </div>
                    )}
                </Button>
            )}

            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}
