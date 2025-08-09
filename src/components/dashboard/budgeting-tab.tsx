
"use client";
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Budget, BudgetOverride, Category, Transaction } from "@/lib/types";
import { PlusCircle } from "lucide-react";
import { CategoryBudget } from "./category-budget";
import { EditCategoryDialog } from "../dialogs/edit-category-dialog";
import { useBoolean } from "@/hooks/use-boolean";

type Props = {
    activeBudgets: Budget[];
    onMultipleBudgetChange: (budgets: Budget[]) => void;
    transactions: Transaction[];
    onTransactionsUpdate: (transactions: Transaction[]) => void;
    onIncomeDetailsChange: (details: any) => void;
    availableMonths: string[];
    onSetBudgetOverride: (override: BudgetOverride) => void;
    allCategories: Category[];
    setAllCategories: React.Dispatch<React.SetStateAction<Category[]>>;
    budgetOverrides: BudgetOverride[];
    onDeleteBudgetOverride: (month: string, category: Category) => void;
};

export function BudgetingTab({
    activeBudgets,
    onMultipleBudgetChange,
    transactions,
    availableMonths,
    onSetBudgetOverride,
    allCategories,
    setAllCategories,
}: Props) {
    const [selectedMonth, setSelectedMonth] = React.useState("default");
    const {value: isDialogOpen, setTrue: openDialog, setFalse: closeDialog} = useBoolean(false);
    const [selectedCategory, setSelectedCategory] = React.useState<Category | null>(null);


    const spendingByCategory = React.useMemo(() => {
        return transactions.reduce((acc, t) => {
            if (t.amount > 0) {
                acc[t.category] = (acc[t.category] || 0) + t.amount;
            }
            return acc;
        }, {} as Record<string, number>);
    }, [transactions]);

    const handleBudgetChange = (category: Category, amount: number) => {
        if(selectedMonth && selectedMonth !== 'default'){
             onSetBudgetOverride({
                month: selectedMonth,
                category,
                amount
            });
        } else {
            onMultipleBudgetChange([{ category, amount }]);
        }
    };
    
    const handleEditCategory = (category: Category) => {
        setSelectedCategory(category);
        openDialog();
    };
    
    const handleSaveCategory = (newCategory: Category, icon: string) => {
        // This is a placeholder for a more robust implementation
        // For now, we just update the local state.
        if(selectedCategory && newCategory !== selectedCategory){
            const updatedCategories = allCategories.map(c => c === selectedCategory ? newCategory : c);
            setAllCategories(updatedCategories);
        } else if (!selectedCategory && !allCategories.includes(newCategory)){
            setAllCategories([...allCategories, newCategory]);
        }
        closeDialog();
        setSelectedCategory(null);
    }
    

    const nonBudgetedCategories = allCategories.filter(
      (c) =>
        !activeBudgets.some((b) => b.category === c) &&
        !['Payment', 'Rewards', 'Investments & Savings', 'Fees & Charges', 'Government & Taxes'].includes(c)
    );

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                <Card className="col-span-1 md:col-span-3">
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <CardTitle>Monthly Budgets</CardTitle>
                                <CardDescription>
                                    Track and manage your spending for each category.
                                </CardDescription>
                            </div>
                             <div className="flex gap-2">
                                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select month" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="default">Default</SelectItem>
                                        {availableMonths.map(month => (
                                            <SelectItem key={month} value={month}>{month}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button variant="outline" onClick={() => { setSelectedCategory(null); openDialog(); }}>
                                    <PlusCircle className="mr-2 h-4 w-4"/>
                                    Add Category
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {activeBudgets
                                .map(budget => (
                                <CategoryBudget
                                    key={budget.category}
                                    category={budget.category}
                                    budget={budget.amount}
                                    spent={spendingByCategory[budget.category] || 0}
                                    onBudgetChange={handleBudgetChange}
                                    onEditCategory={handleEditCategory}
                                />
                            ))}
                             {nonBudgetedCategories.map(category => (
                                <CategoryBudget
                                    key={category}
                                    category={category}
                                    budget={0}
                                    spent={spendingByCategory[category] || 0}
                                    onBudgetChange={handleBudgetChange}
                                    onEditCategory={handleEditCategory}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <EditCategoryDialog
                isOpen={isDialogOpen}
                onClose={() => { closeDialog(); setSelectedCategory(null); }}
                onSave={handleSaveCategory}
                category={selectedCategory}
            />
        </>
    );
}
