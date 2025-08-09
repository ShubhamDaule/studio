
"use client";

import * as React from 'react';
import { Bar, BarChart, XAxis, YAxis, Tooltip, LabelList, Rectangle } from 'recharts';
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
import { TopMerchantIcon } from '../icons';

interface TopMerchantsChartProps {
  transactions: Transaction[];
  onBarClick: (data: any) => void;
}

const chartConfig = {
  amount: {
    label: "Amount",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

// Custom shape for the bar to apply hover effect
const CustomBar = (props: any) => {
    const { x, y, width, height, isHovered } = props;
    const scale = isHovered ? 1.05 : 1;
    const scaledWidth = width * scale;

    return (
        <Rectangle
            {...props}
            width={scaledWidth}
            style={{ transition: 'all 0.2s ease-in-out' }}
        />
    );
};

export function TopMerchantsChart({ transactions, onBarClick }: TopMerchantsChartProps) {
  const [hoveredBar, setHoveredBar] = React.useState<string | null>(null);

  const aggregatedData = React.useMemo(() => {
    if (!transactions) return [];
    const spendingTransactions = transactions.filter(t => t.amount > 0);
    
    const merchantTotals = spendingTransactions.reduce((acc, transaction) => {
      acc[transaction.merchant] = (acc[transaction.merchant] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(merchantTotals)
      .map(([merchant, amount]) => ({
        merchant,
        amount,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5) // Take top 5
      .reverse(); // Reverse for horizontal bar chart display
  }, [transactions]);

  const formatCurrency = (value: number) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Function to truncate text with an ellipsis
  const truncate = (str: string, n: number) => {
    return (str.length > n) ? str.slice(0, n-1) + '...' : str;
  };

  return (
    <Card className="flex flex-col h-full card-interactive">
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
            <TopMerchantIcon className="h-6 w-6" />
            Top 5 Merchants
        </CardTitle>
        <CardDescription>Your highest spending by merchant. Click a bar for details.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <ChartContainer config={chartConfig} className="h-[220px] w-full sm:h-[250px]">
          <BarChart
            data={aggregatedData}
            layout="vertical"
            margin={{ top: 5, left: 10, right: 40, bottom: 5 }}
            onMouseMove={(state) => {
                if (state.isTooltipActive) {
                    setHoveredBar(state.activeLabel || null);
                } else {
                    setHoveredBar(null);
                }
            }}
            onMouseLeave={() => setHoveredBar(null)}
          >
            <YAxis
              dataKey="merchant"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              width={100} // Increased width for longer labels
              tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }}
              tickFormatter={(value) => truncate(value, 15)} // Truncate labels
            />
            <XAxis dataKey="amount" type="number" hide />
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
              formatter={(value, name, item) => `${item.payload.merchant}: ${formatCurrency(value as number)}`}
            />
            <Bar 
                dataKey="amount" 
                fill="var(--color-amount)" 
                radius={4} 
                onClick={(data) => onBarClick(data)}
                className="cursor-pointer"
                shape={(props) => <CustomBar {...props} isHovered={props.payload.merchant === hoveredBar} />}
            >
                <LabelList
                    dataKey="amount"
                    position="right"
                    offset={8}
                    className="fill-foreground font-medium"
                    fontSize={12}
                    formatter={(value: number) => formatCurrency(value)}
                />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
