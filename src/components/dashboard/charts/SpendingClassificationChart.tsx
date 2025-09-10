
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
import { Target } from 'lucide-react';
import { getStableColor } from '@/lib/colors';

// Define the classification of each category
export const categoryClassification: { [key: string]: 'Needs' | 'Wants' | 'Savings & Other' } = {
    'Groceries': 'Needs',
    'Housing & Rent': 'Needs',
    'Utilities': 'Needs',
    'Health': 'Needs',
    'Insurance': 'Needs',
    'Travel & Transport': 'Needs', // Assuming commute, can be ambiguous
    'Government & Taxes': 'Needs',
    'Dining': 'Wants',
    'Entertainment': 'Wants',
    'Shopping': 'Wants',
    'Subscriptions': 'Wants',
    'Miscellaneous': 'Wants',
    'Investments & Savings': 'Savings & Other',
    'Payment': 'Savings & Other',
    'Fees & Charges': 'Savings & Other',
    'Charity & Donations': 'Savings & Other',
    'Rewards': 'Savings & Other',
    'Hardware': 'Wants',
    'Office Supplies': 'Wants',
    'Education': 'Wants'
};

const chartConfig = {
  Needs: { label: 'Needs', color: getStableColor('Needs') },
  Wants: { label: 'Wants', color: getStableColor('Wants') },
} satisfies ChartConfig;

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


export function SpendingClassificationChart({ transactions, onClick }: { transactions: Transaction[], onClick: (data: any) => void }) {
  const [activeIndex, setActiveIndex] = React.useState<number | undefined>(undefined);

  const { aggregatedData, totalSpending } = React.useMemo(() => {
    const spending = transactions
      .filter(t => {
        const classification = categoryClassification[t.category];
        return t.amount > 0 && (classification === 'Needs' || classification === 'Wants');
      })
      .reduce((acc, t) => {
        const classification = categoryClassification[t.category];
        if (classification) {
            acc[classification] = (acc[classification] || 0) + t.amount;
        }
        return acc;
      }, {} as Record<string, number>);

    const data = Object.entries(spending)
        .map(([name, value]) => ({ name, value, fill: getStableColor(name) }))
        .sort((a,b) => b.value - a.value);

    const total = data.reduce((acc, item) => acc + item.value, 0);

    return { aggregatedData: data, totalSpending: total };
  }, [transactions]);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(undefined);
  };
  
  const formatCurrency = (value: number) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  
  const tooltipFormatter = (value: number) => {
    const percentage = totalSpending > 0 ? ((value / totalSpending) * 100).toFixed(1) : 0;
    return `${formatCurrency(value)} (${percentage}%)`;
  }

  if (aggregatedData.length === 0) {
    return (
        <Card className="flex flex-col h-full card-interactive group">
            <CardHeader>
                <CardTitle className='flex items-center gap-2 group-hover:text-primary transition-colors'>
                    <Target className="h-6 w-6" />
                    Needs vs. Wants
                </CardTitle>
                <CardDescription>How your spending is classified.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 items-center justify-center pt-6">
                <p className="text-muted-foreground text-center">No transactions classified as 'Needs' or 'Wants' in this period.</p>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card className="flex flex-col h-full card-interactive group">
      <CardHeader>
        <CardTitle className='flex items-center gap-2 group-hover:text-primary transition-colors'>
            <Target className="h-6 w-6" />
            Needs vs. Wants
        </CardTitle>
        <CardDescription>How your spending is classified.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 pt-6">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] sm:max-h-[300px] relative"
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-xs text-muted-foreground">Total (N/W)</p>
              <p className="text-2xl font-bold">
                  {totalSpending.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </p>
          </div>
          <PieChart>
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent formatter={tooltipFormatter} hideLabel />}
            />
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={aggregatedData}
              dataKey="value"
              nameKey="name"
              innerRadius="65%"
              outerRadius="100%"
              strokeWidth={2}
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              onClick={(data) => onClick({ classification: data.name })}
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
