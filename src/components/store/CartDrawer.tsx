"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/utils/supabase/client";
import type { Product, ButtonStyles } from "@/types";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ChevronRight, Loader2 } from "lucide-react";

import {
    StepContact,
    StepDelivery,
    SuccessView,
    COUNTRY_CODES,
    type Step1Data,
    type Step2Data,
    type CountryCode,
} from "./checkout";

// Dynamic schema based on country
const getPhoneSchema = (countryCode: CountryCode) => {
    const country = COUNTRY_CODES.find((c) => c.code === countryCode);
    const digits = country?.digits || 8;
    return z
        .string()
        .regex(
            new RegExp(`^\\d{${digits}}$`),
            `Le numéro doit contenir exactement ${digits} chiffres`
        );
};

const step1Schema = (countryCode: CountryCode) =>
    z.object({
        customer_name: z
            .string()
            .min(3, "Le nom doit contenir au moins 3 caractères"),
        customer_phone: getPhoneSchema(countryCode),
    });

const step2Schema = z.object({
    customer_governorate: z.string().min(1, "Sélectionnez un gouvernorat"),
    customer_city: z
        .string()
        .min(2, "La ville doit contenir au moins 2 caractères"),
    customer_address: z
        .string()
        .min(5, "L'adresse doit contenir au moins 5 caractères"),
});

interface CartDrawerProps {
    product: Product;
    sellerId: string;
    storeName: string;
    buttonStyles: ButtonStyles;
    borderRadius?: string;
}

export function CartDrawer({
    product,
    sellerId,
    storeName,
    buttonStyles,
    borderRadius = "0.5rem",
}: CartDrawerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState<1 | 2 | "success">(1);
    const [isLoading, setIsLoading] = useState(false);
    const [step1Data, setStep1Data] = useState<
        (Step1Data & { countryCode: CountryCode }) | null
    >(null);
    const [countryCode, setCountryCode] = useState<CountryCode>("+216");
    const [isMobile, setIsMobile] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 640);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const form1 = useForm<Step1Data>({
        resolver: zodResolver(step1Schema(countryCode)),
        defaultValues: {
            customer_name: "",
            customer_phone: "",
        },
    });

    useEffect(() => {
        if (form1.getValues("customer_phone")) {
            form1.trigger("customer_phone");
        }
    }, [countryCode, form1]);

    const form2 = useForm<Step2Data>({
        resolver: zodResolver(step2Schema),
        defaultValues: {
            customer_governorate: "",
            customer_city: "",
            customer_address: "",
        },
    });

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            setStep(1);
            setStep1Data(null);
            setCountryCode("+216");
            form1.reset();
            form2.reset();
        }
    };

    const onSubmitStep1 = async () => {
        const isValid = await form1.trigger();
        if (!isValid) return;

        const data = form1.getValues();
        setIsLoading(true);
        try {
            const fullPhone = `${countryCode}${data.customer_phone}`;
            await supabase.from("leads").insert({
                user_id: sellerId,
                customer_name: data.customer_name,
                customer_phone: fullPhone,
            });
            setStep1Data({ ...data, countryCode });
            setStep(2);
        } catch (error) {
            console.error("Erreur lors de la sauvegarde du lead:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmitStep2 = async () => {
        const isValid = await form2.trigger();
        if (!isValid || !step1Data) return;

        const data = form2.getValues();
        setIsLoading(true);
        try {
            const fullPhone = `${step1Data.countryCode}${step1Data.customer_phone}`;
            const { error } = await supabase.from("orders").insert({
                user_id: sellerId,
                customer_name: step1Data.customer_name,
                customer_phone: fullPhone,
                customer_governorate: data.customer_governorate,
                customer_city: data.customer_city,
                customer_address: data.customer_address,
                product_details: {
                    title: product.title,
                    price: product.price,
                    quantity: 1,
                },
                total_price: product.price,
                status: "new",
            });
            if (error) throw error;
            setStep("success");
        } catch (error) {
            console.error("Erreur lors de la création de la commande:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={handleOpenChange}>
            <SheetTrigger asChild>
                <button
                    className="w-full h-12 font-semibold text-base transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                        backgroundColor: buttonStyles.backgroundColor,
                        color: buttonStyles.textColor,
                        borderRadius,
                    }}
                    disabled={product.stock === 0}
                >
                    {product.stock === 0 ? "Indisponible" : "COMMANDER"}
                </button>
            </SheetTrigger>
            <SheetContent
                side={isMobile ? "bottom" : "right"}
                className={`
          ${isMobile
                        ? "h-[90vh] rounded-t-3xl"
                        : "w-full max-w-[400px] border-l-0 shadow-2xl"
                    }
          flex flex-col p-0 overflow-hidden
        `}
            >
                {step === "success" ? (
                    <SuccessView
                        storeName={storeName}
                        onClose={() => handleOpenChange(false)}
                    />
                ) : (
                    <div className="flex flex-col h-full">
                        <div className="px-6 pt-6 pb-4">
                            <SheetHeader className="text-left">
                                <SheetTitle className="text-2xl font-bold tracking-tight">
                                    {step === 1 ? "Vos coordonnées" : "Adresse de livraison"}
                                </SheetTitle>
                                <SheetDescription className="text-sm text-slate-500">
                                    Étape {step}/2 • {product.title}
                                </SheetDescription>
                            </SheetHeader>

                            <div className="mt-4 flex gap-2">
                                <div
                                    className="h-1 flex-1 rounded-full transition-colors"
                                    style={{ backgroundColor: step >= 1 ? buttonStyles.backgroundColor : "#e5e7eb" }}
                                />
                                <div
                                    className="h-1 flex-1 rounded-full transition-colors"
                                    style={{ backgroundColor: step >= 2 ? buttonStyles.backgroundColor : "#e5e7eb" }}
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6">
                            {step === 1 ? (
                                <StepContact
                                    form={form1}
                                    countryCode={countryCode}
                                    onCountryCodeChange={setCountryCode}
                                />
                            ) : (
                                <StepDelivery
                                    form={form2}
                                    product={product}
                                    onBack={() => setStep(1)}
                                />
                            )}
                        </div>

                        <div className="p-4 bg-white/95 backdrop-blur-sm border-t border-slate-100">
                            <button
                                type="button"
                                onClick={step === 1 ? onSubmitStep1 : onSubmitStep2}
                                className="w-full h-14 font-semibold text-base transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                                style={{
                                    backgroundColor: buttonStyles.backgroundColor,
                                    color: buttonStyles.textColor,
                                    borderRadius: "9999px",
                                    boxShadow: `0 8px 24px ${buttonStyles.backgroundColor}40`,
                                }}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : step === 1 ? (
                                    <>
                                        Suivant
                                        <ChevronRight className="h-5 w-5" />
                                    </>
                                ) : (
                                    "CONFIRMER · Paiement à la livraison"
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
