"use client"
import * as React from "react"
import { Label, Pie, PieChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import type { Transaction } from "@/lib/types"

type SpendingBreakdownChartProps = {
  data: Transaction[];
};

export default function SpendingBreakdownChart({ data }: SpendingBreakdownChartProps) {
  const spendingByCategory = React.useMemo(() => {
    const categoryMap: { [key: string]: number } = {};
    const spendingTransactions = data.filter((t) => t.amount < 0 && t.category !== 'Income');

    spendingTransactions.forEach((transaction) => {
        if (!categoryMap[transaction.category]) {
          categoryMap[transaction.category] = 0;
        }
        categoryMap[transaction.category] += Math.abs(transaction.amount);
      });

    const categories = Object.keys(categoryMap);

    return Object.entries(categoryMap).map(([category, total]) => ({
      name: category,
      value: total,
      fill: `hsl(var(--chart-${(categories.indexOf(category) % 5) + 1}))`,
    }));
  }, [data]);
  
  const chartConfig = spendingByCategory.reduce((acc, category) => {
    const key = category.name.toLowerCase().replace(/ /g, "_");
    acc[key] = {
      label: category.name,
      color: category.fill,
    };
    return acc;
  }, {} as any);

  const totalSpending = React.useMemo(() => {
    return spendingByCategory.reduce((acc, curr) => acc + curr.value, 0)
  }, [spendingByCategory])
  
  if (spendingByCategory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending Breakdown</CardTitle>
          <CardDescription>How you're spending your money.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">No spending data to display.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Breakdown</CardTitle>
        <CardDescription>How you spend your money by category.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={spendingByCategory}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="text-3xl font-bold fill-foreground"
                        >
                          {`$${totalSpending.toFixed(0)}`}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="text-sm fill-muted-foreground"
                        >
                          Total
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
             <ChartLegend
              content={<ChartLegendContent nameKey="name" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
