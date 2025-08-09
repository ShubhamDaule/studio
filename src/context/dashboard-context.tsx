
"use client";
import type { DateRange } from "react-day-picker";
import * as React from 'react';
import type { Transaction } from "@/lib/types";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

type ExportFormat = 'csv' | 'xlsx' | 'pdf';

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
  triggerExport: (format: ExportFormat) => void;
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


  const triggerExport = (format: ExportFormat) => {
    const dataToExport = filteredTransactions.map(t => ({
      ID: t.id,
      Date: t.date,
      Merchant: t.merchant,
      Amount: t.amount,
      Category: t.category,
      Source: t.fileSource
    }));

    if (format === 'csv' || format === 'xlsx') {
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
      const fileType = format === 'xlsx' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' : 'text/csv;charset=utf-8;';
      const fileExtension = format === 'xlsx' ? '.xlsx' : '.csv';
      const excelBuffer = XLSX.write(workbook, { bookType: format, type: 'array' });
      const data = new Blob([excelBuffer], { type: fileType });
      saveAs(data, "transactions" + fileExtension);
    } else if (format === 'pdf') {
      const doc = new jsPDF();
      (doc as any).autoTable({
        head: [['ID', 'Date', 'Merchant', 'Amount', 'Category', 'Source']],
        body: dataToExport.map(t => [t.ID, t.Date, t.Merchant, t.Amount, t.Category, t.Source]),
      });
      doc.save('transactions.pdf');
    }
  };

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
    triggerExport,
    filteredTransactions,
    setFilteredTransactions,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}