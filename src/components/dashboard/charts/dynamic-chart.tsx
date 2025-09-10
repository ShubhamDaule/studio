
"use client";

import * as React from 'react';
import { Pie, PieChart, Bar, BarChart, XAxis, YAxis, Tooltip, Cell, Legend, ResponsiveContainer } from 'recharts';
import type { ChartData } from '@/lib/types';
import { getStableColor } from '@/lib/colors';


const formatCurrency = (value: number) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function DynamicChart({ chartData }: DynamicChartProps) {
    if (chartData.type === 'pie') {
        return (
            <div className="w-full h-64 mt-4">
                <ResponsiveContainer>
                    <PieChart>
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                        <Pie data={chartData.data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
                            {chartData.data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getStableColor(entry.name)} />
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
                    <BarChart data={chartData.data}>
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `$${value}`} />
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                        <Bar dataKey="value" fill="#8884d8">
                            {chartData.data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getStableColor(entry.name)} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
    }
    
    return null;
}
