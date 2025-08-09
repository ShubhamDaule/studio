

"use client";
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Budget, BudgetOverride, Category, Transaction } from "@/lib/types";
import { PlusCircle } from "lucide-react";
import { EditCategoryDialog } from "../dialogs/edit-category-dialog";
import { useBoolean } from "@/hooks/use-boolean";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableCategoryBudget } from "./sortable-category-budget";

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
    onDeleteBudgetOverride: (month: string, category: Category['name']) => void;
    onAddBudget: (budget: Budget) => void;
};

export function BudgetingTab({
    activeBudgets,
    onMultipleBudgetChange,
    transactions,
    setAllCategories,
    onAddBudget,
    allCategories
}: Props) {
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

    const handleBudgetChange = (category: Category['name'], amount: number) => {
        onMultipleBudgetChange([{ category, amount }]);
    };
    
    const handleEditCategory = (category: Category) => {
        setSelectedCategory(category);
        openDialog();
    };
    
    const handleSaveCategory = (updatedCategory: Category) => {
        const isEditing = !!selectedCategory;
        if(isEditing){
             setAllCategories(prev => prev.map(c => c.name === selectedCategory.name ? updatedCategory : c));
        } else {
            // This is the "Add" mode
            const isAlreadyBudgeted = activeBudgets.some(b => b.category === updatedCategory.name);
            if (isAlreadyBudgeted) {
                // Don't add if it's already there
                closeDialog();
                setSelectedCategory(null);
                return;
            }

            const isNewCustomCategory = !allCategories.some(c => c.name === updatedCategory.name);
            if (isNewCustomCategory) {
                // Add to the master list of all possible categories if it's brand new
                setAllCategories(prev => [...prev, updatedCategory]);
            }
            
            // Add the category to the active budget list
            onAddBudget({ category: updatedCategory.name, amount: 0 });
        }
        closeDialog();
        setSelectedCategory(null);
    }
    

    const budgetedCategories = allCategories.filter(
      (c) => activeBudgets.some((b) => b.category === c.name)
    );

    const availableToAdd = allCategories.filter(c => !activeBudgets.some(b => b.category === c.name));

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                <Card className="col-span-1 md:col-span-3">
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <CardTitle>Monthly Budgets</CardTitle>
                                <CardDescription>
                                    Track and manage your spending for each category. Drag to reorder.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            <SortableContext items={budgetedCategories.map(c => c.name)} strategy={verticalListSortingStrategy}>
                                {budgetedCategories.map(cat => {
                                        const budget = activeBudgets.find(b => b.category === cat.name);
                                        if(!budget) return null;

                                        return (
                                            <SortableCategoryBudget
                                                key={cat.name}
                                                id={cat.name}
                                                category={cat}
                                                budget={budget.amount}
                                                spent={spendingByCategory[budget.category] || 0}
                                                onBudgetChange={handleBudgetChange}
                                                onEditCategory={handleEditCategory}
                                            />
                                        )
                                    })}
                            </SortableContext>
                             <div className="flex items-center justify-center min-h-[160px] border-2 border-dashed rounded-lg">
                                <Button variant="ghost" onClick={() => { setSelectedCategory(null); openDialog(); }}>
                                    <PlusCircle className="mr-2 h-4 w-4"/>
                                    Add Category
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <EditCategoryDialog
                isOpen={isDialogOpen}
                onClose={() => { closeDialog(); setSelectedCategory(null); }}
                onSave={handleSaveCategory}
                category={selectedCategory}
                availableCategories={availableToAdd}
            />
        </>
    );
}
