"use client";

import { useState, useEffect } from "react";
import PersonalInfoForm from "@/components/checkout/personal-info-form";
import QrCodeDisplay from "@/components/checkout/qr-code-display";
import SuccessDisplay from "@/components/checkout/success-display";
import Footer from "@/components/checkout/footer";
import { Toaster } from "@/components/ui/toaster";
import { createPayment, CreatePaymentInput, CreatePaymentOutput } from "@/ai/flows/create-payment-flow";
import { saveSale, Sale } from "@/services/sales-service";
import { Product } from "@/services/products-service"; // No longer need getProductBySlug here
import { createTables } from "@/lib/seed-db";
// No longer need notFound or Skeleton here as product is passed via props

type UserData = {
  name: string;
  email: string;
};

type CheckoutStep = "INFO" | "QR" | "SUCCESS";

interface CheckoutPageClientProps {
    product: Product; // Now receives the full product object
}

export default function CheckoutPageClient({ product }: CheckoutPageClientProps) {
  const [step, setStep] = useState<CheckoutStep>("INFO");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [paymentData, setPaymentData] = useState<CreatePaymentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false); // For payment processing

  useEffect(() => {
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
  }, []);

  const handleInfoSubmit = async (data: UserData) => {
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
    // No longer need isLoadingProduct or Skeleton as product is always available here
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
