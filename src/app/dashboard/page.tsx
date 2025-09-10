
"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryTransactionsDialog } from "@/components/dialogs/category-transactions-dialog";
import { DayTransactionsDialog } from "@/components/dialogs/day-transactions-dialog";
import { SourceTransactionsDialog } from "@/components/dialogs/source-transactions-dialog";
import { MerchantTransactionsDialog } from "@/components/dialogs/merchant-transactions-dialog";
import { TransactionDetailDialog } from "@/components/dialogs/transaction-detail-dialog";
import { BudgetingTab } from "@/components/dashboard/budgeting-tab";
import { useDialogs } from "@/hooks/useDialogs";
import { OverviewTab } from "@/app/dashboard/tabs/overview-tab";
import { TransactionsTab } from "@/app/dashboard/tabs/transactions-tab";
import { InsightsTab } from "@/app/dashboard/tabs/insights-tab";
import { SavedTab } from "@/app/dashboard/tabs/saved-tab";
import { useDashboardContext } from "@/context/dashboard-context";
import type { TransactionFile } from "@/lib/types";
import { LayoutGrid, List, Sparkles, Target, Trash, History } from "lucide-react";
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
import { ClassificationTransactionsDialog } from "@/components/dialogs/classification-transactions-dialog";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useTiers } from "@/hooks/use-tiers";
import { cn } from "@/lib/utils";
import { UpgradeGate } from "@/components/dashboard/upgrade-gate";


export default function DashboardPage() {
    const { 
        filteredTransactions,
        allTransactions,
        setAllTransactions,
        allCategories,
        transactionFiles,
        setTransactionFiles,
        isUsingMockData,
        handleCategoryChange,
        isUploading,
    } = useDashboardContext();
    
    const { isPremium, isPro, consumeTokens, tokenBalance } = useTiers();
    const { toast } = useToast();
    const [fileToDelete, setFileToDelete] = React.useState<TransactionFile | null>(null);
    const [activeTab, setActiveTab] = React.useState("overview");

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

    const handleSaveFile = (fileToSave: TransactionFile) => {
        const SAVE_COST = 2.0;
        if (tokenBalance < SAVE_COST) {
            toast({
                variant: "destructive",
                title: "Insufficient Tokens",
                description: `You need ${SAVE_COST} tokens to save this file.`,
            });
            return;
        }

        if (consumeTokens(SAVE_COST, true)) {
            setTransactionFiles(prevFiles => 
                prevFiles.map(file => 
                    file.fileName === fileToSave.fileName ? { ...file, isSaved: true } : file
                )
            );
            toast({
                title: "File Saved!",
                description: `Transactions from ${fileToSave.fileName} are now stored.`,
            });
            // In a real app, you would also save the transactions to a database here.
        }
    }

    if (isUploading) {
        return (
             <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                <DashboardSkeleton />
             </main>
        )
    }
    
    const handleTabChange = (value: string) => {
        if (!isPro && value === 'budgeting') {
            return;
        }
        if(!isPremium && value === 'saved') {
            return;
        }
        setActiveTab(value);
    }

    return (
        <TooltipProvider>
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
                                    <FilePill 
                                        key={file.fileName} 
                                        file={file} 
                                        onDelete={() => setFileToDelete(file)}
                                        onSave={() => handleSaveFile(file)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                        <TabsList className={cn(
                            "grid w-full",
                            isPremium ? "grid-cols-5" : "grid-cols-4"
                        )}>
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
                            <UpgradeGate requiredTier="Pro" type="tab">
                                <TabsTrigger value="budgeting">
                                    <Target className="mr-2 h-4 w-4" />
                                    Budgeting
                                </TabsTrigger>
                            </UpgradeGate>
                            {isPremium && (
                                <TabsTrigger value="saved">
                                    <History className="mr-2 h-4 w-4" />
                                    Saved
                                </TabsTrigger>
                            )}
                        </TabsList>
                        <TabsContent value="overview" className="mt-4">
                            <OverviewTab 
                                openDialog={openDialog}
                            />
                        </TabsContent>
                        <TabsContent value="transactions" className="mt-4">
                            <TransactionsTab />
                        </TabsContent>
                        <TabsContent value="insights" className="mt-4">
                           <InsightsTab />
                        </TabsContent>
                        <TabsContent value="budgeting" className="mt-4">
                            {isPro && <BudgetingTab />}
                        </TabsContent>
                         {isPremium && (
                            <TabsContent value="saved" className="mt-4">
                                <SavedTab />
                            </TabsContent>
                        )}
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
                 <ClassificationTransactionsDialog
                    isOpen={dialogState.classification}
                    onClose={() => closeDialog('classification')}
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
        </TooltipProvider>
    );
}
