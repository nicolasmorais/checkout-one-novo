
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
import { ShieldCheck, Star, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Product } from "@/services/products-service";
import { Review, getReviews } from "@/services/reviews-service";
import { getMarketingScripts } from "@/services/marketing-service";
import { useState, useEffect } from "react";
import * as fbq from '@/lib/fpixel';


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
  product: Omit<Product, 'id' | 'slug'>;
  onSubmit: (data: UserData) => void;
  isLoading: boolean;
}

export default function PersonalInfoForm({ product, onSubmit, isLoading }: PersonalInfoFormProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pixelId, setPixelId] = useState<string | undefined>(undefined);

  useEffect(() => {
    setReviews(getReviews());
    const scripts = getMarketingScripts();
    setPixelId(scripts.facebook_pixel_id);
  }, []);

  const form = useForm<UserData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  function handleFormSubmit(values: UserData) {
    if (pixelId) {
        fbq.event('InitiateCheckout', {
            content_name: product.name,
            currency: 'BRL',
            value: product.value,
        });
    }
    onSubmit(values);
  }

  return (
    <>
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="p-4">
          <div className="flex items-start gap-4">
             <Image
              src={product.logoUrl || `https://placehold.co/80x80.png?text=${product.name.charAt(0)}`}
              alt="Product Image"
              width={80}
              height={80}
              data-ai-hint="product image"
              className="rounded-md"
              unoptimized
              priority
            />
            <div className="flex-1">
              <h2 className="text-xl font-bold">{product.name}</h2>
              <p className="text-sm text-muted-foreground">{product.description}</p>
              <div className="mt-2 flex items-baseline">
                <p className="text-2xl font-bold text-primary">
                  {product.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
                <p className="text-sm text-muted-foreground ml-1">à vista</p>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
      
      {product.checkoutImageUrl && (
          <div className="relative w-full max-w-md mt-6 rounded-md overflow-hidden">
             <Image
              src={product.checkoutImageUrl}
              alt="Imagem do Checkout"
              width={600} 
              height={400}
              className="w-full h-auto"
              data-ai-hint="advertisement"
              unoptimized
            />
          </div>
      )}

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
              <Button type="submit" size="lg" className="w-full h-12 text-lg font-bold" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : 'CONTINUAR »'}
              </Button>
              <div className="mt-4 flex items-center justify-center gap-2 text-muted-foreground">
                <ShieldCheck size={16} className="text-green-600"/>
                <span className="text-sm font-medium">Ambiente Seguro</span>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {reviews.length > 0 && (
        <Card className="w-full max-w-md shadow-lg mt-6">
          <CardHeader>
            <CardTitle>O que nossos clientes estão dizendo:</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={review.avatarUrl || `https://placehold.co/40x40.png?text=${review.name.charAt(0)}`} alt={review.name} data-ai-hint="person avatar" />
                  <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{review.name}</p>
                    <div className="flex items-center">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      {[...Array(5 - review.rating)].map((_, i) => (
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
      )}
    </>
  );
}
