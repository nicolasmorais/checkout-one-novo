
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
import { Loader2, Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface QrCodeDisplayProps {
  userData: {
    name: string;
    email: string;
  };
  onScanned: () => void;
}

export default function QrCodeDisplay({ userData, onScanned }: QrCodeDisplayProps) {
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const pixCode = "00020126360014br.gov.bcb.pix0114+551199999999952040000530398654059.905802BR5925Mago do CTR Solucoes Digita6009SAO PAULO62070503***6304E4A5";

  useEffect(() => {
    // This is a placeholder for a real payment check.
    // In a real application, you would poll your backend to see if the payment has been completed.
    const interval = setInterval(() => {
      // For demonstration, we'll just move to the next step after 10 seconds.
      // In a real scenario, this would be triggered by a successful payment webhook or API poll.
      // onScanned();
    }, 10000); 

    return () => clearInterval(interval);
  }, [onScanned]);

  const handleCopy = () => {
    navigator.clipboard.writeText(pixCode);
    setIsCopied(true);
    toast({
      description: "Código Pix copiado!",
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
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
            src="https://placehold.co/256x256.png"
            alt="QR Code para pagamento"
            width={256}
            height={256}
            data-ai-hint="qr code"
          />
        </div>
        <Button onClick={handleCopy} className="w-full" variant="outline">
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
  );
}
