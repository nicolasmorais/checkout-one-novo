
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/ui/logo";
import { getProducts, Product } from "@/services/products-service";
import { ShieldCheck, Zap, Lock } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const features = [
    {
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      title: "Compra 100% Segura",
      description: "Utilizamos as tecnologias mais avançadas para garantir a segurança da sua transação, do início ao fim."
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Aprovação Imediata com Pix",
      description: "Seu pagamento é processado instantaneamente e o acesso ao produto é liberado na mesma hora."
    },
    {
      icon: <Lock className="h-8 w-8 text-primary" />,
      title: "Seus Dados Protegidos",
      description: "Respeitamos sua privacidade. Seus dados são criptografados e nunca compartilhados com terceiros."
    }
];

export default function LandingPage() {
    const [firstProduct, setFirstProduct] = useState<Product | null>(null);

    useEffect(() => {
        const products = getProducts();
        if (products.length > 0) {
            setFirstProduct(products[0]);
        }
    }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 py-6">
         <Logo standalone />
      </header>

      <main className="flex-grow container mx-auto px-4 flex flex-col items-center justify-center text-center">
        <section className="py-20 sm:py-32">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter max-w-3xl">
            Uma experiência de checkout <span className="text-primary">simples, rápida e segura.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
            Nosso sistema de pagamento foi desenhado para ser intuitivo e sem fricção, permitindo que você finalize sua compra em segundos e receba seu acesso imediatamente.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            {firstProduct ? (
                 <Button asChild size="lg" className="text-lg h-12 px-8">
                    <Link href={`/${firstProduct.slug}`}>Conheça o Produto Principal</Link>
                </Button>
            ) : (
                <Button size="lg" className="text-lg h-12 px-8" disabled>
                    Nenhum produto disponível
                </Button>
            )}
          </div>
        </section>

        <section className="py-20 sm:py-32 w-full">
           <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tighter">Tudo o que você precisa, sem complicações.</h2>
                <p className="text-muted-foreground mt-2">Foco no que importa: sua satisfação.</p>
           </div>
           <div className="grid md:grid-cols-3 gap-8">
                {features.map(feature => (
                    <Card key={feature.title} className="text-left">
                        <CardHeader className="flex flex-row items-center gap-4">
                            {feature.icon}
                            <CardTitle className="text-xl">{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </CardContent>
                    </Card>
                ))}
           </div>
        </section>
      </main>

      <footer className="w-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 py-6">
        <div className="container mx-auto px-4 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} OneConversion. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
