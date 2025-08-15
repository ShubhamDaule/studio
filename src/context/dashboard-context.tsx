
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
        if (!isDashboard || allTransactions.length === 0) {
            return { minDate: undefined, maxDate: undefined };
        }

        // If there are uploaded files with statement periods, use those for the "All time" range
        if (transactionFiles.length > 0) {
            const periodDates: Date[] = [];
            transactionFiles.forEach(file => {
                if (file.statementPeriod?.startDate && file.statementPeriod?.endDate) {
                    try {
                        periodDates.push(parseISO(file.statementPeriod.startDate));
                        periodDates.push(parseISO(file.statementPeriod.endDate));
                    } catch (e) {
                        console.error("Invalid statement period date found:", file.statementPeriod);
                    }
                }
            });

            if (periodDates.length > 0) {
                const min = new Date(Math.min.apply(null, periodDates.map(d => d.getTime())));
                const max = new Date(Math.max.apply(null, periodDates.map(d => d.getTime())));
                return { minDate: startOfDay(min), maxDate: endOfDay(max) };
            }
        }
        
        // Fallback for mock data or if no statement periods are found
        const transactionDates = allTransactions.map(t => new Date(t.date));
        const min = new Date(Math.min.apply(null, transactionDates.map(d => d.getTime())));
        const max = new Date(Math.max.apply(null, transactionDates.map(d => d.getTime())));
        return { minDate: startOfDay(min), maxDate: endOfDay(max) };

    }, [isDashboard, allTransactions, transactionFiles]);
    
    React.useEffect(() => {
        if (minDate && maxDate && !dateRange) {
            setDateRange({ from: minDate, to: maxDate });
        }
    }, [minDate, maxDate, dateRange]);


    const addUploadedTransactions: NewTransactionsCallback = (uploads) => {
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
        
        const updatedTransactions = isUsingMockData ? allNewTransactions : [...allTransactions, ...allNewTransactions];
        const updatedFiles = isUsingMockData ? newFiles : [...transactionFiles, ...newFiles];

        if (isUsingMockData) {
            setIsUsingMockData(false);
        }

        setAllTransactions(updatedTransactions);
        setTransactionFiles(updatedFiles);

        // Date range logic
        let newDateRange: DateRange | undefined = undefined;

        if (uploads.length === 1) {
            const singleUpload = uploads[0];
            // Prioritize statement period
            if (singleUpload.statementPeriod?.startDate && singleUpload.statementPeriod?.endDate) {
                try {
                    newDateRange = {
                        from: startOfDay(parseISO(singleUpload.statementPeriod.startDate)),
                        to: endOfDay(parseISO(singleUpload.statementPeriod.endDate))
                    };
                } catch (e) {
                    console.error("Could not parse statement period dates:", e);
                }
            }
            
            // Fallback to transaction dates if statement period is not available or invalid
            if (!newDateRange && singleUpload.data.length > 0) {
                const dates = singleUpload.data.map(t => parseISO(t.date));
                const min = new Date(Math.min.apply(null, dates.map(d => d.getTime())));
                const max = new Date(Math.max.apply(null, dates.map(d => d.getTime())));
                newDateRange = { from: startOfDay(min), to: endOfDay(max) };
            }
        }

        // If multiple files are uploaded or no specific range could be determined, set to all time
        if (!newDateRange) {
            const allValidFiles = [...updatedFiles];
            const allPeriodDates: Date[] = [];
            allValidFiles.forEach(file => {
                 if (file.statementPeriod?.startDate && file.statementPeriod?.endDate) {
                    try {
                        allPeriodDates.push(parseISO(file.statementPeriod.startDate));
                        allPeriodDates.push(parseISO(file.statementPeriod.endDate));
                    } catch {}
                }
            });
            
            if (allPeriodDates.length > 0) {
                const newMinDate = new Date(Math.min.apply(null, allPeriodDates.map(d => d.getTime())));
                const newMaxDate = new Date(Math.max.apply(null, allPeriodDates.map(d => d.getTime())));
                newDateRange = { from: startOfDay(newMinDate), to: endOfDay(newMaxDate) };
            } else {
                const allDates = updatedTransactions.map(t => new Date(t.date));
                const newMinDate = new Date(Math.min.apply(null, allDates.map(d => d.getTime())));
                const newMaxDate = new Date(Math.max.apply(null, allDates.map(d => d.getTime())));
                newDateRange = { from: startOfDay(newMinDate), to: endOfDay(newMaxDate) };
            }
        }
        
        setDateRange(newDateRange);


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
        
                const rangeFrom = startOfDay(dateRange.from!);
                const rangeTo = endOfDay(dateRange.to!);
            
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
