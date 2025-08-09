
"use client";

import * as React from "react";
import { Wallet, ReceiptText, ArrowUpCircle, Calendar, Landmark } from "lucide-react";
import { SpendingChart } from "@/components/dashboard/spending-chart";
import { SpendingByDayChart } from "@/components/dashboard/spending-by-day-chart";
import { SpendingBySourceChart } from "@/components/dashboard/spending-by-source-chart";
import { TopMerchantsChart } from "@/components/dashboard/top-merchants-chart";
import { BudgetSpendingChart } from "@/components/dashboard/budget-spending-chart";
import { SpendingTrendChart } from "@/components/dashboard/spending-trend-chart";
import type { Budget, Category, Transaction } from "@/lib/types";
import StatsCard from "@/components/stats-card";
import { format } from "date-fns";

type OverviewTabProps = {
    totalSpending: number;
    filterDescription: string;
    transactionCount: number;
    highestTransaction: Transaction | null;
    openDialog: (type: 'transactionDetail' | 'day' | 'category' | 'source' | 'merchant', data: any) => void;
    currentBalance: number | null;
    highestDay: { date: string; total: number } | null;
    filteredTransactions: Transaction[];
    allTransactions: Transaction[];
    activeBudgets: Budget[];
    allCategories: Category[];
};

export function OverviewTab({
    totalSpending,
    filterDescription,
    transactionCount,
    highestTransaction,
    openDialog,
    currentBalance,
    highestDay,
    filteredTransactions,
    allTransactions,
    activeBudgets,
    allCategories,
}: OverviewTabProps) {
    return (
        <div className="grid gap-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard 
                    title="Total Spending"
                    value={totalSpending.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                    icon={<Wallet className="h-4 w-4 text-muted-foreground" />}
                    description={filterDescription}
                />
                <StatsCard 
                    title="Transactions"
                    value={String(transactionCount)}
                    icon={<ReceiptText className="h-4 w-4 text-muted-foreground" />}
                    description={filterDescription}
                />
                 <StatsCard
                    title="Highest Transaction"
                    value={highestTransaction ? highestTransaction.amount.toLocaleString("en-US", { style: "currency", currency: "USD" }) : "N/A"}
                    icon={<ArrowUpCircle className="h-4 w-4 text-muted-foreground" />}
                    description={highestTransaction ? `at ${highestTransaction.merchant}` : "No transactions found"}
                    onClick={() => openDialog('transactionDetail', highestTransaction)}
                />
                {currentBalance !== null ? (
                     <StatsCard
                        title="Current Balance"
                        value={currentBalance.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                        icon={<Landmark className="h-4 w-4 text-muted-foreground" />}
                        description="Reflects all transactions from source"
                    />
                ) : (
                    <StatsCard
                        title="Highest Spending Day"
                        value={highestDay ? highestDay.total.toLocaleString("en-US", { style: "currency", currency: "USD" }) : "N/A"}
                        icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
                        description={highestDay ? `on ${format(new Date(highestDay.date), "PPP")}` : "No spending data"}
                        onClick={() => openDialog('day', highestDay?.date ?? null)}
                    />
                )}
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                <SpendingChart transactions={filteredTransactions} onPieClick={(data) => openDialog('category', data.category)} budgets={activeBudgets} allCategories={allCategories} />
                <SpendingByDayChart transactions={filteredTransactions} onBarClick={(data) => openDialog('day', data.date)} />
            </div>
            <>
                <div className="grid md:grid-cols-2 gap-8">
                    <SpendingBySourceChart transactions={allTransactions} onPieClick={(data) => openDialog('source', data.name)} />
                    <TopMerchantsChart transactions={filteredTransactions} onBarClick={(data) => openDialog('merchant', data.merchant)} />
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                    <SpendingTrendChart transactions={allTransactions} />
                    <BudgetSpendingChart transactions={filteredTransactions} budgets={activeBudgets} allCategories={allCategories} />
                </div>
            </>
        </div>
    );
}
