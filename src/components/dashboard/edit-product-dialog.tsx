
"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Product } from "@/services/products-service";
import { Review } from "@/services/reviews-service";
import { useEffect } from "react";
import { Trash2, PlusCircle, Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const reviewSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "O nome é obrigatório."),
  text: z.string().min(10, "A avaliação deve ter pelo menos 10 caracteres."),
  rating: z.coerce.number().min(1).max(5),
  avatarUrl: z.string().url("URL do avatar inválida.").optional().or(z.literal('')),
});

const formSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  description: z.string().min(3, "A descrição deve ter pelo menos 3 caracteres."),
  value: z.coerce.number().positive("O valor deve ser um número positivo."),
  logoUrl: z.string().url("URL inválida").optional().or(z.literal('')),
  checkoutImageUrl: z.string().url("URL inválida").optional().or(z.literal('')),
  reviews: z.array(reviewSchema),
});

type ProductFormData = z.infer<typeof formSchema>;

interface EditProductDialogProps {
  product: Product;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (product: Product) => void;
}

export default function EditProductDialog({
  product,
  isOpen,
  onOpenChange,
  onSave,
}: EditProductDialogProps) {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product.name,
      description: product.description,
      value: product.value,
      logoUrl: product.logoUrl || "",
      checkoutImageUrl: product.checkoutImageUrl || "",
      reviews: product.reviews || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "reviews",
  });

  // Reset form when the product prop changes
  useEffect(() => {
    form.reset({
        name: product.name,
        description: product.description,
        value: product.value,
        logoUrl: product.logoUrl || "",
        checkoutImageUrl: product.checkoutImageUrl || "",
        reviews: product.reviews || [],
    });
  }, [product, form]);

  const handleSubmit = (data: ProductFormData) => {
    onSave({
      ...product,
      ...data,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
          <DialogDescription>
            Faça alterações no seu produto aqui. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Produto</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Input {...field} />
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
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="logoUrl"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>URL da Imagem da Logo (Opcional)</FormLabel>
                    <FormControl>
                    <Input {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="checkoutImageUrl"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>URL da Imagem do Checkout (Opcional)</FormLabel>
                    <FormControl>
                    <Input {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <Separator />

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Avaliações do Produto</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ id: new Date().getTime().toString(), name: "", text: "", rating: 5, avatarUrl: "" })}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Adicionar Avaliação
                </Button>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="p-4 border rounded-md space-y-2 relative">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>

                    <FormField
                      control={form.control}
                      name={`reviews.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do Cliente</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name={`reviews.${index}.text`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Texto da Avaliação</FormLabel>
                          <FormControl><Textarea {...field} /></FormControl>
                           <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name={`reviews.${index}.rating`}
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Nota (1-5)</FormLabel>
                                <FormControl><Input type="number" min="1" max="5" {...field} /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`reviews.${index}.avatarUrl`}
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>URL do Avatar (Opcional)</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                  </div>
                ))}
              </div>
            </div>


             <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                    Cancelar
                </Button>
                <Button type="submit">Salvar Alterações</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
