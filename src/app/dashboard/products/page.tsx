
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Package, Copy, Link as LinkIcon, Loader2 } from "lucide-react";
import { Product, getProducts, saveProduct } from "@/services/products-service";

const formSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  description: z.string().min(3, "A descrição deve ter pelo menos 3 caracteres."),
  value: z.coerce.number().positive("O valor deve ser um número positivo."),
});

type ProductFormData = z.infer<typeof formSchema>;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      value: 0,
    },
  });

  const handleAddProduct = (data: ProductFormData) => {
    setIsLoading(true);
    try {
      const newProduct: Omit<Product, 'id' | 'slug'> = {
        name: data.name,
        description: data.description,
        value: data.value,
      };
      const savedProduct = saveProduct(newProduct);
      setProducts(currentProducts => [savedProduct, ...currentProducts]);
      toast({
        title: "Produto Adicionado!",
        description: `O produto "${data.name}" foi salvo com sucesso.`,
      });
      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao Salvar",
        description: "Não foi possível salvar o produto.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/?product=${slug}`;
    navigator.clipboard.writeText(url);
    toast({
      description: "Link do checkout copiado para a área de transferência!",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Novo Produto</CardTitle>
          <CardDescription>
            Preencha os dados abaixo para cadastrar um novo produto digital.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAddProduct)}>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Produto</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Ebook de Receitas" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição (Subtítulo)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Acesso Vitalício" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor (R$)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="Ex: 29.90" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : <Package className="mr-2" />}
                Adicionar Produto
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Meus Produtos</CardTitle>
          <CardDescription>
            A lista dos seus produtos cadastrados. Use o link para o checkout.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Produto</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length > 0 ? (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.description}</TableCell>
                    <TableCell className="text-right">
                      {product.value.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyLink(product.slug)}
                      >
                        <LinkIcon className="mr-2 h-4 w-4" />
                        Copiar Link
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Nenhum produto cadastrado ainda.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
