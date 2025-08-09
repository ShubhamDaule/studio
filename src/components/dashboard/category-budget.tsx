
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CategoryIcon } from "../icons";
import { useBoolean } from "@/hooks/use-boolean";
import { Edit } from "lucide-react";

type Props = {
  category: Category;
  budget: number;
  spent: number;
  onBudgetChange: (category: Category, amount: number) => void;
  onEditCategory: (category: Category) => void;
};

export function CategoryBudget({ category, budget, spent, onBudgetChange, onEditCategory }: Props) {
  const {value: isEditing, setTrue: startEditing, setFalse: stopEditing} = useBoolean(false);
  const [localBudget, setLocalBudget] = React.useState(budget);

  React.useEffect(() => {
    setLocalBudget(budget);
  }, [budget]);

  const percentage = budget > 0 ? (spent / budget) * 100 : 0;
  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  const handleSave = () => {
    onBudgetChange(category, localBudget);
    stopEditing();
  };

  return (
    <Card className="flex flex-col group">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CategoryIcon category={category} className="w-6 h-6" />
            <CardTitle className="text-lg">{category}</CardTitle>
          </div>
           <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => onEditCategory(category)}>
             <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-end">
        <Progress value={percentage} className={cn(
            "h-3 rounded-full",
            percentage > 100 ? "bg-destructive" : "bg-primary"
        )} />
        <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
          <span>{formatCurrency(spent)}</span>
          <span className={cn(percentage > 100 && "text-destructive font-semibold")}>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={localBudget}
                  onChange={(e) => setLocalBudget(parseFloat(e.target.value) || 0)}
                  className="h-8 w-28 text-right"
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                />
                <Button size="sm" onClick={handleSave}>Set</Button>
              </div>
            ) : (
              <span className="cursor-pointer hover:font-bold" onClick={startEditing}>
                of {formatCurrency(budget)}
              </span>
            )}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
