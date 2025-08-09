
"use client"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { Budget, Category, Transaction } from "@/lib/types"

type ChartData = {
  category: Category;
  spending: number;
  budget: number;
}

export function BudgetSpendingChart({ transactions, budgets, allCategories }: { transactions: Transaction[], budgets: Budget[], allCategories: Category[] }) {
  const spendingByCategory = transactions
    .filter(t => t.amount > 0 && t.category !== "Payment")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<Category, number>);

  const chartData: ChartData[] = allCategories
    .filter(cat => cat !== 'Payment' && cat !== 'Investment' && cat !== 'Rent' && cat !== 'Cash') // Exclude some categories for clarity
    .map(category => ({
      category,
      spending: spendingByCategory[category] || 0,
      budget: budgets.find(b => b.category === category)?.amount || 0,
    }))
    .filter(d => d.budget > 0 || d.spending > 0)
    .sort((a,b) => (b.spending/b.budget) - (a.spending/a.budget));

  if (chartData.length === 0) {
    return (
       <Card>
        <CardHeader>
          <CardTitle>Spending vs. Budget</CardTitle>
          <CardDescription>How your spending compares to your budget.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No budget data to display.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending vs. Budget</CardTitle>
        <CardDescription>How your spending compares to your budget for each category.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" tickFormatter={(value) => `$${value}`} />
            <YAxis type="category" dataKey="category" width={100} tick={{ fontSize: 12 }} interval={0} />
            <Tooltip
              formatter={(value: number) => value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
              cursor={{ fill: 'hsl(var(--muted))' }}
            />
            <Legend />
            <Bar dataKey="spending" fill="hsl(var(--primary))" name="Spending" radius={[0, 4, 4, 0]} />
            <Bar dataKey="budget" fill="hsl(var(--primary) / 0.2)" name="Budget" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
