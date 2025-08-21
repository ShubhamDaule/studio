
import type { icons } from "lucide-react";
import type { BankName as ExtractorBankName, StatementType as ExtractorStatementType, StatementPeriod as ExtractorStatementPeriod } from "@/ai/flows/extract-transactions";

export type BankName = ExtractorBankName;
export type StatementType = ExtractorStatementType;
export type StatementPeriod = ExtractorStatementPeriod;

export type Category = {
  name: string;
  icon: keyof typeof icons;
  isDefault?: boolean;
};

export type FinancialSource = {
  name: BankName;
  type: StatementType;
  fileNames: string[];
};

export type TransactionFile = {
  fileName: string;
  bankName: BankName;
  statementType: StatementType;
  statementPeriod: StatementPeriod | null;
};

export type Transaction = {
  id: string;
  date: string; // YYYY-MM-DD
  merchant: string;
  amount: number;
  category: Category['name'];
  fileSource: string;
  bankName: BankName;
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
  description:string;
}

export type ChartType = 'pie' | 'bar' | 'line';

export type ChartData = {
  data: { name: string; value: number }[];
  type: ChartType;
  title: string;
  dataKey: string;
  nameKey: string;
};

export type QueryResult = {
  answer: string;
  chartData?: ChartData;
};

export type Budgets = Budget[];

export type ExtractedTransaction = {
    date: string;
    merchant: string;
    amount: number;
    category: Category['name'];
    bankName: BankName;
    fileSource: string;
};

export type RawTransaction = Omit<ExtractedTransaction, 'category' | 'bankName'>;

export type TokenUsage = {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
}

export type UploadFile = {
  text: string;
  fileName: string;
  cost: number;
  arrayBuffer: ArrayBuffer;
  bankName: BankName;
  statementType: StatementType;
  statementPeriod: StatementPeriod | null;
};
