
"use client";
import type { DateRange } from "react-day-picker";
import * as React from 'react';
import type { Transaction, ExtractedTransaction, BankName, StatementType, FinancialSource, TransactionFile, StatementPeriod } from "@/lib/types";
import { usePathname } from "next/navigation";

type NewTransactionsCallback = (uploads: { data: ExtractedTransaction[], fileName: string, bankName: BankName, statementType: StatementType, statementPeriod: StatementPeriod | null }[]) => void;

type DashboardContextType = {
  allTransactions: Transaction[];
  setAllTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  transactionFiles: TransactionFile[];
  setTransactionFiles: React.Dispatch<React.SetStateAction<TransactionFile[]>>;
  dateRange: DateRange | undefined;
  setDateRange: (date: DateRange | undefined) => void;
  selectedSourceFilter: string;
  setSelectedSourceFilter: (source: string) => void;
  minDate: Date | undefined;
  maxDate: Date | undefined;
  filteredTransactions: Transaction[];
  setFilteredTransactions: (transactions: Transaction[]) => void;
  onNewTransactions: NewTransactionsCallback | null;
  addUploadedTransactions: (callback: NewTransactionsCallback) => void;
  financialSources: FinancialSource[];
  isUsingMockData: boolean;
  setIsUsingMockData: React.Dispatch<React.SetStateAction<boolean>>;
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
    const [transactionFiles, setTransactionFiles] = React.useState<TransactionFile[]>([]);
    const [isUsingMockData, setIsUsingMockData] = React.useState<boolean>(true);


    const financialSources = React.useMemo(() => {
        const sourcesMap = new Map<BankName, { type: StatementType; fileNames: Set<string> }>();
        transactionFiles.forEach(file => {
            if (!sourcesMap.has(file.bankName)) {
                sourcesMap.set(file.bankName, { type: file.statementType, fileNames: new Set() });
            }
            sourcesMap.get(file.bankName)!.fileNames.add(file.fileName);
        });
        return Array.from(sourcesMap.entries()).map(([name, data]) => ({
            name,
            type: data.type,
            fileNames: Array.from(data.fileNames)
        }));
    }, [transactionFiles]);

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
    transactionFiles,
    setTransactionFiles,
    dateRange,
    setDateRange,
    selectedSourceFilter,
    setSelectedSourceFilter,
    minDate,
    maxDate,
    filteredTransactions,
    setFilteredTransactions,
    onNewTransactions,
    addUploadedTransactions,
    financialSources,
    isUsingMockData,
    setIsUsingMockData
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}
