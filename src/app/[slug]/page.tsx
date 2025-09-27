import CheckoutPageClient from "@/components/checkout-page-client";
import { notFound } from "next/navigation";

export default async function CheckoutPage({ params }: { params: { slug: string | undefined } }) {
  const productSlug = params.slug;

  if (!productSlug) {
    return notFound();
  }

  // Pass the slug to the client component for client-side fetching
  return <CheckoutPageClient productSlug={productSlug} />;
}
