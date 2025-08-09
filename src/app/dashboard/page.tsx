

"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryTransactionsDialog } from "@/components/dialogs/category-transactions-dialog";
import { DayTransactionsDialog } from "@/components/dialogs/day-transactions-dialog";
import { SourceTransactionsDialog } from "@/components/dialogs/source-transactions-dialog";
import { MerchantTransactionsDialog } from "@/components/dialogs/merchant-transactions-dialog";
import { TransactionDetailDialog } from "@/components/dialogs/transaction-detail-dialog";
import { BudgetingTab } from "@/components/dashboard/budgeting-tab";
import { useBudgets } from "@/hooks/useBudgets";
import { useDialogs } from "@/hooks/useDialogs";
import { useTiers } from "@/hooks/use-tiers";
import { OverviewTab } from "@/components/dashboard/tabs/overview-tab";
import { TransactionsTab } from "@/components/dashboard/tabs/transactions-tab";
import { InsightsTab } from "@/components/dashboard/tabs/insights-tab";
import { useDashboardContext } from "@/context/dashboard-context";
import { mockTransactions, mockCategories } from "@/lib/mock-data";
import type { Transaction, Category } from "@/lib/types";
import { LayoutGrid, List, Sparkles, Target } from "lucide-react";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

export default function DashboardPage() {
    const { isPro } = useTiers();
    const { setHasTransactions, dateRange, selectedSourceFilter, setFilteredTransactions: setContextFilteredTransactions } = useDashboardContext();

    const [allTransactions, setAllTransactions] = React.useState<Transaction[]>(mockTransactions);
    const [allCategories, setAllCategories] = React.useState<Category[]>(mockCategories);
    
    const transactionFiles = React.useMemo(() => {
        return Array.from(new Set(allTransactions.map((t) => t.fileSource)));
    }, [allTransactions]);

    const filteredTransactions = React.useMemo(() => {
        return allTransactions.filter((t) => {
        const transactionDate = new Date(t.date);
        const isInDateRange =
            dateRange?.from && dateRange?.to
            ? transactionDate >= dateRange.from && transactionDate <= dateRange.to
            : true;
        const matchesSource =
            selectedSourceFilter === "all" || t.fileSource === selectedSourceFilter;
        return isInDateRange && matchesSource;
        });
    }, [allTransactions, dateRange, selectedSourceFilter]);

    React.useEffect(() => {
        setContextFilteredTransactions(filteredTransactions);
    }, [filteredTransactions, setContextFilteredTransactions]);

    React.useEffect(() => {
        setHasTransactions(allTransactions.length > 0);
    }, [allTransactions, setHasTransactions]);

    const totalSpending = React.useMemo(() => {
        return filteredTransactions
        .filter((t) => t.amount > 0 && t.category !== "Payment" && t.category !== "Investment")
        .reduce((acc, t) => acc + t.amount, 0);
    }, [filteredTransactions]);

    const highestTransaction = React.useMemo(() => {
        if (filteredTransactions.length === 0) return null;
        return filteredTransactions.reduce((max, t) => (t.amount > max.amount ? t : max), filteredTransactions[0]);
    }, [filteredTransactions]);

    const transactionCount = React.useMemo(() => {
        return filteredTransactions.length;
    }, [filteredTransactions]);

    const spendingByDay = React.useMemo(() => {
        const byDay: { [date: string]: number } = {};
        filteredTransactions
        .filter((t) => t.amount > 0 && t.category !== "Payment" && t.category !== "Investment")
        .forEach((t) => {
            byDay[t.date] = (byDay[t.date] || 0) + t.amount;
        });
        return Object.entries(byDay).map(([date, total]) => ({ date, total }));
    }, [filteredTransactions]);

    const highestDay = React.useMemo(() => {
        if (spendingByDay.length === 0) return null;
        return spendingByDay.reduce((max, day) => (day.total > max.total ? day : max), spendingByDay[0]);
    }, [spendingByDay]);

    const currentBalance = React.useMemo(() => {
        if (selectedSourceFilter === 'all') return null; // Can't calculate balance for all sources
        const sourceTransactions = allTransactions.filter(t => t.fileSource === selectedSourceFilter);
        return sourceTransactions.reduce((acc, t) => acc - t.amount, 0);
    }, [allTransactions, selectedSourceFilter]);

    const availableMonths = React.useMemo(() => {
        const months = new Set<string>();
        allTransactions.forEach(t => {
        months.add(t.date.substring(0, 7)); // YYYY-MM
        });
        return Array.from(months).sort().reverse();
    }, [allTransactions]);
    
    const filterDescription = React.useMemo(() => {
        if (selectedSourceFilter !== "all") {
          const file = transactionFiles.find(f => f === selectedSourceFilter);
          return `for ${file}`;
        }
        return `across ${transactionFiles.length} files`;
    }, [selectedSourceFilter, transactionFiles]);

    const handleCategoryChange = React.useCallback((transactionId: string, newCategory: Category['name']) => {
        setAllTransactions(prev => 
        prev.map(t => 
            t.id === transactionId ? { ...t, category: newCategory } : t
        )
        );
    }, []);

    const {
        budgets,
        budgetOverrides,
        activeBudgets,
        handleMultipleBudgetChange,
        handleSetBudgetOverride,
        handleDeleteBudgetOverride,
        addBudget,
        deleteBudget
    } = useBudgets({allCategories, dateRange, transactions: filteredTransactions});

    const {
        dialogState,
        openDialog,
        closeDialog,
        dialogData
    } = useDialogs({
        transactions: filteredTransactions,
        allTransactions,
        allCategories,
        handleCategoryChange
    });

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setAllCategories((items) => {
                const oldIndex = items.findIndex((item) => item.name === active.id);
                const newIndex = items.findIndex((item) => item.name === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };
    
    const handleDeleteCategory = (categoryName: Category['name']) => {
        // Remove from master category list
        setAllCategories(prev => prev.filter(c => c.name !== categoryName));
        // Remove from budget
        deleteBudget(categoryName);
    };

    return (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background text-foreground">
                <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="overview">
                                <LayoutGrid className="mr-2 h-4 w-4" />
                                Overview
                            </TabsTrigger>
                            <TabsTrigger value="transactions">
                                <List className="mr-2 h-4 w-4" />
                                Transactions
                            </TabsTrigger>
                            <TabsTrigger value="insights">
                                <Sparkles className="mr-2 h-4 w-4" />
                                AI Insights
                            </TabsTrigger>
                            <TabsTrigger value="budgeting">
                                <Target className="mr-2 h-4 w-4" />
                                Budgeting
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="overview" className="mt-4">
                            <OverviewTab 
                            totalSpending={totalSpending}
                            filterDescription={filterDescription}
                            transactionCount={transactionCount}
                            highestTransaction={highestTransaction}
                            openDialog={openDialog}
                            currentBalance={currentBalance}
                            highestDay={highestDay}
                            filteredTransactions={filteredTransactions}
                            allTransactions={allTransactions}
                            activeBudgets={activeBudgets}
                            allCategories={allCategories}
                            />
                        </TabsContent>
                        <TabsContent value="transactions" className="mt-4">
                            <TransactionsTab 
                            filteredTransactions={filteredTransactions}
                            handleCategoryChange={handleCategoryChange}
                            allCategories={allCategories}
                            />
                        </TabsContent>
                        <TabsContent value="insights" className="mt-4">
                            <InsightsTab allTransactions={allTransactions} budgets={activeBudgets}/>
                        </TabsContent>
                        <TabsContent value="budgeting" className="mt-4">
                            <BudgetingTab
                                activeBudgets={activeBudgets}
                                onMultipleBudgetChange={handleMultipleBudgetChange}
                                transactions={filteredTransactions}
                                onTransactionsUpdate={setAllTransactions}
                                onIncomeDetailsChange={() => {}} // This state is now local to the tab
                                availableMonths={availableMonths}
                                onSetBudgetOverride={handleSetBudgetOverride}
                                allCategories={allCategories}
                                setAllCategories={setAllCategories}
                                budgetOverrides={budgetOverrides}
                                onDeleteBudgetOverride={handleDeleteBudgetOverride}
                                onAddBudget={addBudget}
                                onDeleteCategory={handleDeleteCategory}
                            />
                        </TabsContent>
                    </Tabs>
                </main>
                
                <CategoryTransactionsDialog
                    isOpen={dialogState.category}
                    onClose={() => closeDialog('category')}
                    {...dialogData}
                />
                <DayTransactionsDialog
                    isOpen={dialogState.day}
                    onClose={() => closeDialog('day')}
                    {...dialogData}
                />
                <SourceTransactionsDialog
                    isOpen={dialogState.source}
                    onClose={() => closeDialog('source')}
                    {...dialogData}
                />
                <MerchantTransactionsDialog
                    isOpen={dialogState.merchant}
                    onClose={() => closeDialog('merchant')}
                    {...dialogData}
                />
                <TransactionDetailDialog
                    isOpen={dialogState.transactionDetail}
                    onClose={() => closeDialog('transactionDetail')}
                    transaction={dialogData.transaction}
                    allCategories={allCategories}
                />
            </div>
        </DndContext>
    );
}
