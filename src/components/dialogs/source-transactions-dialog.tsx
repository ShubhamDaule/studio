
"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { TransactionTable } from "../dashboard/transaction-table";
import type { Transaction, Category } from "@/lib/types";
import { FileText } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  source?: string;
  transactions: Transaction[];
  allCategories: Category[];
  onCategoryChange: (transactionId: string, newCategory: Category) => void;
  isPro: boolean;
};

export function SourceTransactionsDialog({ isOpen, onClose, source, transactions, allCategories, onCategoryChange, isPro }: Props) {
  if (!source) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Transactions from {source}
          </DialogTitle>
          <DialogDescription>
            Showing all transactions from the file "{source}".
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
