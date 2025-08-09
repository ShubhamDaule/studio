
"use client";

import * as React from 'react';
import { Pie, PieChart, Tooltip, Cell, Sector, Legend, ResponsiveContainer } from 'recharts';
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
  ChartLegendContent,
} from "@/components/ui/chart";
import type { Transaction, Budget, Category } from '@/lib/types';
import { PieChart as PieChartIcon, TrendingUp } from 'lucide-react';

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
        outerRadius={outerRadius + 4}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        className="drop-shadow-lg"
      />
    </g>
  );
};

export function SpendingChart({ transactions, onPieClick, budgets, allCategories }: SpendingChartProps) {
  const [activeIndex, setActiveIndex] = React.useState<number | undefined>(undefined);

  const { aggregatedData, chartConfig } = React.useMemo(() => {
    if (!transactions) return { aggregatedData: [], chartConfig: {} };
    const spendingTransactions = transactions.filter(t => t.amount > 0);
    
    const categoryTotals = spendingTransactions.reduce((acc, transaction) => {
      const category = transaction.category as string;
      acc[category] = (acc[category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);
    
    const dynamicChartConfig: ChartConfig = { ...chartConfigBase };
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
            name: category,
            value: amount,
            fill: `var(--color-${key})`,
            key
        }
      })
      .sort((a, b) => b.value - a.amount);

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
    const { payload } = props;
    const budget = budgets.find(b => b.category === payload.name)?.amount;
    const spentFormatted = formatCurrency(value as number);

    if (budget && budget > 0) {
      const budgetFormatted = formatCurrency(budget);
      return `${payload.name}: ${spentFormatted} of ${budgetFormatted}`;
    }
    
    return `${payload.name}: ${spentFormatted}`;
  }

  return (
    <Card className="flex flex-col h-full card-interactive group" onClick={() => onPieClick({})}>
      <CardHeader className="flex-row items-center gap-2 space-y-0">
        <PieChartIcon className="h-6 w-6" />
        <div className="flex-1">
            <CardTitle className='group-hover:text-primary transition-colors'>Spending Breakdown</CardTitle>
            <CardDescription>Monthly spending by category. Click for details.</CardDescription>
        </div>
        <TrendingUp className="h-5 w-5" />
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] sm:max-h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <Tooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel formatter={tooltipFormatter} hideIndicator />}
              />
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={aggregatedData}
                dataKey="value"
                nameKey="name"
                innerRadius="30%"
                outerRadius="80%"
                strokeWidth={2}
                onClick={(data) => onPieClick(data)}
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
                className="cursor-pointer"
              >
                {aggregatedData.map((entry) => (
                  <Cell key={`cell-${entry.key}`} fill={entry.fill} />
                ))}
              </Pie>
              <Legend content={<ChartLegendContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
