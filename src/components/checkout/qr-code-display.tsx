
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Copy, Check, TriangleAlert } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { CreatePaymentOutput } from "@/ai/flows/create-payment-flow";

interface QrCodeDisplayProps {
  userData: {
    name: string;
    email: string;
  };
  paymentData: CreatePaymentOutput;
  onScanned: () => void;
}

const ALERT_ENABLED_KEY = "checkout_alert_enabled";
const ALERT_MESSAGE_KEY = "checkout_alert_message";

export default function QrCodeDisplay({ userData, paymentData, onScanned }: QrCodeDisplayProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    try {
      const alertEnabled = localStorage.getItem(ALERT_ENABLED_KEY) === 'true';
      const message = localStorage.getItem(ALERT_MESSAGE_KEY);
      const defaultMessage = "⚠️ Atenção: O não pagamento do Pix pode gerar uma negativação no Serasa e SPC.";
      
      setShowAlert(alertEnabled);
      setAlertMessage(message || defaultMessage);
    } catch (error) {
      // localStorage might not be available
      console.error("Could not read from localStorage", error);
    }
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(paymentData.pixCode);
    setIsCopied(true);
    toast({
      description: "Código Pix copiado!",
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <>
      {showAlert && (
        <Alert variant="warning" className="mb-4 shadow-md">
            <TriangleAlert className="h-4 w-4" />
            <AlertDescription>
              {alertMessage}
            </AlertDescription>
        </Alert>
      )}

      <Card className="w-full max-w-md text-center shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Quase lá, {userData.name.split(' ')[0]}!</CardTitle>
          <CardDescription>
            Pague com Pix para receber o acesso imediatamente.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <div className="p-4 bg-white rounded-lg border">
            <Image
              src={paymentData.qrCode}
              alt="QR Code para pagamento"
              width={256}
              height={256}
              data-ai-hint="qr code"
            />
          </div>
          <Button onClick={handleCopy} className="w-full">
            {isCopied ? <Check className="mr-2 h-4 w-4 text-green-500" /> : <Copy className="mr-2 h-4 w-4" />}
            {isCopied ? "Copiado!" : "Copiar Código Pix"}
          </Button>
          <div className="text-sm text-muted-foreground text-left space-y-2 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-md border">
            <p className="font-bold">Como pagar com Pix:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Abra o app do seu banco e escolha a opção Pix.</li>
              <li>Escaneie o QR Code ou use o código do "Copia e Cola".</li>
              <li>Confirme os dados e o valor.</li>
              <li>Pronto! Pagamento aprovado na hora.</li>
            </ol>
          </div>
          <p className="text-sm text-muted-foreground">
            Este QR code expira em 5 minutos.
          </p>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <p className="text-xs text-muted-foreground">
            Aguardando pagamento...
          </p>
        </CardFooter>
      </Card>
    </>
  );
}
