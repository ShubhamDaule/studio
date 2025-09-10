
"use client";

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Transaction } from '@/lib/types';
import { SpendingChart } from '@/components/dashboard/charts/spending-chart';
import { SpendingByDayChart } from '@/components/dashboard/charts/spending-by-day-chart';
import { SpendingBySourceChart } from '@/components/dashboard/charts/spending-by-source-chart';
import { TopMerchantsChart } from '@/components/dashboard/charts/top-merchants-chart';
import { SpendingClassificationChart } from '../dashboard/charts/SpendingClassificationChart';
import { SpendingTrendChart } from '../dashboard/charts/spending-trend-chart';
import { BudgetSpendingChart } from '../dashboard/charts/budget-spending-chart';
import { SubscriptionsCard } from '../dashboard/cards/subscriptions-card';
import { useDashboardContext } from '@/context/dashboard-context';
import { useBudgets } from '@/hooks/useBudgets';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  chartData?: { title: string, data: Transaction[], type: 'bar' | 'pie' | 'treemap' | 'area' | 'line' | 'table' };
};

export function ChartExpandedDialog({ isOpen, onClose, chartData }: Props) {
  const [groupBy, setGroupBy] = React.useState('category');
  const { allCategories } = useDashboardContext();
  const { budgets } = useBudgets({allCategories, transactions: chartData?.data || [], dateRange: undefined});


  if (!chartData) return null;
  
  const aggregatedData = React.useMemo(() => {
    if (!chartData.data) return [];
    
    const key = groupBy as keyof Transaction;
    
    return chartData.data
      .filter(t => t.amount > 0)
      .reduce((acc, t) => {
        const groupKey = t[key] as string || 'Unknown';
        acc[groupKey] = (acc[groupKey] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);
  }, [chartData.data, groupBy]);

  const chartComponent = () => {
    switch (chartData.title) {
        case 'Spending Breakdown':
            return <SpendingChart transactions={chartData.data} onPieClick={() => {}} budgets={[]} allCategories={allCategories} />;
        case 'Spending By Day':
            return <SpendingByDayChart transactions={chartData.data} onBarClick={() => {}} />;
        case 'Spending by Source':
            return <SpendingBySourceChart transactions={chartData.data} onPieClick={() => {}} />;
        case 'Top 5 Merchants':
             return <TopMerchantsChart transactions={chartData.data} onBarClick={() => {}} />;
        case 'Needs vs. Wants':
            return <SpendingClassificationChart transactions={chartData.data} onClick={() => {}} />;
        case 'Recurring Subscriptions':
            return <div className="p-4"><SubscriptionsCard transactions={chartData.data} /></div>;
        case 'Spending Trend':
             return <SpendingTrendChart transactions={chartData.data} />;
        case 'Spending vs. Budget':
            return <BudgetSpendingChart transactions={chartData.data} budgets={budgets} allCategories={allCategories} />;
        default:
            return <p>Chart type not supported in expanded view.</p>;
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{chartData.title}</DialogTitle>
          <DialogDescription>
            Expanded view. Use the dropdown to change how the data is grouped.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2 my-2">
            <span className='text-sm font-medium'>Group by:</span>
            <Select value={groupBy} onValueChange={setGroupBy}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Group by..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="category">Category</SelectItem>
                    <SelectItem value="merchant">Merchant</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="flex-1 overflow-auto -mx-6 px-6">
            <div className="h-[500px] w-full">
               {chartComponent()}
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
