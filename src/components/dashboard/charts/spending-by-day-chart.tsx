
"use client";

import * as React from 'react';
import { Bar, BarChart, XAxis, YAxis, Tooltip, Rectangle } from 'recharts';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { Transaction } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import { BarChart3 } from 'lucide-react';
import { ChartCardHeader } from './chart-card-header';
import { getStableColor } from '@/lib/colors';

interface SpendingByDayChartProps {
  transactions: Transaction[];
  onBarClick: (data: any) => void;
  onExpand: () => void;
}

const chartConfig = {
  amount: {
    label: "Amount",
    color: getStableColor("daily_spending"),
  },
} satisfies ChartConfig;

// Custom shape for the bar to apply hover effect
const CustomBar = (props: any) => {
    const { isHovered } = props;
    const scale = isHovered ? 1.05 : 1;

    return (
        <Rectangle
            {...props}
            height={props.height * scale}
            y={props.y - (props.height * (scale - 1)) / 2}
            style={{ transition: 'all 0.2s ease-in-out', transformOrigin: 'center' }}
        />
    );
};

export function SpendingByDayChart({ transactions, onBarClick, onExpand }: SpendingByDayChartProps) {
  const [hoveredBar, setHoveredBar] = React.useState<string | null>(null);

  const aggregatedData = React.useMemo(() => {
    if (!transactions) return [];
    const dailyTotals = transactions.reduce((acc, transaction) => {
      if(transaction.amount < 0) return acc;
      
      try {
        const date = parseISO(transaction.date);
        if (!isNaN(date.getTime())) {
          const dayKey = format(date, 'yyyy-MM-dd');
          acc[dayKey] = (acc[dayKey] || 0) + transaction.amount;
        }
      } catch {}

      return acc;
    }, {} as Record<string, number>);

    return Object.entries(dailyTotals)
      .map(([date, amount]) => ({
        date: date,
        displayDate: format(parseISO(date), 'MMM d'),
        amount,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [transactions]);
  
  const formatCurrency = (value: number) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <Card className="flex flex-col h-full card-interactive group">
      <ChartCardHeader
        title="Spending By Day"
        description="Daily spending overview. Click a bar to see details."
        Icon={BarChart3}
        onExpand={onExpand}
      />
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="h-[250px] w-full sm:h-[300px]">
          <BarChart
            data={aggregatedData}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            onMouseMove={(state) => {
                if (state.isTooltipActive) {
                    setHoveredBar(state.activePayload?.[0]?.payload.date || null);
                } else {
                    setHoveredBar(null);
                }
            }}
            onMouseLeave={() => setHoveredBar(null)}
            >
            <XAxis dataKey="displayDate" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
            <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `$${value}`}
                fontSize={12}
            />
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" formatter={(value) => formatCurrency(value as number)} />}
            />
            <Bar 
              dataKey="amount" 
              fill="var(--color-amount)" 
              radius={4} 
              onClick={(data) => onBarClick(data)}
              className="cursor-pointer"
              shape={(props) => <CustomBar {...props} isHovered={props.payload.date === hoveredBar} />}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
