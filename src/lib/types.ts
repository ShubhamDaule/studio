
export type Category = 
  | 'Groceries'
  | 'Dining'
  | 'Travel & Transport'
  | 'Shopping'
  | 'Entertainment'
  | 'Utilities'
  | 'Rent'
  | 'Cash'
  | 'Investment'
  | 'Payment'
  | 'Other';

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
