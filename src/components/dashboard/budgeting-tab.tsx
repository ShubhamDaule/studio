
"use client";
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Budget, BudgetOverride, Category, Transaction } from "@/lib/types";
import { Settings2 } from "lucide-react";
import { useBoolean } from "@/hooks/use-boolean";
import { ManageCategoriesDialog } from "../dialogs/manage-categories-dialog";
import { BudgetingTable } from "./budgeting-table";
import { useBudgets } from "@/hooks/useBudgets";
import { useDashboardContext } from "@/context/dashboard-context";

type Props = {
    activeBudgets: Budget[];
    onMultipleBudgetChange: (budgets: Budget[]) => void;
    transactions: Transaction[];
    onSetBudgetOverride: (override: BudgetOverride) => void;
    allCategories: Category[];
    setAllCategories: React.Dispatch<React.SetStateAction<Category[]>>;
    budgetOverrides: BudgetOverride[];
    onDeleteBudgetOverride: (month: string, category: Category['name']) => void;
    onAddBudget: (budget: Budget) => void;
    onDeleteBudget: (categoryName: Category['name']) => void;
    onDeleteCategory: (categoryName: Category['name']) => void;
};

export function BudgetingTab({
    activeBudgets: proratedBudgets,
    onMultipleBudgetChange,
    transactions,
    setAllCategories,
    onAddBudget,
    allCategories,
    onDeleteBudget,
}: Props) {
    const {value: isManageDialogOpen, setTrue: openManageDialog, setFalse: closeManageDialog} = useBoolean(false);
    const { dateRange } = useDashboardContext();

    const { budgets, handleMultipleBudgetChange: handleBaseBudgetChange } = useBudgets({ allCategories, dateRange, transactions });

    const spendingByCategory = React.useMemo(() => {
        return transactions.reduce((acc, t) => {
            if (t.amount > 0) {
                acc[t.category] = (acc[t.category] || 0) + t.amount;
            }
            return acc;
        }, {} as Record<string, number>);
    }, [transactions]);
    
    const budgetedCategories = allCategories.filter(
      (c) => proratedBudgets.some((b) => b.category === c.name)
    );

    const tableData = React.useMemo(() => {
        return budgetedCategories.map(cat => {
            const proratedBudget = proratedBudgets.find(b => b.category === cat.name);
            const spent = spendingByCategory[cat.name] || 0;
            return {
                category: cat,
                budget: proratedBudget?.amount || 0,
                spent,
                remaining: (proratedBudget?.amount || 0) - spent,
            };
        });
    }, [budgetedCategories, proratedBudgets, spendingByCategory]);

    return (
        <>
            <Card className="col-span-1 md:col-span-3">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <CardTitle>Budgets</CardTitle>
                            <CardDescription>
                                Track and manage your spending for each category. Budgets are prorated based on your selected date range.
                            </CardDescription>
                        </div>
                        <Button size="sm" onClick={openManageDialog}>
                            <Settings2 className="mr-2 h-4 w-4"/>
                            Manage Categories
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                   <BudgetingTable 
                    data={tableData}
                    onBudgetChange={handleBaseBudgetChange} // Pass the base budget updater here
                   />
                </CardContent>
            </Card>

            <ManageCategoriesDialog 
                isOpen={isManageDialogOpen}
                onClose={closeManageDialog}
                allCategories={allCategories}
                activeBudgets={budgets} // Pass base budgets
                onAddBudget={onAddBudget}
                onDeleteBudget={onDeleteBudget}
                transactions={transactions}
                onAddCustomCategory={() => { closeManageDialog(); /* TODO: Implement add custom category flow */ }}
            />
        </>
    );
}
