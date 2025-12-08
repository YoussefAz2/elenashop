"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Printer, Package, MapPin, Phone, DollarSign } from "lucide-react";
import type { Order } from "@/types";

interface ShippingLabelProps {
    order: Order;
    storeName: string;
    onClose?: () => void;
}

export function ShippingLabel({ order, storeName, onClose }: ShippingLabelProps) {
    const labelRef = useRef<HTMLDivElement>(null);

    const productDetails = order.product_details as {
        title: string;
        price: number;
        quantity?: number;
    } | null;

    const handlePrint = () => {
        const printContent = labelRef.current;
        if (!printContent) return;

        const printWindow = window.open("", "_blank");
        if (!printWindow) {
            alert("Veuillez autoriser les popups pour imprimer");
            return;
        }

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Étiquette - ${order.customer_name}</title>
                <style>
                    @page {
                        size: 105mm 148mm; /* A6 format */
                        margin: 0;
                    }
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        width: 105mm;
                        height: 148mm;
                        padding: 8mm;
                        display: flex;
                        flex-direction: column;
                    }
                    .header {
                        text-align: center;
                        padding-bottom: 4mm;
                        border-bottom: 2px solid #000;
                        margin-bottom: 4mm;
                    }
                    .store-name {
                        font-size: 16pt;
                        font-weight: bold;
                        text-transform: uppercase;
                        letter-spacing: 2px;
                    }
                    .label-title {
                        font-size: 10pt;
                        color: #666;
                        margin-top: 2mm;
                    }
                    .section {
                        margin-bottom: 4mm;
                    }
                    .section-title {
                        font-size: 8pt;
                        color: #666;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        margin-bottom: 1mm;
                    }
                    .recipient-name {
                        font-size: 14pt;
                        font-weight: bold;
                    }
                    .phone {
                        font-size: 12pt;
                        font-weight: bold;
                        margin-top: 2mm;
                    }
                    .address {
                        font-size: 11pt;
                        line-height: 1.4;
                        margin-top: 2mm;
                    }
                    .address-line {
                        margin-bottom: 1mm;
                    }
                    .governorate {
                        font-weight: bold;
                        font-size: 12pt;
                    }
                    .product-section {
                        background: #f5f5f5;
                        padding: 3mm;
                        border-radius: 2mm;
                        margin: 4mm 0;
                    }
                    .product-name {
                        font-size: 10pt;
                    }
                    .amount-section {
                        margin-top: auto;
                        text-align: center;
                        padding: 4mm;
                        border: 3px solid #000;
                        border-radius: 2mm;
                    }
                    .amount-label {
                        font-size: 9pt;
                        color: #666;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                    }
                    .amount {
                        font-size: 24pt;
                        font-weight: bold;
                    }
                    .currency {
                        font-size: 14pt;
                    }
                    .footer {
                        text-align: center;
                        font-size: 8pt;
                        color: #999;
                        margin-top: 3mm;
                    }
                    .order-id {
                        font-family: monospace;
                        font-size: 8pt;
                        color: #666;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="store-name">${storeName}</div>
                    <div class="label-title">Étiquette de livraison</div>
                </div>
                
                <div class="section">
                    <div class="section-title">Destinataire</div>
                    <div class="recipient-name">${order.customer_name}</div>
                    <div class="phone">📞 ${order.customer_phone}</div>
                </div>
                
                <div class="section">
                    <div class="section-title">Adresse de livraison</div>
                    <div class="address">
                        <div class="governorate">${order.customer_governorate}</div>
                        ${order.customer_city ? `<div class="address-line">${order.customer_city}</div>` : ""}
                        ${order.customer_address ? `<div class="address-line">${order.customer_address}</div>` : ""}
                    </div>
                </div>
                
                ${productDetails ? `
                <div class="product-section">
                    <div class="section-title">Colis</div>
                    <div class="product-name">
                        ${productDetails.quantity && productDetails.quantity > 1 ? `${productDetails.quantity}x ` : ""}
                        ${productDetails.title}
                    </div>
                </div>
                ` : ""}
                
                <div class="amount-section">
                    <div class="amount-label">Montant à encaisser</div>
                    <div class="amount">${order.total_price} <span class="currency">TND</span></div>
                </div>
                
                <div class="footer">
                    <div class="order-id">Réf: ${order.id.slice(0, 8).toUpperCase()}</div>
                </div>
            </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.focus();

        // Wait for styles to load then print
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden">
                {/* Preview */}
                <div
                    ref={labelRef}
                    className="p-6 bg-white border-b"
                    style={{ aspectRatio: "105/148" }}
                >
                    {/* Header */}
                    <div className="text-center pb-3 border-b-2 border-black mb-3">
                        <h2 className="text-lg font-bold uppercase tracking-widest">{storeName}</h2>
                        <p className="text-xs text-slate-500">Étiquette de livraison</p>
                    </div>

                    {/* Recipient */}
                    <div className="mb-3">
                        <p className="text-[10px] uppercase tracking-wide text-slate-400">Destinataire</p>
                        <p className="font-bold text-lg">{order.customer_name}</p>
                        <p className="font-semibold flex items-center gap-1 mt-1">
                            <Phone className="h-3 w-3" />
                            {order.customer_phone}
                        </p>
                    </div>

                    {/* Address */}
                    <div className="mb-3">
                        <p className="text-[10px] uppercase tracking-wide text-slate-400">Adresse</p>
                        <div className="flex items-start gap-1 mt-0.5">
                            <MapPin className="h-3 w-3 mt-0.5 text-slate-400" />
                            <div className="text-sm">
                                <p className="font-semibold">{order.customer_governorate}</p>
                                {order.customer_city && <p>{order.customer_city}</p>}
                                {order.customer_address && <p className="text-slate-500 text-xs">{order.customer_address}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Product */}
                    {productDetails && (
                        <div className="bg-slate-100 rounded-lg p-2 mb-3">
                            <p className="text-[10px] uppercase tracking-wide text-slate-400">Colis</p>
                            <p className="text-sm flex items-center gap-1">
                                <Package className="h-3 w-3" />
                                {productDetails.quantity && productDetails.quantity > 1 && (
                                    <span className="font-semibold">{productDetails.quantity}x</span>
                                )}
                                {productDetails.title}
                            </p>
                        </div>
                    )}

                    {/* Amount */}
                    <div className="border-2 border-black rounded-lg p-3 text-center mt-auto">
                        <p className="text-[10px] uppercase tracking-wide text-slate-500">Montant à encaisser</p>
                        <p className="text-2xl font-bold flex items-center justify-center gap-1">
                            <DollarSign className="h-5 w-5" />
                            {order.total_price} <span className="text-sm font-normal">TND</span>
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-4 bg-slate-50 flex gap-2">
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={onClose}
                    >
                        Fermer
                    </Button>
                    <Button
                        onClick={handlePrint}
                        className="flex-1 bg-slate-900 hover:bg-slate-800"
                    >
                        <Printer className="h-4 w-4 mr-2" />
                        Imprimer PDF
                    </Button>
                </div>
            </div>
        </div>
    );
}
