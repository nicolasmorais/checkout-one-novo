"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { ShieldCheck, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor, insira um endereço de e-mail válido.",
  }),
});

type UserData = z.infer<typeof formSchema>;

interface PersonalInfoFormProps {
  onSubmit: (data: UserData) => void;
}

const reviews = [
  {
    name: "Maria S.",
    avatar: "https://placehold.co/40x40.png",
    rating: 5,
    text: "“Transformou meu negócio! Os criativos que aprendi a fazer aqui geraram um ROI de 5x em menos de 30 dias. Essencial para quem quer escalar.”",
  },
  {
    name: "João P.",
    avatar: "https://placehold.co/40x40.png",
    rating: 5,
    text: "“Didática incrível e conteúdo direto ao ponto. Consegui aplicar as técnicas no mesmo dia e já vi um aumento significativo no engajamento.”",
  },
  {
    name: "Ana L.",
    avatar: "https://placehold.co/40x40.png",
    rating: 5,
    text: "“O melhor investimento que fiz para minha loja. As estratégias de criativos são ouro puro e o suporte do Mago é fora de série.”",
  },
];

export default function PersonalInfoForm({ onSubmit }: PersonalInfoFormProps) {
  const form = useForm<UserData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  function handleFormSubmit(values: UserData) {
    onSubmit(values);
  }

  return (
    <>
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="p-4">
          <div className="flex items-center gap-4">
            <Image
              src="https://placehold.co/80x80.png"
              alt="Mago do CTR"
              width={80}
              height={80}
              data-ai-hint="man portrait"
              className="rounded-full"
            />
            <div className="flex-1">
              <h2 className="font-bold">Mago do CTR</h2>
              <p className="text-sm text-muted-foreground">3 Pilares Dos Criativos</p>
              <div className="mt-2 flex items-baseline">
                <p className="text-sm text-muted-foreground mr-2">Total</p>
                <p className="text-2xl font-bold text-primary">R$ 9,90</p>
                <p className="text-sm text-muted-foreground ml-1">à vista</p>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="w-full max-w-md shadow-lg mt-6">
        <CardHeader>
          <h3 className="font-bold text-lg">Dados Pessoais</h3>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Seu Nome" {...field} className="h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="E-mail que receberá a compra" {...field} className="h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex-col items-center">
              <Button type="submit" size="lg" className="w-full h-12 text-lg font-bold">
                CONTINUAR &raquo;
              </Button>
              <div className="mt-4 flex items-center justify-center gap-2 text-muted-foreground">
                <ShieldCheck size={16} className="text-green-600"/>
                <span className="text-sm font-medium">Ambiente Seguro</span>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <Card className="w-full max-w-md shadow-lg mt-6">
        <CardHeader>
          <CardTitle>O que nossos alunos estão dizendo:</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {reviews.map((review, index) => (
            <div key={index} className="flex items-start gap-4">
              <Avatar>
                <AvatarImage src={review.avatar} alt={review.name} data-ai-hint="person avatar" />
                <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{review.name}</p>
                  <div className="flex items-center">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    {[...Array(5-review.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-gray-300" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{review.text}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
