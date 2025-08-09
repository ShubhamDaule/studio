
"use client";

import React, { useMemo } from 'react';
import { DashboardProvider as InnerDashboardProvider } from './dashboard-context';
import { usePathname } from 'next/navigation';
import { mockTransactions } from '@/lib/mock-data';

export function DashboardProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isDashboard = pathname.startsWith('/dashboard');

    const transactionFiles = useMemo(() => {
        if (!isDashboard) return [];
        return Array.from(new Set(mockTransactions.map((t) => t.fileSource)));
    }, [isDashboard]);

    const { minDate, maxDate } = useMemo(() => {
        if (!isDashboard || mockTransactions.length === 0) return { minDate: undefined, maxDate: undefined };
        const dates = mockTransactions.map(t => new Date(t.date));
        const min = new Date(Math.min.apply(null, dates.map(d => d.getTime())));
        const max = new Date(Math.max.apply(null, dates.map(d => d.getTime())));
        return { minDate: min, maxDate: max };
    }, [isDashboard]);
    
    const providerValue = React.useMemo(() => ({
        transactionFiles,
        minDate,
        maxDate,
    }), [transactionFiles, minDate, maxDate]);


    return (
        <InnerDashboardProvider value={providerValue}>
            {children}
        </InnerDashboardProvider>
    );
}
