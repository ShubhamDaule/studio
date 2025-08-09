
"use client";
import type { DateRange } from "react-day-picker";
import * as React from 'react';

type DashboardContextType = {
  dateRange: DateRange | undefined;
  setDateRange: (date: DateRange | undefined) => void;
  selectedSourceFilter: string;
  setSelectedSourceFilter: (source: string) => void;
  // Exposing these so the header can be aware of the data boundaries
  transactionFiles: string[];
  minDate: Date | undefined;
  maxDate: Date | undefined;
  hasTransactions: boolean;
  triggerExport: () => void;
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
  }
};

export function DashboardProvider({ children, value: providerValue }: DashboardProviderProps) {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: providerValue.minDate,
    to: providerValue.maxDate,
  });
  const [selectedSourceFilter, setSelectedSourceFilter] = React.useState<string>("all");

  React.useEffect(() => {
    setDateRange({ from: providerValue.minDate, to: providerValue.maxDate });
  }, [providerValue.minDate, providerValue.maxDate]);

  const triggerExport = () => {
    console.log("Triggering export");
  };
  
  const hasTransactions = providerValue.transactionFiles.length > 0;

  const value = {
    dateRange,
    setDateRange,
    selectedSourceFilter,
    setSelectedSourceFilter,
    transactionFiles: providerValue.transactionFiles,
    minDate: providerValue.minDate,
    maxDate: providerValue.maxDate,
    hasTransactions,
    triggerExport,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}
