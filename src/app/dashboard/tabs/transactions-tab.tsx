
"use client";

import { TransactionTable } from "@/components/dashboard/transaction-table";
import { useTiers } from "@/hooks/use-tiers";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useDashboardContext } from "@/context/dashboard-context";

export function TransactionsTab() {
    const { isPro } = useTiers();
    const { filteredTransactions, handleCategoryChange, allCategories } = useDashboardContext();

    return (
        <TooltipProvider>
            <TransactionTable
                transactions={filteredTransactions}
                onCategoryChange={handleCategoryChange}
                allCategories={allCategories}
                isPro={isPro}
            />
        </TooltipProvider>
    );
}
