

import type { icons } from "lucide-react";
import type { defaultCategoryIcons } from "@/components/icons";
export type Category = keyof typeof defaultCategoryIcons | "Other";


export type Transaction = {
  id: string;
  date: string; // YYYY-MM-DD
  merchant: string;
  amount: number;
  category: Category;
  fileSource: string;
};

export type Budget = {
    category: Category;
    amount: number;
};

export type BudgetOverride = {
    month: string; // YYYY-MM
    category: Category;
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
