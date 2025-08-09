
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, ReceiptText, Sparkles } from "lucide-react";
import { SpendingChart } from "@/components/dashboard/spending-chart";
import { TransactionTable } from "@/components/dashboard/transaction-table";
import { TipsPanel } from "@/components/dashboard/tips-panel";
import { SpendingByDayChart } from "@/components/dashboard/spending-by-day-chart";
import { HighestTransactionCard } from "@/components/dashboard/highest-transaction-card";
import { CategoryTransactionsDialog } from "@/components/dashboard/dialogs/category-transactions-dialog";
import { DayTransactionsDialog } from "@/components/dashboard/dialogs/day-transactions-dialog";
import { HighestDayCard } from "@/components/dashboard/highest-day-card";
import { SpendingBySourceChart } from "@/components/dashboard/spending-by-source-chart";
import { TopMerchantsChart } from "@/components/dashboard/top-merchants-chart";
import { SourceTransactionsDialog } from "@/components/dashboard/dialogs/source-transactions-dialog";
import { MerchantTransactionsDialog } from "@/components/dashboard/dialogs/merchant-transactions-dialog";
import { TransactionDetailDialog } from "@/components/dashboard/dialogs/transaction-detail-dialog";
import { BudgetingTab } from "@/components/dashboard/budgeting-tab";
import { BudgetSpendingChart } from "@/components/dashboard/budget-spending-chart";
import { AnomaliesCard } from "@/components/dashboard/anomalies-card";
import { SpendingTrendChart } from "@/components/dashboard/spending-trend-chart";
import { CurrentBalanceCard } from "@/components/dashboard/current-balance-card";
import { useDashboardContext } from "@/context/dashboard-context";
import { useBudgets } from "@/hooks/useBudgets";
import { useDialogs } from "@/hooks/useDialogs";
import { useTransactions } from "@/hooks/useTransactions";
import { DateRangePicker } from "@/components/dashboard/date-range-picker";
import { SourceFilter } from "@/components/dashboard/source-filter";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AskAiCharacter } from "@/components/dashboard/ask-ai-character";
import { useTiers } from "@/hooks/use-tiers";


const PremiumUpgradeCard = () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="h-full flex flex-col overflow-hidden bg-muted/20 col-span-1 lg:col-span-2 cursor-help border-dashed border-primary/50">
             <CardContent className="flex-1 flex flex-col justify-center items-center text-center p-6">
                <div className="flex flex-col sm:flex-row items-center justify-center text-center sm:text-left gap-4">
                    <div className="w-20 h-20 flex-shrink-0">
                        <AskAiCharacter />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-xl font-semibold">Unlock Ask AI</h3>
                        <p className="text-muted-foreground">
                            Upgrade to Premium to ask questions, generate simple graphs, and get instant insights into your finances.
                        </p>
                        <p className="text-xs text-muted-foreground pt-2">Hover to learn more</p>
                    </div>
                </div>
              </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent className="p-0 max-w-sm" side="top" align="center">
          <PremiumFeaturesTooltipContent />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

const PremiumFeaturesTooltipContent = () => (
    <div className="space-y-3 p-2">
        <p className="text-center font-bold text-lg text-primary">Unlock Premium Features!</p>
        <p className="text-center text-sm">Includes all Pro features, plus:</p>
        <ul className="list-none space-y-2 text-sm text-foreground">
            <li className="flex items-start gap-2">
                <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>**Ask AI**: Get instant answers to your financial questions by chatting with our advanced AI assistant.</span>
            </li>
        </ul>
        <p className="text-center text-xs text-muted-foreground pt-2">Enable "Premium Mode" at the top right to try it out.</p>
    </div>
);


export default function DashboardPage() {
    const { isPro } = useTiers();
    const {
        transactionFiles,
        allTransactions,
        setAllTransactions,
        filteredTransactions,
        dateRange,
        setDateRange,
        selectedSourceFilter,
        setSelectedSourceFilter,
        totalSpending,
        highestTransaction,
        transactionCount,
        highestDay,
        availableMonths,
        minDate,
        maxDate,
        filterDescription,
        currentBalance,
        allCategories,
        setAllCategories,
        handleCategoryChange,
        handleUpdateTransactions,
    } = useTransactions(isPro);

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

  const dashboardContext = useDashboardContext();
  
  React.useEffect(() => {
    // This effect can be used for any future logic that needs to run on mount
    // For now, it's kept empty as the data loading is handled by the useTransactions hook.
  }, []);


  return (
    <div className="min-h-screen bg-background text-foreground">
        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row items-center gap-x-4 gap-y-2 mb-8">
              <DateRangePicker
                  date={dateRange}
                  setDate={setDateRange}
                  minDate={minDate}
                  maxDate={maxDate}
              />
              <SourceFilter
                  files={transactionFiles}
                  selectedSource={selectedSourceFilter}
                  onSelectSource={setSelectedSourceFilter}
              />
            </div>
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
              </TabsContent>
              <TabsContent value="transactions" className="mt-4">
                <TransactionTable
                  transactions={filteredTransactions}
                  onCategoryChange={handleCategoryChange}
                  allCategories={allCategories}
                  isPro={isPro}
                />
              </TabsContent>
                <TabsContent value="insights" className="mt-4">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <AnomaliesCard transactions={allTransactions} />
                    <TipsPanel transactions={allTransactions} />
                  </div>
                  <PremiumUpgradeCard />
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
