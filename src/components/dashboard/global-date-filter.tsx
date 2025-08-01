
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useGlobalFilter, Period } from "@/contexts/global-filter-context";

export default function GlobalDateFilter() {
  const { period, dateRange, setPeriod, setDateRange } = useGlobalFilter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePeriodChange = (newPeriod: Period) => {
    setPeriod(newPeriod);
  };

  const displayDate = () => {
    if (!isMounted || !dateRange?.from) {
      return <span>Selecione o período</span>;
    }
    if (dateRange.to) {
      return (
        <>
          {format(dateRange.from, "dd LLL, y", { locale: ptBR })} -{" "}
          {format(dateRange.to, "dd LLL, y", { locale: ptBR })}
        </>
      );
    }
    return format(dateRange.from, "dd LLL, y", { locale: ptBR });
  };


  return (
    <div className="flex items-center gap-2">
      <Button
        variant={period === 'today' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handlePeriodChange('today')}
      >
        Hoje
      </Button>
      <Button
        variant={period === '7d' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handlePeriodChange('7d')}
      >
        7 dias
      </Button>
      <Button
        variant={period === '30d' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handlePeriodChange('30d')}
      >
        30 dias
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={period === 'custom' ? 'default' : 'outline'}
            size="sm"
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {displayDate()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={2}
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
