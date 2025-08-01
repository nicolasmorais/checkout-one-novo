
"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { DateRange } from 'react-day-picker';
import { subDays, startOfDay, endOfDay } from 'date-fns';
import { getSales, Sale } from '@/services/sales-service';

export type Period = 'today' | '7d' | '30d' | 'custom';

interface GlobalFilterContextType {
  period: Period;
  setPeriod: (period: Period) => void;
  dateRange: DateRange;
  setDateRange: (dateRange: DateRange | undefined) => void;
  sales: Sale[];
  setSales: React.Dispatch<React.SetStateAction<Sale[]>>;
  filteredSales: Sale[];
  isLoading: boolean;
}

const GlobalFilterContext = createContext<GlobalFilterContextType | undefined>(undefined);

export const GlobalFilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [period, setPeriodState] = useState<Period>('30d');
  const [dateRange, setDateRangeState] = useState<DateRange>({
    from: startOfDay(subDays(new Date(), 29)),
    to: endOfDay(new Date()),
  });
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSales() {
        setIsLoading(true);
        try {
            const salesData = await getSales();
            setSales(salesData);
        } catch (error) {
            console.error("Failed to fetch sales", error);
        } finally {
            setIsLoading(false);
        }
    }
    fetchSales();
  }, []);

  const setPeriod = (newPeriod: Period) => {
    setPeriodState(newPeriod);
    let fromDate: Date;
    const toDate = endOfDay(new Date());

    switch (newPeriod) {
      case 'today':
        fromDate = startOfDay(new Date());
        break;
      case '7d':
        fromDate = startOfDay(subDays(new Date(), 6));
        break;
      case '30d':
        fromDate = startOfDay(subDays(new Date(), 29));
        break;
      case 'custom':
        // For custom, we don't change the date range here. It's set by the calendar.
        return;
    }
    setDateRangeState({ from: fromDate, to: toDate });
  };
  
  const setDateRange = (newDateRange: DateRange | undefined) => {
    if (newDateRange) {
        setPeriodState('custom');
        // ensure we cover the whole day on range selection
        const from = newDateRange.from ? startOfDay(newDateRange.from) : undefined;
        const to = newDateRange.to ? endOfDay(newDateRange.to) : undefined;
        setDateRangeState({ from, to });
    }
  }

  const filteredSales = useMemo(() => {
    if (!dateRange.from) {
      return sales;
    }
    const fromDate = dateRange.from;
    const toDate = dateRange.to || endOfDay(dateRange.from);

    return sales.filter(sale => {
      const saleDate = new Date(sale.sale_date);
      return saleDate >= fromDate && saleDate <= toDate;
    });
  }, [sales, dateRange]);


  return (
    <GlobalFilterContext.Provider value={{ period, setPeriod, dateRange, setDateRange, sales, setSales, filteredSales, isLoading }}>
      {children}
    </GlobalFilterContext.Provider>
  );
};

export const useGlobalFilter = (): GlobalFilterContextType => {
  const context = useContext(GlobalFilterContext);
  if (context === undefined) {
    throw new Error('useGlobalFilter must be used within a GlobalFilterProvider');
  }
  return context;
};
