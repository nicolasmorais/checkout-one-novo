"use client";

import { useState } from "react";
import PersonalInfoForm from "@/components/checkout/personal-info-form";
import QrCodeDisplay from "@/components/checkout/qr-code-display";
import SuccessDisplay from "@/components/checkout/success-display";

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
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background p-4 font-body">
        <div key={step} className="w-full max-w-md animate-in fade-in duration-500">
            {renderStep()}
        </div>
    </main>
  );
}
