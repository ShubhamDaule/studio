
"use client";
import type { DateRange } from "react-day-picker";
import * as React from 'react';

type DashboardContextType = {
  isPro: boolean;
  triggerExport: () => void;
  hasTransactions: boolean;
  dateRange: DateRange | undefined;
  setDateRange: (date: DateRange | undefined) => void;
  transactionFiles: string[];
  selectedSourceFilter: string;
  setSelectedSourceFilter: (source: string) => void;
  minDate: Date | undefined;
  maxDate: Date | undefined;
};

const DashboardContext = React.createContext<DashboardContextType | undefined>(undefined);

export function useDashboardContext() {
  const context = React.useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboardContext must be used within a DashboardProvider");
  }
  return context;
}

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [isPro] = React.useState(true); // Mock value
  const [hasTransactions] = React.useState(true); // Mock value
  
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);
  const [transactionFiles, setTransactionFiles] = React.useState<string[]>([]);
  const [selectedSourceFilter, setSelectedSourceFilter] = React.useState<string>("all");
  const [minDate, setMinDate] = React.useState<Date | undefined>(undefined);
  const [maxDate, setMaxDate] = React.useState<Date | undefined>(undefined);


  const triggerExport = () => {
    console.log("Triggering export");
  };

  // This is a simplified context for now.
  // In a real app, you'd likely fetch data here and pass it down.
  const value = {
    isPro,
    triggerExport,
    hasTransactions,
    dateRange,
    setDateRange,
    transactionFiles,
    selectedSourceFilter,
    setSelectedSourceFilter,
    minDate,
    maxDate,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}
