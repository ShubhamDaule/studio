
"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryTransactionsDialog } from "@/components/dashboard/dialogs/category-transactions-dialog";
import { DayTransactionsDialog } from "@/components/dashboard/dialogs/day-transactions-dialog";
import { SourceTransactionsDialog } from "@/components/dashboard/dialogs/source-transactions-dialog";
import { MerchantTransactionsDialog } from "@/components/dashboard/dialogs/merchant-transactions-dialog";
import { TransactionDetailDialog } from "@/components/dashboard/dialogs/transaction-detail-dialog";
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
    const { setHasTransactions } = useDashboardContext();
    
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
    <div className="min-h-screen bg-background text-foreground">
        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
            <Tabs defaultValue="overview" className="mt-8">
              <div className="overflow-x-auto">
                <TabsList className="whitespace-nowrap">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="transactions">Transactions</TabsTrigger>
                  <TabsTrigger value="insights">Insights</TabsTrigger>
                  <TabsTrigger value="budgeting">Budgeting</TabsTrigger>
                </TabsList>
              </div>
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
                <TabsContent value="budgeting">
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
            category={dialogData.category}
            transactions={dialogData.transactions}
        />
        <DayTransactionsDialog
            isOpen={dialogState.day}
            onClose={() => closeDialog('day')}
            date={dialogData.date}
            transactions={dialogData.transactions}
        />
        <SourceTransactionsDialog
            isOpen={dialogState.source}
            onClose={() => closeDialog('source')}
            source={dialogData.source}
            transactions={dialogData.transactions}
        />
        <MerchantTransactionsDialog
            isOpen={dialogState.merchant}
            onClose={() => closeDialog('merchant')}
            merchant={dialogData.merchant}
            transactions={dialogData.transactions}
        />
        <TransactionDetailDialog
            isOpen={dialogState.transactionDetail}
            onClose={() => closeDialog('transactionDetail')}
            transaction={dialogData.transaction}
        />
    </div>
  );
}
