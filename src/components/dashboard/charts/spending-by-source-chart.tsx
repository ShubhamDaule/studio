
"use client";

import * as React from 'react';
import { Treemap, ResponsiveContainer, Rectangle, Cell } from 'recharts';
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
  const { depth, x, y, width, height, name, value, isHovered, color } = props;
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
        className={cn(
            "stroke-background stroke-2 transition-all duration-300 ease-in-out",
            isHovered ? 'scale-[1.01]' : ''
        )}
        style={{
            fill: color,
            transformOrigin: `${x + width/2}px ${y + height/2}px`,
        }}
        radius={4}
      />
      {width > 80 && height > 30 && (
         <foreignObject x={x + 4} y={y + 4} width={width - 8} height={height - 8} className="pointer-events-none">
            <div className={`w-full h-full flex flex-col justify-start items-start ${textShadow}`}>
                <p className={`font-bold text-sm ${textColor} truncate`}>{name}</p>
                {typeof value === 'number' && (
                  <p className={`text-xs ${textColor}`}>
                      ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                )}
            </div>
        </foreignObject>
      )}
    </g>
  );
};

export function SpendingBySourceChart({ transactions, onPieClick }: { transactions: Transaction[], onPieClick: (data: any) => void }) {
    const [hoveredNode, setHoveredNode] = React.useState<any | null>(null);

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

    const handleChartClick = () => {
        if (hoveredNode) {
            onPieClick({ name: hoveredNode.name });
        }
    }
  
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
            <div className="w-full h-full cursor-pointer" onClick={handleChartClick}>
                <ResponsiveContainer width="100%" height="100%">
                    <Treemap
                        data={aggregatedData}
                        dataKey="size"
                        aspectRatio={4 / 3}
                        stroke="#fff"
                        content={
                            <CustomizedContent isHovered={false} />
                        }
                        onMouseMove={(node) => {
                           if (hoveredNode?.name !== node?.name) {
                             setHoveredNode(node);
                           }
                        }}
                        onMouseLeave={() => setHoveredNode(null)}
                    >
                        {aggregatedData.map((entry, index) => (
                           <Cell 
                                key={`cell-${index}`} 
                                content={<CustomizedContent isHovered={hoveredNode?.name === entry.name} />}
                           />
                        ))}
                    </Treemap>
                </ResponsiveContainer>
            </div>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
