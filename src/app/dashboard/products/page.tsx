// src/app/dashboard/products/page.tsx
import { getProducts } from "@/services/products-service";
import ProductsClient from "./ProductsClient";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export default async function ProductsPage() {
  // Busca os produtos no servidor.
  const products = await getProducts();

  return (
    // Suspense é usado aqui caso a busca de produtos seja demorada.
    <Suspense fallback={<div className="flex justify-center items-center h-40"><Loader2 className="animate-spin h-8 w-8" /></div>}>
      <ProductsClient initialProducts={products} />
    </Suspense>
  );
}
