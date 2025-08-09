
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, ReceiptText } from "lucide-react";
import { SpendingChart } from "@/components/dashboard/spending-chart";
import { SpendingByDayChart } from "@/components/dashboard/spending-by-day-chart";
import { HighestTransactionCard } from "@/components/dashboard/highest-transaction-card";
import { HighestDayCard } from "@/components/dashboard/highest-day-card";
import { SpendingBySourceChart } from "@/components/dashboard/spending-by-source-chart";
import { TopMerchantsChart } from "@/components/dashboard/top-merchants-chart";
import { BudgetSpendingChart } from "@/components/dashboard/budget-spending-chart";
import { SpendingTrendChart } from "@/components/dashboard/spending-trend-chart";
import { CurrentBalanceCard } from "@/components/dashboard/current-balance-card";
import type { Budget, Category, Transaction } from "@/lib/types";

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
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Spending</CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">
                            {totalSpending.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                            })}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {filterDescription}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                        <ReceiptText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">{transactionCount}</div>
                        <p className="text-xs text-muted-foreground">
                            {filterDescription}
                        </p>
                    </CardContent>
                </Card>
                <HighestTransactionCard transaction={highestTransaction} onClick={() => openDialog('transactionDetail', highestTransaction)} />
                {currentBalance !== null ? (
                    <CurrentBalanceCard balance={currentBalance} />
                ) : (
                    <HighestDayCard day={highestDay} onClick={() => openDialog('day', highestDay?.date ?? null)} />
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
