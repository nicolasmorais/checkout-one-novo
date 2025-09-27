// src/lib/server-products.ts
import { Product } from "@/services/products-service"; // Re-use the Product interface

export async function getProductBySlugFromServer(slug: string): Promise<Product | undefined> {
  // In a real application, you would fetch this from a database or API.
  // For demonstration, we'll use a mock list.
  const mockProducts: Product[] = [
    {
      id: "1",
      slug: "example-product-1",
      name: "Example Product One",
      description: "This is a great example product.",
      value: 99.99,
      reviews: [],
    },
    {
        id: "2",
        slug: "example-product-2",
        name: "Example Product Two",
        description: "Another fantastic product.",
        value: 129.99,
        reviews: [],
    }
  ];

  return mockProducts.find(p => p.slug === slug);
}
