
"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { Transaction } from "@/lib/types";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { categoryColors } from "../../recent-transactions"; // Using same colors

type Props = {
  isOpen: boolean;
  onClose: () => void;
  transaction?: Transaction | null;
};

export function TransactionDetailDialog({ isOpen, onClose, transaction }: Props) {
  if (!transaction) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>
            Detailed view of your transaction.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
            <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-bold text-lg">{transaction.amount < 0 ? "-" : ""}${Math.abs(transaction.amount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Date</span>
                <span>{format(new Date(transaction.date), "PPP")}</span>
            </div>
             <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Merchant</span>
                <span>{transaction.merchant}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Category</span>
                <Badge variant="outline" className={cn("font-normal", categoryColors[transaction.category])}>
                    {transaction.category}
                </Badge>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Source File</span>
                <span>{transaction.fileSource}</span>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
