
"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { TransactionTable } from "../dashboard/transaction-table";
import type { Transaction, Category } from "@/lib/types";
import { Banknote } from "lucide-react";
import { TooltipProvider } from "../ui/tooltip";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  source?: string;
  transactions: Transaction[];
  allCategories: Category[];
  onCategoryChange: (transactionId: string, newCategory: string) => void;
  isPro: boolean;
};

export function SourceTransactionsDialog({ isOpen, onClose, source, transactions, allCategories, onCategoryChange, isPro }: Props) {
  if (!source) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Banknote className="w-6 h-6" />
            Transactions from {source}
          </DialogTitle>
          <DialogDescription>
            Showing all transactions from the bank "{source}".
          </DialogDescription>
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
