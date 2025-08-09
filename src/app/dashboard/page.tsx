
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
import { useTransactions } from "@/hooks/useTransactions";
import { useTiers } from "@/hooks/use-tiers";
import { OverviewTab } from "@/components/dashboard/tabs/overview-tab";
import { TransactionsTab } from "@/components/dashboard/tabs/transactions-tab";
import { InsightsTab } from "@/components/dashboard/tabs/insights-tab";
import { useDashboardContext } from "@/context/dashboard-context";


export default function DashboardPage() {
    const { isPro } = useTiers();
    const { setHasTransactions, setFilteredTransactions } = useDashboardContext();
    
    const {
        transactionFiles,
        allTransactions,
        setAllTransactions,
        filteredTransactions,
        totalSpending,
        highestTransaction,
        transactionCount,
        highestDay,
        availableMonths,
        filterDescription,
        currentBalance,
        allCategories,
        setAllCategories,
        handleCategoryChange,
    } = useTransactions();

    React.useEffect(() => {
        setHasTransactions(allTransactions.length > 0);
    }, [allTransactions, setHasTransactions]);
    
    React.useEffect(() => {
        setFilteredTransactions(filteredTransactions);
    }, [filteredTransactions, setFilteredTransactions]);

  const { dateRange } = useDashboardContext();
  
  const {
      budgets,
      budgetOverrides,
      activeBudgets,
      handleMultipleBudgetChange,
      handleSetBudgetOverride,
      handleDeleteBudgetOverride
  } = useBudgets({allCategories, dateRange, transactions: filteredTransactions});

  const {
    dialogState,
    openDialog,
    closeDialog,
    dialogData
  } = useDialogs({
    transactions: filteredTransactions, 
    allTransactions
  });


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background text-foreground">
        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
                <TabsTrigger value="budgeting">Budgeting</TabsTrigger>
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
                  isPro={isPro}
                />
              </TabsContent>
                <TabsContent value="insights" className="mt-4">
                  <InsightsTab allTransactions={allTransactions}/>
                </TabsContent>
                <TabsContent value="budgeting" className="mt-4">
                  <BudgetingTab
                    defaultBudgets={budgets}
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
        />
    </div>
  );
}
