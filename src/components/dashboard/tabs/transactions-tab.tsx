

"use client";

import { TransactionTable } from "@/components/dashboard/transaction-table";
import type { Category, Transaction } from "@/lib/types";
import { useTiers } from "@/hooks/use-tiers";
import { TooltipProvider } from "@/components/ui/tooltip";

type TransactionsTabProps = {
    filteredTransactions: Transaction[];
    handleCategoryChange: (transactionId: string, newCategory: Category['name']) => void;
    allCategories: Category[];
};

export function TransactionsTab({
    filteredTransactions,
    handleCategoryChange,
    allCategories,
}: TransactionsTabProps) {
    const { isPro } = useTiers();

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
