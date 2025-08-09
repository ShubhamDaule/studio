
"use client";

import React from 'react';
import { DashboardProvider as InnerDashboardProvider } from './dashboard-context';
import { useTransactions } from '@/hooks/useTransactions';
import { usePathname } from 'next/navigation';

export function DashboardProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isDashboard = pathname.startsWith('/dashboard');

    // Only run the hook if we are on a dashboard page
    const transactionsData = isDashboard ? useTransactions() : {
        transactionFiles: [],
        minDate: undefined,
        maxDate: undefined
    };

    const { transactionFiles, minDate, maxDate } = transactionsData;
    
    const providerValue = React.useMemo(() => ({
        transactionFiles,
        minDate,
        maxDate
    }), [transactionFiles, minDate, maxDate]);


    return (
        <InnerDashboardProvider value={providerValue}>
            {children}
        </InnerDashboardProvider>
    );
}
