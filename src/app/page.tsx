
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/ui/logo";
import { getProducts, Product } from "@/services/products-service";
import { ShieldCheck, Zap, Lock, Check, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


const problems = [
    { text: "Cliente interessado → Vai pagar → Vê que precisa do CPF → Desiste" },
    { text: "Formulário longo → Cliente com pressa → Abandona o carrinho" },
    { text: "Processo complicado → Cliente desconfiado → Não finaliza" },
];

const solutions = [
    {
      icon: <Check className="h-8 w-8 text-green-500" />,
      title: "Sem CPF Obrigatório",
      description: "Seus clientes compram apenas com nome e email. Simples, rápido, sem medo."
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "3 Cliques e Pronto",
      description: "Processo ultrarrápido que não dá tempo do cliente desistir. Quanto menos etapas, mais vendas."
    },
    {
      icon: <Check className="h-8 w-8 text-green-500" />,
      title: "Aprovação Instantânea",
      description: "Pix aprovado em segundos = cliente feliz = menos cancelamentos = mais faturamento."
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      title: "100% Seguro e Legal",
      description: "Atendemos todas as exigências fiscais sem complicar a vida do seu cliente."
    }
];

const testimonials = [
    { quote: "“Implementei e minhas vendas aumentaram 40% no primeiro mês. Os clientes não desistem mais na hora de pagar!”" },
    { quote: "“Finalmente um checkout que pensa no cliente. Minha taxa de abandono de carrinho despencou.”" }
]

const comparisonData = [
    { feature: "Coleta de Dados", traditional: "Pede CPF, RG, telefone", oneconversion: "Só nome e email" },
    { feature: "Campos Obrigatórios", traditional: "7-10 campos", oneconversion: "3 campos apenas" },
    { feature: "Jornada do Cliente", traditional: "Cliente desiste no meio", oneconversion: "Finaliza em segundos" },
    { feature: "Resultado", traditional: "Taxa de conversão baixa", oneconversion: "+40% mais vendas" },
]

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

      <main className="flex-grow container mx-auto px-4 flex flex-col items-center text-center">
        {/* Hero Section */}
        <section className="py-20 sm:py-24">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter max-w-3xl">
            Pare de Perder Vendas por Causa do <span className="text-primary">CPF</span> 🚫📝
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            O checkout que aumenta sua conversão eliminando fricções desnecessárias. Seus clientes estão abandonando o carrinho na hora de pagar? O problema pode ser mais simples do que você imagina.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            {firstProduct ? (
                 <Button asChild size="lg" className="text-lg h-12 px-8 animate-pulse">
                    <Link href={`/${firstProduct.slug}`}>Aumentar Minhas Vendas</Link>
                </Button>
            ) : (
                <Button size="lg" className="text-lg h-12 px-8" disabled>
                    Nenhum produto disponível
                </Button>
            )}
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-16 sm:py-20 w-full bg-secondary rounded-xl">
           <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tighter">O Problema Que Todo Vendedor Conhece</h2>
           </div>
           <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {problems.map((problem, index) => (
                    <Card key={index} className="text-left bg-background/50 border-destructive/50">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <X className="h-6 w-6 text-destructive" />
                            <p className="text-muted-foreground">{problem.text}</p>
                        </CardHeader>
                    </Card>
                ))}
           </div>
            <p className="mt-12 text-2xl font-bold text-destructive">Resultado: Você perde dinheiro todos os dias.</p>
        </section>

        {/* Solution Section */}
        <section className="py-20 sm:py-24 w-full">
           <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tighter">Nossa Solução: <span className="text-primary">Checkout Sem Fricção</span></h2>
           </div>
           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {solutions.map(feature => (
                    <Card key={feature.title} className="text-left text-card-foreground border-border/80">
                        <CardHeader>
                            {feature.icon}
                        </CardHeader>
                        <CardContent>
                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </CardContent>
                    </Card>
                ))}
           </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 sm:py-20 w-full bg-secondary rounded-xl">
           <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tighter">O Que Nossos Clientes Dizem</h2>
           </div>
           <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {testimonials.map((testimonial, index) => (
                    <Card key={index} className="text-center bg-background/50">
                        <CardContent className="pt-6">
                            <p className="text-lg italic text-muted-foreground">{testimonial.quote}</p>
                        </CardContent>
                    </Card>
                ))}
           </div>
        </section>

        {/* Comparison Section */}
        <section className="py-20 sm:py-24 w-full">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tighter">Compare e Decida</h2>
            </div>
            <Card className="max-w-4xl mx-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px]"></TableHead>
                            <TableHead className="text-center text-base">Checkout Tradicional</TableHead>
                            <TableHead className="text-center text-base text-primary">Nosso Checkout</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {comparisonData.map((row) => (
                            <TableRow key={row.feature}>
                                <TableCell className="font-medium">{row.feature}</TableCell>
                                <TableCell className="text-center text-muted-foreground"><span className="inline-flex items-center gap-2"><X className="h-4 w-4 text-destructive" />{row.traditional}</span></TableCell>
                                <TableCell className="text-center font-semibold text-primary"><span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-green-500" />{row.oneconversion}</span></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 sm:py-24 w-full">
            <div className="bg-primary text-primary-foreground p-12 rounded-xl text-center">
                <h2 className="text-4xl font-bold">Comece Hoje e Veja Suas Vendas Decolarem</h2>
                <p className="mt-4 text-lg max-w-2xl mx-auto">
                    Chega de perder dinheiro com checkout complicado. Junte-se a centenas de vendedores que já aumentaram suas vendas conosco.
                </p>
                <div className="mt-8">
                     {firstProduct ? (
                        <Button asChild size="lg" variant="secondary" className="text-lg h-14 px-10">
                            <Link href={`/${firstProduct.slug}`}>Quero Aumentar Minhas Vendas Agora</Link>
                        </Button>
                    ) : (
                        <Button size="lg" variant="secondary" className="text-lg h-14 px-10" disabled>
                            Nenhum produto disponível
                        </Button>
                    )}
                </div>
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

    