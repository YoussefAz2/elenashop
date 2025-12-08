// Template configuration with pricing

export interface TemplateConfig {
    id: "minimal" | "luxe" | "street";
    name: string;
    description: string;
    preview: string;
    isPremium: boolean;
    price: number | null; // in TND, null if free
}

export const TEMPLATES: TemplateConfig[] = [
    {
        id: "minimal",
        name: "Minimal",
        description: "Épuré et professionnel",
        preview: "from-slate-100 to-white",
        isPremium: false,
        price: null,
    },
    {
        id: "luxe",
        name: "Luxe",
        description: "Élégant et premium",
        preview: "from-zinc-900 to-black",
        isPremium: true,
        price: 49,
    },
    {
        id: "street",
        name: "Street",
        description: "Urbain et audacieux",
        preview: "from-violet-600 to-purple-900",
        isPremium: true,
        price: 49,
    },
];

export function getTemplateConfig(templateId: string): TemplateConfig | undefined {
    return TEMPLATES.find((t) => t.id === templateId);
}

export function isTemplatePremium(templateId: string): boolean {
    const template = getTemplateConfig(templateId);
    return template?.isPremium ?? false;
}

export function getTemplatePrice(templateId: string): number | null {
    const template = getTemplateConfig(templateId);
    return template?.price ?? null;
}
