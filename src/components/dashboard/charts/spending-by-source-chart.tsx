
"use client";

import * as React from 'react';
import { Treemap, ResponsiveContainer, Rectangle } from 'recharts';
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
} from "@/components/ui/chart";
import type { Transaction } from '@/lib/types';
import { Banknote } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getStableColor } from '@/lib/colors';

// A custom component to render each cell of the treemap with styling
const CustomizedContent = (props: any) => {
  const { root, depth, x, y, width, height, index, name, value, onPieClick, isHovered, color } = props;
  const isParent = depth === 0;
  const textColor = isParent ? 'text-white' : 'text-white/80';
  const textShadow = 'drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]';

  return (
    <g>
      <Rectangle
        x={x}
        y={y}
        width={width}
        height={height}
        onClick={() => onPieClick({ name })}
        className={cn(
            "stroke-background stroke-2 transition-all duration-300 ease-in-out cursor-pointer",
            isHovered ? 'opacity-100 scale-[1.01]' : 'opacity-80'
        )}
        style={{
            fill: color,
            transformOrigin: `${x + width/2}px ${y + height/2}px`,
        }}
        radius={4}
      />
      {width > 80 && height > 30 && (
         <foreignObject x={x + 4} y={y + 4} width={width - 8} height={height - 8}>
            <div className={`w-full h-full flex flex-col justify-start items-start ${textShadow}`}>
                <p className={`font-bold text-sm ${textColor} truncate`}>{name}</p>
                <p className={`text-xs ${textColor}`}>
                    ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
            </div>
        </foreignObject>
      )}
    </g>
  );
};

export function SpendingBySourceChart({ transactions, onPieClick }: { transactions: Transaction[], onPieClick: (data: any) => void }) {
    const aggregatedData = React.useMemo(() => {
        if (!transactions) return [];
        
        const spendingTransactions = transactions.filter(t => t.amount > 0);
        
        const sourceTotals = spendingTransactions.reduce((acc, transaction) => {
        const source = transaction.bankName || 'Unknown Source';
        acc[source] = (acc[source] || 0) + transaction.amount;
        return acc;
        }, {} as Record<string, number>);

        return Object.entries(sourceTotals)
            .map(([source, amount]) => ({
                name: source,
                size: amount, // Treemap uses 'size' instead of 'amount' or 'value'
                color: getStableColor(source)
            }))
            .sort((a, b) => b.size - a.size);
    }, [transactions]);
  
  return (
    <Card className="flex flex-col h-full card-interactive group">
      <CardHeader>
        <CardTitle className='flex items-center gap-2 group-hover:text-primary transition-colors'>
            <Banknote className="h-6 w-6" />
            Spending by Source
        </CardTitle>
        <CardDescription>Breakdown of spending from each bank. Click a block for details.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <ChartContainer config={{}} className="h-[250px] w-full sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <Treemap
                    data={aggregatedData}
                    dataKey="size"
                    aspectRatio={4 / 3}
                    stroke="#fff"
                    content={
                        <CustomizedContent 
                            onPieClick={onPieClick} 
                            isHovered={false} // Default state
                        />
                    }
                />
            </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
