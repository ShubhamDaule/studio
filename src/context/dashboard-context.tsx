
"use client";
import type { DateRange } from "react-day-picker";
import * as React from 'react';
import type { Transaction } from "@/lib/types";
import { mockTransactions } from "@/lib/mock-data";
import { usePathname } from "next/navigation";

type DashboardContextType = {
  dateRange: DateRange | undefined;
  setDateRange: (date: DateRange | undefined) => void;
  selectedSourceFilter: string;
  setSelectedSourceFilter: (source: string) => void;
  transactionFiles: string[];
  minDate: Date | undefined;
  maxDate: Date | undefined;
  hasTransactions: boolean;
  setHasTransactions: (has: boolean) => void;
  filteredTransactions: Transaction[];
  setFilteredTransactions: (transactions: Transaction[]) => void;
};

const DashboardContext = React.createContext<DashboardContextType | undefined>(undefined);

export function useDashboardContext() {
  const context = React.useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboardContext must be used within a DashboardProvider");
  }
  return context;
}

type DashboardProviderProps = { 
  children: React.ReactNode;
};

export function DashboardProvider({ children }: DashboardProviderProps) {
    const pathname = usePathname();
    const isDashboard = pathname.startsWith('/dashboard');

    const transactionFiles = React.useMemo(() => {
        if (!isDashboard) return [];
        return Array.from(new Set(mockTransactions.map((t) => t.fileSource)));
    }, [isDashboard]);

    const { minDate, maxDate } = React.useMemo(() => {
        if (!isDashboard || mockTransactions.length === 0) return { minDate: undefined, maxDate: undefined };
        const dates = mockTransactions.map(t => new Date(t.date));
        const min = new Date(Math.min.apply(null, dates.map(d => d.getTime())));
        const max = new Date(Math.max.apply(null, dates.map(d => d.getTime())));
        return { minDate: min, maxDate: max };
    }, [isDashboard]);

  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: minDate,
    to: maxDate,
  });
  const [selectedSourceFilter, setSelectedSourceFilter] = React.useState<string>("all");
  const [hasTransactions, setHasTransactions] = React.useState(transactionFiles.length > 0);
  const [filteredTransactions, setFilteredTransactions] = React.useState<Transaction[]>([]);

  React.useEffect(() => {
    setDateRange({ from: minDate, to: maxDate });
  }, [minDate, maxDate]);
  
  const value = {
    dateRange,
    setDateRange,
    selectedSourceFilter,
    setSelectedSourceFilter,
    transactionFiles,
    minDate,
    maxDate,
    hasTransactions,
    setHasTransactions,
    filteredTransactions,
    setFilteredTransactions,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}
