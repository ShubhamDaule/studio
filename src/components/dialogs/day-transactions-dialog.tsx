
"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { TransactionTable } from "../dashboard/transaction-table";
import type { Transaction } from "@/lib/types";
import { format, parseISO } from "date-fns";
import { Calendar } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  date?: string;
  transactions: Transaction[];
};

export function DayTransactionsDialog({ isOpen, onClose, date, transactions }: Props) {
  if (!date) return null;
  const formattedDate = format(parseISO(date), "PPP");
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Transactions on {formattedDate}
          </DialogTitle>
          <DialogDescription>
            Showing all transactions for {formattedDate}.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 max-h-[60vh] overflow-auto">
          <TransactionTable transactions={transactions} isPro={true} onCategoryChange={() => {}} allCategories={[]} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
