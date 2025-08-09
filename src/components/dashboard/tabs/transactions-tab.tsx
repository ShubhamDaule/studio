
"use client";

import { TransactionTable } from "@/components/dashboard/transaction-table";
import type { Category, Transaction } from "@/lib/types";

type TransactionsTabProps = {
    filteredTransactions: Transaction[];
    handleCategoryChange: (transactionId: string, newCategory: Category) => void;
    allCategories: Category[];
    isPro: boolean;
};

export function TransactionsTab({
    filteredTransactions,
    handleCategoryChange,
    allCategories,
    isPro,
}: TransactionsTabProps) {
    return (
        <TransactionTable
            transactions={filteredTransactions}
            onCategoryChange={handleCategoryChange}
            allCategories={allCategories}
            isPro={isPro}
        />
    );
}
