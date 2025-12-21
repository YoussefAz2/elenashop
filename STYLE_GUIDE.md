# 🎨 ElenaShop - Guide de Style (Landing Page)

Ce document résume le style visuel et les patterns de design utilisés sur l'accueil ElenaShop.
À utiliser comme référence pour maintenir la cohérence sur tout le projet.

---

## 🎨 Palette de Couleurs

### Couleurs Primaires
| Nom | Hex | Usage |
|-----|-----|-------|
| **Indigo 600** | `#4f46e5` | CTA principal, liens actifs |
| **Indigo 500** | `#6366f1` | Accents, icônes |
| **Violet 600** | `#7c3aed` | Gradients, highlights |

### Couleurs Secondaires
| Nom | Hex | Usage |
|-----|-----|-------|
| **Slate 900** | `#0f172a` | Texte principal, fonds dark |
| **Slate 600** | `#475569` | Texte secondaire |
| **Slate 500** | `#64748b` | Texte tertiaire, placeholders |
| **Slate 100** | `#f1f5f9` | Bordures légères, fonds |
| **Slate 50** | `#f8fafc` | Background principal |

### Couleurs d'État
| Nom | Hex | Usage |
|-----|-----|-------|
| **Emerald 500** | `#10b981` | Succès, "Live", toggles ON |
| **Rose 600** | `#e11d48` | Tunisie, accents féminins |
| **WhatsApp** | `#25D366` | Carte WhatsApp |

---

## 🔤 Typographie

### Police
- **Font Family** : `font-sans` (système ou Inter/Geist si configuré)

### Tailles
| Élément | Classes Tailwind |
|---------|-----------------|
| Hero H1 | `text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight` |
| Section H2 | `text-3xl sm:text-5xl font-extrabold tracking-tight` |
| Card H3 | `text-xl font-bold` ou `text-2xl font-bold` |
| Body | `text-base` ou `text-lg` |
| Small/Caption | `text-xs font-semibold uppercase tracking-wider` |

### Couleurs Texte
- Principal : `text-slate-900`
- Secondaire : `text-slate-600`
- Tertiaire : `text-slate-500`
- Sur fond dark : `text-white`, `text-slate-400`

---

## 📐 Espacements & Layout

### Conteneurs
```css
max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
```

### Sections
```css
py-24 /* ou */ py-32 /* pour les grandes sections */
```

### Gaps
- Grilles : `gap-6` à `gap-12`
- Éléments inline : `gap-2` à `gap-4`

---

## 🧱 Composants

### Cards (Bento Style)
```css
bg-white rounded-[2rem] p-8 border border-slate-100 
shadow-sm hover:shadow-xl transition-all
```

### Boutons Primaires
```css
bg-[#4f46e5] hover:bg-[#4338ca] text-white 
rounded-2xl px-10 h-16 text-lg font-bold 
shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 
hover:-translate-y-1 transition-all
```

### Boutons Secondaires
```css
border-2 border-slate-200 hover:border-indigo-200 
hover:bg-indigo-50/50 rounded-2xl px-10 h-16
bg-white/50 backdrop-blur-sm
```

### Badges
```css
inline-flex items-center gap-2 px-4 py-2 
bg-white/80 backdrop-blur-md rounded-full 
border border-indigo-100 shadow-sm
```

### Icônes dans cercles
```css
h-14 w-14 rounded-2xl bg-indigo-50 
flex items-center justify-center
```

---

## ✨ Effets Visuels

### Glassmorphism
```css
bg-white/60 backdrop-blur-xl border border-white/50
```

### Ombres
- Légère : `shadow-sm`
- Standard : `shadow-xl shadow-indigo-500/10`
- Forte : `shadow-2xl shadow-indigo-900/20`

### Gradients (Texte)
```css
text-transparent bg-clip-text 
bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600
```

### Blobs de fond
```css
absolute w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl
```

### Grain/Noise
```css
bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20
```

---

## 🎬 Animations (Framer Motion)

### Fade In Up (Standard)
```tsx
initial={{ opacity: 0, y: 20 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
```

### Scale In
```tsx
initial={{ opacity: 0, scale: 0.9 }}
whileInView={{ opacity: 1, scale: 1 }}
```

### Hover Lift
```tsx
whileHover={{ y: -8 }}
/* ou */
hover:-translate-y-1 transition-all
```

### Durées
- Rapide : `0.3s`
- Standard : `0.5s` à `0.8s`
- Lente (effet) : `1.5s`

### Easing
- Standard : `easeOut`
- Synchronisé : `easeInOut`
- Rebond : `type: "spring"`

---

## 📱 Responsive

### Breakpoints utilisés
- `sm:` (640px) - Mobile large
- `md:` (768px) - Tablette
- `lg:` (1024px) - Desktop

### Patterns
```css
/* Grille responsive */
grid md:grid-cols-3 gap-6

/* Texte responsive */
text-5xl sm:text-6xl lg:text-7xl

/* Padding responsive */
p-8 md:p-12

/* Masquer sur mobile */
hidden lg:block
```

---

## 🔗 Ressources Externes

| Service | Usage |
|---------|-------|
| `ui-avatars.com` | Avatars initiales |
| `lucide-react` | Icônes |
| `framer-motion` | Animations |

---

## ✅ Checklist Nouveau Composant

1. [ ] Utilise les couleurs de la palette
2. [ ] Coins arrondis (`rounded-2xl` ou `rounded-[2rem]`)
3. [ ] Ombres cohérentes avec teinte de couleur
4. [ ] Animation `whileInView` ou `hover` pour l'interactivité
5. [ ] Responsive avec breakpoints `md:` et `lg:`
6. [ ] Textes dans la hiérarchie définie
