"use client";

import * as React from 'react';
import { Bar, BarChart, XAxis, YAxis, Tooltip, Rectangle } from 'recharts';
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
import { format, parseISO } from 'date-fns';
import { BarChart3 } from 'lucide-react';

interface SpendingByDayChartProps {
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
    const scaledHeight = height * scale;
    const yOffset = (scaledHeight - height) / 2;

    return (
        <Rectangle
            {...props}
            y={y - yOffset}
            height={scaledHeight}
            style={{ transition: 'all 0.2s ease-in-out', transformOrigin: 'center' }}
        />
    );
};

export function SpendingByDayChart({ transactions, onBarClick }: SpendingByDayChartProps) {
  const [hoveredBar, setHoveredBar] = React.useState<string | null>(null);

  const aggregatedData = React.useMemo(() => {
    if (!transactions) return [];
    const dailyTotals = transactions.reduce((acc, transaction) => {
      if(transaction.amount < 0) return acc;
      
      try {
        const date = parseISO(transaction.date);
        if (!isNaN(date.getTime())) {
          const day = format(date, 'MMM d');
          const fullDate = transaction.date;
          if (!acc[day]) {
            acc[day] = { amount: 0, fullDate };
          }
          acc[day].amount += transaction.amount;
        }
      } catch {}

      return acc;
    }, {} as Record<string, { amount: number, fullDate: string }>);

    return Object.entries(dailyTotals)
      .map(([date, data]) => ({
        date,
        amount: data.amount,
        fullDate: data.fullDate,
      }))
      // Custom sort to handle dates correctly across year changes
      .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());
  }, [transactions]);
  
  const formatCurrency = (value: number) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  
  const handleBarClick = (data: any) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      onBarClick({ date: data.activePayload[0].payload.fullDate });
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
            <BarChart3 className="h-6 w-6" />
            Spending By Day
        </CardTitle>
        <CardDescription>Daily spending overview. Click a bar to see details.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="h-[250px] w-full sm:h-[300px]">
          <BarChart
            data={aggregatedData}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            onMouseMove={(state) => {
                if (state.isTooltipActive) {
                    setHoveredBar(state.activeLabel || null);
                } else {
                    setHoveredBar(null);
                }
            }}
            onMouseLeave={() => setHoveredBar(null)}
            onClick={handleBarClick}
            >
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
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
              className="cursor-pointer"
              shape={(props) => <CustomBar {...props} isHovered={props.payload.date === hoveredBar} />}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
