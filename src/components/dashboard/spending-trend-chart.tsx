
"use client"
import * as React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Transaction } from "@/lib/types";
import { format, parseISO } from "date-fns";

export function SpendingTrendChart({ transactions }: { transactions: Transaction[] }) {
    const monthlySpending = React.useMemo(() => {
        const spendingByMonth: { [key: string]: number } = {};
        transactions.forEach(t => {
            if (t.amount > 0 && t.category !== 'Payment' && t.category !== 'Investment') {
                const month = format(parseISO(t.date), 'yyyy-MM');
                spendingByMonth[month] = (spendingByMonth[month] || 0) + t.amount;
            }
        });
        
        return Object.entries(spendingByMonth)
            .map(([month, total]) => ({ month, total }))
            .sort((a,b) => a.month.localeCompare(b.month));
    }, [transactions]);
    
    if (monthlySpending.length < 2) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>Spending Trend</CardTitle>
                    <CardDescription>Your spending over time.</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                    <p className="text-muted-foreground">Not enough data to show a trend.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Spending Trend</CardTitle>
                <CardDescription>Your spending over time.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlySpending}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="month" 
                            tickFormatter={(str) => format(parseISO(`${str}-01`), 'MMM yy')}
                        />
                        <YAxis tickFormatter={(val) => `$${val}`} />
                        <Tooltip formatter={(val: number) => val.toLocaleString('en-US', {style: 'currency', currency: 'USD'})} />
                        <Legend />
                        <Line type="monotone" dataKey="total" stroke="hsl(var(--primary))" name="Total Spending" />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
