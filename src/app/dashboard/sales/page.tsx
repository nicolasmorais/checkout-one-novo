
"use client";

import { useEffect, useState, useMemo } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DateRange } from "react-day-picker";
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
    CheckCircle,
    Percent,
    DollarSign,
    Calendar as CalendarIcon,
} from "lucide-react";
import { getSales, updateSaleStatus, checkSaleStatus, Sale } from "@/services/sales-service";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";


export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [date, setDate] = useState<DateRange | undefined>();
  const { toast } = useToast();

  useEffect(() => {
    setSales(getSales());
  }, []);
  
  const filteredSales = useMemo(() => {
    if (!date?.from) {
      return sales; // Return all sales if no start date is selected
    }
    const fromDate = date.from;
    const toDate = date.to ? date.to : fromDate; // If no end date, use start date

    // Set time to beginning and end of day for accurate filtering
    fromDate.setHours(0, 0, 0, 0);
    toDate.setHours(23, 59, 59, 999);

    return sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate >= fromDate && saleDate <= toDate;
    });
  }, [sales, date]);

  const salesMetrics = useMemo(() => {
    const totalSales = filteredSales.length;
    const approvedSales = filteredSales.filter(sale => sale.status === 'Aprovado');
    const approvedSalesCount = approvedSales.length;
    const approvalRate = totalSales > 0 ? (approvedSalesCount / totalSales) * 100 : 0;
    
    const totalValue = filteredSales.reduce((acc, sale) => {
        const value = parseFloat(sale.amount.replace('R$ ', '').replace(',', '.'));
        return acc + value;
    }, 0);

    const approvedValue = approvedSales.reduce((acc, sale) => {
        const value = parseFloat(sale.amount.replace('R$ ', '').replace(',', '.'));
        return acc + value;
    }, 0);

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
        <div className="flex justify-start">
            <Popover>
                <PopoverTrigger asChild>
                <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                    "w-[300px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                    date.to ? (
                        <>
                        {format(date.from, "LLL dd, y", { locale: ptBR })} -{" "}
                        {format(date.to, "LLL dd, y", { locale: ptBR })}
                        </>
                    ) : (
                        format(date.from, "LLL dd, y", { locale: ptBR })
                    )
                    ) : (
                    <span>Escolha um período</span>
                    )}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                    locale={ptBR}
                />
                </PopoverContent>
            </Popover>
        </div>
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
              <CardTitle>Vendas Recentes ({salesMetrics.totalSales} totais, {salesMetrics.approvedSales} aprovadas)</CardTitle>
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
              {filteredSales.length > 0 ? (
                filteredSales.map((sale) => (
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
                    {new Date(sale.date).toLocaleString('pt-BR')}
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
