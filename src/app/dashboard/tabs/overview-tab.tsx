
"use client";

import * as React from "react";
import { Wallet, ReceiptText} from "lucide-react";
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
import { useBudgets } from "@/hooks/useBudgets";
import { UpgradeGate } from "@/components/dashboard/upgrade-gate";
import { SubscriptionsCard } from "@/components/dashboard/cards/subscriptions-card";
import { useTiers } from "@/hooks/use-tiers";
import { BudgetSpendingChart } from "@/components/dashboard/charts/budget-spending-chart";

// Props for the OverviewTab component, including a function to open dialogs.
type OverviewTabProps = {
    openDialog: (type: 'transactionDetail' | 'day' | 'category' | 'source' | 'merchant' | 'classification', data: any) => void;
};

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
    const { budgets } = useBudgets({ allCategories, transactions: filteredTransactions, dateRange });


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
            
            {/* Row 1 */}
            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
                <SpendingChart transactions={filteredTransactions} onPieClick={(data) => openDialog('category', data)} budgets={budgets} allCategories={allCategories} />
                <SpendingByDayChart transactions={filteredTransactions} onBarClick={(data) => openDialog('day', data.date)} />
            </div>

            {/* Row 2 */}
            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
                <SpendingBySourceChart transactions={allTransactions} onPieClick={(data) => openDialog('source', {name: data.source})} />
                <TopMerchantsChart transactions={filteredTransactions} onBarClick={(data) => openDialog('merchant', {merchant: data.merchant})} />
            </div>
            
            {/* Row 3 */}
            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
                <UpgradeGate requiredTier="Pro" type="card">
                    <SpendingClassificationChart transactions={filteredTransactions} onClick={(data) => openDialog('classification', data)} />
                </UpgradeGate>
                <UpgradeGate requiredTier="Pro" type="card">
                    <SubscriptionsCard transactions={filteredTransactions} />
                </UpgradeGate>
            </div>
            
            {/* Row 4 */}
            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
                 <UpgradeGate requiredTier="Pro" type="card">
                    <BudgetSpendingChart transactions={filteredTransactions} budgets={budgets} allCategories={allCategories} />
                </UpgradeGate>
                <UpgradeGate requiredTier="Pro" type="card">
                     <SpendingTrendChart transactions={allTransactions} />
                </UpgradeGate>
            </div>
        </div>
    );
}
