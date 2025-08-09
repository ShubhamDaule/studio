
"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { TransactionTable } from "../dashboard/transaction-table";
import type { Transaction } from "@/lib/types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
  transactions: Transaction[];
};

export function CategoryTransactionsDialog({ isOpen, onClose, category, transactions }: Props) {
  if (!category) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Transactions for {category}</DialogTitle>
          <DialogDescription>
            Showing all transactions in the "{category}" category for the selected period.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 max-h-[60vh] overflow-auto">
          <TransactionTable transactions={transactions} isPro={true} onCategoryChange={() => {}} allCategories={[]} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
