

"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { TransactionTable } from "../dashboard/transaction-table";
import type { Transaction, Category } from "@/lib/types";
import { CategoryIcon } from "../icons";
import { TooltipProvider } from "@radix-ui/react-tooltip";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  category?: Category['name'];
  transactions: Transaction[];
  allCategories: Category[];
  onCategoryChange: (transactionId: string, newCategory: Category['name']) => void;
  isPro: boolean;
};

export function CategoryTransactionsDialog({ isOpen, onClose, category, transactions, allCategories, onCategoryChange, isPro }: Props) {
  if (!category) return null;
  
  const isAllCategories = category === 'all';
  const categoryObj = isAllCategories ? null : allCategories.find(c => c.name === category);
  const title = isAllCategories ? "All Spending" : `Transactions for ${category}`;
  const description = isAllCategories 
    ? "Showing all spending transactions for the selected period."
    : `Showing all transactions in the "${category}" category for the selected period.`;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {categoryObj && <CategoryIcon category={categoryObj} className="w-6 h-6" />}
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="mt-4 max-h-[60vh] overflow-auto">
            <TooltipProvider>
              <TransactionTable 
                transactions={transactions} 
                isPro={isPro} 
                onCategoryChange={onCategoryChange} 
                allCategories={allCategories} 
              />
            </TooltipProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
}
