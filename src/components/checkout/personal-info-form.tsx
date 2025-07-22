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
} from "@/components/ui/card";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";

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
            <CardFooter className="flex-col">
              <Button type="submit" size="lg" className="w-full h-12 text-lg font-bold">
                CONTINUAR &raquo;
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      <div className="mt-4 flex items-center justify-center gap-2 text-muted-foreground">
        <ShieldCheck size={16} />
        <span className="text-sm font-medium">Ambiente Seguro</span>
      </div>
    </>
  );
}
