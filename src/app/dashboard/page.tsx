
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
import { mockCategories, mockTransactions } from "@/lib/mock-data";
import type { Transaction, Category, TransactionFile } from "@/lib/types";
import { LayoutGrid, List, Sparkles, Target, Trash, X } from "lucide-react";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useToast } from "@/hooks/use-toast";
import { FilePill } from "@/components/dashboard/file-pill";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function DashboardPage() {
    const { isPro } = useTiers();
    const { 
        dateRange, 
        selectedSourceFilter, 
        setFilteredTransactions: setContextFilteredTransactions, 
        addUploadedTransactions, 
        allTransactions,
        setAllTransactions,
        transactionFiles,
        setTransactionFiles,
        financialSources,
        isUsingMockData,
        setIsUsingMockData,
    } = useDashboardContext();
    const { toast } = useToast();
    const [allCategories, setAllCategories] = React.useState<Category[]>(mockCategories);
    const [fileToDelete, setFileToDelete] = React.useState<TransactionFile | null>(null);

    React.useEffect(() => {
        if (isUsingMockData && allTransactions.length === 0) {
            setAllTransactions(mockTransactions);
            setTransactionFiles([
                { fileName: 'statement-q1.pdf', bankName: 'Amex', type: 'Credit Card' },
                { fileName: 'statement-q2.pdf', bankName: 'Amex', type: 'Credit Card' },
                { fileName: 'statement-q3.csv', bankName: 'Discover', type: 'Credit Card' },
            ]);
        }
    }, [isUsingMockData, allTransactions, setAllTransactions, setTransactionFiles]);


    const filteredTransactions = React.useMemo(() => {
        return allTransactions.filter((t) => {
            const transactionDate = new Date(t.date);
            const isInDateRange =
                dateRange?.from && dateRange?.to
                ? transactionDate >= dateRange.from && transactionDate <= dateRange.to
                : true;

            const matchesSource = isUsingMockData
                ? selectedSourceFilter === "all" || t.fileSource === selectedSourceFilter
                : selectedSourceFilter === "all" || t.bankName === selectedSourceFilter;
                
            return isInDateRange && matchesSource;
        });
    }, [allTransactions, dateRange, selectedSourceFilter, isUsingMockData]);

    React.useEffect(() => {
        setContextFilteredTransactions(filteredTransactions);
    }, [filteredTransactions, setContextFilteredTransactions]);

    React.useEffect(() => {
        addUploadedTransactions((uploads) => {
             const allNewTransactions = uploads.flatMap(upload => 
                upload.data.map(t => ({
                    ...t,
                    id: crypto.randomUUID(),
                    fileSource: upload.fileName,
                }))
            );

            const newFiles: TransactionFile[] = uploads.map(upload => ({
                fileName: upload.fileName,
                bankName: upload.bankName,
                statementType: upload.statementType,
            }));

            if (isUsingMockData) {
                setAllTransactions(allNewTransactions);
                setTransactionFiles(newFiles);
                setIsUsingMockData(false);
            } else {
                setAllTransactions(prev => [...prev, ...allNewTransactions]);
                setTransactionFiles(prev => [...prev, ...newFiles]);
            }

            if (uploads.length > 0) {
                 toast({
                    title: "Uploads Successful!",
                    description: `${allNewTransactions.length} transactions from ${uploads.length} file(s) have been added.`,
                });
            }
        });
    }, [addUploadedTransactions, toast, isUsingMockData, setAllTransactions, setTransactionFiles, setIsUsingMockData]);

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
        const sourceTransactions = allTransactions.filter(t => t.bankName === selectedSourceFilter);
        return sourceTransactions.reduce((acc, t) => acc - t.amount, 0);
    }, [allTransactions, selectedSourceFilter]);
    
    const filterDescription = React.useMemo(() => {
        if (selectedSourceFilter !== "all") {
          return `for ${selectedSourceFilter}`;
        }
        return `across all sources`;
    }, [selectedSourceFilter]);

    const handleCategoryChange = React.useCallback((transactionId: string, newCategory: Category['name']) => {
        setAllTransactions(prev => 
        prev.map(t => 
            t.id === transactionId ? { ...t, category: newCategory } : t
        )
        );
    }, [setAllTransactions]);

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
        handleCategoryChange,
        selectedSource: selectedSourceFilter
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
        setAllCategories(prev => prev.filter(c => c.name !== categoryName));
        deleteBudget(categoryName);
    };

    const handleDeleteFile = () => {
        if (!fileToDelete) return;
        setAllTransactions(prev => prev.filter(t => t.fileSource !== fileToDelete.fileName));
        setTransactionFiles(prev => prev.filter(f => f.fileName !== fileToDelete.fileName));
        toast({
            title: "File Removed",
            description: `All transactions from ${fileToDelete.fileName} have been deleted.`
        })
        setFileToDelete(null);
    };

    return (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background text-foreground">
                <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                    {!isUsingMockData && transactionFiles.length > 0 && (
                        <div className="mb-8 p-6 bg-muted/30 rounded-lg">
                            <h2 className="text-xl font-semibold mb-2">Uploaded Statements</h2>
                            <p className="text-muted-foreground mb-4">
                                Manage the statements you've uploaded. Remove a file to exclude its transactions.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {transactionFiles.map(file => (
                                    <FilePill key={file.fileName} file={file} onDelete={() => setFileToDelete(file)} />
                                ))}
                            </div>
                        </div>
                    )}
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
                                onSetBudgetOverride={handleSetBudgetOverride}
                                allCategories={allCategories}
                                setAllCategories={setAllCategories}
                                budgetOverrides={budgetOverrides}
                                onDeleteBudgetOverride={handleDeleteBudgetOverride}
                                onAddBudget={addBudget}
                                onDeleteBudget={deleteBudget}
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

                <AlertDialog open={!!fileToDelete} onOpenChange={(open) => !open && setFileToDelete(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete all transactions from{' '}
                            <strong>{fileToDelete?.fileName}</strong>. 
                            This action cannot be undone.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteFile} className="bg-destructive hover:bg-destructive/90">
                            <Trash className="mr-2 h-4 w-4" />
                            Delete File
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </DndContext>
    );
}
