
"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { TransactionTable } from "../dashboard/transaction-table";
import type { Transaction, Category } from "@/lib/types";
import { TopMerchantIcon } from "../icons";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  merchant?: string;
  transactions: Transaction[];
  allCategories: Category[];
  onCategoryChange: (transactionId: string, newCategory: Category) => void;
  isPro: boolean;
};

export function MerchantTransactionsDialog({ isOpen, onClose, merchant, transactions, allCategories, onCategoryChange, isPro }: Props) {
  if (!merchant) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TopMerchantIcon className="w-6 h-6" />
            Transactions at {merchant}
          </DialogTitle>
          <DialogDescription>
            Showing all transactions at "{merchant}" for the selected period.
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
