
"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Landmark } from "lucide-react";

export function CurrentBalanceCard({ balance }: { balance: number }) {
  return (
    <Card className="card-interactive group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">Current Balance</CardTitle>
        <Landmark className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">
          {balance.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </div>
        <p className="text-xs text-muted-foreground">
            Reflects all transactions from source
        </p>
      </CardContent>
    </Card>
  );
}
