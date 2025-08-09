
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Category, Budget } from "@/lib/types";
import { CategoryIcon } from "../icons";
import { ScrollArea } from "../ui/scroll-area";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  allCategories: Category[];
  activeBudgets: Budget[];
  onAddBudget: (budget: Budget) => void;
  onDeleteCategory: (categoryName: Category['name']) => void;
};

const CategoryRow = ({ category, action, onAction }: { category: Category; action: 'add' | 'remove'; onAction: () => void; }) => {
    return (
        <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
            <div className="flex items-center gap-2">
                <CategoryIcon category={category} className="w-5 h-5" />
                <span className="text-sm">{category.name}</span>
            </div>
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onAction}>
                {action === 'add' ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
            </Button>
        </div>
    )
}

export function ManageCategoriesDialog({ isOpen, onClose, allCategories, activeBudgets, onAddBudget, onDeleteCategory }: Props) {
  
  const budgetedCategories = allCategories.filter(c => activeBudgets.some(b => b.category === c.name));
  const availableCategories = allCategories.filter(c => !activeBudgets.some(b => b.category === c.name) && !['Payment', 'Rewards', 'Investments & Savings', 'Fees & Charges', 'Government & Taxes'].includes(c.name));
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Manage Budget Categories</DialogTitle>
          <DialogDescription>
            Add or remove categories from your main budget panel.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 grid grid-cols-2 gap-4 items-start">
            <div className="border rounded-lg p-2">
                <h3 className="font-semibold p-2">Available Categories</h3>
                <ScrollArea className="h-72">
                    <div className="space-y-1">
                        {availableCategories.map(cat => (
                            <CategoryRow 
                                key={cat.name} 
                                category={cat} 
                                action="add" 
                                onAction={() => onAddBudget({ category: cat.name, amount: 0 })}
                            />
                        ))}
                    </div>
                </ScrollArea>
            </div>
            <div className="border rounded-lg p-2">
                 <h3 className="font-semibold p-2">Budgeted Categories</h3>
                 <ScrollArea className="h-72">
                    <div className="space-y-1">
                        {budgetedCategories.map(cat => (
                            <CategoryRow 
                                key={cat.name} 
                                category={cat} 
                                action="remove" 
                                onAction={() => onDeleteCategory(cat.name)}
                            />
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
        <DialogFooter>
            <Button onClick={onClose}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
