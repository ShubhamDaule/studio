
"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { TransactionTable } from "../dashboard/transaction-table";
import type { Transaction, Category } from "@/lib/types";
import { Target } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  classification?: 'Needs' | 'Wants' | 'Savings & Other';
  transactions: Transaction[];
  allCategories: Category[];
  onCategoryChange: (transactionId: string, newCategory: Category['name']) => void;
  isPro: boolean;
};

export function ClassificationTransactionsDialog({ isOpen, onClose, classification, transactions, allCategories, onCategoryChange, isPro }: Props) {
  if (!classification) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-6 h-6" />
            Transactions Classified as "{classification}"
          </DialogTitle>
          <DialogDescription>Showing all transactions in the "{classification}" classification for the selected period.</DialogDescription>
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
