Version : 2.0 (Multi-Store Architecture)
Type : Web App / SaaS
Target : Marché Tunisien (Mobile First, Cash-Economy)

# 1. VISION DU PROJET

Plateforme SaaS B2B2C permettant aux vendeurs Instagram/TikTok en Tunisie de créer des boutiques en ligne ultra-simplifiées. 
Optimisée pour le Paiement à la Livraison (COD) et la gestion via WhatsApp.

## Philosophie UX
- **Mobile First Absolu** : 95% du trafic sera mobile
- **Zéro Friction** : Pas de création de compte pour l'acheteur
- **Vitesse** : Interface instantanée

---

# 2. STACK TECHNIQUE

| Catégorie | Technologie |
|-----------|-------------|
| Frontend | Next.js 16+ (App Router) |
| Langage | TypeScript (Strict mode) |
| Styling | Tailwind CSS + Shadcn UI |
| Animations | Framer Motion |
| Icônes | Lucide React |
| Backend/Auth/DB | Supabase (PostgreSQL) |
| Déploiement | Vercel |

---

# 3. ARCHITECTURE BASE DE DONNÉES (v2.0 - Multi-Store)

## Tables principales

### `stores` (nouveau)
```sql
CREATE TABLE stores (
    id UUID PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,        -- URL de la boutique
    name TEXT NOT NULL,
    theme_config JSONB DEFAULT '{}',
    subscription_status TEXT DEFAULT 'free',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `store_members` (nouveau - relation users ↔ stores)
```sql
CREATE TABLE store_members (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    store_id UUID REFERENCES stores(id),
    role TEXT DEFAULT 'owner',  -- owner | admin | editor
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, store_id)
);
```

### `profiles` (simplifié)
```sql
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    first_name TEXT,
    last_name TEXT,
    phone_number TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `products`
```sql
CREATE TABLE products (
    id UUID PRIMARY KEY,
    store_id UUID REFERENCES stores(id),  -- Lié à store, pas user
    title TEXT NOT NULL,
    price NUMERIC NOT NULL,
    image_url TEXT,
    description TEXT,
    stock INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `orders`
```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY,
    store_id UUID REFERENCES stores(id),  -- Lié à store
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_governorate TEXT NOT NULL,
    customer_city TEXT,
    customer_address TEXT,
    product_details JSONB,
    total_price NUMERIC NOT NULL,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Avantages de cette architecture
- ✅ 1 utilisateur = N boutiques
- ✅ N utilisateurs = 1 boutique (équipes)
- ✅ Rôles : Owner > Admin > Editor
- ✅ Données bien séparées

---

# 4. RÈGLES MÉTIER

## Paiement & Checkout
- **Strictement COD** : Pas de Stripe/PayPal
- **Tunnel 2 étapes** :
  - Step 1 (Lead Capture) : Nom + Téléphone (+216)
  - Step 2 (Livraison) : Gouvernorat + Ville + Adresse

## Gestion Vendeur
- **WhatsApp Automation** : Bouton avec message pré-rempli
- **Étiquettes PDF** : Format A6 pour colis

---

# 5. DESIGN SYSTEM

## Ambiance
- Minimaliste & Pro (inspiré Shopify Checkout)
- Couleur d'accent : Vert Émeraude (`emerald-600`)

## Pages Clés
1. **Boutique Publique** (`/[store_slug]`)
2. **Dashboard Vendeur** (`/dashboard`)
3. **Onboarding Wizard** (`/onboarding`) - 4 étapes animées

---

# 6. STRUCTURE DES DOSSIERS

```
src/
├── app/
│   ├── [store_name]/     # Pages boutique publique
│   ├── dashboard/        # Admin vendeur
│   ├── login/           # Authentification
│   └── onboarding/      # Wizard création boutique
├── components/
│   ├── ui/              # Composants atomiques
│   ├── dashboard/       # Composants admin
│   ├── store/           # Composants boutique
│   └── auth/            # Composants auth
├── lib/
│   ├── stores.ts        # Helpers multi-boutique
│   └── onboarding-data.ts # Smart matching templates
└── types/
    └── index.ts         # Interfaces TypeScript
```

---

# 7. RÈGLES DE CODE (STRICT)

1. **Modularité** : Max 150 lignes par composant
2. **Séparation** : Logique métier dans `/hooks` ou `/lib`
3. **Types** : Toutes les interfaces dans `/types`
4. **Nommage** : Explicite (`recentOrders`, pas `data`)
5. **Pas de code mort**

---

FIN DU DOCUMENT
