
"use client"
import * as React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import type { Transaction } from "@/lib/types";

export function TopMerchantsChart({ transactions, onBarClick }: { transactions: Transaction[], onBarClick: (data: any) => void }) {
    const spendingByMerchant = React.useMemo(() => {
        const data: { [key: string]: number } = {};
        transactions
            .filter(t => t.amount > 0 && t.category !== "Payment" && t.category !== "Investment")
            .forEach(transaction => {
                const merchant = transaction.merchant;
                data[merchant] = (data[merchant] || 0) + transaction.amount;
            });
        
        return Object.entries(data)
            .map(([merchant, total]) => ({ merchant, total }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 10); // Top 10 merchants
    }, [transactions]);

    if (spendingByMerchant.length === 0) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>Top Merchants</CardTitle>
                    <CardDescription>Your top 10 spending locations.</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                    <p className="text-muted-foreground">No spending data available.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Top Merchants</CardTitle>
                <CardDescription>Your top 10 spending locations.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        layout="vertical"
                        data={spendingByMerchant.slice().reverse()}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        onClick={(data) => onBarClick(data?.activePayload?.[0]?.payload)}
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" tickFormatter={(val) => `$${val}`} />
                        <YAxis dataKey="merchant" type="category" width={100} tick={{ fontSize: 12 }} />
                        <Tooltip formatter={(val: number) => val.toLocaleString('en-US', {style: 'currency', currency: 'USD'})} />
                        <Bar dataKey="total" fill="hsl(var(--primary))" name="Total Spent" radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
