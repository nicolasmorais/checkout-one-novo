"use client";

import { useState, useEffect } from "react";
import PersonalInfoForm from "@/components/checkout/personal-info-form";
import QrCodeDisplay from "@/components/checkout/qr-code-display";
import SuccessDisplay from "@/components/checkout/success-display";
import Footer from "@/components/checkout/footer";
import { Toaster } from "@/components/ui/toaster";
import { createPayment, CreatePaymentInput, CreatePaymentOutput } from "@/ai/flows/create-payment-flow";
import { saveSale, Sale } from "@/services/sales-service";
import { Product, getProductBySlug } from "@/services/products-service"; // Import getProductBySlug
import { createTables } from "@/lib/seed-db";
import { notFound } from "next/navigation"; // Import notFound for client-side redirection
import { Skeleton } from "@/components/ui/skeleton";

type UserData = {
  name: string;
  email: string;
};

type CheckoutStep = "INFO" | "QR" | "SUCCESS";

interface CheckoutPageClientProps {
    productSlug: string; // Now receives slug instead of product
}

export default function CheckoutPageClient({ productSlug }: CheckoutPageClientProps) {
  const [step, setStep] = useState<CheckoutStep>("INFO");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [paymentData, setPaymentData] = useState<CreatePaymentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false); // For payment processing
  const [product, setProduct] = useState<Product | null>(null); // State to store fetched product
  const [isLoadingProduct, setIsLoadingProduct] = useState(true); // State for product fetching

  useEffect(() => {
    // Fetch product on the client-side using the slug
    const fetchProduct = () => {
      setIsLoadingProduct(true);
      const foundProduct = getProductBySlug(productSlug);
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        notFound(); // If product not found, show 404
      }
      setIsLoadingProduct(false);
    };

    fetchProduct();

    // We still ensure tables exist, but this is a quick client-side check.
    // The main product data is now passed via props.
    async function setupDatabase() {
      try {
        await createTables();
        console.log("Database setup complete on client.");
      } catch (error) {
        console.error("Error during client-side DB setup:", error);
      }
    }
    setupDatabase();
  }, [productSlug]); // Re-run when productSlug changes

  const handleInfoSubmit = async (data: UserData) => {
    if (!product) return; // Should not happen if notFound() is called above

    setIsLoading(true);
    setUserData(data);
    try {
      const paymentResult = await createPayment({
        name: data.name,
        email: data.email,
        valueInCents: Math.round(product.value * 100)
      });
      setPaymentData(paymentResult);
      
      const newSale: Omit<Sale, 'id' | 'sale_date'> = {
        transaction_id: paymentResult.transactionId,
        customer_name: data.name,
        customer_email: data.email,
        product_name: product.name,
        amount_in_cents: Math.round(product.value * 100),
        status: "Pendente",
        pix_code: paymentResult.pixCode,
      };
      await saveSale(newSale);
      
      setStep("QR");
    } catch (error) {
      console.error("Failed to create payment or save sale", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setStep("SUCCESS");
  };

  const renderStep = () => {
    if (isLoadingProduct || !product) {
        return <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-12 w-full" />
        </div>;
    }

    switch (step) {
      case "INFO":
        return <PersonalInfoForm product={product} onSubmit={handleInfoSubmit} isLoading={isLoading} />;
      case "QR":
        if (userData && paymentData) {
          return <QrCodeDisplay userData={userData} product={product} paymentData={paymentData} onScanned={handlePaymentSuccess} />;
        }
        setStep("INFO");
        return null;
      case "SUCCESS":
        if (userData) {
          return <SuccessDisplay userData={userData} />;
        }
        setStep("INFO");
        return null;
      default:
        return <PersonalInfoForm product={product} onSubmit={handleInfoSubmit} isLoading={isLoading} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow flex w-full flex-col items-center bg-background p-4 font-body">
        <div key={step} className="w-full max-w-md animate-in fade-in duration-500">
          {renderStep()}
        </div>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
