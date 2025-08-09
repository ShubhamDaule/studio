

"use client";

import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CategoryBudget } from "./category-budget";
import type { Category } from "@/lib/types";
import { GripVertical } from "lucide-react";

type Props = {
  id: string;
  category: Category;
  budget: number;
  spent: number;
  onBudgetChange: (category: Category['name'], amount: number) => void;
  onEditCategory: (category: Category) => void;
};

export function SortableCategoryBudget({ id, category, budget, spent, onBudgetChange, onEditCategory }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group/sortable">
        <button {...attributes} {...listeners} className="absolute top-1/2 -left-6 -translate-y-1/2 p-2 text-muted-foreground opacity-0 group-hover/sortable:opacity-50 transition-opacity cursor-grab active:cursor-grabbing z-10">
            <GripVertical className="h-5 w-5" />
        </button>
        <CategoryBudget
            category={category}
            budget={budget}
            spent={spent}
            onBudgetChange={onBudgetChange}
            onEditCategory={onEditCategory}
        />
    </div>
  );
}
