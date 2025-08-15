
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
import { OverviewTab } from "@/components/dashboard/tabs/overview-tab";
import { TransactionsTab } from "@/components/dashboard/tabs/transactions-tab";
import { InsightsTab } from "@/components/dashboard/tabs/insights-tab";
import { useDashboardContext } from "@/context/dashboard-context";
import type { Category, TransactionFile } from "@/lib/types";
import { LayoutGrid, List, Sparkles, Target, Trash } from "lucide-react";
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
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";

export default function DashboardPage() {
    const { 
        filteredTransactions,
        allTransactions,
        setAllTransactions,
        allCategories,
        setAllCategories,
        transactionFiles,
        setTransactionFiles,
        isUsingMockData,
        handleCategoryChange,
        totalSpending,
        filterDescription,
        transactionCount,
        highestTransaction,
        currentBalance,
        highestDay,
        isUploading,
    } = useDashboardContext();
    
    const { toast } = useToast();
    const [fileToDelete, setFileToDelete] = React.useState<TransactionFile | null>(null);

    const {
        budgets,
        budgetOverrides,
        activeBudgets,
        handleMultipleBudgetChange,
        handleSetBudgetOverride,
        handleDeleteBudgetOverride,
        addBudget,
        deleteBudget
    } = useBudgets({allCategories, transactions: filteredTransactions});

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

    if (isUploading) {
        return (
             <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                <DashboardSkeleton />
             </main>
        )
    }

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
                                openDialog={openDialog}
                                totalSpending={totalSpending}
                                filterDescription={filterDescription}
                                transactionCount={transactionCount}
                                highestTransaction={highestTransaction}
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
                            <InsightsTab allTransactions={allTransactions} budgets={activeBudgets} isMockData={isUsingMockData} />
                        </TabsContent>
                        <TabsContent value="budgeting" className="mt-4">
                            <BudgetingTab
                                onAddBudget={addBudget}
                                onDeleteBudget={deleteBudget}
                                allCategories={allCategories}
                                setAllCategories={setAllCategories}
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
