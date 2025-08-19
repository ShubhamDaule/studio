
"use client";

import * as React from "react";
import { Wallet, ReceiptText } from "lucide-react";
import { SpendingChart } from "@/components/charts/spending-chart";
import { SpendingByDayChart } from "@/components/charts/spending-by-day-chart";
import { SpendingBySourceChart } from "@/components/charts/spending-by-source-chart";
import { TopMerchantsChart } from "@/components/charts/top-merchants-chart";
import { SpendingClassificationChart } from "@/components/charts/SpendingClassificationChart";
import { SpendingTrendChart } from "@/components/charts/spending-trend-chart";
import StatsCard from "@/components/dashboard/cards/stats-card";
import { HighestTransactionCard } from "@/components/dashboard/cards/highest-transaction-card";
import { HighestDayCard } from "@/components/dashboard/cards/highest-day-card";
import { CurrentBalanceCard } from "@/components/dashboard/cards/current-balance-card";
import { useDashboardContext } from "@/context/dashboard-context";
import { useBudgets } from "@/hooks/useBudgets";

type OverviewTabProps = {
    openDialog: (type: 'transactionDetail' | 'day' | 'category' | 'source' | 'merchant', data: any) => void;
};

export function OverviewTab({ openDialog }: OverviewTabProps) {
    const { 
        filteredTransactions,
        allTransactions,
        allCategories,
        totalSpending,
        filterDescription,
        transactionCount,
        highestTransaction,
        currentBalance,
        highestDay,
    } = useDashboardContext();

    const { activeBudgets } = useBudgets({allCategories, transactions: filteredTransactions});

    return (
        <div className="grid gap-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard 
                    title="Total Spending"
                    value={totalSpending.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                    icon={<Wallet className="h-4 w-4 text-muted-foreground" />}
                    description={filterDescription}
                    onClick={() => openDialog('category', { category: 'all' })}
                />
                <StatsCard 
                    title="Transactions"
                    value={String(transactionCount)}
                    icon={<ReceiptText className="h-4 w-4 text-muted-foreground" />}
                    description={filterDescription}
                    onClick={() => {
                        const tabs = document.querySelector('[role="tablist"]');
                        const transactionsTab = tabs?.querySelector('[value="transactions"]');
                        (transactionsTab as HTMLElement)?.click();
                    }}
                />
                 <HighestTransactionCard 
                    transaction={highestTransaction}
                    onClick={() => openDialog('transactionDetail', highestTransaction)}
                />
                {currentBalance !== null ? (
                     <CurrentBalanceCard balance={currentBalance} />
                ) : (
                    <HighestDayCard 
                        day={highestDay}
                        onClick={() => openDialog('day', highestDay?.date ?? null)}
                    />
                )}
            </div>
            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
                <SpendingChart transactions={filteredTransactions} onPieClick={(data) => openDialog('category', data)} budgets={activeBudgets} allCategories={allCategories} />
                <SpendingByDayChart transactions={filteredTransactions} onBarClick={(data) => openDialog('day', data.date)} />
            </div>
            <>
                <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
                    <SpendingBySourceChart transactions={allTransactions} onPieClick={(data) => openDialog('source', data)} />
                    <TopMerchantsChart transactions={filteredTransactions} onBarClick={(data) => openDialog('merchant', data)} />
                </div>
                <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
                    <SpendingTrendChart transactions={allTransactions} />
                    <SpendingClassificationChart transactions={filteredTransactions} />
                </div>
            </>
        </div>
    );
}
