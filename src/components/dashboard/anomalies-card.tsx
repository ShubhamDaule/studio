
"use client";
import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { AlertTriangle, TrendingUp, CircleDollarSign } from 'lucide-react';
import type { Transaction } from "@/lib/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

type Anomaly = {
  type: 'Large Purchase' | 'Category Outlier' | 'Potential Duplicate' | 'Multiple Charges in a Day';
  description: string;
  transaction: Transaction;
};

const ANOMALY_RULES = {
  LARGE_PURCHASE: {
    'Dining': 150,
    'Shopping': 200,
    'Groceries': 250,
    'Other': 100,
    'Travel & Transport': 300,
  },
  CATEGORY_OUTLIER_MULTIPLIER: 2.5,
  DUPLICATE_WINDOW_HOURS: 48
};

const detectAnomalies = (transactions: Transaction[]): Anomaly[] => {
  const anomalies: Anomaly[] = [];
  if (transactions.length === 0) return anomalies;

  const categoryAverages: { [key: string]: { total: number; count: number } } = {};
  
  transactions.forEach(t => {
    if (t.amount > 0) {
      if (!categoryAverages[t.category]) {
        categoryAverages[t.category] = { total: 0, count: 0 };
      }
      categoryAverages[t.category].total += t.amount;
      categoryAverages[t.category].count += 1;
    }
  });

  const categoryAvgValues: { [key: string]: number } = {};
  for (const cat in categoryAverages) {
    categoryAvgValues[cat] = categoryAverages[cat].total / categoryAverages[cat].count;
  }
  
  const sortedTransactions = [...transactions].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  for (let i = 0; i < sortedTransactions.length; i++) {
    const t = sortedTransactions[i];
    if (t.amount <= 0) continue;

    // Rule 1: Large Purchase
    const largePurchaseThreshold = (ANOMALY_RULES.LARGE_PURCHASE as any)[t.category];
    if (largePurchaseThreshold && t.amount > largePurchaseThreshold) {
      anomalies.push({ type: 'Large Purchase', description: `High spending of $${t.amount.toFixed(2)} in ${t.category}.`, transaction: t });
    }

    // Rule 2: Category Outlier
    const avg = categoryAvgValues[t.category];
    if (avg && t.amount > avg * ANOMALY_RULES.CATEGORY_OUTLIER_MULTIPLIER) {
       anomalies.push({ type: 'Category Outlier', description: `Unusually high $${t.amount.toFixed(2)} purchase in ${t.category}. Average is $${avg.toFixed(2)}.`, transaction: t });
    }
    
    // Rule 3: Potential Duplicate
    if (i > 0) {
      const prev = sortedTransactions[i-1];
      const timeDiff = new Date(t.date).getTime() - new Date(prev.date).getTime();
      if (
        t.merchant === prev.merchant && 
        t.amount === prev.amount && 
        timeDiff < 1000 * 60 * 60 * ANOMALY_RULES.DUPLICATE_WINDOW_HOURS
      ) {
         anomalies.push({ type: 'Potential Duplicate', description: `Possible duplicate transaction at ${t.merchant}.`, transaction: t });
      }
    }
    
    // Rule 4: Multiple Charges in a day
    const sameDayCharges = transactions.filter(other => other.id !== t.id && other.date === t.date && other.merchant === t.merchant);
    if (sameDayCharges.length > 1) {
        const alreadyReported = anomalies.some(a => a.type === 'Multiple Charges in a Day' && a.transaction.merchant === t.merchant && a.transaction.date === t.date);
        if(!alreadyReported) {
             anomalies.push({ type: 'Multiple Charges in a Day', description: `Multiple charges at ${t.merchant} on the same day.`, transaction: t });
        }
    }
  }

  return anomalies;
};

export const AnomaliesCard = ({ transactions }: { transactions: Transaction[] }) => {
  const [anomalies, setAnomalies] = React.useState<Anomaly[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setIsLoading(true);
    // Simulate async detection
    setTimeout(() => {
      const detected = detectAnomalies(transactions);
      setAnomalies(detected);
      setIsLoading(false);
    }, 500);
  }, [transactions]);
  
  const getIcon = (type: Anomaly['type']) => {
    switch (type) {
      case 'Large Purchase': return <CircleDollarSign className="h-4 w-4" />;
      case 'Category Outlier': return <TrendingUp className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  }

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Spending Anomalies</CardTitle>
        <CardDescription>Unusual spending patterns we've detected.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
            <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
            </div>
        ) : anomalies.length > 0 ? (
          <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
            {anomalies.map((anomaly, index) => (
              <Alert key={index} variant={index % 2 === 0 ? "default" : "destructive"}>
                {getIcon(anomaly.type)}
                <AlertTitle>{anomaly.type}</AlertTitle>
                <AlertDescription>
                  {anomaly.description}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <AlertTriangle className="mx-auto h-12 w-12" />
            <p className="mt-4">No anomalies detected in the selected period.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
