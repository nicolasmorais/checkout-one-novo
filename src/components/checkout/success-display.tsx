
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, PartyPopper } from "lucide-react";

interface SuccessDisplayProps {
    userData: {
      name: string;
      email: string;
    };
  }
  
export default function SuccessDisplay({ userData }: SuccessDisplayProps) {
  return (
    <Card className="w-full max-w-md text-center shadow-2xl">
      <CardHeader>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
        </div>
        <CardTitle className="text-2xl font-headline mt-4">Pagamento Aprovado!</CardTitle>
        <CardDescription>
          Obrigado pela sua compra, {userData.name}.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <p className="text-sm text-muted-foreground">
          Enviamos um e-mail com os detalhes do seu acesso para <span className="font-medium text-foreground">{userData.email}</span>.
        </p>
        <Button onClick={() => window.location.reload()} className="w-full mt-4" variant="default">
            <PartyPopper className="mr-2 h-4 w-4"/>
            Iniciar Novo Pedido
        </Button>
      </CardContent>
    </Card>
  );
}
