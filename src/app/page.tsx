import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedCounter } from "@/components/landing/animated-counter";
import { FAQSection } from "@/components/landing/faq-section";
import {
  Store,
  Zap,
  MessageCircle,
  MapPin,
  ArrowRight,
  Check,
  Smartphone,
  Truck,
  Shield,
  Star,
  CreditCard,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-emerald-600 flex items-center justify-center">
                <Store className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900">ElenaShop</span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
                  Se connecter
                </Button>
              </Link>
              <Link href="/login">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-5">
                  Commencer
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-6xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <div className="text-center lg:text-left animate-fade-in-up">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-700 text-sm font-medium mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Nouveau : Paiement par carte disponible 💳
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
                Votre boutique en ligne en{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                  2 minutes
                </span>
                .
                <br />
                <span className="text-slate-500">Spécialement pour la Tunisie.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0">
                Paiement à la livraison <strong>ou par carte</strong>, WhatsApp intégré, 100% optimisé mobile.
              </p>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Link href="/login">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 h-14 text-lg font-semibold shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/30 transition-all hover:-translate-y-0.5">
                    Commencer gratuitement
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" size="lg" className="rounded-full px-8 h-14 text-lg border-2 hover:bg-slate-50 transition-all">
                    Voir les fonctionnalités
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-6 justify-center lg:justify-start text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-emerald-500" />
                  <span>Gratuit pour commencer</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-emerald-500" />
                  <span>Sans carte bancaire</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-emerald-500" />
                  <span>Setup en 2 minutes</span>
                </div>
              </div>
            </div>

            {/* Right - Phone Mockup */}
            <div className="relative flex justify-center lg:justify-end animate-fade-in-up animation-delay-200">
              <div className="relative">
                {/* Phone Frame */}
                <div className="relative w-[260px] h-[520px] bg-slate-900 rounded-[2.5rem] p-2 shadow-2xl hover:shadow-emerald-500/20 transition-shadow duration-500">
                  <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden relative">
                    {/* Dynamic Island */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full z-10 flex items-center justify-center">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    </div>

                    {/* Screen Content */}
                    <div className="pt-12 px-3 pb-3 h-full">
                      {/* Store Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/30">
                            <Store className="h-4 w-4 text-white" />
                          </div>
                          <span className="font-semibold text-sm text-slate-900">Ma Boutique</span>
                        </div>
                        <div className="relative">
                          <span className="text-lg">🛒</span>
                          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">2</span>
                        </div>
                      </div>

                      {/* Hero */}
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-3 mb-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-white/10 rounded-full"></div>
                        <p className="text-white text-xs opacity-80">Nouvelle collection</p>
                        <p className="text-white font-bold text-lg">Été 2024 ☀️</p>
                        <span className="inline-block mt-1 text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full">-20% cette semaine</span>
                      </div>

                      {/* Products */}
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { sold: true, price: "89" },
                          { sold: false, price: "65" },
                          { sold: false, price: "45" },
                          { sold: true, price: "120" },
                        ].map((product, i) => (
                          <div key={i} className="bg-slate-50 rounded-lg p-2 relative">
                            <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-md mb-1.5 flex items-center justify-center">
                              <span className="text-2xl opacity-40">{['👗', '👜', '👟', '⌚'][i]}</span>
                            </div>
                            {product.sold && (
                              <span className="absolute top-1 right-1 text-[8px] bg-red-500 text-white px-1.5 py-0.5 rounded font-medium">VENDU</span>
                            )}
                            <p className="text-[10px] text-slate-600 truncate">Produit</p>
                            <p className="text-xs font-bold text-emerald-600">{product.price} TND</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Success notification */}
                <div className="absolute -right-4 top-24 bg-white rounded-xl shadow-lg p-2.5 animate-float border border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-emerald-600" />
                    </div>
                    <p className="text-[10px] font-medium text-slate-700">Commande reçue !</p>
                  </div>
                </div>

                {/* Glow effect */}
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-emerald-200 rounded-full blur-3xl opacity-40"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos / Social Proof */}
      <section className="py-12 bg-slate-50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-slate-500 text-sm mb-6">
            Déjà adopté par <AnimatedCounter target={150} /> vendeurs en Tunisie
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {/* Instagram */}
            <div className="flex items-center gap-2 text-slate-600 hover:text-pink-600 transition-colors cursor-pointer">
              <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <span className="font-medium">Instagram</span>
            </div>
            {/* TikTok */}
            <div className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
              </svg>
              <span className="font-medium">TikTok</span>
            </div>
            {/* Facebook */}
            <div className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer">
              <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="font-medium">Facebook</span>
            </div>
            {/* WhatsApp */}
            <div className="flex items-center gap-2 text-slate-600 hover:text-green-600 transition-colors cursor-pointer">
              <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span className="font-medium">WhatsApp</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Pourquoi choisir ElenaShop ?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Tout ce dont vous avez besoin pour vendre en ligne, adapté au marché tunisien.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="h-8 w-8" />,
                title: "Ultra Rapide",
                description: "Boutique optimisée mobile, temps de chargement instantané. Vos clients achètent sans friction.",
                color: "from-amber-400 to-orange-500",
                delay: "0",
              },
              {
                icon: <MessageCircle className="h-8 w-8" />,
                title: "WhatsApp Natif",
                description: "Recevez et gérez vos commandes via WhatsApp. Un clic pour contacter vos clients.",
                color: "from-green-400 to-emerald-500",
                delay: "100",
              },
              {
                icon: <MapPin className="h-8 w-8" />,
                title: "100% Tunisien",
                description: "24 gouvernorats pré-configurés, paiement à la livraison ET par carte. Pensé pour vous.",
                color: "from-blue-400 to-indigo-500",
                delay: "200",
              },
            ].map((feature, i) => (
              <Card key={i} className="border-slate-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group animate-fade-in-up" style={{ animationDelay: `${feature.delay}ms` }}>
                <CardContent className="p-8">
                  <div className={`inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br ${feature.color} text-white mb-6 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Payment Methods Banner */}
          <div className="mt-16 bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 text-center animate-fade-in-up">
            <h3 className="text-2xl font-bold text-white mb-4">
              💳 Nouveau : Acceptez les paiements par carte !
            </h3>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Vos clients peuvent maintenant payer par carte bancaire ou à la livraison. Plus de flexibilité = plus de ventes.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-white">
                <Truck className="h-5 w-5" />
                <span>Cash on Delivery</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-white">
                <CreditCard className="h-5 w-5" />
                <span>Carte Bancaire</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-lg text-slate-600">
              3 étapes simples pour lancer votre boutique
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                icon: <Smartphone className="h-10 w-10" />,
                title: "Créez votre compte",
                description: "Inscription gratuite en 30 secondes. Choisissez le nom de votre boutique.",
              },
              {
                step: 2,
                icon: <Store className="h-10 w-10" />,
                title: "Ajoutez vos produits",
                description: "Uploadez vos photos, fixez vos prix. Interface simple et intuitive.",
              },
              {
                step: 3,
                icon: <Truck className="h-10 w-10" />,
                title: "Vendez !",
                description: "Partagez votre lien, recevez des commandes, gérez tout depuis WhatsApp.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center group animate-fade-in-up">
                <div className="relative inline-flex items-center justify-center mb-6">
                  <div className="h-20 w-20 bg-white rounded-2xl shadow-lg flex items-center justify-center text-emerald-600 group-hover:shadow-xl group-hover:scale-105 transition-all">
                    {item.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 h-8 w-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Ce que disent nos vendeurs
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarra M.",
                role: "Mode & Accessoires",
                text: "J'ai triplé mes ventes depuis que j'utilise ElenaShop. Mes clientes adorent la simplicité de commande.",
                avatar: "https://ui-avatars.com/api/?name=Sarra+M&background=f0abfc&color=701a75&bold=true&size=128",
                emoji: "👩🏻",
              },
              {
                name: "Ahmed K.",
                role: "Électronique",
                text: "Le système WhatsApp est génial. Je confirme mes commandes en un clic, directement depuis mon téléphone.",
                avatar: "https://ui-avatars.com/api/?name=Ahmed+K&background=93c5fd&color=1e3a8a&bold=true&size=128",
                emoji: "👨🏽",
              },
              {
                name: "Ines B.",
                role: "Cosmétiques",
                text: "Enfin une solution adaptée à la Tunisie ! Pas de problèmes de paiement, tout est simple et rapide.",
                avatar: "https://ui-avatars.com/api/?name=Ines+B&background=fcd34d&color=78350f&bold=true&size=128",
                emoji: "👩🏻‍🦱",
              },
            ].map((testimonial, i) => (
              <Card key={i} className="border-slate-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-600 mb-6">&ldquo;{testimonial.text}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-2xl shadow-inner">
                      {testimonial.emoji}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{testimonial.name}</p>
                      <p className="text-sm text-slate-500">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600/20 rounded-full text-emerald-400 text-sm font-medium mb-6 animate-pulse">
            <Shield className="h-4 w-4" />
            Offre de lancement
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Commencez gratuitement, sans engagement
          </h2>
          <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
            Créez votre boutique maintenant. Aucune carte bancaire requise.
            Upgradez quand vous êtes prêt.
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 h-14 text-lg font-semibold shadow-lg shadow-emerald-600/25 hover:shadow-xl transition-all hover:-translate-y-0.5">
              Créer ma boutique gratuitement
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center">
                  <Store className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-xl">ElenaShop</span>
              </div>
              <p className="text-slate-400 text-sm max-w-xs">
                La plateforme e-commerce conçue pour les vendeurs Instagram et TikTok en Tunisie.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="#features" className="hover:text-emerald-400 transition-colors">Fonctionnalités</Link></li>
                <li><Link href="#faq" className="hover:text-emerald-400 transition-colors">FAQ</Link></li>
                <li><Link href="/login" className="hover:text-emerald-400 transition-colors">Connexion</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/legal/cgu" className="hover:text-emerald-400 transition-colors">Conditions d&apos;utilisation</Link></li>
                <li><Link href="/legal/privacy" className="hover:text-emerald-400 transition-colors">Politique de confidentialité</Link></li>
                <li><a href="mailto:contact@elenashop.tn" className="hover:text-emerald-400 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © 2024 ElenaShop. Tous droits réservés.
            </p>
            <p className="text-sm text-slate-500">
              Made with ❤️ in Tunisia 🇹🇳
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
