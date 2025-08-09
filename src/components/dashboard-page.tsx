import { transactions } from '@/lib/data';
import StatsCard from '@/components/stats-card';
import SpendingBreakdownChart from '@/components/spending-breakdown-chart';
import SpendingTrendChart from '@/components/spending-trend-chart';
import RecentTransactions from '@/components/recent-transactions';
import AIInsights from '@/components/ai-insights';
import { DollarSign, Receipt, TrendingUp as TrendingUpIcon } from 'lucide-react';

export default function DashboardPage() {
  const totalSpending = transactions
    .filter((t) => t.amount < 0)
    .reduce((acc, t) => acc + Math.abs(t.amount), 0);
  
  const totalIncome = transactions
    .filter((t) => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const totalTransactions = transactions.length;
  
  const netFlow = totalIncome - totalSpending;

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Spending"
          value={`$${totalSpending.toFixed(2)}`}
          icon={<DollarSign className="w-5 h-5 text-muted-foreground" />}
          description="Total amount spent this period"
        />
        <StatsCard
          title="Total Income"
          value={`$${totalIncome.toFixed(2)}`}
          icon={<DollarSign className="w-5 h-5 text-muted-foreground" />}
          description="Total income received this period"
        />
        <StatsCard
          title="Net Flow"
          value={`${netFlow < 0 ? '-' : ''}$${Math.abs(netFlow).toFixed(2)}`}
          icon={<TrendingUpIcon className="w-5 h-5 text-muted-foreground" />}
          description="Income minus spending"
        />
        <StatsCard
          title="Transactions"
          value={totalTransactions.toString()}
          icon={<Receipt className="w-5 h-5 text-muted-foreground" />}
          description="Total transactions this period"
        />
      </div>
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <SpendingTrendChart data={transactions} />
        </div>
        <div className="lg:col-span-2">
          <SpendingBreakdownChart data={transactions} />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <RecentTransactions data={transactions} />
        </div>
        <div className="lg:col-span-2">
          <AIInsights data={transactions} />
        </div>
      </div>
    </div>
  );
}
