"use client";

import { MessageCircle } from "lucide-react";

interface FloatingWhatsAppProps {
    phoneNumber: string;
    message?: string;
    position?: "left" | "right";
    backgroundColor?: string;
}

export function FloatingWhatsApp({
    phoneNumber,
    message = "Bonjour, j'ai une question !",
    position = "right",
    backgroundColor = "#25D366",
}: FloatingWhatsAppProps) {
    if (!phoneNumber) return null;

    // Clean phone number (remove non-digits)
    const cleanPhone = phoneNumber.replace(/\D/g, "");
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

    const positionClass = position === "left" ? "left-4" : "right-4";

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`fixed bottom-4 ${positionClass} z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform`}
            style={{ backgroundColor }}
            aria-label="Contacter sur WhatsApp"
        >
            <MessageCircle className="w-7 h-7 text-white" fill="white" />
        </a>
    );
}
