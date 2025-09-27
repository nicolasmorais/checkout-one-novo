
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Package, Copy, Link as LinkIcon, Loader2, Trash2, Edit } from "lucide-react";
import { Product, getProducts, saveProduct, deleteProduct, updateProduct } from "@/services/products-service";
import EditProductDialog from "@/components/dashboard/edit-product-dialog";


const formSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  description: z.string().min(3, "A descrição deve ter pelo menos 3 caracteres."),
  value: z.coerce.number().positive("O valor deve ser um número positivo."),
  logoUrl: z.string().url("URL inválida").optional().or(z.literal('')),
  checkoutImageUrl: z.string().url("URL inválida").optional().or(z.literal('')),
});

type ProductFormData = z.infer<typeof formSchema>;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
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
      logoUrl: "",
      checkoutImageUrl: "",
    },
  });

  const handleAddProduct = (data: ProductFormData) => {
    setIsLoading(true);
    try {
      const newProduct: Omit<Product, 'id' | 'slug'> = {
        name: data.name,
        description: data.description,
        value: data.value,
        logoUrl: data.logoUrl,
        checkoutImageUrl: data.checkoutImageUrl,
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
    const url = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(url);
    toast({
      description: "Link do checkout copiado para a área de transferência!",
    });
  };

  const handleOpenEditModal = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteAlert = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteAlertOpen(true);
  };

  const handleUpdateProduct = (updatedData: Product) => {
    try {
      updateProduct(updatedData);
      setProducts(currentProducts =>
        currentProducts.map(p => (p.id === updatedData.id ? updatedData : p))
      );
      toast({
        title: "Produto Atualizado!",
        description: `O produto "${updatedData.name}" foi atualizado.`,
      });
      setIsEditModalOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao Atualizar",
        description: "Não foi possível atualizar o produto.",
      });
    }
  };

  const handleDeleteProduct = () => {
    if (!selectedProduct) return;
    try {
        deleteProduct(selectedProduct.id);
        setProducts(currentProducts =>
            currentProducts.filter(p => p.id !== selectedProduct.id)
        );
        toast({
            title: "Produto Excluído!",
            description: `O produto "${selectedProduct.name}" foi excluído.`,
        });
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Erro ao Excluir",
            description: "Não foi possível excluir o produto.",
        });
    } finally {
        setIsDeleteAlertOpen(false);
        setSelectedProduct(null);
    }
  };


  return (
    <>
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
                <div className="grid md:grid-cols-2 gap-4">
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
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição (Subtítulo)</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Acesso Vitalício ao curso completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                 <div className="grid grid-cols-1 gap-4">
                    <FormField
                        control={form.control}
                        name="logoUrl"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>URL da Imagem da Logo (Opcional)</FormLabel>
                            <FormControl>
                            <Input placeholder="https://..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                 </div>
                 <FormField
                    control={form.control}
                    name="checkoutImageUrl"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>URL da Imagem do Checkout (Opcional)</FormLabel>
                        <FormControl>
                        <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
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
                  <TableHead>Valor</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.description}</TableCell>
                      <TableCell>
                        {product.value.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyLink(product.slug)}
                        >
                          <LinkIcon className="mr-2 h-4 w-4" />
                          Link
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleOpenEditModal(product)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleOpenDeleteAlert(product)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Excluir</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Nenhum produto cadastrado ainda.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      {isEditModalOpen && selectedProduct && (
        <EditProductDialog
          product={selectedProduct}
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          onSave={handleUpdateProduct}
        />
      )}
       <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. Isso excluirá permanentemente o produto
              e tornará seu link de checkout inválido.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct}>
              Sim, excluir produto
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
    

    