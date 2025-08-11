

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

  const { aggregatedData, chartConfig, totalSpending } = React.useMemo(() => {
    if (!transactions) return { aggregatedData: [], chartConfig: {}, totalSpending: 0 };
    const spendingTransactions = transactions.filter(t => t.amount > 0);
    const total = spendingTransactions.reduce((acc, t) => acc + t.amount, 0);
    
    const categoryTotals = spendingTransactions.reduce((acc, transaction) => {
      const category = transaction.category;
      acc[category] = (acc[category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);
    
    const dynamicChartConfig: ChartConfig = { ...chartConfigBase };
    const sortedCategories = Object.entries(categoryTotals).sort((a,b) => b[1] - a[1]);
    
    const aggregated = sortedCategories.map(([category, amount], index) => {
        const key = category.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const color = `hsl(${(index * 40 + 20) % 360}, 70%, 50%)`;
        
        dynamicChartConfig[key] = {
            label: category,
            color: color
        }
        
        return {
            name: category,
            value: amount,
            fill: `var(--color-${key})`,
            key
        }
      });

      return { aggregatedData: aggregated, chartConfig: dynamicChartConfig satisfies ChartConfig, totalSpending: total };
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
    const spentFormatted = formatCurrency(value as number);
    const percentage = totalSpending > 0 ? ((value / totalSpending) * 100).toFixed(1) : 0;
    
    return `${payload.name}: ${spentFormatted} (${percentage}%)`;
  }

  return (
    <Card className="flex flex-col h-full card-interactive group" onClick={() => onPieClick({ category: 'all' })}>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 group-hover:text-primary transition-colors'>
            <PieChartIcon className="h-6 w-6" />
            Spending Breakdown
        </CardTitle>
        <CardDescription>Monthly spending by category. Click a slice for details.</CardDescription>
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
                dataKey="value"
                nameKey="name"
                innerRadius="30%"
                outerRadius="80%"
                strokeWidth={2}
                onClick={(data, index, e) => {
                  e.stopPropagation();
                  onPieClick({ category: data.name })
                }}
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
                className="cursor-pointer"
              >
                {aggregatedData.map((entry) => (
                  <Cell key={`cell-${entry.key}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
