
"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { TransactionTable } from "../dashboard/transaction-table";
import type { Transaction, Category } from "@/lib/types";
import { CategoryIcon } from "../icons";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  category?: Category;
  transactions: Transaction[];
  allCategories: Category[];
  onCategoryChange: (transactionId: string, newCategory: Category) => void;
  isPro: boolean;
};

export function CategoryTransactionsDialog({ isOpen, onClose, category, transactions, allCategories, onCategoryChange, isPro }: Props) {
  if (!category) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CategoryIcon category={category} className="w-6 h-6" />
            Transactions for {category}
          </DialogTitle>
          <DialogDescription>
            Showing all transactions in the "{category}" category for the selected period.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 max-h-[60vh] overflow-auto">
          <TransactionTable 
            transactions={transactions} 
            isPro={isPro} 
            onCategoryChange={onCategoryChange} 
            allCategories={allCategories} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
