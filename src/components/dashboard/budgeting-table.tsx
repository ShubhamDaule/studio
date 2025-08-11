
"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import type { Category, Budget } from "@/lib/types";
import { CategoryIcon } from "@/components/icons";
import { ArrowUp, ArrowDown, Edit, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDashboardContext } from "@/context/dashboard-context";
import { differenceInCalendarDays, getDaysInMonth } from "date-fns";

type TableData = {
    category: Category;
    budget: number; // This will be the full monthly budget
    spent: number; // This is spent within the date range
};

interface BudgetingTableProps {
  data: TableData[];
  onBudgetChange: (budgets: Budget[]) => void;
}

type SortableColumn = 'category' | 'budget' | 'spent' | 'remaining' | 'progress';

const formatCurrency = (val: number) => {
    const isNegative = val < 0;
    const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.abs(val));
    return isNegative ? `(${formatted})` : formatted;
}

export function BudgetingTable({ data, onBudgetChange }: BudgetingTableProps) {
  const [sortColumn, setSortColumn] = React.useState<SortableColumn>('spent');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('desc');
  const [editingRow, setEditingRow] = React.useState<string | null>(null);
  const [editingValue, setEditingValue] = React.useState<number>(0);
  const { dateRange } = useDashboardContext();

  const handleSort = (column: SortableColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const tableDataWithCalculations = React.useMemo(() => {
    const daysInMonth = dateRange?.from ? getDaysInMonth(dateRange.from) : 30;
    let numberOfDays = 30;
    if (dateRange?.from && dateRange?.to) {
        numberOfDays = differenceInCalendarDays(dateRange.to, dateRange.from) + 1;
    }
    const prorationFactor = numberOfDays / daysInMonth;

    return data.map(item => {
        const proratedBudget = item.budget * prorationFactor;
        const remaining = proratedBudget - item.spent;
        const progress = proratedBudget > 0 ? (item.spent / proratedBudget) * 100 : 0;
        return {
            ...item,
            remaining,
            progress,
        };
    })

  }, [data, dateRange])

  const sortedData = React.useMemo(() => {
    return [...tableDataWithCalculations].sort((a, b) => {
      let comparison = 0;
      switch(sortColumn) {
        case 'category':
          comparison = a.category.name.localeCompare(b.category.name);
          break;
        case 'budget':
          comparison = a.budget - b.budget;
          break;
        case 'spent':
          comparison = a.spent - b.spent;
          break;
        case 'remaining':
            comparison = a.remaining - b.remaining;
            break;
        case 'progress':
            comparison = a.progress - b.progress;
            break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [tableDataWithCalculations, sortColumn, sortDirection]);
  
  const handleEdit = (categoryName: string, currentBudget: number) => {
    setEditingRow(categoryName);
    setEditingValue(currentBudget);
  };

  const handleSave = (categoryName: string) => {
    onBudgetChange([{ category: categoryName, amount: editingValue }]);
    setEditingRow(null);
  };

  const SortableHeader = ({ column, label, className }: { column: SortableColumn, label: string, className?: string }) => (
    <TableHead className={cn('font-semibold', className)}>
        <Button 
          variant="ghost" 
          onClick={() => handleSort(column)} 
          className="px-2 py-1 h-auto -ml-2 text-black dark:text-white font-semibold hover:text-primary hover:bg-transparent"
        >
            {label}
            {sortColumn === column && (
                sortDirection === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
            )}
        </Button>
    </TableHead>
  );

  return (
    <div className="overflow-x-auto relative">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-muted/0">
            <SortableHeader column="category" label="Category" />
            <SortableHeader column="budget" label="Monthly Budget" className="text-right" />
            <SortableHeader column="spent" label="Spent" className="text-right" />
            <SortableHeader column="remaining" label="Remaining" className="text-right" />
            <SortableHeader column="progress" label="Progress" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.length > 0 ? (
            sortedData.map((item) => {
              const isEditing = editingRow === item.category.name;

              return (
              <TableRow key={item.category.name}>
                <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                        <CategoryIcon category={item.category} className="h-5 w-5" />
                        <span>{item.category.name}</span>
                    </div>
                </TableCell>
                <TableCell className="text-right font-medium w-48">
                    {isEditing ? (
                         <div className="flex items-center justify-end gap-1">
                            <Input 
                                type="number" 
                                value={editingValue}
                                onChange={e => setEditingValue(Number(e.target.value))}
                                onKeyDown={e => e.key === 'Enter' && handleSave(item.category.name)}
                                onBlur={() => handleSave(item.category.name)}
                                className="h-8 w-24 text-right"
                                autoFocus
                            />
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleSave(item.category.name)}>
                                <Check className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-end gap-1 group">
                           {formatCurrency(item.budget)}
                           <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleEdit(item.category.name, item.budget)}>
                             <Edit className="h-4 w-4" />
                           </Button>
                        </div>
                    )}
                </TableCell>
                <TableCell className="text-right">{formatCurrency(item.spent)}</TableCell>
                <TableCell className={cn("text-right", item.remaining < 0 && "text-destructive font-medium")}>{formatCurrency(item.remaining)}</TableCell>
                <TableCell className="w-[200px]">
                    <Progress value={Math.min(item.progress, 100)} className="h-3" indicatorClassName={cn(
                        {
                        "bg-destructive": item.progress > 100,
                        "bg-yellow-500": item.progress > 80 && item.progress <= 100,
                        "bg-primary": item.progress <= 80
                        }
                    )} />
                </TableCell>
              </TableRow>
            )})
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                No budgets configured. Go to "Manage Categories" to add some.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
