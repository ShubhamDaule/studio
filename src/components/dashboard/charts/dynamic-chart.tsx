
"use client";

import * as React from 'react';
import { Pie, PieChart, Bar, BarChart, XAxis, YAxis, Tooltip, Cell, Legend, ResponsiveContainer, Rectangle } from 'recharts';
import type { ChartData } from '@/lib/types';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface DynamicChartProps {
    chartData: ChartData;
}

const chartColors = [
  "hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))",
  "hsl(var(--chart-4))", "hsl(var(--chart-5))"
];

const formatCurrency = (value: number) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function DynamicChart({ chartData }: DynamicChartProps) {
    if (chartData.type === 'pie') {
        return (
            <div className="w-full h-64 mt-4">
                <ResponsiveContainer>
                    <PieChart>
                        <Tooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel formatter={(value) => formatCurrency(value as number)} />}
                        />
                        <Pie data={chartData.data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
                            {chartData.data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                            ))}
                        </Pie>
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        );
    }

    if (chartData.type === 'bar') {
        return (
            <div className="w-full h-64 mt-4">
                <ResponsiveContainer>
                    <BarChart data={chartData.data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
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
                        <Bar dataKey="value" fill="var(--color-amount)" radius={4}>
                            {chartData.data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
    }
    
    return null;
}
