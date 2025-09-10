
"use client";

import * as React from 'react';
import { Pie, PieChart, Tooltip, Cell, Sector } from 'recharts';
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
import { Target } from 'lucide-react';
import { ChartCardHeader } from './chart-card-header';

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
  Needs: { label: 'Needs', color: 'hsl(var(--chart-1))' },
  Wants: { label: 'Wants', color: 'hsl(var(--chart-2))' },
} satisfies ChartConfig;

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * props.midAngle);
  const cos = Math.cos(-RADIAN * props.midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

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
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="hsl(var(--foreground))" className="text-sm font-semibold">{payload.name}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="hsl(var(--muted-foreground))" className="text-xs">
        {`$${value.toFixed(2)} (${(percent * 100).toFixed(0)}%)`}
      </text>
    </g>
  );
};


export function SpendingClassificationChart({ transactions, onClick, onExpand }: { transactions: Transaction[], onClick: (data: any) => void, onExpand: () => void }) {
  const [activeIndex, setActiveIndex] = React.useState<number | undefined>(0);

  const aggregatedData = React.useMemo(() => {
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

    return Object.entries(spending)
        .map(([name, value]) => ({ name, value, fill: `var(--color-${name})` }))
        .sort((a,b) => b.value - a.value);
  }, [transactions]);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(undefined);
  };
  
  const formatCurrency = (value: number) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  if (aggregatedData.length === 0) {
    return (
        <Card className="flex flex-col h-full card-interactive group">
            <ChartCardHeader 
                title="Needs vs. Wants"
                description="How your spending is classified."
                Icon={Target}
                onExpand={onExpand}
            />
            <CardContent className="flex flex-1 items-center justify-center pt-6">
                <p className="text-muted-foreground text-center">No transactions classified as 'Needs' or 'Wants' in this period.</p>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card className="flex flex-col h-full card-interactive group">
      <ChartCardHeader 
        title="Needs vs. Wants"
        description="How your spending is classified."
        Icon={Target}
        onExpand={onExpand}
      />
      <CardContent className="flex-1 pb-0 pt-6">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] sm:max-h-[300px]"
        >
          <PieChart>
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel formatter={(value) => formatCurrency(value as number)} />}
            />
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={aggregatedData}
              dataKey="value"
              nameKey="name"
              innerRadius="35%"
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
