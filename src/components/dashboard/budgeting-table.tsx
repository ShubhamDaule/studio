
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
import type { Category, Budget } from "@/lib/types";
import { CategoryIcon } from "@/components/icons";
import { ArrowUp, ArrowDown, Edit, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDashboardContext } from "@/context/dashboard-context";
import { differenceInCalendarDays, getDaysInMonth } from "date-fns";
import { Progress } from "@/components/ui/progress";

type TableData = {
    category: Category;
    budget: number; // This will be the full monthly budget
    spent: number; // This is spent within the date range
};

interface BudgetingTableProps {
  data: TableData[];
  onBudgetChange: (budgets: Budget[]) => void;
}

type SortableColumn = 'category' | 'budget' | 'spent' | 'periodBudget';

const formatCurrency = (val: number, withSign: boolean = false) => {
    const isNegative = val < 0;
    const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.abs(val));
    if (withSign) {
        return isNegative ? `-${formatted}`: formatted;
    }
    return formatted;
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
        const progress = proratedBudget > 0 ? (item.spent / proratedBudget) * 100 : 0;
        const remaining = proratedBudget - item.spent;
        return {
            ...item,
            proratedBudget,
            progress,
            remaining,
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
        case 'periodBudget':
            comparison = a.proratedBudget - b.proratedBudget;
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

  const SortableHeader = ({ column, label, className, buttonClassName }: { column: SortableColumn, label: string, className?: string, buttonClassName?: string }) => (
    <TableHead className={cn('font-semibold', className)}>
        <Button 
          variant="ghost" 
          onClick={() => handleSort(column)} 
          className={cn("px-2 py-1 h-auto -ml-2 text-black dark:text-white font-semibold hover:text-primary hover:bg-transparent", buttonClassName)}
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
            <SortableHeader column="budget" label="Monthly Budget" />
            <SortableHeader column="spent" label="Spent" />
            <SortableHeader column="periodBudget" label="Period Budget" />
            <TableHead className="font-semibold text-black dark:text-white text-center">Progress</TableHead>
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
                <TableCell className="font-medium">
                    <div className="flex items-center justify-start gap-1 group">
                         {isEditing ? (
                            <div className="flex items-center gap-1">
                                <Input 
                                    type="number" 
                                    value={editingValue}
                                    onChange={e => setEditingValue(Number(e.target.value))}
                                    onKeyDown={e => e.key === 'Enter' && handleSave(item.category.name)}
                                    onBlur={() => handleSave(item.category.name)}
                                    className="h-8 w-24"
                                    autoFocus
                                />
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleSave(item.category.name)}>
                                    <Check className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                             <Button variant="ghost" className="h-auto p-0 font-medium text-foreground hover:text-primary justify-start w-full" onClick={() => handleEdit(item.category.name, item.budget)}>
                                {formatCurrency(item.budget)}
                                <Edit className="h-3 w-3 ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                           </Button>
                        )}
                    </div>
                </TableCell>
                <TableCell>{formatCurrency(item.spent)}</TableCell>
                <TableCell>{formatCurrency(item.proratedBudget)}</TableCell>
                <TableCell className="w-[200px] text-center align-middle">
                    <div className="flex items-center gap-2">
                        <span className={cn("w-16 text-right text-xs", item.remaining < 0 && "text-destructive font-semibold")}>
                           ({formatCurrency(item.remaining, true)})
                        </span>
                        <Progress value={Math.min(item.progress, 100)} className="h-4 flex-1" indicatorClassName={cn(
                            {
                            "bg-destructive": item.progress > 100,
                            "bg-yellow-500": item.progress > 75 && item.progress <= 100,
                            }
                        )} />
                    </div>
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
