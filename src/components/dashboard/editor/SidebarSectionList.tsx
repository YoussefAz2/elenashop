"use client";

import {
    Image,
    ShoppingBag,
    Footprints,
    Megaphone,
    PanelTop,
    User,
    FileText,
    Phone,
    HelpCircle,
    MessageCircle,
    Gift,
    Search,
    Star,
    ChevronRight,
} from "lucide-react";

// Section definition
export type SectionId =
    | "header"
    | "announcement"
    | "hero"
    | "products"
    | "testimonials"
    | "about"
    | "footer"
    | "about-page"
    | "contact-page"
    | "faq-page"
    | "whatsapp"
    | "promos"
    | "seo";

export interface Section {
    id: SectionId;
    label: string;
    icon: React.ReactNode;
    category: "home" | "pages" | "marketing" | "seo";
}

export const SECTIONS: Section[] = [
    // Home sections
    { id: "header", label: "En-tête", icon: <PanelTop className="h-4 w-4" />, category: "home" },
    { id: "announcement", label: "Bandeau annonce", icon: <Megaphone className="h-4 w-4" />, category: "home" },
    { id: "hero", label: "Bannière principale", icon: <Image className="h-4 w-4" />, category: "home" },
    { id: "products", label: "Grille produits", icon: <ShoppingBag className="h-4 w-4" />, category: "home" },
    { id: "testimonials", label: "Témoignages", icon: <Star className="h-4 w-4" />, category: "home" },
    { id: "about", label: "À propos (accueil)", icon: <User className="h-4 w-4" />, category: "home" },
    { id: "footer", label: "Pied de page", icon: <Footprints className="h-4 w-4" />, category: "home" },
    // Pages
    { id: "about-page", label: "Page À propos", icon: <FileText className="h-4 w-4" />, category: "pages" },
    { id: "contact-page", label: "Page Contact", icon: <Phone className="h-4 w-4" />, category: "pages" },
    { id: "faq-page", label: "Page FAQ", icon: <HelpCircle className="h-4 w-4" />, category: "pages" },
    // Marketing
    { id: "whatsapp", label: "WhatsApp Flottant", icon: <MessageCircle className="h-4 w-4" />, category: "marketing" },
    { id: "promos", label: "Promotions", icon: <Gift className="h-4 w-4" />, category: "marketing" },
    // SEO
    { id: "seo", label: "SEO & Référencement", icon: <Search className="h-4 w-4" />, category: "seo" },
];

const CATEGORIES = [
    { key: "home" as const, label: "SECTIONS ACCUEIL" },
    { key: "pages" as const, label: "PAGES" },
    { key: "marketing" as const, label: "MARKETING" },
    { key: "seo" as const, label: "RÉFÉRENCEMENT" },
];

interface SidebarSectionListProps {
    onSelectSection: (sectionId: SectionId) => void;
}

export function SidebarSectionList({ onSelectSection }: SidebarSectionListProps) {
    return (
        <div className="space-y-6">
            {CATEGORIES.map((category) => {
                const categorySections = SECTIONS.filter((s) => s.category === category.key);
                if (categorySections.length === 0) return null;

                return (
                    <div key={category.key}>
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1 mb-3">
                            {category.label}
                        </h3>
                        <div className="space-y-1">
                            {categorySections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => onSelectSection(section.id)}
                                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-150 group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                                            {section.icon}
                                        </div>
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                            {section.label}
                                        </span>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors" />
                                </button>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
