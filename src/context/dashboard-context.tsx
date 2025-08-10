
"use client";
import type { DateRange } from "react-day-picker";
import * as React from 'react';
import type { Transaction, ExtractedTransaction } from "@/lib/types";
import { usePathname } from "next/navigation";

type NewTransactionsCallback = (newTransactions: ExtractedTransaction[], fileName: string) => void;

type DashboardContextType = {
  allTransactions: Transaction[];
  setAllTransactions: (transactions: Transaction[]) => void;
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
  onNewTransactions: NewTransactionsCallback | null;
  addUploadedTransactions: (callback: NewTransactionsCallback) => void;
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
    const [onNewTransactions, setOnNewTransactions] = React.useState<NewTransactionsCallback | null>(null);
    const [allTransactions, setAllTransactions] = React.useState<Transaction[]>([]);

    const transactionFiles = React.useMemo(() => {
        if (!isDashboard) return [];
        return Array.from(new Set(allTransactions.map((t) => t.fileSource)));
    }, [isDashboard, allTransactions]);

    const { minDate, maxDate } = React.useMemo(() => {
        if (!isDashboard || allTransactions.length === 0) return { minDate: undefined, maxDate: undefined };
        const dates = allTransactions.map(t => new Date(t.date));
        const min = new Date(Math.min.apply(null, dates.map(d => d.getTime())));
        const max = new Date(Math.max.apply(null, dates.map(d => d.getTime())));
        return { minDate: min, maxDate: max };
    }, [isDashboard, allTransactions]);

  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: minDate,
    to: maxDate,
  });
  const [selectedSourceFilter, setSelectedSourceFilter] = React.useState<string>("all");
  const [hasTransactions, setHasTransactions] = React.useState(false);
  const [filteredTransactions, setFilteredTransactions] = React.useState<Transaction[]>([]);

  React.useEffect(() => {
    setDateRange({ from: minDate, to: maxDate });
  }, [minDate, maxDate]);
  
  const addUploadedTransactions = React.useCallback((callback: NewTransactionsCallback) => {
    setOnNewTransactions(() => callback);
  }, []);


  const value = {
    allTransactions,
    setAllTransactions,
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
    onNewTransactions,
    addUploadedTransactions,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

    