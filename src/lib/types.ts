

import type { icons } from "lucide-react";

export type Category = {
  name: string;
  icon: keyof typeof icons;
  isDefault?: boolean;
};


export type Transaction = {
  id: string;
  date: string; // YYYY-MM-DD
  merchant: string;
  amount: number;
  category: Category['name'];
  fileSource: string;
};

export type Budget = {
    category: Category['name'];
    amount: number;
};

export type BudgetOverride = {
    month: string; // YYYY-MM
    category: Category['name'];
    amount: number;
};

export type ExportFormat = 'csv' | 'pdf';

export type Anomaly = {
  transactionId: string;
  reason: string;
}

export type Tip = {
  icon: keyof typeof icons;
  title: string;
  description: string;
}

export type ChartType = 'pie' | 'bar' | 'line';

export type ChartData = {
  data: { name: string; value: number }[];
  type: ChartType;
};

export type QueryResult = {
  answer: string;
  chartData?: ChartData;
};

export type Budgets = Budget[];
