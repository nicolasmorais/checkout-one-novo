"use client";

import { useState } from "react";
import Image from "next/image";
import PersonalInfoForm from "@/components/checkout/personal-info-form";
import QrCodeDisplay from "@/components/checkout/qr-code-display";
import SuccessDisplay from "@/components/checkout/success-display";
import { ShieldCheck, Phone } from "lucide-react";

type UserData = {
  name: string;
  email: string;
  cpf: string;
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
    <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 font-body">
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
      <div className="fixed bottom-4 right-4">
        <button className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white shadow-lg">
          <Phone size={24} />
        </button>
      </div>
    </main>
  );
}
