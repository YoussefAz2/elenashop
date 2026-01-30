Version : 3.0 (Visual Editor + Multi-Store Architecture)
Type : Web App / SaaS
Target : Marché Tunisien (Mobile First, Cash-Economy)
Last Update : 2025-01-30

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
- ✅ 1 utilisateur = N boutiques (max 3)
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
  └── Connexion réussie → /stores

/stores
  ├── 0 boutiques  → Redirect /onboarding
  ├── 1 boutique   → Auto-select + Redirect /dashboard
  └── N boutiques  → Page de sélection de boutique
                        └── Clic → set cookie → /dashboard

/onboarding
  ├── Limite atteinte (3) → Page "Limite atteinte" + lien /stores
  └── Pas de limite → Formulaire de création (4 étapes)
                          └── Animation → set cookie → /dashboard

/dashboard
  └── Affiche les données de current_store_id
```

## Middleware optimisé (v3.0)
- **Skip complet** pour routes publiques (/, /login, /legal/*, boutiques publiques)
- Vérifie auth uniquement pour /dashboard, /onboarding, /stores
- **Try-catch** pour éviter GATEWAY_TIMEOUT sur Vercel Edge
- Redirige vers /login si non authentifié

---

# 5. ÉDITEUR VISUEL (v3.0)

## Architecture
- `/dashboard/editor` - Interface d'édition drag & drop
- Sidebar gauche : Liste des sections/éléments
- Zone centrale : Preview en temps réel (Desktop/Mobile toggle)
- Sidebar droite : Toolbars de styling contextuelle

## Toolbars implémentés

| Toolbar | Fichier | Fonctionnalités |
|---------|---------|-----------------|
| **TitleToolbar** | `toolbars/TitleToolbar.tsx` | 14 polices, graisse 100-900, taille, couleur+opacité, espacement lettres, alignement+justify, italic/underline/strikethrough, casse, text-shadow |
| **ParagraphToolbar** | `toolbars/ParagraphToolbar.tsx` | Identique à TitleToolbar |
| **ButtonToolbar** | `toolbars/ButtonToolbar.tsx` | Padding, typo, couleurs normal/hover, bordure 0-12px, radius, ombres |
| **ImageToolbar** | `toolbars/ImageToolbar.tsx` | Largeur, ratio, fit, radius, 8 filtres, opacité, bordure, ombre |
| **ContainerToolbar** | `toolbars/ContainerToolbar.tsx` | Hauteur, fond (couleur/dégradé/image), parallaxe, overlay, padding, radius, flex alignment |
| **DividerToolbar** | `toolbars/DividerToolbar.tsx` | Couleur, épaisseur, largeur, style, marge, opacité |
| **IconToolbar** | `toolbars/IconToolbar.tsx` | Couleur, taille, stroke, opacité, rotation |
| **ProductCardToolbar** | `toolbars/ProductCardToolbar.tsx` | Couleurs, radius, bordure, ombres, padding, gap |

## Type ElementStyleOverride
Défini dans `src/types/index.ts`, contient toutes les propriétés de style :
- Typography: fontFamily, fontSize, fontWeight, lineHeight, letterSpacing, textAlign, color, textTransform, fontStyle, textDecoration, textShadow
- Spacing: padding, paddingX, paddingY, margin, gap
- Dimensions: width, height
- Background: backgroundColor, backgroundImage, backgroundSize, backgroundPosition, overlayColor, overlayOpacity, parallax
- Border: borderColor, borderWidth, borderRadius, borderStyle
- Flex: display, flexDirection, alignItems, justifyContent
- Effects: boxShadow, opacity, filter, objectFit
- Product card specific: titleColor, descriptionColor, priceColor, buttonBgColor, buttonTextColor, etc.

---

# 6. RESPONSIVE MOBILE (v3.0)

## Corrections appliquées
- **min-h-dvh** : Utilise la hauteur dynamique du viewport (évite les problèmes avec la barre d'adresse mobile)
- **Onboarding** : py-4 mobile, py-12 desktop
- **Stores page** : Cartes compactes (h-20 mobile, h-36 desktop), marges réduites
- **Onboarding-form** : Grille 3 colonnes compacte, icônes et textes adaptés
- **TemplateCard** : Preview h-16 mobile, features cachées sur mobile

## Classes Tailwind responsives utilisées
- `sm:` pour breakpoint 640px+
- `hidden sm:block` pour cacher sur mobile
- `text-xs sm:text-base` pour adapter les tailles

---

# 7. RÈGLES MÉTIER

## Paiement & Checkout
- **Strictement COD** : Pas de Stripe/PayPal
- **Tunnel 2 étapes** :
  - Step 1 (Lead Capture) : Nom + Téléphone (+216)
  - Step 2 (Livraison) : Gouvernorat + Ville + Adresse

## Gestion Vendeur
- **WhatsApp Automation** : Bouton avec message pré-rempli
- **Étiquettes PDF** : Format A6 pour colis

---

# 8. DESIGN SYSTEM

## Ambiance
- Minimaliste & Pro (inspiré Shopify Checkout)
- Couleur d'accent : Vert Émeraude (`emerald-600`)

## Pages Clés
1. **Boutique Publique** (`/[store_slug]`)
2. **Dashboard Vendeur** (`/dashboard`) + sous-pages
3. **Onboarding Wizard** (`/onboarding`) - 4 étapes animées
4. **Éditeur Visuel** (`/dashboard/editor`) - Drag & drop

---

# 9. STRUCTURE DES DOSSIERS

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
│   ├── stores/          # Sélection de boutique
│   ├── login/           # Authentification
│   └── onboarding/      # Wizard création boutique
├── components/
│   ├── ui/              # Composants atomiques
│   ├── dashboard/       # Composants admin
│   │   └── editor/      # Composants éditeur
│   │       └── toolbars/ # Tous les toolbars
│   ├── store/           # Composants boutique
│   └── auth/            # Composants auth
├── lib/
│   ├── stores.ts        # Helpers multi-boutique
│   └── onboarding-data.ts # Smart matching templates
├── utils/
│   └── supabase/
│       ├── client.ts    # Client Supabase (browser)
│       ├── server.ts    # Client Supabase (server)
│       └── middleware.ts # Middleware auth optimisé
└── types/
    └── index.ts         # Interfaces TypeScript
```

---

# 10. RÈGLES DE CODE (STRICT)

1. **Modularité** : Max 150 lignes par composant
2. **Séparation** : Logique métier dans `/hooks` ou `/lib`
3. **Types** : Toutes les interfaces dans `/types`
4. **Nommage** : Explicite (`recentOrders`, pas `data`)
5. **Pas de code mort**
6. **Multi-Store** : Toujours utiliser `store_id` (jamais `user_id` pour les données)
7. **Cookie** : Lire `current_store_id` du cookie pour identifier la boutique active
8. **Responsive** : Toujours utiliser les classes Tailwind `sm:`, `md:`, `lg:` pour le responsive

---

# 11. PROBLÈMES CONNUS & SOLUTIONS

## GATEWAY_TIMEOUT sur Vercel (504)
**Cause** : Middleware appelant Supabase sur toutes les requêtes
**Solution** : Skip auth check pour routes publiques + try-catch

## Tailwind v4 darkMode
**Cause** : Config `darkMode: ["class"]` (array) incompatible
**Solution** : Changer en `darkMode: "class"` (string)

## TypeScript build errors avec ElementStyleOverride
**Cause** : Propriétés manquantes (height, gap, margin)
**Solution** : Ajouter les propriétés au type dans `src/types/index.ts`

---

# 12. ÉTAT ACTUEL (v3.0)

## ✅ Implémenté
- Architecture multi-store complète (max 3 boutiques/user)
- Création de boutique avec animation
- Dashboard avec sélection de boutique
- Toutes les pages dashboard migrées vers `store_id`
- **Éditeur visuel complet** avec tous les toolbars
- **Mobile responsive** pour onboarding, stores, homepage
- Middleware optimisé sans timeout

## 🔄 Prochaines étapes possibles
- Tests E2E complets
- Améliorer le drag & drop de l'éditeur
- Ajouter undo/redo dans l'éditeur
- Plus de templates de boutique
- Intégration paiement carte bancaire (Konnect/Flouci)

---

FIN DU DOCUMENT
