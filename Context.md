Version : 1.0 (MVP) Type : Web App / SaaS Target : Marché Tunisien (Mobile First, Cash-Economy)

1. VISION DU PROJET (Le "Pourquoi")
   Nous construisons une plateforme SaaS B2B2C qui permet aux vendeurs Instagram/TikTok en Tunisie de générer une boutique en ligne ultra-simplifiée en quelques secondes. Problème résolu : Shopify est trop cher et inadapté (devises, cartes bancaires). Les vendeurs locaux ont besoin d'une solution optimisée pour le Paiement à la Livraison (COD) et la gestion via WhatsApp.

Philosophie UX :

Mobile First Absolu : 95% du trafic sera mobile.

Zéro Friction : Pas de création de compte pour l'acheteur. Pas de panier complexe.

Vitesse : L'interface doit être instantanée.

2. STACK TECHNIQUE (Architecture)
   Tu agiras en tant qu'Expert Senior Full-Stack. Voici les technologies imposées :

Frontend : Next.js 14+ (App Router).

Langage : TypeScript (Strict mode).

Styling : Tailwind CSS + Shadcn UI (pour les composants réutilisables).

Icônes : Lucide React.

Backend / Auth / DB : Supabase (PostgreSQL).

Déploiement cible : Vercel.

3. RÈGLES MÉTIER CRITIQUES (Business Logic)
   A. Paiement \& Checkout
   Strictement Cash on Delivery (COD) : Aucune intégration Stripe/PayPal. Le bouton final est toujours "Commander (Paiement à la livraison)".

Tunnel de commande "Anti-Abandon" (2 Steps) :

Step 1 (Lead Capture) : Nom + Téléphone (+216). Si l'utilisateur valide cette étape, les données sont sauvegardées dans la table leads (même s'il quitte après).

Step 2 (Livraison) : Gouvernorat (Liste déroulante des 24 gouvernorats tunisiens), Ville, Adresse.

B. Gestion Vendeur (Dashboard)
WhatsApp Automation : Chaque commande doit avoir un bouton "Confirmer sur WhatsApp" qui génère un lien wa.me avec un message pré-rempli (détails dans la section UI).

Étiquettes : Possibilité de générer un PDF simple (format A6) pour le colis avec les infos destinataire et le montant à encaisser.

4. SCHÉMA DE BASE DE DONNÉES (Supabase SQL)
   L'IA doit utiliser cette structure exacte.

SQL

-- 1. Table des vendeurs (étend la table auth.users de Supabase)
create table public.profiles (
id uuid references auth.users on delete cascade primary key,
store\_name text unique not null, -- ex: "mamari" pour elenashop.tn/mamari
phone\_number text,
avatar\_url text,
subscription\_status text default 'free', -- 'free', 'pro'
created\_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Table des produits
create table public.products (
id uuid default gen\_random\_uuid() primary key,
user\_id uuid references public.profiles(id) on delete cascade not null,
title text not null,
price numeric not null, -- En TND
image\_url text,
description text,
stock integer default 0,
is\_active boolean default true,
created\_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Table des commandes
create table public.orders (
id uuid default gen\_random\_uuid() primary key,
user\_id uuid references public.profiles(id) not null, -- Le vendeur
customer\_name text not null,
customer\_phone text not null,
customer\_governorate text not null, -- ex: "Tunis", "Sfax"
customer\_city text,
customer\_address text,
product\_details jsonb, -- Snapshot du produit au moment de l'achat (Titre, Prix)
total\_price numeric not null,
status text default 'new', -- 'new', 'confirmed', 'shipped', 'delivered', 'cancelled'
created\_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. Table des Leads (Paniers abandonnés - Step 1 validé mais pas Step 2)
create table public.leads (
id uuid default gen\_random\_uuid() primary key,
user\_id uuid references public.profiles(id) not null,
customer\_phone text not null,
customer\_name text,
created\_at timestamp with time zone default timezone('utc'::text, now())
);
5. DESIGN SYSTEM \& UI GUIDELINES
Ambiance (Vibe)
Minimaliste \& Pro : Inspiré de Shopify Checkout. Fond blanc, texte gris foncé (slate-900), bordures subtiles.

Couleur d'accent (Action) : Un Vert Émeraude rassurant (ex: bg-emerald-600) pour les boutons "Commander" et "WhatsApp".

Pages Clés à développer

1. Page Boutique Publique (/\[store\_name])
   Header sticky avec le nom de la marque.

Grille de produits simple (Photo carrée + Titre + Prix en gras).

Bouton "Acheter" sur chaque produit qui ouvre un Drawer (volet glissant du bas) sur mobile, plutôt qu'une nouvelle page.

2. Page Dashboard Vendeur (/dashboard)
   Vue "Commandes" : Une liste type "Inbox". Chaque ligne montre : Nom du client, Montant, Statut (badge couleur).

Action Rapide : Un bouton icône WhatsApp à côté de chaque commande.

Template Message : "Bonjour \[Nom], merci pour votre commande sur \[Store]. Le total est de \[Prix] TND. On vous livre demain ?"

3. Formulaire de Commande (Drawer)
   Input Téléphone avec préfixe fixe +216 visible.

Liste déroulante des Gouvernorats (Tunis, Ariana, Ben Arous, Manouba, Nabeul, Zaghouan, Bizerte, Beja, Jendouba, Kef, Siliana, Kairouan, Kasserine, Sidi Bouzid, Sousse, Monastir, Mahdia, Sfax, Gafsa, Tozeur, Kebili, Gabes, Medenine, Tataouine).

6. INSTRUCTIONS D'IMPLÉMENTATION (Roadmap IA)
   Ordre d'exécution pour l'IA :

Setup : Initialiser le projet Next.js avec Tailwind et Shadcn. Configurer le client Supabase.

Database : Générer les migrations SQL pour créer les tables ci-dessus.

Feature 1 (Public Store) : Créer la page dynamique \[store\_name] qui fetch les produits d'un utilisateur via son slug.

Feature 2 (Checkout) : Créer le composant Formulaire en 2 étapes et la logique d'insertion en DB (Table orders et leads).

Feature 3 (Admin) : Créer le Dashboard vendeur (Login, Liste des commandes, Ajout produit).

Feature 4 (Magie) : Coder la logique du lien WhatsApp dynamique et la génération PDF de l'étiquette.





\# RÈGLES D'ARCHITECTURE \& CODING STYLE (STRICT)



TU DOIS APPLIQUER CES RÈGLES AUTOMATIQUEMENT SANS QU'ON TE LE DEMANDE :



1\.  \*\*MODULARITÉ PAR DÉFAUT (Règle d'Or) :\*\*

&nbsp;   \* Interdiction formelle de créer des composants de plus de 150 lignes.

&nbsp;   \* Si un fichier dépasse cette taille, tu DOIS le découper immédiatement en sous-composants.

&nbsp;   \* Ne mets jamais la logique métier (fetch, calculs) mélangée au UI. Utilise des Custom Hooks (`useCart`, `useOrders`) dans `/hooks`.



2\.  \*\*STRUCTURE DES DOSSIERS OBLIGATOIRE :\*\*

&nbsp;   \* `src/components/ui/` : Uniquement les composants atomiques (Boutons, Inputs) réutilisables.

&nbsp;   \* `src/components/dashboard/\[feature]/` : Composants spécifiques à l'admin (ex: `ProductList.tsx`, `StatsChart.tsx`).

&nbsp;   \* `src/components/store/\[feature]/` : Composants spécifiques à la boutique publique (ex: `CartDrawer.tsx`, `ProductGrid.tsx`).

&nbsp;   \* `src/lib/types.ts` : Toutes les interfaces TypeScript doivent être ici. Pas de `interface X {}` qui traîne dans les fichiers `.tsx`.



3\.  \*\*CLEAN CODE :\*\*

&nbsp;   \* Utilise toujours des noms explicites. Pas de `const data`, mais `const recentOrders`.

&nbsp;   \* Supprime toujours le code mort ou commenté.

&nbsp;   \* Si tu modifies un fichier, vérifie que tu ne casses pas les imports ailleurs.



4\.  \*\*COMPORTEMENT "AGENTIQUE" :\*\*

&nbsp;   \* Avant de coder une feature complexe, analyse d'abord quels petits composants tu vas devoir créer.

&nbsp;   \* Ne me donne pas tout le code d'un coup dans un seul bloc. Crée fichier par fichier.



SI TU NE RESPECTES PAS CES RÈGLES, LE CODE SERA REJETÉ.

FIN DU DOCUMENT

