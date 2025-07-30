
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DollarSign, ShoppingCart, Percent, BarChart2, Download, Settings, Users } from 'lucide-react';
import { Sale, getSales } from '@/services/sales-service';
import { Product, getProducts } from '@/services/products-service';

type Period = 'today' | '7d' | '30d';

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
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [period, setPeriod] = useState<Period>('30d');

  useEffect(() => {
    setSales(getSales());
    setProducts(getProducts());
  }, []);

  const filteredSales = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return sales.filter(sale => {
      const saleDate = new Date(sale.date);
      if (period === 'today') {
        return saleDate >= startOfToday;
      }
      if (period === '7d') {
        const sevenDaysAgo = new Date(startOfToday.getTime() - 6 * 24 * 60 * 60 * 1000);
        return saleDate >= sevenDaysAgo;
      }
      if (period === '30d') {
        const thirtyDaysAgo = new Date(startOfToday.getTime() - 29 * 24 * 60 * 60 * 1000);
        return saleDate >= thirtyDaysAgo;
      }
      return true;
    });
  }, [sales, period]);

  const metrics: SalesMetrics = useMemo(() => {
    const totalOrders = filteredSales.length;
    const approvedSales = filteredSales.filter(s => s.status === 'Aprovado');
    const approvedOrders = approvedSales.length;
    
    const approvedRevenue = approvedSales.reduce((acc, sale) => {
        return acc + parseFloat(sale.amount.replace(/[^0-9,-]+/g, "").replace(",", "."));
    }, 0);

    const totalRevenue = filteredSales.reduce((acc, sale) => {
        return acc + parseFloat(sale.amount.replace(/[^0-9,-]+/g, "").replace(",", "."));
    }, 0);

    const approvalRate = totalOrders > 0 ? ((approvedOrders / totalOrders) * 100).toFixed(1) : '0.0';
    const averageTicket = approvedOrders > 0 ? (approvedRevenue / approvedOrders) : 0;

    const productSales = filteredSales.reduce<Record<string, { quantity: number; revenue: number }>>((acc, sale) => {
        if (!acc[sale.product]) {
            acc[sale.product] = { quantity: 0, revenue: 0 };
        }
        acc[sale.product].quantity += 1;
        acc[sale.product].revenue += parseFloat(sale.amount.replace(/[^0-9,-]+/g, "").replace(",", "."));
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
            <Button variant={period === 'today' ? 'default' : 'outline'} onClick={() => setPeriod('today')}>Hoje</Button>
            <Button variant={period === '7d' ? 'default' : 'outline'} onClick={() => setPeriod('7d')}>Últimos 7 dias</Button>
            <Button variant={period === '30d' ? 'default' : 'outline'} onClick={() => setPeriod('30d')}>Últimos 30 dias</Button>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Exportar Dados</Button>
            <Button variant="outline"><Settings className="mr-2 h-4 w-4" /> Personalizar Widgets</Button>
        </div>
      </div>

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
