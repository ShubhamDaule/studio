
"use client";

import { useState, useMemo, useCallback } from 'react';
import type { Transaction, Category } from '@/lib/types';
import { useTiers } from './use-tiers';
import { useTransactions } from './useTransactions';

type DialogType = 'category' | 'day' | 'source' | 'merchant' | 'transactionDetail';

type DialogState = {
  [key in DialogType]: boolean;
};

type DialogData = {
    category?: Category;
    date?: string;
    source?: string;
    merchant?: string;
    transaction?: Transaction | null;
    transactions: Transaction[];
    allCategories: Category[];
    onCategoryChange: (transactionId: string, newCategory: Category) => void;
    isPro: boolean;
}

type UseDialogsProps = {
    transactions: Transaction[];
    allTransactions: Transaction[];
};

export const useDialogs = ({ transactions, allTransactions }: UseDialogsProps) => {
  const { isPro } = useTiers();
  const { allCategories, handleCategoryChange } = useTransactions();

  const [dialogState, setDialogState] = useState<DialogState>({
    category: false,
    day: false,
    source: false,
    merchant: false,
    transactionDetail: false,
  });
  
  const [activeDialogKey, setActiveDialogKey] = useState<string | Transaction | null>(null);

  const openDialog = useCallback((type: DialogType, key: string | Transaction | null) => {
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
        transactions: []
    };

    if (!activeDialogKey) return baseData;
    
    if (typeof activeDialogKey === 'string') {
        if (dialogState.category) {
            return {
                ...baseData,
                category: activeDialogKey as Category,
                transactions: transactions.filter(t => t.category === activeDialogKey),
            };
        }
        if (dialogState.day) {
            return {
                ...baseData,
                date: activeDialogKey,
                transactions: transactions.filter(t => t.date === activeDialogKey),
            };
        }
        if (dialogState.source) {
            return {
                ...baseData,
                source: activeDialogKey,
                transactions: allTransactions.filter(t => t.fileSource === activeDialogKey),
            };
        }
        if (dialogState.merchant) {
            return {
                ...baseData,
                merchant: activeDialogKey,
                transactions: transactions.filter(t => t.merchant === activeDialogKey),
            };
        }
    }
    
    if (typeof activeDialogKey === 'object' && activeDialogKey !== null && 'id' in activeDialogKey && dialogState.transactionDetail) {
        return {
            ...baseData,
            transaction: activeDialogKey,
        };
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
