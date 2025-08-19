
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
import type { Transaction } from '@/lib/types';
import { Banknote } from 'lucide-react';

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


export function SpendingBySourceChart({ transactions, onPieClick }: { transactions: Transaction[], onPieClick: (data: any) => void }) {
  const [activeIndex, setActiveIndex] = React.useState<number | undefined>(undefined);

  const { aggregatedData, chartConfig } = React.useMemo(() => {
    if (!transactions) return { aggregatedData: [], chartConfig: {} };
    
    const spendingTransactions = transactions.filter(t => t.amount > 0);
    
    const sourceTotals = spendingTransactions.reduce((acc, transaction) => {
      const source = transaction.bankName || 'Unknown Source';
      acc[source] = (acc[source] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

    const dynamicChartConfig: ChartConfig = {
        amount: {
            label: "Amount",
        },
    };

    const sortedSources = Object.entries(sourceTotals).sort((a, b) => b[1] - a[1]);
    const totalSources = sortedSources.length;
    const hueStep = totalSources > 1 ? (360 - 60) / (totalSources -1) : 0; // Avoid reds by staying in a 300 degree range
    const hueOffset = 40; // Start at a non-red color

    const aggregated = sortedSources.map(([source, amount], index) => {
        const configKey = `source${index}`;
        const hue = (hueOffset + hueStep * index) % 360;
        const color = `hsl(${hue}, 70%, 50%)`;

        dynamicChartConfig[configKey] = { label: source, color };
        return {
          name: configKey,
          source,
          amount,
          fill: `var(--color-${configKey})`,
        }
      });
      
    return { aggregatedData: aggregated, chartConfig: dynamicChartConfig satisfies ChartConfig };
  }, [transactions]);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(undefined);
  };

  const formatCurrency = (value: number) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <Card className="flex flex-col h-full card-interactive group" onClick={() => onPieClick({name: null})}>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 group-hover:text-primary transition-colors'>
            <Banknote className="h-6 w-6" />
            Spending by Source
        </CardTitle>
        <CardDescription>Breakdown of spending from each bank.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] sm:max-h-[300px]"
        >
          <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel formatter={(value, name, item) => `${item.payload.source}: ${formatCurrency(value as number)}`} hideIndicator />}
            />
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={aggregatedData}
              dataKey="amount"
              nameKey="source"
              innerRadius={60}
              strokeWidth={2}
              onClick={(data) => onPieClick({ name: data.source })}
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              className="cursor-pointer"
            >
              {aggregatedData.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={entry.fill} name={entry.source} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
