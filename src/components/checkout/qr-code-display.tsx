
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, Check, TriangleAlert } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { CreatePaymentOutput } from "@/ai/flows/create-payment-flow";
import { getCheckoutSettings, CheckoutSettings } from "@/services/checkout-settings-service";
import * as fbq from '@/lib/fpixel';
import { getMarketingScripts } from "@/services/marketing-service";
import { Product } from "@/services/products-service";

interface QrCodeDisplayProps {
  userData: {
    name: string;
    email: string;
  };
  product: Omit<Product, 'id' | 'slug'>,
  paymentData: CreatePaymentOutput;
  onScanned: () => void;
}

export default function QrCodeDisplay({ userData, product, paymentData, onScanned }: QrCodeDisplayProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [settings, setSettings] = useState<CheckoutSettings | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    try {
      setSettings(getCheckoutSettings());
      const scripts = getMarketingScripts();
      if (scripts.facebook_pixel_id) {
          fbq.event('Purchase', {
              currency: 'BRL',
              value: product.value,
              content_name: product.name,
              payment_type: 'PIX'
          });
      }
    } catch (error) {
      console.error("Could not read from localStorage", error);
    }
  }, [product]);

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
      {settings?.showAlert && (
        <Alert variant="warning" className="mb-4 shadow-md">
            <TriangleAlert className="h-4 w-4" />
            <AlertDescription>
              {settings.alertMessage}
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
           <div className="w-full text-center font-mono text-sm break-all p-3 mb-2 bg-gray-50 dark:bg-gray-800/50 rounded-md border border-dashed">
            {paymentData.pixCode}
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

