
"use client";

import * as React from "react";
import { Wallet, ReceiptText } from "lucide-react";
import { SpendingChart } from "@/components/dashboard/charts/spending-chart";
import { SpendingByDayChart } from "@/components/dashboard/charts/spending-by-day-chart";
import { SpendingBySourceChart } from "@/components/dashboard/charts/spending-by-source-chart";
import { TopMerchantsChart } from "@/components/dashboard/charts/top-merchants-chart";
import { SpendingClassificationChart } from "@/components/dashboard/charts/SpendingClassificationChart";
import { SpendingTrendChart } from "@/components/dashboard/charts/spending-trend-chart";
import StatsCard from "@/components/dashboard/cards/stats-card";
import { HighestTransactionCard } from "@/components/dashboard/cards/highest-transaction-card";
import { HighestDayCard } from "@/components/dashboard/cards/highest-day-card";
import { CurrentBalanceCard } from "@/components/dashboard/cards/current-balance-card";
import { useDashboardContext } from "@/context/dashboard-context";

type OverviewTabProps = {
    openDialog: (type: 'transactionDetail' | 'day' | 'category' | 'source' | 'merchant', data: any) => void;
};

export function OverviewTab({ openDialog }: OverviewTabProps) {
    const {
        totalSpending,
        filterDescription,
        transactionCount,
        highestTransaction,
        currentBalance,
        highestDay,
        filteredTransactions,
        allTransactions,
        activeBudgets,
        allCategories,
    } = useDashboardContext();

    return (
        <div className="grid gap-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard 
                    title="Total Spending"
                    value={(totalSpending ?? 0).toLocaleString("en-US", { style: "currency", currency: "USD" })}
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
                    <SpendingBySourceChart transactions={allTransactions} onPieClick={(data) => openDialog('source', {name: data.source})} />
                    <TopMerchantsChart transactions={filteredTransactions} onBarClick={(data) => openDialog('merchant', {merchant: data.merchant})} />
                </div>
                <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
                    <SpendingTrendChart transactions={allTransactions} />
                    <SpendingClassificationChart transactions={filteredTransactions} />
                </div>
            </>
        </div>
    );
}
