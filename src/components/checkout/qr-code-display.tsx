"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface QrCodeDisplayProps {
  userData: {
    name: string;
    email: string;
  };
  onScanned: () => void;
}

export default function QrCodeDisplay({ userData, onScanned }: QrCodeDisplayProps) {
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulate = () => {
    setIsSimulating(true);
    // Simulate a delay for backend communication
    setTimeout(() => {
        onScanned();
        setIsSimulating(false);
    }, 2000);
  }

  return (
    <Card className="w-full max-w-md text-center shadow-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Almost there, {userData.name.split(' ')[0]}!</CardTitle>
        <CardDescription>
          Step 2: Scan the QR code with your payment app
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="p-4 bg-white rounded-lg border">
          <Image
            src="https://placehold.co/256x256.png"
            alt="QR Code for payment"
            width={256}
            height={256}
            data-ai-hint="qr code"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          This QR code will expire in 5 minutes.
        </p>
      </CardContent>
      <CardFooter className="flex-col gap-4">
        <p className="text-xs text-muted-foreground">
          For demonstration purposes, click the button below to simulate a successful scan.
        </p>
        <Button onClick={handleSimulate} className="w-full" variant="outline" disabled={isSimulating}>
          {isSimulating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSimulating ? "Processing..." : "Simulate Successful Payment"}
        </Button>
      </CardFooter>
    </Card>
  );
}
