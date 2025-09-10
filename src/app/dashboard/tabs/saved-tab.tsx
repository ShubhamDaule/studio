
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TransactionTable } from "@/components/dashboard/transaction-table";
import { useDashboardContext } from "@/context/dashboard-context";
import { useTiers } from "@/hooks/use-tiers";
import { History, Save } from "lucide-react";
import * as React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";


/**
 * Renders the "Saved" tab for premium users.
 * This tab will display permanently stored transaction data.
 */
export function SavedTab() {
  const { allTransactions, transactionFiles, handleCategoryChange, allCategories } = useDashboardContext();
  const { isPro } = useTiers();

  const savedTransactions = React.useMemo(() => {
    const savedFileNames = new Set(
      transactionFiles.filter(f => f.isSaved).map(f => f.fileName)
    );
    return allTransactions.filter(t => savedFileNames.has(t.fileSource));
  }, [allTransactions, transactionFiles]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <History className="w-6 h-6" />
            Saved Transactions
        </CardTitle>
        <CardDescription>
          View and manage all your permanently saved transaction data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {savedTransactions.length > 0 ? (
           <TooltipProvider>
              <TransactionTable
                  transactions={savedTransactions}
                  onCategoryChange={handleCategoryChange}
                  allCategories={allCategories}
                  isPro={isPro}
              />
          </TooltipProvider>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-center">
            <Save className="w-12 h-12 mb-4 text-muted-foreground" />
            <p className="font-semibold">No Saved Transactions</p>
            <p className="text-muted-foreground text-sm max-w-sm">
              You haven't saved any files yet. Click the save icon on an uploaded file to store its transactions permanently.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
