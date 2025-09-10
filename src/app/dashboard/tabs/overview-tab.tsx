
"use client";

import * as React from "react";
import { Wallet, ReceiptText, TrendingUp, CalendarDays, Repeat, Target } from "lucide-react";
import { SpendingChart } from "@/components/dashboard/charts/spending-chart";
import { SpendingByDayChart } from "@/components/dashboard/charts/spending-by-day-chart";
import { SpendingBySourceChart, SpendingBySourceChartHeader } from "@/components/dashboard/charts/spending-by-source-chart";
import { TopMerchantsChart, TopMerchantsChartHeader } from "@/components/dashboard/charts/top-merchants-chart";
import { SpendingClassificationChart, SpendingClassificationChartHeader } from "@/components/dashboard/charts/SpendingClassificationChart";
import { SpendingTrendChart, SpendingTrendChartHeader } from "@/components/dashboard/charts/spending-trend-chart";
import StatsCard from "@/components/dashboard/cards/stats-card";
import { HighestTransactionCard } from "@/components/dashboard/cards/highest-transaction-card";
import { HighestDayCard } from "@/components/dashboard/cards/highest-day-card";
import { CurrentBalanceCard } from "@/components/dashboard/cards/current-balance-card";
import { useDashboardContext } from "@/context/dashboard-context";
import { useBudgets } from "@/hooks/useBudgets";
import { UpgradeGate } from "@/components/dashboard/upgrade-gate";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SubscriptionsCard } from "@/components/dashboard/cards/subscriptions-card";
import { useTiers } from "@/hooks/use-tiers";

// Props for the OverviewTab component, including a function to open dialogs.
type OverviewTabProps = {
    openDialog: (type: 'transactionDetail' | 'day' | 'category' | 'source' | 'merchant' | 'classification', data: any) => void;
};

const NeedsVsWantsHeader = () => (
    <CardHeader>
        <CardTitle className='flex items-center gap-2 group-hover:text-primary transition-colors'>
          <Target className="h-6 w-6" />
          Needs vs. Wants
        </CardTitle>
        <CardDescription>How your spending is classified. Click a slice for details.</CardDescription>
    </CardHeader>
);

/**
 * Renders the "Overview" tab in the dashboard.
 * This tab displays a high-level summary of financial data through stats cards and charts.
 */
export function OverviewTab({ openDialog }: OverviewTabProps) {
    // Destructure necessary data and functions from the dashboard context.
    const {
        totalSpending,
        filterDescription,
        transactionCount,
        highestTransaction,
        currentBalance,
        highestDay,
        filteredTransactions,
        allTransactions,
        allCategories,
        dateRange,
    } = useDashboardContext();
    const { isPro } = useTiers();

    // Use the budgets hook to get budget data relevant to the current view.
    const { activeBudgets } = useBudgets({ allCategories, transactions: filteredTransactions, dateRange });


    return (
        <div className="grid gap-8">
            {/* Section for key statistics cards */}
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
                        // Programmatically switch to the "Transactions" tab when this card is clicked.
                        const tabs = document.querySelector('[role="tablist"]');
                        const transactionsTab = tabs?.querySelector('[value="transactions"]');
                        (transactionsTab as HTMLElement)?.click();
                    }}
                />
                <HighestTransactionCard 
                    transaction={highestTransaction}
                    onClick={() => openDialog('transactionDetail', highestTransaction)}
                />
                {/* Conditionally render either the current balance or the highest spending day card. */}
                {currentBalance !== null ? (
                     <CurrentBalanceCard balance={currentBalance} />
                ) : (
                    <HighestDayCard 
                        day={highestDay}
                        onClick={() => openDialog('day', highestDay?.date ?? null)}
                    />
                )}
            </div>
            {/* Section for primary charts */}
            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
                <SpendingChart transactions={filteredTransactions} onPieClick={(data) => openDialog('category', data)} budgets={activeBudgets} allCategories={allCategories} />
                <SpendingByDayChart transactions={filteredTransactions} onBarClick={(data) => openDialog('day', data.date)} />
            </div>
            {/* Section for secondary charts */}
            <>
                <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
                    <SpendingBySourceChart transactions={allTransactions} onPieClick={(data) => openDialog('source', {name: data.source})} />
                    <TopMerchantsChart transactions={filteredTransactions} onBarClick={(data) => openDialog('merchant', {merchant: data.merchant})} />
                </div>
                 <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
                    <UpgradeGate requiredTier="Pro" type="card" cardHeader={<NeedsVsWantsHeader />}>
                        <SubscriptionsCard transactions={filteredTransactions} />
                    </UpgradeGate>
                    <UpgradeGate requiredTier="Pro" type="card" cardHeader={<SpendingClassificationChartHeader />}>
                        <SpendingClassificationChart transactions={filteredTransactions} onClick={(data) => openDialog('classification', data)} />
                    </UpgradeGate>
                </div>
                <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
                    <UpgradeGate requiredTier="Pro" type="card" cardHeader={<SpendingTrendChartHeader />}>
                         <SpendingTrendChart transactions={allTransactions} />
                    </UpgradeGate>
                </div>
            </>
        </div>
    );
}
