// src/services/products-service.ts

// Removendo "use client";
'use server';

import { db, sql } from '@vercel/postgres';
import { Review } from "@/services/reviews-service"; // Re-using Review interface

// Define a estrutura de um objeto de produto, alinhada com a tabela do banco de dados
export interface Product {
  id: string; // O ID virá do banco de dados
  slug: string; // Slug único para URL
  name: string;
  description: string;
  value: number; // Stored as a number, but will be NUMERIC in DB
  logoUrl?: string; // logo_url no banco de dados
  checkoutImageUrls?: string[]; // checkout_image_urls (TEXT[] ou JSON string)
  reviews: Review[]; // stored as JSON string in DB
}

// Helper para gerar um slug simples
function generateSlug(name: string): string {
    const randomPart = Math.random().toString(36).substring(2, 8);
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + randomPart;
}

/**
 * Cria a tabela de produtos no banco de dados, se não existir.
 */
export async function createProductsTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        value NUMERIC(10, 2) NOT NULL,
        logo_url VARCHAR(255),
        checkout_image_urls TEXT[],
        reviews JSONB
      );
    `;
    console.log('Products table ensured to exist in Vercel Postgres');
  } catch (error) {
    console.error('Error creating products table in Vercel Postgres:', error);
    throw error;
  }
}

/**
 * Retorna todos os produtos do banco de dados.
 * @returns {Promise<Product[]>} Um array de objetos Product.
 */
export async function getProducts(): Promise<Product[]> {
  try {
    const { rows } = await sql<Product>`SELECT id, slug, name, description, value, logo_url AS "logoUrl", checkout_image_urls AS "checkoutImageUrls", reviews FROM products;`;
    return rows.map(row => ({
      ...row,
      id: String(row.id), // Ensure id is string
      value: Number(row.value), // Ensure value is number
      reviews: row.reviews ? JSON.parse(row.reviews as string) : []
    }));
  } catch (error) {
    console.error('Error fetching products from Vercel Postgres:', error);
    return [];
  }
}

/**
 * Salva um novo produto no banco de dados. Aqui assumimos que reviews são gerados default
 * @param {Omit<Product, 'id' | 'reviews'>} productData Os dados do novo produto.
 * @returns {Promise<Product>} O objeto Product completo com o ID gerado.
 */
export async function saveProduct(productData: Omit<Product, 'id' | 'reviews'>): Promise<Product> {
  try {
    const newSlug = generateSlug(productData.name);
    const defaultReviews: Review[] = [
      { id: '1', name: 'Maria S.', text: '“Transformou meu negócio! Os criativos que aprendi a fazer aqui geraram um ROI de 5x em menos de 30 dias. Essencial para quem quer escalar.”', rating: 5, avatarUrl: 'https://placehold.co/40x40.png' },
      { id: '2', name: 'João P.', text: '“Didática incrível e conteúdo direto ao ponto. Consegui aplicar as técnicas no mesmo dia e já vi um aumento significativo no engajamento.”', rating: 5, avatarUrl: 'https://placehold.co/40x40.png' },
    ];
    const reviewsJson = JSON.stringify(defaultReviews);

    const { rows } = await sql<Product>`
      INSERT INTO products (
        slug,
        name,
        description,
        value,
        logo_url,
        checkout_image_urls,
        reviews
      ) VALUES (
        ${newSlug},
        ${productData.name},
        ${productData.description},
        ${productData.value},
        ${productData.logoUrl || null},
        ${productData.checkoutImageUrls || []}::TEXT[],
        ${reviewsJson}::JSONB
      )
      RETURNING id, slug, name, description, value, logo_url AS "logoUrl", checkout_image_urls AS "checkoutImageUrls", reviews;
    `;
    const newProduct = rows[0];
    return {
      ...newProduct,
      id: String(newProduct.id), // Ensure id is string
      value: Number(newProduct.value), // Ensure value is number
      reviews: newProduct.reviews ? JSON.parse(newProduct.reviews as string) : []
    };
  } catch (error) {
    console.error('Error saving product to Vercel Postgres:', error);
    throw error;
  }
}

/**
 * Encontra um produto pelo seu slug no banco de dados.
 * @param {string} slug O slug do produto a ser encontrado. Aqui ele será sempre uma string, não undefined.
 * @returns {Promise<Product | undefined>} O produto encontrado ou undefined.
 */
export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  try {
    const { rows } = await sql<Product>`
      SELECT id, slug, name, description, value, logo_url AS "logoUrl", checkout_image_urls AS "checkoutImageUrls", reviews
      FROM products
      WHERE slug = ${slug};
    `;
    if (rows.length > 0) {
      const product = rows[0];
      return {
        ...product,
        id: String(product.id),
        value: Number(product.value),
        reviews: product.reviews ? JSON.parse(product.reviews as string) : []
      };
    }
    return undefined;
  } catch (error) {
    console.error('Error fetching product by slug from Vercel Postgres:', error);
    return undefined;
  }
}

/**
 * Atualiza um produto existente no banco de dados.
 * @param {Product} updatedProduct O objeto Product com os dados atualizados.
 * @returns {Promise<Product>} O objeto Product atualizado.
 */
export async function updateProduct(updatedProduct: Product): Promise<Product> {
  try {
    const reviewsJson = JSON.stringify(updatedProduct.reviews);
    const { rows } = await sql<Product>`
      UPDATE products
      SET
        name = ${updatedProduct.name},
        description = ${updatedProduct.description},
        value = ${updatedProduct.value},
        logo_url = ${updatedProduct.logoUrl || null},
        checkout_image_urls = ${updatedProduct.checkoutImageUrls || []}::TEXT[],
        reviews = ${reviewsJson}::JSONB
      WHERE id = ${updatedProduct.id}
      RETURNING id, slug, name, description, value, logo_url AS "logoUrl", checkout_image_urls AS "checkoutImageUrls", reviews;
    `;
    const product = rows[0];
    return {
        ...product,
        id: String(product.id),
        value: Number(product.value),
        reviews: product.reviews ? JSON.parse(product.reviews as string) : []
    };
  } catch (error) {
    console.error('Error updating product in Vercel Postgres:', error);
    throw error;
  }
}

/**
 * Deleta um produto do banco de dados pelo seu ID.
 * @param {string} productId O ID do produto a ser deletado.
 */
export async function deleteProduct(productId: string): Promise<void> {
  try {
    await sql`DELETE FROM products WHERE id = ${productId};`;
    console.log(`Product with ID ${productId} deleted from Vercel Postgres.`);
  } catch (error) {
    console.error('Error deleting product from Vercel Postgres:', error);
    throw error;
  }
}
