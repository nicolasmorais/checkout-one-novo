
import CheckoutPageContent from "./[slug]/page";

// This page will render the checkout for the default product,
// as no slug is provided in the URL.
export default function Home() {
  return <CheckoutPageContent params={{ slug: undefined }} />;
}

    