
"use client";

import { useState, useMemo, useCallback } from 'react';
import type { Transaction, Category } from '@/lib/types';
import { useTiers } from './use-tiers';
import { useDashboardContext } from '@/context/dashboard-context';

type DialogType = 'category' | 'day' | 'source' | 'merchant' | 'transactionDetail';

type DialogState = {
  [key in DialogType]: boolean;
};

type DialogData = {
    category?: Category['name'];
    date?: string;
    source?: string;
    merchant?: string;
    transaction?: Transaction | null;
    transactions: Transaction[];
    allCategories: Category[];
    onCategoryChange: (transactionId: string, newCategory: Category['name']) => void;
    isPro: boolean;
}

type UseDialogsProps = {
    transactions: Transaction[];
    allTransactions: Transaction[];
    allCategories: Category[];
    handleCategoryChange: (transactionId: string, newCategory: Category['name']) => void;
};

export const useDialogs = ({ transactions, allTransactions, allCategories, handleCategoryChange }: UseDialogsProps) => {
  const { isPro } = useTiers();

  const [dialogState, setDialogState] = useState<DialogState>({
    category: false,
    day: false,
    source: false,
    merchant: false,
    transactionDetail: false,
  });
  
  const [activeDialogKey, setActiveDialogKey] = useState<any | null>(null);

  const openDialog = useCallback((type: DialogType, key: any | null) => {
    if(!key) return;
    setActiveDialogKey(key);
    setDialogState(prev => ({ ...prev, [type]: true }));
  }, []);

  const closeDialog = useCallback((type: DialogType) => {
    setDialogState(prev => ({ ...prev, [type]: false }));
    setActiveDialogKey(null);
  }, []);
  
  const dialogData: DialogData = useMemo(() => {
    const baseData = {
        allCategories,
        onCategoryChange: handleCategoryChange,
        isPro,
        transactions: [] as Transaction[]
    };

    if (!activeDialogKey) return baseData;
    
    if (dialogState.transactionDetail && typeof activeDialogKey === 'object' && activeDialogKey !== null && 'id' in activeDialogKey) {
        return { ...baseData, transaction: activeDialogKey };
    }

    if (dialogState.day && typeof activeDialogKey === 'string') {
        return { ...baseData, date: activeDialogKey, transactions: transactions.filter(t => t.date === activeDialogKey) };
    }
    
    if (dialogState.category && typeof activeDialogKey === 'object' && 'category' in activeDialogKey) {
        const { category } = activeDialogKey;
        const txns = category === 'all'
            ? transactions.filter(t => t.amount > 0)
            : transactions.filter(t => t.category === category);
        return { ...baseData, category, transactions: txns };
    }
    
    if (dialogState.merchant && typeof activeDialogKey === 'object' && 'merchant' in activeDialogKey) {
        const { merchant } = activeDialogKey;
        return { ...baseData, merchant, transactions: transactions.filter(t => t.merchant === merchant) };
    }

    if (dialogState.source && typeof activeDialogKey === 'object' && 'name' in activeDialogKey) {
         const { name: sourceName } = activeDialogKey as any;
         return { ...baseData, source: sourceName, transactions: allTransactions.filter(t => t.bankName === sourceName) };
    }
    
    if (dialogState.source && typeof activeDialogKey === 'string') {
       return { ...baseData, source: activeDialogKey, transactions: allTransactions.filter(t => t.bankName === activeDialogKey) };
    }

    return baseData;
  }, [activeDialogKey, dialogState, transactions, allTransactions, allCategories, handleCategoryChange, isPro]);

  return {
    dialogState,
    openDialog,
    closeDialog,
    dialogData
  };
};
