
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Logo from "@/components/ui/logo";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
       <div className="mb-8">
        <Logo standalone />
      </div>
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader>
           <CardTitle className="text-2xl font-bold">Em Manutenção</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="mt-2">
            Estamos trabalhando para melhorar sua experiência. <br /> Voltaremos em breve!
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
