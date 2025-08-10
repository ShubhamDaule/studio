
"use client";

import * as React from "react";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import type { Transaction, Category, Budget, BudgetOverride } from "@/lib/types";

// Default monthly budgets
const defaultBudgets: Budget[] = [
    { category: 'Groceries', amount: 500 },
    { category: 'Dining', amount: 250 },
    { category: 'Shopping', amount: 300 },
    { category: 'Travel & Transport', amount: 200 },
    { category: 'Entertainment', amount: 100 },
    { category: 'Subscriptions', amount: 50 },
    { category: 'Health', amount: 150 },
    { category: 'Utilities', amount: 200 },
    { category: 'Housing & Rent', amount: 1800 },
    { category: 'Education', amount: 50 },
    { category: 'Insurance', amount: 150 },
    { category: 'Charity & Donations', amount: 25 },
    { category: 'Home Improvement & Hardware', amount: 100 },
    { category: 'Office Supplies', amount: 20 },
    { category: 'Miscellaneous', amount: 100 },
];

type UseBudgetsProps = {
    allCategories: Category[];
    dateRange: DateRange | undefined;
    transactions: Transaction[];
};

export function useBudgets({ allCategories, dateRange, transactions }: UseBudgetsProps) {
  const [budgets, setBudgets] = React.useState<Budget[]>(defaultBudgets);
  const [budgetOverrides, setBudgetOverrides] = React.useState<BudgetOverride[]>([]);

  const activeBudgets = React.useMemo(() => {
    const currentMonth = dateRange?.from ? format(dateRange.from, 'yyyy-MM') : format(new Date(), 'yyyy-MM');
    
    return allCategories
        .filter(cat => !['Payment', 'Rewards', 'Investments & Savings', 'Fees & Charges', 'Government & Taxes'].includes(cat.name))
        .filter(cat => budgets.some(b => b.category === cat.name)) // Ensure only budgeted categories are active
        .map(category => {
            const override = budgetOverrides.find(o => o.month === currentMonth && o.category === category.name);
            if (override) {
                return { category: category.name, amount: override.amount };
            }
            const defaultBudget = budgets.find(b => b.category === category.name);
            return { category: category.name, amount: defaultBudget?.amount || 0 };
    });
  }, [allCategories, budgets, budgetOverrides, dateRange]);


  const handleMultipleBudgetChange = (updatedBudgets: Budget[]) => {
    setBudgets(prev => {
        const newBudgets = [...prev];
        updatedBudgets.forEach(ub => {
            const index = newBudgets.findIndex(b => b.category === ub.category);
            if (index > -1) {
                newBudgets[index] = ub;
            } else {
                newBudgets.push(ub);
            }
        });
        return newBudgets;
    });
  };

  const handleSetBudgetOverride = (override: BudgetOverride) => {
    setBudgetOverrides(prev => {
        const index = prev.findIndex(o => o.month === override.month && o.category === override.category);
        if (index > -1) {
            const newOverrides = [...prev];
            newOverrides[index] = override;
            return newOverrides;
        }
        return [...prev, override];
    });
  };

  const handleDeleteBudgetOverride = (month: string, category: Category['name']) => {
    setBudgetOverrides(prev => prev.filter(o => !(o.month === month && o.category === category)));
  };

  const addBudget = (newBudget: Budget) => {
    setBudgets(prev => {
      const existing = prev.find(b => b.category === newBudget.category);
      if (existing) {
        return prev;
      }
      return [...prev, newBudget];
    });
  };

  const deleteBudget = (categoryName: Category['name']) => {
    setBudgets(prev => prev.filter(b => b.category !== categoryName));
    setBudgetOverrides(prev => prev.filter(o => o.category !== categoryName));
  }


  return {
    budgets,
    budgetOverrides,
    activeBudgets,
    handleMultipleBudgetChange,
    handleSetBudgetOverride,
    handleDeleteBudgetOverride,
    addBudget,
    deleteBudget
  };
}
