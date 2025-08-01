
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  getMarketingScripts,
  saveMarketingScripts,
  MarketingScripts,
} from "@/services/marketing-service";
import { Terminal } from "lucide-react";

const marketingSchema = z.object({
  gtm_head: z.string().optional(),
  gtm_body: z.string().optional(),
});

type MarketingFormData = z.infer<typeof marketingSchema>;

export default function MarketingPage() {
  const { toast } = useToast();

  const form = useForm<MarketingFormData>({
    resolver: zodResolver(marketingSchema),
    defaultValues: {
      gtm_head: "",
      gtm_body: "",
    },
  });

  useEffect(() => {
    const scripts = getMarketingScripts();
    form.reset(scripts);
  }, [form]);

  const onSubmit = (data: MarketingFormData) => {
    try {
      saveMarketingScripts(data);
      toast({
        title: "Scripts Salvos!",
        description: "Os códigos de marketing foram atualizados com sucesso.",
      });
       // Dispatch a custom event to notify the layout to update scripts
       window.dispatchEvent(new Event('marketingScriptsUpdated'));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao Salvar",
        description: "Não foi possível salvar os scripts. Verifique o console.",
      });
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Marketing e Rastreamento</CardTitle>
          <CardDescription>
            Gerencie os códigos de rastreamento e scripts para suas páginas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="warning" className="mb-6">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Atenção!</AlertTitle>
            <AlertDescription>
              Os códigos inseridos aqui serão carregados em todas as páginas
              públicas. Use apenas scripts de fontes confiáveis para evitar
              problemas de segurança ou performance.
            </AlertDescription>
          </Alert>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="gtm_head"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código para o &lt;head&gt;</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="<!-- Google Tag Manager --> <script>...</script>"
                        className="h-48 font-mono"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gtm_body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código para o início do &lt;body&gt;</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="<!-- Google Tag Manager (noscript) --> <noscript>...</noscript>"
                        className="h-32 font-mono"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <CardFooter className="border-t px-0 py-4 mt-6">
                 <Button type="submit">Salvar Códigos</Button>
               </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
