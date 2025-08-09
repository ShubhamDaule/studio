

"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { Transaction, Category } from "@/lib/types";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CategoryIcon } from "../icons";
import { TrendingUp, Calendar, Banknote, Tag, Building, FileText } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  transaction?: Transaction | null;
  allCategories: Category[];
};

export function TransactionDetailDialog({ isOpen, onClose, transaction, allCategories }: Props) {
  if (!transaction) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    try {
        const date = parseISO(dateString);
        return format(date, "MMMM do, yyyy");
    } catch {
        return dateString;
    }
  }

  const categoryObj = allCategories.find(c => c.name === transaction.category);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
           <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            Transaction Details
          </DialogTitle>
          <DialogDescription>
            Detailed view of your transaction.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4 text-sm">
            <div className="flex justify-between items-center bg-muted/50 p-3 rounded-lg">
                <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium text-muted-foreground">Merchant</span>
                </div>
                <span className="font-semibold text-right">{transaction.merchant}</span>
            </div>
             <div className="flex justify-between items-center bg-muted/50 p-3 rounded-lg">
                <div className="flex items-center gap-3">
                    <Banknote className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium text-muted-foreground">Amount</span>
                </div>
                <span className="font-semibold text-primary text-lg">{formatCurrency(transaction.amount)}</span>
            </div>
            <div className="flex justify-between items-center bg-muted/50 p-3 rounded-lg">
                <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium text-muted-foreground">Date</span>
                </div>
                <span className="font-semibold">{formatDate(transaction.date)}</span>
            </div>
             <div className="flex justify-between items-center bg-muted/50 p-3 rounded-lg">
                <div className="flex items-center gap-3">
                    <Tag className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium text-muted-foreground">Category</span>
                </div>
                <Badge variant="outline" className="py-1 text-sm">
                    <CategoryIcon
                        category={categoryObj}
                        className="mr-2 h-4 w-4"
                    />
                    {transaction.category}
                </Badge>
            </div>
            <div className="flex justify-between items-center bg-muted/50 p-3 rounded-lg">
                <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium text-muted-foreground">Source</span>
                </div>
                <span className="font-semibold text-muted-foreground">{transaction.fileSource}</span>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
