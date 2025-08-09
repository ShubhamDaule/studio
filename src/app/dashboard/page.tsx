import {
  LayoutDashboard,
  Wallet,
  TrendingUp,
  Settings,
  HelpCircle,
} from 'lucide-react';
import DashboardPage from '@/components/dashboard-page';

export default function Home() {
  return (
    <div className="flex">
        <aside className="w-64 p-4 border-r">
          <div className="flex items-center gap-2 mb-8">
            <div className="p-1.5 rounded-lg bg-primary/20">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-xl font-semibold font-headline">SpendWise</h1>
          </div>
          <nav className="flex flex-col gap-2">
            <a href="#" className="flex items-center gap-2 p-2 rounded-lg bg-primary/10 text-primary font-semibold">
              <LayoutDashboard />
              Dashboard
            </a>
            <a href="#" className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted">
              <TrendingUp />
              Trends
            </a>
            <a href="#" className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted">
              <Wallet />
              Transactions
            </a>
          </nav>
          <div className="mt-auto flex flex-col gap-2 pt-8">
            <a href="#" className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted">
              <Settings />
              Settings
            </a>
            <a href="#" className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted">
              <HelpCircle />
              Help
            </a>
          </div>
        </aside>
        <main className="flex-1 p-4 overflow-auto md:p-6">
          <DashboardPage />
        </main>
    </div>
  );
}
