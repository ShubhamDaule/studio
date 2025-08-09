export type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: 'Food' | 'Shopping' | 'Utilities' | 'Entertainment' | 'Travel' | 'Health' | 'Income' | 'Other';
};
