
"use client";

import * as React from 'react';
import { Area, AreaChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
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
import type { Transaction } from '@/lib/types';
import { format, startOfMonth, parseISO } from 'date-fns';
import { AreaChart as AreaChartIcon } from 'lucide-react';
import { getStableColor } from '@/lib/colors';

interface SpendingTrendChartProps {
  transactions: Transaction[];
}

const chartConfig = {
  amount: {
    label: "Amount",
    color: getStableColor("monthly_spending"),
  },
} satisfies ChartConfig;

export function SpendingTrendChart({ transactions }: SpendingTrendChartProps) {
  const aggregatedData = React.useMemo(() => {
    if (!transactions) return [];

    const monthlyTotals = transactions.reduce((acc, transaction) => {
      if(transaction.amount < 0) return acc;
      
      try {
        const date = parseISO(transaction.date);
        if (!isNaN(date.getTime())) {
          const monthKey = format(startOfMonth(date), 'yyyy-MM');
          acc[monthKey] = {
              date: startOfMonth(date),
              amount: (acc[monthKey]?.amount || 0) + transaction.amount
          };
        }
      } catch {}

      return acc;
    }, {} as Record<string, { date: Date, amount: number }>);

    return Object.values(monthlyTotals)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map(d => ({
          date: format(d.date, 'MMM yy'),
          amount: d.amount
      }));

  }, [transactions]);
  
  const formatCurrency = (value: number) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  if (aggregatedData.length < 2) {
      return (
        <Card className="flex flex-col h-full card-interactive group">
            <CardHeader>
                <CardTitle className='flex items-center gap-2 group-hover:text-primary transition-colors'>
                    <AreaChartIcon className="h-6 w-6" />
                    Spending Trend
                </CardTitle>
                <CardDescription>A month-over-month view of your spending habits.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 items-center justify-center pt-6 text-center">
                <p className="text-muted-foreground">Not enough data to display a trend. At least two months of transactions are needed.</p>
            </CardContent>
        </Card>
      )
  }

  return (
    <Card className="flex flex-col h-full card-interactive group">
        <CardHeader>
            <CardTitle className='flex items-center gap-2 group-hover:text-primary transition-colors'>
                <AreaChartIcon className="h-6 w-6" />
                Spending Trend
            </CardTitle>
            <CardDescription>A month-over-month view of your spending habits.</CardDescription>
        </CardHeader>
      <CardContent className="flex-1 pb-4 pt-6">
        <ChartContainer config={chartConfig} className="h-[250px] w-full sm:h-[300px]">
            <AreaChart
                data={aggregatedData}
                margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
                }}
            >
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => formatCurrency(value as number)}
                    fontSize={12}
                    width={80}
                />
                <Tooltip
                cursor={true}
                content={
                    <ChartTooltipContent
                    indicator="dot"
                    formatter={(value) => formatCurrency(value as number)}
                    />
                }
                />
                <defs>
                    <linearGradient id="fillAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop
                        offset="5%"
                        stopColor="var(--color-amount)"
                        stopOpacity={0.8}
                        />
                        <stop
                        offset="95%"
                        stopColor="var(--color-amount)"
                        stopOpacity={0.1}
                        />
                    </linearGradient>
                </defs>
                <Area
                    dataKey="amount"
                    type="natural"
                    fill="url(#fillAmount)"
                    stroke="var(--color-amount)"
                    stackId="a"
                />
            </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
