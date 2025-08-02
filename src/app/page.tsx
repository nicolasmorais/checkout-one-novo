
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Terminal } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Terminal className="h-8 w-8 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <CardTitle className="text-2xl font-bold">Em Manutenção</CardTitle>
          <CardDescription className="mt-2">
            Estamos trabalhando para melhorar sua experiência. <br /> Voltaremos em breve!
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
