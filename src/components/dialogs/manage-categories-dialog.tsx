
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Category, Budget, Transaction } from "@/lib/types";
import { CategoryIcon } from "../icons";
import { ScrollArea } from "../ui/scroll-area";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  allCategories: Category[];
  activeBudgets: Budget[];
  onAddBudget: (budget: Budget) => void;
  onDeleteBudget: (categoryName: Category['name']) => void;
  transactions: Transaction[];
};

const CategoryRow = ({ category, action, onAction, disabled }: { category: Category; action: 'add' | 'remove'; onAction: () => void; disabled?: boolean }) => {
    const button = (
        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onAction} disabled={disabled}>
            {action === 'add' ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
        </Button>
    )

    return (
        <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
            <div className="flex items-center gap-2">
                <CategoryIcon category={category} className="w-5 h-5" />
                <span className="text-sm">{category.name}</span>
            </div>
            {disabled ? (
                 <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>{button}</TooltipTrigger>
                        <TooltipContent>
                            <p>Cannot remove a category with active transactions.</p>
                        </TooltipContent>
                    </Tooltip>
                 </TooltipProvider>
            ) : button}
        </div>
    )
}

export function ManageCategoriesDialog({ isOpen, onClose, allCategories, activeBudgets, onAddBudget, onDeleteBudget, transactions }: Props) {
  const [locallyBudgeted, setLocallyBudgeted] = useState<Budget[]>([]);

  useEffect(() => {
    if (isOpen) {
        setLocallyBudgeted(activeBudgets);
    }
  }, [isOpen, activeBudgets]);

  const budgetedCategories = useMemo(() => {
    const budgetedNames = new Set(locallyBudgeted.map(b => b.category));
    return allCategories.filter(c => budgetedNames.has(c.name));
  }, [locallyBudgeted, allCategories]);
  
  const availableCategories = useMemo(() => {
    const budgetedNames = new Set(locallyBudgeted.map(b => b.category));
    return allCategories.filter(c => !budgetedNames.has(c.name) && !['Payment', 'Rewards', 'Investments & Savings', 'Fees & Charges', 'Government & Taxes'].includes(c.name));
  }, [locallyBudgeted, allCategories]);

  const categoriesWithTransactions = useMemo(() => new Set(transactions.map(t => t.category)), [transactions]);

  const handleAddToBudgeted = (categoryName: Category['name']) => {
    setLocallyBudgeted(prev => [...prev, { category: categoryName, amount: 0 }]);
  }

  const handleRemoveFromBudgeted = (categoryName: Category['name']) => {
    setLocallyBudgeted(prev => prev.filter(b => b.category !== categoryName));
  }
  
  const handleSaveChanges = () => {
    const initialBudgetedNames = new Set(activeBudgets.map(b => b.category));
    const finalBudgetedNames = new Set(locallyBudgeted.map(b => b.category));

    const categoriesToAdd = locallyBudgeted.filter(b => !initialBudgetedNames.has(b.category));
    const categoriesToRemove = activeBudgets.filter(b => !finalBudgetedNames.has(b.category));

    categoriesToAdd.forEach(b => onAddBudget(b));
    categoriesToRemove.forEach(b => onDeleteBudget(b.category));
    
    onClose();
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Manage Budget Categories</DialogTitle>
          <DialogDescription>
            Add or remove categories from your main budget panel. Changes will be saved when you click "Save".
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 grid grid-cols-2 gap-4 items-start">
            <div className="border rounded-lg p-2">
                 <h3 className="font-semibold p-2">Budgeted Categories</h3>
                 <ScrollArea className="h-72">
                    <div className="space-y-1">
                        {budgetedCategories.map(cat => (
                            <CategoryRow 
                                key={cat.name} 
                                category={cat} 
                                action="add" 
                                onAction={() => handleRemoveFromBudgeted(cat.name)}
                                disabled={categoriesWithTransactions.has(cat.name)}
                            />
                        ))}
                    </div>
                </ScrollArea>
            </div>
            <div className="border rounded-lg p-2">
                <h3 className="font-semibold p-2">Available Categories</h3>
                <ScrollArea className="h-72">
                    <div className="space-y-1">
                        {availableCategories.map(cat => (
                            <CategoryRow 
                                key={cat.name} 
                                category={cat} 
                                action="remove" 
                                onAction={() => handleAddToBudgeted(cat.name)}
                            />
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
        <DialogFooter>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSaveChanges}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
