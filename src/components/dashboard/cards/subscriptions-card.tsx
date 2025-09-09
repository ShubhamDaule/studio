
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Transaction } from "@/lib/types";
import { Repeat } from "lucide-react";
import { CategoryIcon } from "@/components/icons";

interface SubscriptionsCardProps {
  transactions: Transaction[];
}

export function SubscriptionsCard({ transactions }: SubscriptionsCardProps) {
  const subscriptions = React.useMemo(() => {
    return transactions
      .filter((t) => t.category === "Subscriptions" && t.amount > 0)
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  return (
    <Card className="flex flex-col h-full card-interactive group">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors">
          <Repeat className="h-6 w-6" />
          Recurring Subscriptions
        </CardTitle>
        <CardDescription>
          A summary of your detected monthly and yearly subscriptions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {subscriptions.length > 0 ? (
          <div className="space-y-4">
            {subscriptions.slice(0, 5).map((sub) => (
              <div key={sub.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <CategoryIcon category="Subscriptions" className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{sub.merchant}</span>
                </div>
                <span className="font-semibold text-primary">
                  {formatCurrency(sub.amount)}
                </span>
              </div>
            ))}
            {subscriptions.length > 5 && (
                <p className="text-sm text-center text-muted-foreground pt-2">
                    + {subscriptions.length - 5} more
                </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
            <Repeat className="w-10 h-10 mb-4" />
            <p>No subscriptions found in the selected date range.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
