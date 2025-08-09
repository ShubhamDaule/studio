
"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowUpCircle } from "lucide-react";
import type { Transaction } from "@/lib/types";

export function HighestTransactionCard({ transaction, onClick }: { transaction: Transaction | null, onClick: () => void }) {
  return (
    <Card className="cursor-pointer hover:bg-muted/50" onClick={onClick}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Highest Transaction</CardTitle>
        <ArrowUpCircle className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {transaction ? (
          <>
            <div className="text-2xl font-bold text-primary">
              {transaction.amount.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </div>
            <p className="text-xs text-muted-foreground truncate">
              at {transaction.merchant}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground pt-2">No transactions found.</p>
        )}
      </CardContent>
    </Card>
  );
}
