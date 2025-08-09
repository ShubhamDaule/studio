
"use client"
import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { Transaction } from "@/lib/types"
import { format } from "date-fns"

export function SpendingByDayChart({ transactions, onBarClick }: { transactions: Transaction[], onBarClick: (data: any) => void }) {
  const spendingByDay = React.useMemo(() => {
    const data: { [key: string]: number } = {};
    transactions
      .filter((t) => t.amount > 0 && t.category !== "Payment" && t.category !== "Investment")
      .forEach((transaction) => {
        const day = format(new Date(transaction.date), "yyyy-MM-dd");
        data[day] = (data[day] || 0) + transaction.amount;
      });
    return Object.entries(data).map(([date, total]) => ({
      date,
      displayDate: format(new Date(date), "MMM d"),
      total,
    })).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [transactions]);
  
  if (spendingByDay.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending by Day</CardTitle>
          <CardDescription>How much you're spending each day.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">No spending data for this period.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Day</CardTitle>
        <CardDescription>How much you're spending each day.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={spendingByDay} onClick={(data) => onBarClick(data?.activePayload?.[0]?.payload)}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="displayDate" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
            <Tooltip
              cursor={{ fill: "hsl(var(--muted))" }}
              formatter={(value) => `$${Number(value).toFixed(2)}`}
            />
            <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
