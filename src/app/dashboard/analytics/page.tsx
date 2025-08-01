
"use client";

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DollarSign, ShoppingCart, Percent, BarChart2, Users } from 'lucide-react';
import { useGlobalFilter } from '@/contexts/global-filter-context';

interface SalesMetrics {
  totalOrders: number;
  approvedOrders: number;
  totalRevenue: number;
  approvedRevenue: number;
  approvalRate: string;
  averageTicket: string;
  topProducts: {
    name: string;
    quantity: number;
    revenue: number;
  }[];
}

export default function AnalyticsPage() {
  const { filteredSales } = useGlobalFilter();

  const metrics: SalesMetrics = useMemo(() => {
    const totalOrders = filteredSales.length;
    const approvedSales = filteredSales.filter(s => s.status === 'Aprovado');
    const approvedOrders = approvedSales.length;
    
    const approvedRevenue = approvedSales.reduce((acc, sale) => acc + (sale.amount_in_cents / 100), 0);
    const totalRevenue = filteredSales.reduce((acc, sale) => acc + (sale.amount_in_cents / 100), 0);

    const approvalRate = totalOrders > 0 ? ((approvedOrders / totalOrders) * 100).toFixed(1) : '0.0';
    const averageTicket = approvedOrders > 0 ? (approvedRevenue / approvedOrders) : 0;

    const productSales = filteredSales.reduce<Record<string, { quantity: number; revenue: number }>>((acc, sale) => {
        if (!acc[sale.product_name]) {
            acc[sale.product_name] = { quantity: 0, revenue: 0 };
        }
        acc[sale.product_name].quantity += 1;
        acc[sale.product_name].revenue += (sale.amount_in_cents / 100);
        return acc;
    }, {});
    
    const topProducts = Object.entries(productSales)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

    return {
      totalOrders,
      approvedOrders,
      totalRevenue,
      approvedRevenue,
      approvalRate,
      averageTicket: averageTicket.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      topProducts,
    };
  }, [filteredSales]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalOrders}</div>
            <p className="text-xs text-muted-foreground">Pedidos no período selecionado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compras Aprovadas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.approvedOrders}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.approvedRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} em vendas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Aprovação</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.approvalRate}%</div>
            <p className="text-xs text-muted-foreground">De todos os pedidos do período</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.averageTicket}</div>
            <p className="text-xs text-muted-foreground">Valor médio por compra aprovada</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5" />
            Produtos Mais Vendidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead className="text-center">Quantidade</TableHead>
                <TableHead className="text-right">Receita Gerada</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.topProducts.length > 0 ? (
                metrics.topProducts.map((product) => (
                  <TableRow key={product.name}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-center">
                        <Badge variant="secondary">{product.quantity}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {product.revenue.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    Nenhuma venda no período selecionado.
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
