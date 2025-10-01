// src/app/dashboard/products/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { saveProduct, updateProduct, deleteProduct, Product } from '@/services/products-service';

// Schema para validação dos dados do formulário de produto
const imageUrlSchema = z.object({
  url: z.string().url("URL da imagem inválida").or(z.literal('')),
});

const productFormSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  description: z.string().min(3, "A descrição deve ter pelo menos 3 caracteres."),
  value: z.coerce.number().positive("O valor deve ser um número positivo."),
  logoUrl: z.string().url("URL inválida").optional().or(z.literal('')),
  checkoutImageUrls: z.array(imageUrlSchema),
});

export type ProductFormData = z.infer<typeof productFormSchema>;

/**
 * Server Action para adicionar um novo produto.
 * @param data - Os dados do produto do formulário.
 */
export async function addProductAction(data: ProductFormData) {
  try {
    const newProductData: Omit<Product, 'id' | 'slug' | 'reviews'> = {
      name: data.name,
      description: data.description,
      value: data.value,
      logoUrl: data.logoUrl,
      checkoutImageUrls: data.checkoutImageUrls.map(item => item.url).filter(Boolean),
    };
    await saveProduct(newProductData);
    revalidatePath('/dashboard/products'); // Invalida o cache da página de produtos para recarregar a lista
    return { success: true, message: `Produto "${data.name}" adicionado com sucesso.` };
  } catch (error) {
    console.error('Erro ao salvar produto:', error);
    return { success: false, message: 'Não foi possível salvar o produto.' };
  }
}

/**
 * Server Action para atualizar um produto existente.
 * @param updatedData - Os dados completos do produto a ser atualizado.
 */
export async function updateProductAction(updatedData: Product) {
  try {
    await updateProduct(updatedData);
    revalidatePath('/dashboard/products'); // Invalida o cache da página de produtos
    return { success: true, message: `Produto "${updatedData.name}" atualizado com sucesso.` };
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return { success: false, message: 'Não foi possível atualizar o produto.' };
  }
}

/**
 * Server Action para deletar um produto.
 * @param productId - O ID do produto a ser deletado.
 */
export async function deleteProductAction(productId: string) {
  try {
    await deleteProduct(productId);
    revalidatePath('/dashboard/products'); // Invalida o cache da página de produtos
    return { success: true, message: 'Produto excluído com sucesso.' };
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    return { success: false, message: 'Não foi possível excluir o produto.' };
  }
}
