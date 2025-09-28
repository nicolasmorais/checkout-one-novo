
"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
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
import {
    ShoppingCart,
    RefreshCw,
    Loader2,
    Percent,
    DollarSign,
} from "lucide-react";
import { checkPaymentStatus } from "@/ai/flows/check-payment-status-flow";
import { useToast } from "@/hooks/use-toast";
import { useGlobalFilter } from "@/contexts/global-filter-context";


export default function SalesPage() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  const { filteredSales, setSales, setOnRefresh, setIsRefreshing } = useGlobalFilter();

  const salesMetrics = useMemo(() => {
    const totalSales = filteredSales.length;
    const approvedSales = filteredSales.filter(sale => sale.status === 'Aprovado');
    const approvedSalesCount = approvedSales.length;
    const approvalRate = totalSales > 0 ? (approvedSalesCount / totalSales) * 100 : 0;
    
    const totalValue = filteredSales.reduce((acc, sale) => acc + (sale.amount_in_cents / 100), 0);
    const approvedValue = approvedSales.reduce((acc, sale) => acc + (sale.amount_in_cents / 100), 0);

    return {
      totalSales,
      approvedSales: approvedSalesCount,
      approvalRate: approvalRate.toFixed(1),
      totalValue: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue),
      approvedValue: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(approvedValue),
    };
  }, [filteredSales]);


  const handleCheckStatus = async (transactionId: string) => {
    setLoadingStates(prev => ({ ...prev, [transactionId]: true }));
    try {
      const result = await checkPaymentStatus(transactionId);
      if (result && result.status) {
        setSales(currentSales => 
          currentSales.map(sale => 
            sale.transaction_id === transactionId 
              ? { ...sale, status: result.status } 
              : sale
          )
        );
        toast({
            description: `Status da transação atualizado para: ${result.status}`,
        });
      } else {
        toast({
            variant: "destructive",
            description: "Não foi possível obter o status da transação. Pode ainda não ter sido paga.",
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

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
        const { getSales } = await import('@/services/sales-service');
        const salesData = await getSales();
        setSales(salesData);
        toast({
            description: "Lista de vendas atualizada.",
        });
    } catch (error) {
        console.error("Failed to refresh sales", error);
        toast({
            variant: "destructive",
            description: "Ocorreu um erro ao atualizar as vendas.",
        });
    } finally {
        setIsRefreshing(false);
    }
  }, [setSales, toast, setIsRefreshing]);

  useEffect(() => {
    // Register the refresh function with the global context
    setOnRefresh(() => handleRefresh);

    // Fetch initial data when component mounts
    handleRefresh();
    
    // Cleanup function
    return () => setOnRefresh(() => () => {});
  }, [handleRefresh, setOnRefresh]);


  return (
    <div className="space-y-6">
       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesMetrics.totalValue}</div>
            <p className="text-xs text-muted-foreground">
              Soma de todas as vendas no período.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Aprovado</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesMetrics.approvedValue}</div>
            <p className="text-xs text-muted-foreground">
              Soma das vendas aprovadas no período.
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
              <div>
                <CardTitle>Vendas Recentes ({salesMetrics.totalSales} totais, {salesMetrics.approvedSales} aprovadas)</CardTitle>
                <CardDescription className="mt-1">
                    Uma lista das suas vendas mais recentes do banco de dados.
                </CardDescription>
              </div>
            </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>ID da Transação</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.length > 0 ? (
                filteredSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Avatar className="hidden h-9 w-9 sm:flex" data-ai-hint="person avatar">
                        <AvatarImage src={`https://placehold.co/40x40.png?text=${sale.customer_name.charAt(0)}`} alt="Avatar" />
                        <AvatarFallback>{sale.customer_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="grid gap-1">
                        <p className="text-sm font-medium leading-none">
                          {sale.customer_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {sale.customer_email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {sale.transaction_id && (
                      <Badge variant="outline">{sale.transaction_id.substring(0, 10)}...</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {sale.product_name}
                  </TableCell>
                  <TableCell>
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
                  <TableCell>
                    {new Date(sale.sale_date).toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right">
                    {(sale.amount_in_cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </TableCell>
                  <TableCell className="text-right">
                      {sale.transaction_id && sale.status !== 'Aprovado' && (
                          <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleCheckStatus(sale.transaction_id)}
                              disabled={loadingStates[sale.transaction_id]}
                          >
                              {loadingStates[sale.transaction_id] ? (
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
                          Nenhuma venda encontrada para o período selecionado.
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
