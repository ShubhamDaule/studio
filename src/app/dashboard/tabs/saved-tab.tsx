
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { History } from "lucide-react";

/**
 * Renders the "Saved" tab for premium users.
 * This tab will display permanently stored transaction data.
 */
export function SavedTab() {
  // TODO: Fetch and display saved transactions from a persistent source.
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <History className="w-6 h-6" />
            Saved Transactions
        </CardTitle>
        <CardDescription>
          View and manage all your permanently saved transaction data.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-64 flex flex-col items-center justify-center text-center">
        <History className="w-12 h-12 mb-4 text-muted-foreground" />
        <p className="font-semibold">Feature Coming Soon</p>
        <p className="text-muted-foreground text-sm">
          This is where your stored transaction history will appear.
        </p>
      </CardContent>
    </Card>
  );
}
