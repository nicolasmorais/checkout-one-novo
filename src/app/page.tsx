
"use client";

import { useState } from "react";
import Image from "next/image";
import PersonalInfoForm from "@/components/checkout/personal-info-form";
import QrCodeDisplay from "@/components/checkout/qr-code-display";
import SuccessDisplay from "@/components/checkout/success-display";
import { ShieldCheck } from "lucide-react";
import Footer from "@/components/checkout/footer";
import { Toaster } from "@/components/ui/toaster";

type UserData = {
  name: string;
  email: string;
};

type CheckoutStep = "INFO" | "QR" | "SUCCESS";

export default function Home() {
  const [step, setStep] = useState<CheckoutStep>("INFO");
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleInfoSubmit = (data: UserData) => {
    setUserData(data);
    setStep("QR");
  };

  const handleQrScanned = () => {
    setStep("SUCCESS");
  };

  const renderStep = () => {
    switch (step) {
      case "INFO":
        return <PersonalInfoForm onSubmit={handleInfoSubmit} />;
      case "QR":
        if (userData) {
          return <QrCodeDisplay userData={userData} onScanned={handleQrScanned} />;
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
        return <PersonalInfoForm onSubmit={handleInfoSubmit} />;
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
