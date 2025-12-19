# Résumé des Changements - Architecture Multi-Store v2.1

**Date**: 18-19 Décembre 2024  
**Version**: 2.1

---

## 🎯 Objectif Principal

Migration complète de l'architecture single-store (basée sur `profiles.store_name`) vers une architecture multi-store (basée sur `stores` + `store_members`).

---

## 📊 Nouvelle Architecture Base de Données

### Tables Principales

| Table | Description |
|-------|-------------|
| `stores` | Boutiques (id, slug, name, theme_config, subscription_status) |
| `store_members` | Relation users ↔ stores (user_id, store_id, role) |
| `profiles` | Données utilisateur uniquement (first_name, last_name, etc.) |

### Relations

- **1 utilisateur = N boutiques** (propriétaire de plusieurs boutiques)
- **N utilisateurs = 1 boutique** (équipes avec rôles: owner, admin, editor)
- Toutes les données (products, orders, etc.) sont liées via `store_id`

---

## 🔐 Flux d'Authentification

### Nouveau Flow de Connexion

```
/login
  └── Connexion réussie → /dashboard

/dashboard
  ├── 0 boutiques  → Page "Créez votre boutique" + bouton /onboarding
  ├── 1 boutique   → Dashboard direct avec cette boutique
  └── N boutiques  → Page de sélection de boutique
                        └── Clic → set cookie → Dashboard
```

### Nouveau Flow d'Inscription

```
Landing Page
  └── Bouton "Commencer" → /login?mode=signup
        └── Formulaire d'inscription
              └── Compte créé → /dashboard
                    └── Pas de boutique → Page "Créez votre boutique"
                          └── /onboarding (4 étapes)
                                └── Animation de création
                                      └── Cookie set + /dashboard
```

---

## 🍪 Gestion des Sessions

### Cookie `current_store_id`

- **Stocke**: L'ID de la boutique actuellement sélectionnée
- **Définition**: Lors de la création de boutique ou sélection
- **Utilisation**: Par toutes les pages dashboard pour charger les données
- **Durée**: 1 an

---

## 📁 Fichiers Modifiés

### Middleware

| Fichier | Changement |
|---------|------------|
| `utils/supabase/middleware.ts` | Supprimé la vérification `profiles.store_name`, simplifié la logique |

### Pages d'Authentification

| Fichier | Changement |
|---------|------------|
| `app/login/page.tsx` | Support du param `?mode=signup` |
| `components/auth/login-form.tsx` | Prop `defaultMode` pour démarrer en signup |
| `app/onboarding/page.tsx` | Gestion avec `store_members` au lieu de `profiles` |
| `components/auth/onboarding-form.tsx` | Set cookie après création de boutique |

### Dashboard

| Fichier | Changement |
|---------|------------|
| `app/dashboard/page.tsx` | Sélection multi-boutique, cookie handling |
| `app/dashboard/editor/page.tsx` | `store_id` au lieu de `user_id` |
| `app/dashboard/stats/page.tsx` | `store_id` au lieu de `user_id` |
| `app/dashboard/products/page.tsx` | `store_id` au lieu de `user_id` |
| `app/dashboard/promos/page.tsx` | `store_id` au lieu de `user_id` |
| `app/dashboard/leads/page.tsx` | `store_id` au lieu de `user_id` |
| `app/dashboard/categories/page.tsx` | `store_id` au lieu de `user_id` |
| `app/dashboard/billing/page.tsx` | `store_id` au lieu de `user_id` |

### Boutique Publique

| Fichier | Changement |
|---------|------------|
| `app/[store_name]/page.tsx` | `stores.slug` au lieu de `profiles.store_name` |
| `app/[store_name]/[page_slug]/page.tsx` | `stores.slug` + `store_id` |

### Landing Page

| Fichier | Changement |
|---------|------------|
| `app/page.tsx` | Boutons "Commencer" → `/login?mode=signup` |

---

## 🛡️ RLS Policies (Row Level Security)

### Script de Correction

Fichier: `supabase/migrations/fix_rls_policies.sql`

### Policies par Table

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| `stores` | Public | Authenticated | Owner | Owner |
| `store_members` | Member | Self | Owner | Owner |
| `products` | Public (active) | Member | Member | Member |
| `orders` | Member | Public | Member | - |
| `categories` | Public | Member | Member | Member |
| `leads` | Member | Public | - | - |
| `promos` | Public | Member | Member | Member |
| `pages` | Public | Member | Member | Member |

---

## 🆕 Nouvelles Fonctionnalités

### 1. Sélection de Boutique

Si un utilisateur a **plusieurs boutiques** et aucun cookie défini:
- Affichage d'une page de sélection élégante
- Liste toutes les boutiques avec nom et rôle
- Clic → définit le cookie → charge le dashboard

### 2. Animation de Création de Boutique

- Animation créative avec confettis emoji
- Mockup de téléphone avec glow effect
- Bouton "Lancer ma boutique" stylisé
- Navigation vers dashboard après completion

### 3. Flow Login/Signup Séparé

- "Se connecter" → Formulaire de connexion
- "Commencer" → Formulaire d'inscription directement

---

## ⚠️ Points d'Attention

### À Vérifier

1. **Composants clients**: Certains peuvent encore utiliser `user_id` (à migrer si problème)
2. **Checkout flow**: Vérifier le processus de commande public
3. **Tests complets**: Tester tous les flux utilisateur

### Commandes SQL Exécutées

Le script `fix_rls_policies.sql` doit être exécuté dans Supabase SQL Editor pour appliquer les policies correctes.

---

## 📈 Avantages de la Nouvelle Architecture

- ✅ Support multi-boutique natif
- ✅ Équipes avec rôles (owner, admin, editor)
- ✅ Données bien isolées par boutique
- ✅ Pas de boucles de redirection
- ✅ Cookie-based session pour la boutique active
- ✅ RLS policies sécurisées

---

## 🔧 Configuration Requise

### Variables d'Environnement

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Base de Données

1. Exécuter `multi_store_migration.sql` (si pas déjà fait)
2. Exécuter `fix_rls_policies.sql` pour les policies correctes

---

**FIN DU DOCUMENT**
