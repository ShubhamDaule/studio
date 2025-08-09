
"use client";
import type { DateRange } from "react-day-picker";
import * as React from 'react';
import type { Transaction } from "@/lib/types";

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
  value: {
    transactionFiles: string[];
    minDate: Date | undefined;
    maxDate: Date | undefined;
    filteredTransactions: Transaction[];
  }
};

export function DashboardProvider({ children, value: providerValue }: DashboardProviderProps) {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: providerValue.minDate,
    to: providerValue.maxDate,
  });
  const [selectedSourceFilter, setSelectedSourceFilter] = React.useState<string>("all");
  const [hasTransactions, setHasTransactions] = React.useState(providerValue.transactionFiles.length > 0);
  const [filteredTransactions, setFilteredTransactions] = React.useState<Transaction[]>(providerValue.filteredTransactions);

  React.useEffect(() => {
    setDateRange({ from: providerValue.minDate, to: providerValue.maxDate });
  }, [providerValue.minDate, providerValue.maxDate]);
  
  React.useEffect(() => {
    setFilteredTransactions(providerValue.filteredTransactions);
  }, [providerValue.filteredTransactions]);

  const value = {
    dateRange,
    setDateRange,
    selectedSourceFilter,
    setSelectedSourceFilter,
    transactionFiles: providerValue.transactionFiles,
    minDate: providerValue.minDate,
    maxDate: providerValue.maxDate,
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
