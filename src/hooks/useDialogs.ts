
"use client";

import { useState, useMemo } from 'react';
import type { Transaction } from '@/lib/types';

type DialogType = 'category' | 'day' | 'source' | 'merchant' | 'transactionDetail';

type DialogState = {
  [key in DialogType]: boolean;
};

type DialogData = {
    category?: string;
    date?: string;
    source?: string;
    merchant?: string;
    transaction?: Transaction | null;
    transactions: Transaction[];
}

type UseDialogsProps = {
    transactions: Transaction[];
    allTransactions: Transaction[];
};

export const useDialogs = ({ transactions, allTransactions }: UseDialogsProps) => {
  const [dialogState, setDialogState] = useState<DialogState>({
    category: false,
    day: false,
    source: false,
    merchant: false,
    transactionDetail: false,
  });
  
  const [activeDialogKey, setActiveDialogKey] = useState<string | null | Transaction>(null);

  const openDialog = (type: DialogType, key: string | Transaction | null) => {
    setActiveDialogKey(key);
    setDialogState(prev => ({ ...prev, [type]: true }));
  };

  const closeDialog = (type: DialogType) => {
    setDialogState(prev => ({ ...prev, [type]: false }));
    setActiveDialogKey(null);
  };
  
  const dialogData: DialogData = useMemo(() => {
    if (!activeDialogKey) return { transactions: [] };
    
    if (typeof activeDialogKey === 'string') {
        if (dialogState.category) {
            return {
                category: activeDialogKey,
                transactions: transactions.filter(t => t.category === activeDialogKey),
            };
        }
        if (dialogState.day) {
            return {
                date: activeDialogKey,
                transactions: transactions.filter(t => t.date === activeDialogKey),
            };
        }
        if (dialogState.source) {
            return {
                source: activeDialogKey,
                transactions: allTransactions.filter(t => t.fileSource === activeDialogKey),
            };
        }
        if (dialogState.merchant) {
            return {
                merchant: activeDialogKey,
                transactions: transactions.filter(t => t.merchant === activeDialogKey),
            };
        }
    }
    
    if (typeof activeDialogKey === 'object' && activeDialogKey !== null && 'id' in activeDialogKey && dialogState.transactionDetail) {
        return {
            transaction: activeDialogKey,
            transactions: [],
        };
    }

    return { transactions: [] };
  }, [activeDialogKey, dialogState, transactions, allTransactions]);

  return {
    dialogState,
    openDialog,
    closeDialog,
    dialogData
  };
};
