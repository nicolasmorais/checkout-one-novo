
"use client";

import { useEffect, useState } from "react";
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
import { getSales, Sale } from "@/services/sales-service";

export default function SalesPage() {
  const [recentSales, setRecentSales] = useState<Sale[]>([]);

  useEffect(() => {
    // Since this runs on the client, it's safe to call localStorage here.
    setRecentSales(getSales());
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            <CardTitle>Vendas Recentes</CardTitle>
        </div>
        <CardDescription>
          Uma lista das suas vendas mais recentes. (Dados salvos neste navegador)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead className="hidden sm:table-cell">Produto</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="hidden md:table-cell">Data</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentSales.length > 0 ? (
              recentSales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <Avatar className="hidden h-9 w-9 sm:flex" data-ai-hint="person avatar">
                      <AvatarImage src={`https://placehold.co/40x40.png?text=${sale.name.charAt(0)}`} alt="Avatar" />
                      <AvatarFallback>{sale.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <p className="text-sm font-medium leading-none">
                        {sale.name}
                      </p>
                      <p className="text-sm text-muted-foreground md:hidden">
                        {sale.email}
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
                <TableCell className="hidden md:table-cell">
                  {new Date(sale.date).toLocaleString()}
                </TableCell>
                <TableCell className="text-right">{sale.amount}</TableCell>
              </TableRow>
              ))
            ) : (
                <TableRow>
                    <TableCell colSpan={5} className="text-center">
                        Nenhuma venda encontrada neste navegador.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
