"use client";

import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, MapPin } from "lucide-react";
import { GOUVERNORATS } from "@/types";
import type { Product } from "@/types";

export type Step2Data = {
    customer_governorate: string;
    customer_city: string;
    customer_address: string;
};

interface StepDeliveryProps {
    form: UseFormReturn<Step2Data>;
    product: Product;
    onBack: () => void;
}

export function StepDelivery({ form, product, onBack }: StepDeliveryProps) {
    return (
        <form
            id="step2-form"
            onSubmit={(e) => e.preventDefault()}
            className="space-y-5"
        >
            <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors -ml-1"
            >
                <ArrowLeft className="h-4 w-4" />
                Retour
            </button>

            <div className="space-y-2">
                <Label
                    htmlFor="customer_governorate"
                    className="text-sm font-medium text-slate-700"
                >
                    Gouvernorat
                </Label>
                <Select
                    onValueChange={(value) =>
                        form.setValue("customer_governorate", value)
                    }
                    defaultValue={form.getValues("customer_governorate")}
                >
                    <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50/50 text-base">
                        <SelectValue placeholder="Sélectionnez votre gouvernorat" />
                    </SelectTrigger>
                    <SelectContent>
                        {GOUVERNORATS.map((gov) => (
                            <SelectItem key={gov} value={gov}>
                                {gov}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {form.formState.errors.customer_governorate && (
                    <p className="text-sm text-red-500">
                        {form.formState.errors.customer_governorate.message}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label
                    htmlFor="customer_city"
                    className="text-sm font-medium text-slate-700"
                >
                    Ville / Délégation
                </Label>
                <Input
                    id="customer_city"
                    placeholder="Ex: La Marsa, Sousse Ville..."
                    className="h-12 rounded-xl border-slate-200 bg-slate-50/50 text-base placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                    {...form.register("customer_city")}
                />
                {form.formState.errors.customer_city && (
                    <p className="text-sm text-red-500">
                        {form.formState.errors.customer_city.message}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label
                    htmlFor="customer_address"
                    className="text-sm font-medium text-slate-700"
                >
                    Adresse précise
                </Label>
                <div className="relative">
                    <MapPin className="absolute left-4 top-4 h-4 w-4 text-slate-400" />
                    <Input
                        id="customer_address"
                        placeholder="Rue, numéro, point de repère..."
                        className="h-12 pl-11 rounded-xl border-slate-200 bg-slate-50/50 text-base placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                        {...form.register("customer_address")}
                    />
                </div>
                {form.formState.errors.customer_address && (
                    <p className="text-sm text-red-500">
                        {form.formState.errors.customer_address.message}
                    </p>
                )}
            </div>

            {/* Order Summary */}
            <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 p-4 border border-slate-100">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Produit</span>
                    <span className="font-medium text-slate-700 text-right max-w-[60%] truncate">
                        {product.title}
                    </span>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between items-center">
                    <span className="font-semibold text-slate-900">Total à payer</span>
                    <span className="text-xl font-bold text-emerald-600">
                        {product.price} TND
                    </span>
                </div>
            </div>
        </form>
    );
}
