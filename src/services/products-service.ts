
"use client";

// Define the structure of a product object
export interface Product {
  id: string; // Internal ID for React keys
  slug: string; // Unique slug for URL
  name: string;
  value: number; // Stored as a number
}

const PRODUCTS_STORAGE_KEY = "firebase-studio-products";

// Helper to generate a simple, somewhat unique slug
function generateSlug(name: string): string {
    const randomPart = Math.random().toString(36).substring(2, 8);
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + randomPart;
}


/**
 * Retrieves the list of products from localStorage.
 * @returns {Product[]} An array of product objects.
 */
export function getProducts(): Product[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const productsJson = window.localStorage.getItem(PRODUCTS_STORAGE_KEY);
    return productsJson ? JSON.parse(productsJson) : [];
  } catch (error) {
    console.error("Failed to retrieve products from localStorage", error);
    return [];
  }
}

/**
 * Saves a new product to the list in localStorage.
 * @param {Omit<Product, 'id' | 'slug'>} productData The new product data.
 * @returns {Product} The full product object with id and slug.
 */
export function saveProduct(productData: Omit<Product, 'id' | 'slug'>): Product {
  if (typeof window === "undefined") {
    throw new Error("Cannot save product on the server.");
  }
  try {
    const existingProducts = getProducts();
    const newProduct: Product = {
      id: new Date().getTime().toString(),
      slug: generateSlug(productData.name),
      ...productData,
    };
    const updatedProducts = [newProduct, ...existingProducts];
    window.localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updatedProducts));
    return newProduct;
  } catch (error) {
    console.error("Failed to save product to localStorage", error);
    throw error;
  }
}

/**
 * Finds a product by its slug.
 * @param {string} slug The slug of the product to find.
 * @returns {Product | undefined} The found product or undefined.
 */
export function getProductBySlug(slug: string): Product | undefined {
    const products = getProducts();
    return products.find(p => p.slug === slug);
}
