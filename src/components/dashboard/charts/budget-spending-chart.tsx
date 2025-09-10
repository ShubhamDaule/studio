
"use client";

import * as React from 'react';
import { Bar, BarChart, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { Transaction, Budget, Category } from '@/lib/types';
import { Target } from 'lucide-react';
import { getStableColor } from '@/lib/colors';

interface BudgetSpendingChartProps {
  transactions: Transaction[];
  budgets: Budget[];
  allCategories: Category[];
}

const chartConfig = {
  spent: {
    label: "Spent",
    color: getStableColor("Spent"),
  },
  budget: {
    label: "Budget",
    color: getStableColor("Budget"),
  },
} satisfies ChartConfig;

export function BudgetSpendingChart({ transactions, budgets }: BudgetSpendingChartProps) {
  const aggregatedData = React.useMemo(() => {
    if (!transactions) {
        return [];
    }
    const spendingByCategory = transactions
      .filter(t => t.amount > 0)
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    return budgets
      .filter((budget) => (budget.amount || 0) > 0)
      .map((budget) => {
        const spent = spendingByCategory[budget.category] || 0;
        return {
          category: budget.category,
          budget: budget.amount,
          spent: spent,
        };
      })
      .sort((a, b) => (b.spent / (b.budget || 1)) - (a.spent / (a.budget || 1)));

  }, [transactions, budgets]);

  if (aggregatedData.length === 0) {
    return null;
  }
  
  const formatCurrency = (value: number) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  return (
    <Card className="flex flex-col h-full card-interactive group">
      <CardHeader>
        <CardTitle className='flex items-center gap-2 group-hover:text-primary transition-colors'>
            <Target className="h-6 w-6" />
            Spending vs. Budget
        </CardTitle>
        <CardDescription>How your spending compares to your set budgets.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <ChartContainer config={chartConfig} className="h-[300px] w-full sm:h-[350px]">
          <BarChart
            data={aggregatedData}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <XAxis type="number" tickFormatter={formatCurrency} fontSize={12} />
            <YAxis 
                dataKey="category" 
                type="category" 
                tickLine={false} 
                axisLine={false} 
                tickMargin={8} 
                fontSize={12}
                width={100}
            />
            <Tooltip
              cursor={{ fill: 'hsl(var(--muted))' }}
              content={<ChartTooltipContent formatter={(value) => formatCurrency(value as number)} />}
            />
            <Legend />
            <Bar dataKey="spent" fill="var(--color-spent)" radius={4} />
            <Bar dataKey="budget" fill="var(--color-budget)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
