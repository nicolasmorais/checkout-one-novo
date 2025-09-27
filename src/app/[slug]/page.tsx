import { getProductBySlug } from "@/services/products-service";
import CheckoutPageClient from "@/components/checkout-page-client";
import { notFound } from "next/navigation";

export default async function CheckoutPage({ params }: { params: { slug: string | undefined } }) {
  const productSlug = params.slug;

  if (!productSlug) {
    return notFound();
  }

  // This logic now runs on the server, ensuring the product data is available at build/render time.
  // It now uses the server-side products-service to fetch from Vercel Postgres.
  const product = await getProductBySlug(productSlug);

  // If no product is found, show a 404 page.
  if (!product) {
    return notFound();
  }

  // Pass the server-fetched product data to the client component.
  return <CheckoutPageClient product={product} />;
}
