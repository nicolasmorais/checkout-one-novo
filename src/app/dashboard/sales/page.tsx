
"use client";

import { useEffect, useState, useMemo } from "react";
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
import { Button } from "@/components/ui/button";
import { ShoppingCart, RefreshCw, Loader2, CheckCircle, Percent, DollarSign } from "lucide-react";
import { getSales, updateSaleStatus, checkSaleStatus, Sale } from "@/services/sales-service";
import { useToast } from "@/hooks/use-toast";


export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  useEffect(() => {
    setSales(getSales());
  }, []);

  const salesMetrics = useMemo(() => {
    const totalSales = sales.length;
    const approvedSales = sales.filter(sale => sale.status === 'Aprovado').length;
    const approvalRate = totalSales > 0 ? (approvedSales / totalSales) * 100 : 0;
    
    const totalValue = sales.reduce((acc, sale) => {
        const value = parseFloat(sale.amount.replace('R$ ', '').replace(',', '.'));
        return acc + value;
    }, 0);

    return {
      totalSales,
      approvedSales,
      approvalRate: approvalRate.toFixed(1),
      totalValue: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue),
    };
  }, [sales]);


  const handleCheckStatus = async (transactionId: string) => {
    setLoadingStates(prev => ({ ...prev, [transactionId]: true }));
    try {
      const result = await checkSaleStatus(transactionId);
      if (result && result.status) {
        updateSaleStatus(transactionId, result.status as Sale['status']);
        setSales(currentSales => 
            currentSales.map(sale => 
                sale.transactionId === transactionId ? { ...sale, status: result.status as Sale['status'] } : sale
            )
        );
        toast({
            description: `Status da transação atualizado para: ${result.status}`,
        });
      } else {
        toast({
            variant: "destructive",
            description: "Não foi possível obter o status da transação.",
        });
      }
    } catch (error) {
        console.error("Failed to check status", error);
        toast({
            variant: "destructive",
            description: "Ocorreu um erro ao verificar o status.",
        });
    } finally {
        setLoadingStates(prev => ({ ...prev, [transactionId]: false }));
    }
  };

  return (
    <div className="space-y-6">
       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesMetrics.totalValue}</div>
            <p className="text-xs text-muted-foreground">
              Soma de todas as vendas.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compras Recentes</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesMetrics.totalSales}</div>
            <p className="text-xs text-muted-foreground">
              Total de vendas registradas no navegador.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compras Aprovadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesMetrics.approvedSales}</div>
            <p className="text-xs text-muted-foreground">
              Vendas com status 'Aprovado'.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Aprovação</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesMetrics.approvalRate}%</div>
            <p className="text-xs text-muted-foreground">
              Percentual de vendas aprovadas.
            </p>
          </CardContent>
        </Card>
      </div>
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
                <TableHead className="hidden sm:table-cell">ID da Transação</TableHead>
                <TableHead className="hidden sm:table-cell">Produto</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="hidden md:table-cell">Data</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.length > 0 ? (
                sales.map((sale) => (
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
                    {sale.transactionId && (
                      <Badge variant="outline">{sale.transactionId.substring(0, 10)}...</Badge>
                    )}
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
                  <TableCell className="text-right">
                      {sale.transactionId && (
                          <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleCheckStatus(sale.transactionId)}
                              disabled={loadingStates[sale.transactionId]}
                          >
                              {loadingStates[sale.transactionId] ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                  <RefreshCw className="h-4 w-4" />
                              )}
                              <span className="sr-only">Verificar Status</span>
                          </Button>
                      )}
                  </TableCell>
                </TableRow>
                ))
              ) : (
                  <TableRow>
                      <TableCell colSpan={7} className="text-center">
                          Nenhuma venda encontrada neste navegador.
                      </TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
