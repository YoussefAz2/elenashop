import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4 dark:from-slate-950 dark:to-slate-900">
            <Card className="w-full max-w-md border-slate-200/50 shadow-xl dark:border-slate-800/50">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                        <Store className="h-8 w-8 text-red-600 dark:text-red-400" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        Boutique introuvable
                    </CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400">
                        Cette boutique n&apos;existe pas ou a été supprimée.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <Link href="/">
                        <Button
                            variant="outline"
                            className="gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Retour à l&apos;accueil
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}
