
"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, DollarSign, Users, ShoppingCart, Percent } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { useGlobalFilter } from "@/contexts/global-filter-context";
import { format, eachDayOfInterval, subDays, parseISO } from "date-fns";

const chartConfig = {
  revenue: {
    label: "Receita",
    color: "hsl(var(--primary))",
  },
};

export default function DashboardPage() {
  const { filteredSales, dateRange, isLoading } = useGlobalFilter();

  const { metrics, chartData } = useMemo(() => {
    const totalOrders = filteredSales.length;
    const approvedSales = filteredSales.filter(s => s.status === "Aprovado");
    const approvedOrders = approvedSales.length;

    const approvedRevenue = approvedSales.reduce((acc, sale) => acc + (sale.amount_in_cents / 100), 0);

    const approvalRate = totalOrders > 0 ? ((approvedOrders / totalOrders) * 100) : 0;

    const uniqueCustomers = new Set(approvedSales.map(s => s.customer_email)).size;

    // Chart Data Calculation
    const start = dateRange.from || subDays(new Date(), 6);
    const end = dateRange.to || new Date();
    const intervalDays = eachDayOfInterval({ start, end });

    const salesByDay = approvedSales.reduce<Record<string, number>>((acc, sale) => {
      // Assuming sale_date is a string like '2024-07-27T10:00:00.000Z'
      const day = format(parseISO(sale.sale_date), 'yyyy-MM-dd');
      const saleValue = sale.amount_in_cents / 100;
      if (!acc[day]) {
        acc[day] = 0;
      }
      acc[day] += saleValue;
      return acc;
    }, {});
    
    const generatedChartData = intervalDays.map(day => {
        const formattedDay = format(day, 'yyyy-MM-dd');
        const dayKey = format(day, 'dd/MM');
        return {
            date: dayKey,
            revenue: salesByDay[formattedDay] || 0,
        }
    });

    return {
      metrics: {
        approvedRevenue: approvedRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        approvedOrders,
        uniqueCustomers,
        approvalRate: approvalRate.toFixed(1) + '%',
      },
      chartData: generatedChartData,
    };
  }, [filteredSales, dateRange]);


  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Aprovada</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.approvedRevenue}</div>
            <p className="text-xs text-muted-foreground">
              Receita total de vendas aprovadas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas Aprovadas</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{metrics.approvedOrders}</div>
            <p className="text-xs text-muted-foreground">
              Vendas aprovadas no período
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novos Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{metrics.uniqueCustomers}</div>
            <p className="text-xs text-muted-foreground">
              Clientes únicos no período
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Aprovação</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.approvalRate}</div>
            <p className="text-xs text-muted-foreground">
              Do total de pedidos iniciados
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Receita por Dia (Aprovada)
          </CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <ChartContainer config={chartConfig} className="w-full h-[300px]">
            <RechartsBarChart
              accessibilityLayer
              data={chartData}
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickFormatter={(value) => `${(Number(value) / 1000).toLocaleString('pt-BR')}k`}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={80}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" formatter={(value) => `${Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}/>}
              />
              <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
            </RechartsBarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
