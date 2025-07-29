
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ShoppingCart } from "lucide-react";

const recentSales = [
    {
        name: "Olivia Martin",
        email: "olivia.martin@email.com",
        product: "3 Pilares Dos Criativos",
        amount: "R$ 9,90",
        status: "Aprovado",
        avatar: "https://placehold.co/40x40.png"
    },
    {
        name: "Jackson Lee",
        email: "jackson.lee@email.com",
        product: "3 Pilares Dos Criativos",
        amount: "R$ 9,90",
        status: "Aprovado",
        avatar: "https://placehold.co/40x40.png"
    },
    {
        name: "Isabella Nguyen",
        email: "isabella.nguyen@email.com",
        product: "3 Pilares Dos Criativos",
        amount: "R$ 9,90",
        status: "Reembolsado",
        avatar: "https://placehold.co/40x40.png"
    },
    {
        name: "William Kim",
        email: "will@email.com",
        product: "3 Pilares Dos Criativos",
        amount: "R$ 9,90",
        status: "Aprovado",
        avatar: "https://placehold.co/40x40.png"
    },
    {
        name: "Sofia Davis",
        email: "sofia.davis@email.com",
        product: "3 Pilares Dos Criativos",
        amount: "R$ 9,90",
        status: "Pendente",
        avatar: "https://placehold.co/40x40.png"
    },
];

export default function SalesPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            <CardTitle>Vendas Recentes</CardTitle>
        </div>
        <CardDescription>
          Uma lista das suas vendas mais recentes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead className="hidden sm:table-cell">Produto</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentSales.map((sale, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <Avatar className="hidden h-9 w-9 sm:flex" data-ai-hint="person avatar">
                      <AvatarImage src={sale.avatar} alt="Avatar" />
                      <AvatarFallback>{sale.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <p className="text-sm font-medium leading-none">
                        {sale.name}
                      </p>
                      <p className="text-sm text-muted-foreground md:hidden">
                        {sale.product}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {sale.product}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge 
                    className="text-xs" 
                    variant={
                        sale.status === "Aprovado" ? "default" : 
                        sale.status === "Reembolsado" ? "destructive" : 
                        "secondary"
                    }>
                    {sale.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{sale.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
