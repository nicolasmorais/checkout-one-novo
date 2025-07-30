
"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from 'next/navigation';
import PersonalInfoForm from "@/components/checkout/personal-info-form";
import QrCodeDisplay from "@/components/checkout/qr-code-display";
import SuccessDisplay from "@/components/checkout/success-display";
import { ShieldCheck, Loader2 } from "lucide-react";
import Footer from "@/components/checkout/footer";
import { Toaster } from "@/components/ui/toaster";
import { createPayment, CreatePaymentInput, CreatePaymentOutput } from "@/ai/flows/create-payment-flow";
import { saveSale, Sale } from "@/services/sales-service";
import { getProductBySlug, Product } from "@/services/products-service";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type UserData = {
  name: string;
  email: string;
};

type CheckoutStep = "INFO" | "QR" | "SUCCESS";

const DEFAULT_PRODUCT = {
  name: "3 Pilares Dos Criativos",
  value: 9.90,
  slug: "default"
};

function CheckoutPageContent() {
  const searchParams = useSearchParams();
  const productSlug = searchParams.get('product');

  const [step, setStep] = useState<CheckoutStep>("INFO");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [paymentData, setPaymentData] = useState<CreatePaymentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState<Omit<Product, 'id'>>(DEFAULT_PRODUCT);
  const [productLoading, setProductLoading] = useState(true);

  useEffect(() => {
    if (productSlug) {
        const foundProduct = getProductBySlug(productSlug);
        if (foundProduct) {
            setProduct(foundProduct);
        }
    }
    setProductLoading(false);
  }, [productSlug]);

  const handleInfoSubmit = async (data: Omit<CreatePaymentInput, 'valueInCents'>) => {
    setIsLoading(true);
    setUserData(data);
    try {
      const paymentResult = await createPayment({
        ...data,
        valueInCents: Math.round(product.value * 100)
      });
      setPaymentData(paymentResult);
      
      const newSale: Sale = {
        id: new Date().getTime().toString(),
        transactionId: paymentResult.transactionId,
        name: data.name,
        email: data.email,
        product: product.name,
        amount: `R$ ${product.value.toFixed(2).replace('.', ',')}`,
        status: "Pendente",
        pixCode: paymentResult.pixCode,
        date: new Date(),
      };
      saveSale(newSale);
      
      setStep("QR");
    } catch (error) {
      console.error("Failed to create payment", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQrScanned = () => {
    // This flow is currently disabled.
  };

  const renderStep = () => {
    if (productLoading) {
      return (
         <Card className="w-full max-w-md shadow-lg flex items-center justify-center p-10">
            <Loader2 className="h-8 w-8 animate-spin" />
         </Card>
      )
    }

    switch (step) {
      case "INFO":
        return <PersonalInfoForm product={product} onSubmit={handleInfoSubmit} isLoading={isLoading} />;
      case "QR":
        if (userData && paymentData) {
          return <QrCodeDisplay userData={userData} paymentData={paymentData} onScanned={handleQrScanned} />;
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
        <div className="w-full max-w-md">
          <Image
            src="https://placehold.co/600x150.png"
            alt="Banner"
            width={600}
            height={150}
            className="mb-4 w-full rounded-md"
            data-ai-hint="advertisement banner"
          />
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


export default function Home() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <CheckoutPageContent />
    </Suspense>
  )
}
