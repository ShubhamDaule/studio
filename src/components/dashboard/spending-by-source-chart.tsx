
"use client"
import * as React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Transaction } from "@/lib/types";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export function SpendingBySourceChart({ transactions, onPieClick }: { transactions: Transaction[], onPieClick: (data: any) => void }) {
  const spendingBySource = React.useMemo(() => {
    const data: { [key: string]: number } = {};
    transactions
      .filter((t) => t.amount > 0 && t.category !== "Payment" && t.category !== "Investment")
      .forEach((transaction) => {
        const source = transaction.fileSource;
        data[source] = (data[source] || 0) + transaction.amount;
      });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [transactions]);
  
  if (spendingBySource.length <= 1) {
    return null; // Don't show chart if only one or zero sources
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Source</CardTitle>
        <CardDescription>Breakdown of spending by imported file.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={spendingBySource}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              onClick={(data) => onPieClick({source: data.name})}
              label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                return (
                  <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                    {`${(percent * 100).toFixed(0)}%`}
                  </text>
                );
              }}
            >
              {spendingBySource.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
