
"use client";

import { TransactionTable } from "@/components/dashboard/transaction-table";
import { useTiers } from "@/hooks/use-tiers";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useDashboardContext } from "@/context/dashboard-context";

/**
 * Renders the "Transactions" tab in the dashboard.
 * This tab displays a detailed, sortable, and filterable table of all transactions.
 */
export function TransactionsTab() {
    // Tier hook to check user's subscription level.
    const { isPro } = useTiers();
    // Dashboard context to get transaction data and category management functions.
    const { filteredTransactions, handleCategoryChange, allCategories } = useDashboardContext();

    return (
        // TooltipProvider is required for tooltips within the transaction table to work.
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
