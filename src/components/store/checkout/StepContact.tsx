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

// Country codes configuration
export const COUNTRY_CODES = [
    { code: "+216", country: "TN", flag: "🇹🇳", digits: 8 },
    { code: "+33", country: "FR", flag: "🇫🇷", digits: 9 },
    { code: "+1", country: "CA", flag: "🇨🇦", digits: 10 },
] as const;

export type CountryCode = (typeof COUNTRY_CODES)[number]["code"];

export type Step1Data = { customer_name: string; customer_phone: string };

interface StepContactProps {
    form: UseFormReturn<Step1Data>;
    countryCode: CountryCode;
    onCountryCodeChange: (code: CountryCode) => void;
}

export function StepContact({
    form,
    countryCode,
    onCountryCodeChange,
}: StepContactProps) {
    const selectedCountry = COUNTRY_CODES.find((c) => c.code === countryCode)!;

    return (
        <form
            id="step1-form"
            onSubmit={(e) => e.preventDefault()}
            className="space-y-5"
        >
            <div className="space-y-2">
                <Label
                    htmlFor="customer_name"
                    className="text-sm font-medium text-slate-700"
                >
                    Nom complet
                </Label>
                <Input
                    id="customer_name"
                    placeholder="Votre nom et prénom"
                    className="h-12 rounded-xl border-slate-200 bg-slate-50/50 text-base placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                    {...form.register("customer_name")}
                />
                {form.formState.errors.customer_name && (
                    <p className="text-sm text-red-500">
                        {form.formState.errors.customer_name.message}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label
                    htmlFor="customer_phone"
                    className="text-sm font-medium text-slate-700"
                >
                    Numéro de téléphone
                </Label>
                <div className="flex gap-2">
                    {/* Country Code Selector */}
                    <Select
                        value={countryCode}
                        onValueChange={(v) => onCountryCodeChange(v as CountryCode)}
                    >
                        <SelectTrigger className="w-[100px] h-12 rounded-xl border-slate-200 bg-slate-50/50">
                            <SelectValue>
                                <span className="flex items-center gap-1.5">
                                    <span className="text-lg">{selectedCountry.flag}</span>
                                    <span className="text-sm text-slate-600">
                                        {selectedCountry.code}
                                    </span>
                                </span>
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {COUNTRY_CODES.map((country) => (
                                <SelectItem key={country.code} value={country.code}>
                                    <span className="flex items-center gap-2">
                                        <span className="text-lg">{country.flag}</span>
                                        <span>{country.code}</span>
                                        <span className="text-slate-400 text-xs">
                                            ({country.digits} chiffres)
                                        </span>
                                    </span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Input
                        id="customer_phone"
                        placeholder={`${"0".repeat(selectedCountry.digits)}`}
                        className="flex-1 h-12 rounded-xl border-slate-200 bg-slate-50/50 text-base placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                        {...form.register("customer_phone")}
                    />
                </div>
                {form.formState.errors.customer_phone && (
                    <p className="text-sm text-red-500">
                        {form.formState.errors.customer_phone.message}
                    </p>
                )}
            </div>
        </form>
    );
}
