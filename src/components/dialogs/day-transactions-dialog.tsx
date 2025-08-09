
"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { TransactionTable } from "../dashboard/transaction-table";
import type { Transaction } from "@/lib/types";
import { format } from "date-fns";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  date?: string;
  transactions: Transaction[];
};

export function DayTransactionsDialog({ isOpen, onClose, date, transactions }: Props) {
  if (!date) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Transactions on {format(new Date(date), "PPP")}</DialogTitle>
          <DialogDescription>
            Showing all transactions for {format(new Date(date), "PPP")}.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 max-h-[60vh] overflow-auto">
          <TransactionTable transactions={transactions} isPro={true} onCategoryChange={() => {}} allCategories={[]} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
