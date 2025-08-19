
"use client";
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Budget, Category } from "@/lib/types";
import { Settings2 } from "lucide-react";
import { useBoolean } from "@/hooks/use-boolean";
import { ManageCategoriesDialog } from "../dialogs/manage-categories-dialog";
import { BudgetingTable } from "./budgeting-table";
import { useBudgets } from "@/hooks/useBudgets";
import { useDashboardContext } from "@/context/dashboard-context";

export function BudgetingTab() {
    const {value: isManageDialogOpen, setTrue: openManageDialog, setFalse: closeManageDialog} = useBoolean(false);
    const { dateRange, filteredTransactions: transactions, allCategories, setAllCategories } = useDashboardContext();

    const { budgets, handleMultipleBudgetChange, addBudget, deleteBudget } = useBudgets({ allCategories, dateRange, transactions });

    const spendingByCategory = React.useMemo(() => {
        if (!transactions) return {};
        return transactions.reduce((acc, t) => {
            if (t.amount > 0) {
                acc[t.category] = (acc[t.category] || 0) + t.amount;
            }
            return acc;
        }, {} as Record<string, number>);
    }, [transactions]);
    
    const budgetedCategories = allCategories.filter(
      (c) => budgets.some((b) => b.category === c.name)
    );

    const tableData = React.useMemo(() => {
        return budgetedCategories.map(cat => {
            const monthlyBudget = budgets.find(b => b.category === cat.name);
            const spent = spendingByCategory[cat.name] || 0;
            return {
                category: cat,
                budget: monthlyBudget?.amount || 0,
                spent,
            };
        });
    }, [budgetedCategories, budgets, spendingByCategory]);

    return (
        <>
            <Card className="col-span-1 md:col-span-3">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <CardTitle>Budgets</CardTitle>
                            <CardDescription>
                                Set your monthly budget for each category. Spending and progress reflect the selected date range.
                            </CardDescription>
                        </div>
                        <Button size="sm" onClick={openManageDialog} className="btn-gradient-base btn-hover-fade">
                            <Settings2 className="mr-2 h-4 w-4"/>
                            Manage Categories
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                   <BudgetingTable 
                    data={tableData}
                    onBudgetChange={handleMultipleBudgetChange}
                   />
                </CardContent>
            </Card>

            <ManageCategoriesDialog 
                isOpen={isManageDialogOpen}
                onClose={closeManageDialog}
                allCategories={allCategories}
                activeBudgets={budgets} // Pass base budgets
                onAddBudget={addBudget}
                onDeleteBudget={deleteBudget}
                transactions={transactions}
                onAddCustomCategory={() => { closeManageDialog(); /* TODO: Implement add custom category flow */ }}
            />
        </>
    );
}
