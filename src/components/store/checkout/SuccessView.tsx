"use client";

import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuccessViewProps {
    storeName: string;
    onClose: () => void;
}

export function SuccessView({ storeName, onClose }: SuccessViewProps) {
    return (
        <div className="flex flex-col items-center justify-center h-full py-12 px-6 text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200">
                <CheckCircle className="h-12 w-12 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
                Merci pour votre commande !
            </h2>
            <p className="mt-3 text-slate-500 max-w-[280px]">
                L&apos;équipe de{" "}
                <span className="font-semibold text-slate-700">{storeName}</span> vous
                contactera très bientôt.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm text-amber-700">
                <span>💵</span>
                <span>Paiement à la livraison</span>
            </div>
            <Button
                onClick={onClose}
                className="mt-8 rounded-full px-8"
                variant="outline"
            >
                Continuer mes achats
            </Button>
        </div>
    );
}
