
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import PersonalInfoForm from "@/components/checkout/personal-info-form";
import QrCodeDisplay from "@/components/checkout/qr-code-display";
import SuccessDisplay from "@/components/checkout/success-display";
import { ShieldCheck, Loader2 } from "lucide-react";
import Footer from "@/components/checkout/footer";
import { Toaster } from "@/components/ui/toaster";
import { createPayment, CreatePaymentInput, CreatePaymentOutput } from "@/ai/flows/create-payment-flow";
import { saveSale, Sale } from "@/services/sales-service";
import { getProductBySlug, Product } from "@/services/products-service";
import { Card } from "@/components/ui/card";
import { createTables } from "@/lib/seed-db";

type UserData = {
  name: string;
  email: string;
};

type CheckoutStep = "INFO" | "QR" | "SUCCESS";

const DEFAULT_PRODUCT: Omit<Product, 'id' | 'slug'> = {
  name: "Produto Padrão",
  description: "Acesso ao item selecionado",
  value: 9.90,
  bannerUrl: "https://placehold.co/600x400.png",
  logoUrl: "https://placehold.co/80x80.png"
};

export default function CheckoutPageContent({ params }: { params: { slug: string | undefined }}) {
  const productSlug = params.slug;

  const [step, setStep] = useState<CheckoutStep>("INFO");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [paymentData, setPaymentData] = useState<CreatePaymentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState<Omit<Product, 'id' | 'slug'>>(DEFAULT_PRODUCT);
  const [productLoading, setProductLoading] = useState(true);

  useEffect(() => {
    async function setupDatabaseAndLoadProduct() {
      setProductLoading(true);
      try {
        // Ensure database tables are created
        await createTables();
        console.log("Database setup complete.");
        
        // Load product information
        if (productSlug) {
            const foundProduct = getProductBySlug(productSlug);
            if (foundProduct) {
                setProduct(foundProduct);
            }
        }
      } catch (error) {
        console.error("Error during setup:", error);
      } finally {
        setProductLoading(false);
      }
    }
    setupDatabaseAndLoadProduct();
  }, [productSlug]);

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

  if (productLoading) {
    return (
       <div className="flex flex-col min-h-screen">
          <main className="flex-grow flex w-full flex-col items-center justify-center bg-background p-4 font-body">
            <Card className="w-full max-w-md shadow-lg flex items-center justify-center p-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </Card>
          </main>
          <Footer />
          <Toaster />
       </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow flex w-full flex-col items-center bg-background p-4 font-body">
        <div className="w-full max-w-md">
          <div className="relative w-full mb-4">
             <Image
              src={product.bannerUrl}
              alt="Banner"
              width={600} 
              height={400}
              className="rounded-md w-full h-auto"
              data-ai-hint="advertisement banner"
              unoptimized
              priority
            />
          </div>
          <div className="mb-4 flex items-center justify-center gap-2 rounded-md bg-primary p-3 text-primary-foreground">
            <ShieldCheck />
            <span className="font-bold">COMPRA 100% SEGURA</span>
          </div>
        </div>
        <div key={step} className="w-full max-w-md animate-in fade-in duration-500">
          {renderStep()}
        </div>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
