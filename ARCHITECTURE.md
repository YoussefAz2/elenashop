# 📦 ElenaShop – Architecture Technique V2.1

## Structure des Dossiers

```
src/
├── app/                    # Next.js App Router (Pages)
│   ├── dashboard/          # Pages Dashboard seller
│   ├── store/[slug]/       # Pages publiques boutique
│   ├── api/                # API Routes
│   └── (auth)/             # Pages Login/Register
│
├── components/
│   ├── auth/               # Formulaires Auth + Animation Onboarding
│   ├── dashboard/          # Composants Dashboard
│   │   ├── editor/         # Éditeur visuel (10 fichiers)
│   │   └── orders/         # Gestion commandes (4 fichiers)
│   ├── editor/             # Logique d'édition live (8 fichiers)
│   ├── landing/            # Page d'accueil marketing
│   ├── providers/          # Context Providers
│   ├── store/              # Composants Storefront public
│   │   ├── templates/      # Templates (Minimal, Luxe, Street)
│   │   ├── checkout/       # Tunnel de commande
│   │   ├── common/         # Headers, Footers, etc.
│   │   └── pages/          # Pages dynamiques (About, Contact)
│   └── ui/                 # Primitifs UI (shadcn/ui)
│
├── hooks/                  # Custom React Hooks
├── lib/                    # Logique métier (stores, products, promos)
├── types/                  # TypeScript Types/Interfaces
└── utils/                  # Helpers (supabase client, formatters)
```

---

## Conventions de Nommage

| Type | Convention | Exemple |
|------|------------|---------|
| Composants | PascalCase | `ProductCard.tsx` |
| Fichiers page | kebab-case | `products-client.tsx` |
| Hooks | camelCase + use | `useEditorState.ts` |
| Types/Interfaces | PascalCase | `Store`, `Product` |
| Variables | camelCase | `storeName`, `isLoading` |

---

## Templates Boutique

| ID | Nom | Description |
|----|-----|-------------|
| `minimal` | Minimal | Clean, vert émeraude, moderne |
| `luxe` | Luxe | Noir/Or, serif, premium |
| `street` | Street | Violet néon, mono, urbain |

---

## Fonctionnalités V2.1

### Dashboard Seller
- ✅ Multi-Store (création, switch, isolation)
- ✅ Gestion Produits (CRUD, images, catégories)
- ✅ Gestion Commandes (statuts, labels)
- ✅ Leads (collecte, export)
- ✅ Promotions (codes, réductions)
- ✅ Éditeur Visuel Live (couleurs, typo, sections)
- ✅ Stats & Analytics

### Storefront Public
- ✅ 3 Templates (Minimal, Luxe, Street)
- ✅ Panier (Drawer)
- ✅ Checkout WhatsApp intégré
- ✅ Pages dynamiques (About, Contact)
- ✅ SEO optimisé

### Sécurité
- ✅ RLS Supabase (Row Level Security)
- ✅ Auth via Supabase Auth
- ✅ Variables d'environnement (pas de secrets en dur)

---

## Stack Technique

- **Framework** : Next.js 15 (App Router)
- **UI** : Tailwind CSS + shadcn/ui
- **Animations** : Framer Motion
- **Database** : Supabase (PostgreSQL)
- **Auth** : Supabase Auth
- **Hosting** : Vercel
