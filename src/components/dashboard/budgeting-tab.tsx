
"use client";
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Budget, BudgetOverride, Category, Transaction } from "@/lib/types";
import { Settings2, Plus } from "lucide-react";
import { EditCategoryDialog } from "../dialogs/edit-category-dialog";
import { useBoolean } from "@/hooks/use-boolean";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableCategoryBudget } from "./sortable-category-budget";
import { ManageCategoriesDialog } from "../dialogs/manage-categories-dialog";

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
    activeBudgets,
    onMultipleBudgetChange,
    transactions,
    setAllCategories,
    onAddBudget,
    allCategories,
    onDeleteBudget,
    onDeleteCategory,
}: Props) {
    const {value: isEditDialogOpen, setTrue: openEditDialog, setFalse: closeEditDialog} = useBoolean(false);
    const {value: isManageDialogOpen, setTrue: openManageDialog, setFalse: closeManageDialog} = useBoolean(false);
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
        openEditDialog();
    };
    
    const handleSaveCategory = (updatedCategory: Category, isNew: boolean) => {
        if (isNew) {
            setAllCategories(prev => [...prev, updatedCategory]);
            onAddBudget({ category: updatedCategory.name, amount: 0 });
        } else {
             setAllCategories(prev => prev.map(c => c.name === selectedCategory?.name ? updatedCategory : c));
        }
        closeEditDialog();
        setSelectedCategory(null);
    }
    
    const budgetedCategories = allCategories.filter(
      (c) => activeBudgets.some((b) => b.category === c.name)
    );

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                <Card className="col-span-1 md:col-span-3 card-interactive group">
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <CardTitle className="group-hover:text-primary transition-colors">Monthly Budgets</CardTitle>
                                <CardDescription>
                                    Track and manage your spending for each category. Drag to reorder.
                                </CardDescription>
                            </div>
                             <Button size="sm" onClick={openManageDialog}>
                                <Settings2 className="mr-2 h-4 w-4"/>
                                Manage Categories
                            </Button>
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
                                                onDeleteCategory={onDeleteCategory}
                                            />
                                        )
                                    })}
                            </SortableContext>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <EditCategoryDialog
                isOpen={isEditDialogOpen}
                onClose={() => { closeEditDialog(); setSelectedCategory(null); }}
                onSave={handleSaveCategory}
                category={selectedCategory}
            />
            <ManageCategoriesDialog 
                isOpen={isManageDialogOpen}
                onClose={closeManageDialog}
                allCategories={allCategories}
                activeBudgets={activeBudgets}
                onAddBudget={onAddBudget}
                onDeleteBudget={onDeleteBudget}
                transactions={transactions}
                onAddCustomCategory={() => { closeManageDialog(); openEditDialog(); }}
            />
        </>
    );
}
