
"use client";

import * as React from "react";
import type { DateRange } from "react-day-picker";
import { getYear, getMonth, format } from "date-fns";
import type { Transaction, Category, Budget, BudgetOverride } from "@/lib/types";

// Default monthly budgets
const defaultBudgets: Budget[] = [
  { category: "Groceries", amount: 400 },
  { category: "Dining", amount: 200 },
  { category: "Shopping", amount: 150 },
  { category: "Travel & Transport", amount: 150 },
  { category: "Entertainment", amount: 100 },
  { category: "Utilities", amount: 150 },
  { category: "Rent", amount: 1800 },
  { category: "Other", amount: 200 },
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
        .filter(cat => cat !== 'Payment' && cat !== 'Investment' && cat !== 'Cash')
        .map(category => {
            const override = budgetOverrides.find(o => o.month === currentMonth && o.category === category);
            if (override) {
                return { category, amount: override.amount };
            }
            const defaultBudget = budgets.find(b => b.category === category);
            return { category, amount: defaultBudget?.amount || 0 };
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

  const handleDeleteBudgetOverride = (month: string, category: Category) => {
    setBudgetOverrides(prev => prev.filter(o => !(o.month === month && o.category === category)));
  };


  return {
    budgets,
    budgetOverrides,
    activeBudgets,
    handleMultipleBudgetChange,
    handleSetBudgetOverride,
    handleDeleteBudgetOverride
  };
}
