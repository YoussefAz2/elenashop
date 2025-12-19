Version : 2.1 (Multi-Store Architecture - Fully Implemented)
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

### `stores`
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

### `store_members` (relation users ↔ stores)
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

### `profiles` (données utilisateur uniquement)
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

### `products`, `orders`, `categories`, `leads`, `promos`, `pages`
- Toutes ces tables utilisent `store_id` (pas `user_id`)
- Liées à la table `stores`

## Avantages de cette architecture
- ✅ 1 utilisateur = N boutiques
- ✅ N utilisateurs = 1 boutique (équipes)
- ✅ Rôles : Owner > Admin > Editor
- ✅ Données bien séparées par boutique

---

# 4. FLUX D'AUTHENTIFICATION & NAVIGATION

## Cookie `current_store_id`
- Stocke l'ID de la boutique actuellement sélectionnée
- Défini lors de la création de boutique ou sélection
- Utilisé par toutes les pages dashboard pour charger les données

## Flux de connexion
```
/login
  └── Connexion réussie → /dashboard

/dashboard
  ├── 0 boutiques  → Page "Créez votre boutique" + lien /onboarding
  ├── 1 boutique   → Dashboard direct avec cette boutique
  └── N boutiques  → Page de sélection de boutique
                        └── Clic → set cookie → Dashboard

/onboarding
  ├── A des boutiques → Page "Vous avez déjà une boutique" + lien /dashboard
  └── Pas de boutiques → Formulaire de création (4 étapes)
                            └── Animation → set cookie → /dashboard
```

## Middleware simplifié
- Ne vérifie plus `profiles.store_name` (ancienne architecture)
- Laisse les pages gérer leur propre logique avec `store_members`
- Redirige `/dashboard` et `/onboarding` vers `/login` si non connecté
- Redirige `/login` vers `/dashboard` si déjà connecté

---

# 5. RÈGLES MÉTIER

## Paiement & Checkout
- **Strictement COD** : Pas de Stripe/PayPal
- **Tunnel 2 étapes** :
  - Step 1 (Lead Capture) : Nom + Téléphone (+216)
  - Step 2 (Livraison) : Gouvernorat + Ville + Adresse

## Gestion Vendeur
- **WhatsApp Automation** : Bouton avec message pré-rempli
- **Étiquettes PDF** : Format A6 pour colis

---

# 6. DESIGN SYSTEM

## Ambiance
- Minimaliste & Pro (inspiré Shopify Checkout)
- Couleur d'accent : Vert Émeraude (`emerald-600`)

## Pages Clés
1. **Boutique Publique** (`/[store_slug]`)
2. **Dashboard Vendeur** (`/dashboard`) + sous-pages
3. **Onboarding Wizard** (`/onboarding`) - 4 étapes animées

---

# 7. STRUCTURE DES DOSSIERS

```
src/
├── app/
│   ├── [store_name]/     # Pages boutique publique
│   ├── dashboard/        # Admin vendeur
│   │   ├── page.tsx      # Dashboard principal
│   │   ├── editor/       # Éditeur de boutique
│   │   ├── products/     # Gestion produits
│   │   ├── stats/        # Statistiques
│   │   ├── categories/   # Gestion catégories
│   │   ├── promos/       # Promotions
│   │   ├── leads/        # Paniers abandonnés
│   │   └── billing/      # Facturation
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
├── utils/
│   └── supabase/
│       ├── client.ts    # Client Supabase (browser)
│       ├── server.ts    # Client Supabase (server)
│       └── middleware.ts # Middleware auth simplifié
└── types/
    └── index.ts         # Interfaces TypeScript
```

---

# 8. RÈGLES DE CODE (STRICT)

1. **Modularité** : Max 150 lignes par composant
2. **Séparation** : Logique métier dans `/hooks` ou `/lib`
3. **Types** : Toutes les interfaces dans `/types`
4. **Nommage** : Explicite (`recentOrders`, pas `data`)
5. **Pas de code mort**
6. **Multi-Store** : Toujours utiliser `store_id` (jamais `user_id` pour les données)
7. **Cookie** : Lire `current_store_id` du cookie pour identifier la boutique active

---

# 9. ÉTAT ACTUEL (v2.1)

## ✅ Implémenté
- Architecture multi-store complète
- Création de boutique avec animation
- Dashboard avec sélection de boutique
- Toutes les pages dashboard migrées vers `store_id`
- Middleware simplifié sans boucles de redirection
- Login → Dashboard → Onboarding flow propre

## 🔄 À faire
- Migrer les composants clients vers `store_id` si nécessaire
- Tests complets de tous les flux
- Vérifier les RLS policies Supabase

---

FIN DU DOCUMENT
