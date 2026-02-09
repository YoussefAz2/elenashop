import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import type { Store, StoreWithRole } from "@/types";
import Link from "next/link";
import { Plus, ArrowRight, Loader2 } from "lucide-react";
import { StoreCard } from "@/components/stores/store-card";

export default async function StoresPage() {
    const supabase = await createClient();

    // Use getSession() — middleware already validated auth via getUser()
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
        redirect("/login");
    }

    const user = session.user;

    // Single join query instead of 2 sequential queries
    let allStores: StoreWithRole[] = [];

    try {
        const { data: memberships } = await supabase
            .from("store_members")
            .select("role, stores(*)")
            .eq("user_id", user.id);

        if (memberships && memberships.length > 0) {
            allStores = memberships
                .filter(m => m.stores)
                .map(m => ({
                    ...(m.stores as unknown as Store),
                    role: (m.role || "owner") as "owner" | "admin" | "editor"
                }));
        }
    } catch (e) {
        console.error("Membership query failed:", e);
    }

    // REMOVED: Auto-redirect disabled to allow store switching
    // Even with 1 store, user should be able to see the stores page if they explicitly navigate here
    // if (allStores.length === 1) {
    //     redirect(`/api/select-store?store=${allStores[0].id}`);
    // }

    // If user has no stores, redirect to onboarding
    if (allStores.length === 0) {
        redirect("/onboarding");
    }

    return (
        <div className="min-h-dvh bg-stone-50 flex flex-col items-center justify-center p-4 sm:p-6 font-sans selection:bg-zinc-200 selection:text-zinc-900 overflow-hidden">
            {/* Subtle Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-stone-100/50 via-transparent to-transparent blur-[100px] opacity-60"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-5xl">
                {/* Header */}
                <div className="text-center mb-6 sm:mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
                    <Link href="/" className="inline-block mb-4 sm:mb-8 text-xl sm:text-2xl font-black tracking-tight text-zinc-900 hover:opacity-70 transition-opacity">
                        ElenaShop.
                    </Link>
                    <span className="text-[10px] sm:text-xs font-bold tracking-widest text-zinc-400 uppercase mb-2 sm:mb-4 block">
                        Bienvenue, {user.user_metadata?.first_name || "Entrepreneur"}
                    </span>
                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif italic font-medium text-zinc-900 mb-3 sm:mb-6">
                        Sélectionnez une boutique
                    </h1>
                    <p className="text-zinc-500 max-w-lg mx-auto text-sm sm:text-lg font-light hidden sm:block">
                        Gérez vos différentes marques depuis un seul espace centralisé.
                    </p>
                </div>

                {/* Store Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                    {allStores.map((store, i) => {
                        const gradients = [
                            "from-rose-100 to-teal-100",
                            "from-blue-100 to-indigo-100",
                            "from-amber-100 to-orange-100",
                            "from-emerald-100 to-teal-100",
                            "from-violet-100 to-fuchsia-100",
                            "from-cyan-100 to-blue-100"
                        ];
                        return (
                            <StoreCard
                                key={store.id}
                                store={store}
                                gradient={gradients[i % gradients.length]}
                            />
                        );
                    })}

                    {/* Add New Store Card */}
                    {allStores.length < 3 ? (
                        <Link
                            href="/onboarding"
                            className="group flex flex-col items-center justify-center h-full min-h-[120px] sm:min-h-[280px] py-6 sm:py-0 border-2 border-dashed border-zinc-200 rounded-2xl sm:rounded-3xl hover:border-zinc-400 hover:bg-white transition-all duration-300"
                        >
                            <div className="w-14 h-14 rounded-full bg-zinc-100 flex items-center justify-center mb-4 group-hover:bg-zinc-200 group-hover:scale-110 transition-all duration-300">
                                <Plus className="h-6 w-6 text-zinc-500" />
                            </div>
                            <span className="font-bold text-zinc-900 tracking-tight">Nouvelle boutique</span>
                            <span className="text-zinc-400 text-sm mt-1">Lancer un nouveau projet</span>
                        </Link>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full min-h-[120px] sm:min-h-[280px] py-6 sm:py-0 border-2 border-dashed border-zinc-100 rounded-2xl sm:rounded-3xl bg-zinc-50/50 opacity-60 cursor-not-allowed">
                            <div className="w-14 h-14 rounded-full bg-zinc-100 flex items-center justify-center mb-4">
                                <Plus className="h-6 w-6 text-zinc-300" />
                            </div>
                            <span className="font-bold text-zinc-400 tracking-tight">Limite atteinte</span>
                            <span className="text-zinc-300 text-sm mt-1 text-center px-4">3 boutiques max</span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="text-center mt-6 sm:mt-16 text-[10px] sm:text-xs text-zinc-400 font-medium">
                    © 2025 ElenaShop Inc. Tous droits réservés.
                </div>
            </div>
        </div>
    );
}
