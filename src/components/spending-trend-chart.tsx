"use client"
import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { Transaction } from "@/lib/types"

type SpendingTrendChartProps = {
  data: Transaction[];
};

export default function SpendingTrendChart({ data }: SpendingTrendChartProps) {
  const monthlySpending = React.useMemo(() => {
    const spendingByMonth: { [key: string]: number } = {};

    data
      .filter((t) => t.amount < 0)
      .forEach((transaction) => {
        const month = new Date(transaction.date).toLocaleString('default', { month: 'short', year: '2-digit' });
        if (!spendingByMonth[month]) {
          spendingByMonth[month] = 0;
        }
        spendingByMonth[month] += Math.abs(transaction.amount);
      });

    const sortedMonths = Object.entries(spendingByMonth)
      .map(([month, total]) => {
        const [monthName, year] = month.split(' ');
        const date = new Date(`${monthName} 1, 20${year}`);
        return { month, total, date };
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    return sortedMonths.map(({month, total}) => ({month, total}));

  }, [data]);

  const chartConfig = {
    spending: {
      label: "Spending",
      color: "hsl(var(--primary))",
    },
  };
  
  if (monthlySpending.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending Trend</CardTitle>
          <CardDescription>Spending over the last few months.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">No spending data available to display trend.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Trend</CardTitle>
        <CardDescription>Your spending over the last few months.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <BarChart data={monthlySpending} margin={{ left: -20, right: 10 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              tickFormatter={(value) => `$${value}`}
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent 
                formatter={(value) => `$${Number(value).toFixed(2)}`}
                indicator="dot" 
              />}
            />
            <Bar dataKey="total" fill="var(--color-spending)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
