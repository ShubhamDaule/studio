"use client";

import * as React from 'react';
import { Pie, PieChart, Tooltip, Cell, Sector } from 'recharts';
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
import { PieChart as PieChartIcon } from 'lucide-react';

const chartConfigBase = {
  amount: {
    label: "Amount",
  },
  groceries: { label: "Groceries", color: "hsl(var(--chart-1))" },
  dining: { label: "Dining", color: "hsl(var(--chart-2))" },
  'travel-&-transport': { label: "Travel & Transport", color: "hsl(var(--chart-3))" },
  shopping: { label: "Shopping", color: "hsl(var(--chart-4))" },
  entertainment: { label: "Entertainment", color: "hsl(var(--chart-5))" },
  utilities: { label: "Utilities", color: "hsl(var(--chart-1))" },
  'payment': { label: "Payment", color: "hsl(var(--chart-4))" },
  other: { label: "Other", color: "hsl(var(--chart-3))" },
};

interface SpendingChartProps {
  transactions: Transaction[];
  onPieClick: (data: any) => void;
  budgets: Budget[];
  allCategories: Category[];
}

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 4} // This makes the hovered slice pop out
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};


export function SpendingChart({ transactions, onPieClick, budgets, allCategories }: SpendingChartProps) {
  const [activeIndex, setActiveIndex] = React.useState<number | undefined>(undefined);

  const { aggregatedData, chartConfig } = React.useMemo(() => {
    if (!transactions) return { aggregatedData: [], chartConfig: {} };
    // Filter out credits/payments for the spending chart
    const spendingTransactions = transactions.filter(t => t.amount > 0);
    
    const categoryTotals = spendingTransactions.reduce((acc, transaction) => {
      const category = transaction.category as string;
      acc[category] = (acc[category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);
    
    const dynamicChartConfig: ChartConfig = { ...chartConfigBase };

    // Sort categories alphabetically to ensure consistent order between server and client
    const sortedCategories = [...allCategories].sort((a, b) => a.localeCompare(b));

    sortedCategories.forEach((cat, index) => {
        const key = cat.toLowerCase().replace(/ & /g, '-&-').replace(/\//g,'-').replace(/ /g, '-');
        if (!dynamicChartConfig[key]) {
            dynamicChartConfig[key] = {
                label: cat as string,
                color: `hsl(var(--chart-${(index % 5) + 1}))`
            }
        }
    });

    const aggregated = Object.entries(categoryTotals)
      .map(([category, amount]) => {
        const key = category.toLowerCase().replace(/ & /g, '-&-').replace(/\//g,'-').replace(/ /g, '-');
        return {
            category,
            amount,
            fill: `var(--color-${key})`,
        }
      })
      .sort((a, b) => b.amount - a.amount);

      return { aggregatedData: aggregated, chartConfig: dynamicChartConfig satisfies ChartConfig };
  }, [transactions, allCategories]);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(undefined);
  };

  const formatCurrency = (value: number) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  
  const tooltipFormatter = (value: number, name: string, props: any) => {
    const { category } = props.payload;
    const budgetAmount = budgets.find(b => b.category === category)?.amount;
    const spentFormatted = formatCurrency(value as number);

    if (budgetAmount && budgetAmount > 0) {
      const budgetFormatted = formatCurrency(budgetAmount);
      return `${category}: ${spentFormatted} of ${budgetFormatted}`;
    }
    
    return `${category}: ${spentFormatted}`;
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
            <PieChartIcon className="h-6 w-6" />
            Spending Breakdown
        </CardTitle>
        <CardDescription>Monthly spending by category. Click a slice to see details.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] sm:max-h-[300px]"
        >
          <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel formatter={tooltipFormatter} hideIndicator />}
            />
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={aggregatedData}
              dataKey="amount"
              nameKey="category"
              innerRadius={60}
              strokeWidth={2}
              onClick={onPieClick}
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              className="cursor-pointer"
            >
              {aggregatedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
