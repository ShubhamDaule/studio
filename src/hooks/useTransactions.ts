
"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import type { DateRange } from "react-day-picker";
import { subMonths, startOfMonth, endOfMonth } from "date-fns";
import type { Transaction, Category } from "@/lib/types";
import { mockTransactions, mockCategories } from "@/lib/data";

export function useTransactions(isPro: boolean, useMockData: boolean) {
  const [allTransactions, setAllTransactions] = useState<Transaction[]>(useMockData ? mockTransactions : []);
  const [allCategories, setAllCategories] = useState<Category[]>(mockCategories);

  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const end = new Date();
    const start = subMonths(end, 2);
    return { from: start, to: end };
  });

  const transactionFiles = useMemo(() => {
    return Array.from(new Set(allTransactions.map((t) => t.fileSource)));
  }, [allTransactions]);

  const [selectedSourceFilter, setSelectedSourceFilter] = useState<string>("all");

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((t) => {
      const transactionDate = new Date(t.date);
      const isInDateRange =
        dateRange?.from && dateRange?.to
          ? transactionDate >= dateRange.from && transactionDate <= dateRange.to
          : true;
      const matchesSource =
        selectedSourceFilter === "all" || t.fileSource === selectedSourceFilter;
      return isInDateRange && matchesSource;
    });
  }, [allTransactions, dateRange, selectedSourceFilter]);

  const totalSpending = useMemo(() => {
    return filteredTransactions
      .filter((t) => t.amount > 0 && t.category !== "Payment" && t.category !== "Investment")
      .reduce((acc, t) => acc + t.amount, 0);
  }, [filteredTransactions]);

  const highestTransaction = useMemo(() => {
    if (filteredTransactions.length === 0) return null;
    return filteredTransactions.reduce((max, t) => (t.amount > max.amount ? t : max));
  }, [filteredTransactions]);

  const transactionCount = useMemo(() => {
    return filteredTransactions.length;
  }, [filteredTransactions]);

  const spendingByDay = useMemo(() => {
    const byDay: { [date: string]: number } = {};
    filteredTransactions
      .filter((t) => t.amount > 0 && t.category !== "Payment" && t.category !== "Investment")
      .forEach((t) => {
        byDay[t.date] = (byDay[t.date] || 0) + t.amount;
      });
    return Object.entries(byDay).map(([date, total]) => ({ date, total }));
  }, [filteredTransactions]);
  
  const highestDay = useMemo(() => {
    if (spendingByDay.length === 0) return null;
    return spendingByDay.reduce((max, day) => (day.total > max.total ? day : max));
  }, [spendingByDay]);
  
  const currentBalance = useMemo(() => {
    if (selectedSourceFilter === 'all') return null; // Can't calculate balance for all sources
    const sourceTransactions = allTransactions.filter(t => t.fileSource === selectedSourceFilter);
    return sourceTransactions.reduce((acc, t) => acc - t.amount, 0);
  }, [allTransactions, selectedSourceFilter]);
  
  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    allTransactions.forEach(t => {
      months.add(t.date.substring(0, 7)); // YYYY-MM
    });
    return Array.from(months).sort().reverse();
  }, [allTransactions]);
  
  const minDate = useMemo(() => {
    if (allTransactions.length === 0) return new Date();
    return allTransactions.reduce((min, t) => new Date(t.date) < min ? new Date(t.date) : min, new Date());
  }, [allTransactions]);
  
  const maxDate = useMemo(() => {
      if (allTransactions.length === 0) return new Date();
      return allTransactions.reduce((max, t) => new Date(t.date) > max ? new Date(t.date) : max, new Date(0));
  }, [allTransactions]);
  
  const filterDescription = useMemo(() => {
    if (selectedSourceFilter !== "all") {
      const file = transactionFiles.find(f => f === selectedSourceFilter);
      return `for ${file}`;
    }
    return `across ${transactionFiles.length} files`;
  }, [selectedSourceFilter, transactionFiles]);

  const handleCategoryChange = useCallback((transactionId: string, newCategory: Category) => {
    setAllTransactions(prev => 
      prev.map(t => 
        t.id === transactionId ? { ...t, category: newCategory } : t
      )
    );
  }, []);

  const handleUpdateTransactions = useCallback((updatedTransactions: Transaction[]) => {
    setAllTransactions(prev => {
      const updatedIds = new Set(updatedTransactions.map(t => t.id));
      const unchanged = prev.filter(t => !updatedIds.has(t.id));
      return [...unchanged, ...updatedTransactions];
    });
  }, []);

  return {
    transactionFiles,
    allTransactions,
    setAllTransactions,
    filteredTransactions,
    dateRange,
    setDateRange,
    selectedSourceFilter,
    setSelectedSourceFilter,
    totalSpending,
    highestTransaction,
    transactionCount,
    highestDay,
    availableMonths,
    minDate,
    maxDate,
    filterDescription,
    currentBalance,
    allCategories,
    setAllCategories,
    handleCategoryChange,
    handleUpdateTransactions,
  };
}
