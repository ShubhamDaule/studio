
"use client";
import type { DateRange } from "react-day-picker";
import * as React from 'react';
import type { Transaction, ExtractedTransaction, BankName, StatementType, FinancialSource, TransactionFile, StatementPeriod, Category } from "@/lib/types";
import { usePathname } from "next/navigation";
import { mockCategories, mockTransactions } from "@/lib/mock-data";
import { startOfDay, endOfDay, parseISO } from "date-fns";
import { useToast } from "@/hooks/use-toast";

type NewTransactionsCallback = (uploads: { data: ExtractedTransaction[], fileName: string, bankName: BankName, statementType: StatementType, statementPeriod: StatementPeriod | null }[]) => void;

type DashboardContextType = {
  // State
  allTransactions: Transaction[];
  transactionFiles: TransactionFile[];
  allCategories: Category[];
  dateRange: DateRange | undefined;
  selectedSourceFilter: string;
  isUsingMockData: boolean;
  
  // Setters
  setAllTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  setTransactionFiles: React.Dispatch<React.SetStateAction<TransactionFile[]>>;
  setAllCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  setDateRange: (date: DateRange | undefined) => void;
  setSelectedSourceFilter: (source: string) => void;
  setIsUsingMockData: React.Dispatch<React.SetStateAction<boolean>>;
  handleCategoryChange: (transactionId: string, newCategory: Category['name']) => void;

  // Derived State
  minDate: Date | undefined;
  maxDate: Date | undefined;
  filteredTransactions: Transaction[];
  financialSources: FinancialSource[];
  totalSpending: number;
  transactionCount: number;
  highestTransaction: Transaction | null;
  highestDay: { date: string; total: number } | null;
  currentBalance: number | null;
  filterDescription: string;
  
  // Actions
  addUploadedTransactions: NewTransactionsCallback;
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
    const pathname = usePathname();
    const isDashboard = pathname.startsWith('/dashboard');
    const { toast } = useToast();
    
    // Core State
    const [allTransactions, setAllTransactions] = React.useState<Transaction[]>([]);
    const [transactionFiles, setTransactionFiles] = React.useState<TransactionFile[]>([]);
    const [allCategories, setAllCategories] = React.useState<Category[]>(mockCategories);
    const [isUsingMockData, setIsUsingMockData] = React.useState<boolean>(true);
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
    const [selectedSourceFilter, setSelectedSourceFilter] = React.useState<string>("all");
    
    // Initialize with Mock Data
    React.useEffect(() => {
        if (isUsingMockData && allTransactions.length === 0) {
            setAllTransactions(mockTransactions);
            setTransactionFiles([
                { fileName: 'statement-q1.pdf', bankName: 'Amex', statementType: 'Credit Card', statementPeriod: { startDate: '2023-10-01', endDate: '2023-10-31' } },
                { fileName: 'statement-q2.pdf', bankName: 'Amex', statementType: 'Credit Card', statementPeriod: { startDate: '2023-11-01', endDate: '2023-11-30' } },
                { fileName: 'statement-q3.csv', bankName: 'Discover', statementType: 'Credit Card', statementPeriod: { startDate: '2023-11-01', endDate: '2023-11-30' } },
            ]);
        }
    }, [isUsingMockData, allTransactions]);


    const { minDate, maxDate } = React.useMemo(() => {
        if (!isDashboard || allTransactions.length === 0) return { minDate: undefined, maxDate: undefined };
        const dates = allTransactions.map(t => new Date(t.date));
        const min = new Date(Math.min.apply(null, dates.map(d => d.getTime())));
        const max = new Date(Math.max.apply(null, dates.map(d => d.getTime())));
        return { minDate: startOfDay(min), maxDate: endOfDay(max) };
    }, [isDashboard, allTransactions]);
    
    React.useEffect(() => {
        if (minDate && maxDate && !dateRange) {
            setDateRange({ from: minDate, to: maxDate });
        }
    }, [minDate, maxDate, dateRange]);


    const addUploadedTransactions = (uploads: { data: ExtractedTransaction[], fileName: string, bankName: BankName, statementType: StatementType, statementPeriod: StatementPeriod | null }[]) => {
        const allNewTransactions: Transaction[] = uploads.flatMap(upload => 
            upload.data.map(t => ({
                ...t,
                id: crypto.randomUUID(),
            }))
        );

        const newFiles: TransactionFile[] = uploads.map(upload => ({
            fileName: upload.fileName,
            bankName: upload.bankName,
            statementType: upload.statementType,
            statementPeriod: upload.statementPeriod,
        }));
        
        let newDateRange: DateRange | undefined = undefined;
        if (isUsingMockData || !dateRange) {
            const firstValidUpload = uploads.find(u => u.statementPeriod);
            if (firstValidUpload && firstValidUpload.statementPeriod) {
                try {
                    const from = parseISO(firstValidUpload.statementPeriod.startDate);
                    const to = parseISO(firstValidUpload.statementPeriod.endDate);
                    if (!isNaN(from.getTime()) && !isNaN(to.getTime())) {
                        newDateRange = { from: startOfDay(from), to: endOfDay(to) };
                    }
                } catch {}
            }
        }


        if (isUsingMockData) {
            setAllTransactions(allNewTransactions);
            setTransactionFiles(newFiles);
            setIsUsingMockData(false);
            if (newDateRange) {
                setDateRange(newDateRange);
            }
        } else {
            setAllTransactions(prev => [...prev, ...allNewTransactions]);
            setTransactionFiles(prev => [...prev, ...newFiles]);
             if (newDateRange) {
                setDateRange(newDateRange);
            }
        }

        if (uploads.length > 0) {
             toast({
                title: "Uploads Successful!",
                description: `${allNewTransactions.length} transaction(s) from ${uploads.length} file(s) have been added.`,
            });
        }
    };
    

    const handleCategoryChange = React.useCallback((transactionId: string, newCategory: Category['name']) => {
        setAllTransactions(prev => 
            prev.map(t => 
                t.id === transactionId ? { ...t, category: newCategory } : t
            )
        );
    }, [setAllTransactions]);
    
    // -------- DERIVED STATE --------

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
    
    const filteredTransactions = React.useMemo(() => {
        if (!allTransactions || allTransactions.length === 0 || !dateRange?.from || !dateRange?.to) return [];
        
        return allTransactions.filter((t) => {
            try {
                 const transactionDate = parseISO(t.date);
                if (isNaN(transactionDate.getTime())) return false;
        
                const rangeFrom = startOfDay(dateRange.from);
                const rangeTo = endOfDay(dateRange.to);
            
                const isInDateRange = transactionDate >= rangeFrom && transactionDate <= rangeTo;
                const matchesSource = selectedSourceFilter === "all" || t.bankName === selectedSourceFilter;
            
                return isInDateRange && matchesSource;
            } catch (e) {
                return false;
            }
        });
    }, [allTransactions, dateRange, selectedSourceFilter]);

    const totalSpending = React.useMemo(() => {
        return filteredTransactions
        .filter((t) => t.amount > 0 && t.category !== "Payment" && t.category !== "Investment")
        .reduce((acc, t) => acc + t.amount, 0);
    }, [filteredTransactions]);
    
    const transactionCount = React.useMemo(() => {
        return filteredTransactions.length;
    }, [filteredTransactions]);

    const highestTransaction = React.useMemo(() => {
        if (filteredTransactions.length === 0) return null;
        const spendingTransactions = filteredTransactions.filter(t => t.amount > 0);
        if (spendingTransactions.length === 0) return null;
        return spendingTransactions.reduce((max, t) => (t.amount > max.amount ? t : max), spendingTransactions[0]);
    }, [filteredTransactions]);

    const spendingByDay = React.useMemo(() => {
        const byDay: { [date: string]: number } = {};
        filteredTransactions
        .filter((t) => t.amount > 0 && t.category !== "Payment" && t.category !== "Investment")
        .forEach((t) => {
            byDay[t.date] = (byDay[t.date] || 0) + t.amount;
        });
        return Object.entries(byDay).map(([date, total]) => ({ date, total }));
    }, [filteredTransactions]);

    const highestDay = React.useMemo(() => {
        if (spendingByDay.length === 0) return null;
        return spendingByDay.reduce((max, day) => (day.total > max.total ? day : max), spendingByDay[0]);
    }, [spendingByDay]);

    const currentBalance = React.useMemo(() => {
        if (selectedSourceFilter === 'all') return null;
        const sourceFile = transactionFiles.find(f => f.bankName === selectedSourceFilter);
        if(sourceFile?.statementType !== 'Bank Account') return null;

        const sourceTransactions = allTransactions.filter(t => t.bankName === selectedSourceFilter);
        return sourceTransactions.reduce((acc, t) => acc - t.amount, 0);
    }, [allTransactions, selectedSourceFilter, transactionFiles]);
    
    const filterDescription = React.useMemo(() => {
        if (selectedSourceFilter !== "all") {
          return `for ${selectedSourceFilter}`;
        }
        return `across all sources`;
    }, [selectedSourceFilter]);

  const value: DashboardContextType = {
    allTransactions,
    setAllTransactions,
    transactionFiles,
    setTransactionFiles,
    allCategories,
    setAllCategories,
    dateRange,
    setDateRange,
    selectedSourceFilter,
    setSelectedSourceFilter,
    isUsingMockData,
    setIsUsingMockData,
    handleCategoryChange,
    minDate,
    maxDate,
    filteredTransactions,
    financialSources,
    totalSpending,
    transactionCount,
    highestTransaction,
    highestDay,
    currentBalance,
    filterDescription,
    addUploadedTransactions,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}
