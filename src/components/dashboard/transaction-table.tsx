

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Transaction, Category } from "@/lib/types";
import { CategoryIcon } from "@/components/icons";
import { ArrowUp, ArrowDown, Sparkles, FileDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTiers } from "@/hooks/use-tiers";
import { format, parseISO } from "date-fns";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface TransactionTableProps {
  transactions: Transaction[];
  onCategoryChange: (transactionId: string, newCategory: Category['name']) => void;
  allCategories: Category[];
  isPro: boolean;
}

type SortableColumn = 'merchant' | 'date' | 'amount';

const FREE_TIER_LIMIT = 15;

export function TransactionTable({
  transactions,
  onCategoryChange,
  allCategories,
  isPro
}: TransactionTableProps) {
  const [sortColumn, setSortColumn] = React.useState<SortableColumn>('date');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('desc');
  const { setIsPro } = useTiers();

  const handleSort = (column: SortableColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedTransactions = React.useMemo(() => {
    return [...transactions].sort((a, b) => {
      let comparison = 0;
      if (sortColumn === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortColumn === 'amount') {
        comparison = a.amount - b.amount;
      } else if (sortColumn === 'merchant') {
        comparison = a.merchant.localeCompare(b.merchant);
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [transactions, sortColumn, sortDirection]);
  
  const formatCurrency = (amount: number) => {
    const isNegative = amount < 0;
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Math.abs(amount));
    
    return isNegative ? `-${formatted}` : formatted;
  };
  
  const formatDate = (dateString: string) => {
    try {
        return format(parseISO(dateString), "MMM dd, yyyy");
    } catch {
        return dateString;
    }
  }

  const handleExportCSV = () => {
    const headers = ["Date", "Merchant", "Amount", "Category", "File Source"];
    const csvRows = [
      headers.join(','),
      ...sortedTransactions.map(t => [
        `"${formatDate(t.date)}"`,
        `"${t.merchant.replace(/"/g, '""')}"`,
        t.amount,
        `"${t.category}"`,
        `"${t.fileSource}"`
      ].join(','))
    ];
    
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.href) {
      URL.revokeObjectURL(link.href);
    }
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', 'transactions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

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

  const transactionsToShow = isPro ? sortedTransactions : sortedTransactions.slice(0, FREE_TIER_LIMIT);
  const hasMoreTransactions = !isPro && sortedTransactions.length > FREE_TIER_LIMIT;


  return (
    <Card className="card-interactive group">
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
            <CardTitle className="group-hover:text-primary transition-colors">All Transactions</CardTitle>
            <CardDescription>
              Review and re-categorize your transactions as needed. Click headers to sort.
            </CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={handleExportCSV} disabled={transactions.length === 0}>
            <FileDown className="mr-2 h-4 w-4" />
            Export as CSV
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto relative">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-muted/0">
                <SortableHeader column="merchant" label="Merchant" />
                <SortableHeader column="date" label="Date" />
                <SortableHeader column="amount" label="Amount" className="text-right" />
                <TableHead>
                    <div className="text-black dark:text-white font-semibold hover:text-primary transition-colors cursor-default text-center">Category</div>
                </TableHead>
                <TableHead>
                    <div className="text-black dark:text-white font-semibold hover:text-primary transition-colors cursor-default">Source</div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactionsToShow.length > 0 ? (
                transactionsToShow.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {transaction.merchant}
                    </TableCell>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell className={`text-right font-medium ${transaction.amount < 0 ? 'text-primary' : ''}`}>
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell className="w-[200px] text-center">
                      <Tooltip>
                        <TooltipTrigger asChild>
                           <Select
                            value={transaction.category}
                            onValueChange={(value: string) =>
                              onCategoryChange(transaction.id, value)
                            }
                          >
                            <SelectTrigger className="w-full h-9">
                              <SelectValue>
                                <div className="flex items-center gap-2">
                                    <CategoryIcon
                                        category={allCategories.find(c => c.name === transaction.category)}
                                        className="h-4 w-4"
                                    />
                                    <span className="text-sm font-medium">{transaction.category}</span>
                                </div>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {allCategories.map((cat) => (
                                <SelectItem key={cat.name} value={cat.name}>
                                  <div className="flex items-center">
                                    <CategoryIcon
                                      category={cat}
                                      className="mr-2 h-4 w-4"
                                    />
                                    {cat.name}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{transaction.category}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-muted-foreground truncate max-w-xs">{transaction.fileSource}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                    No transactions to display. Upload a statement to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {hasMoreTransactions && (
            <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-background to-transparent pointer-events-none" />
          )}
        </div>
        {hasMoreTransactions && (
            <div className="relative text-center p-8 border-t border-dashed rounded-b-lg -mt-px">
                <div className="flex flex-col items-center gap-2">
                    <Sparkles className="w-10 h-10 text-primary" />
                    <p className="font-semibold text-lg">Unlock All Transactions</p>
                    <p className="text-sm text-muted-foreground max-w-md">
                        You're viewing the latest {FREE_TIER_LIMIT} transactions. Upgrade to Pro to see your complete financial history.
                    </p>
                     <Button onClick={() => setIsPro(true)} className="mt-4">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Upgrade to Pro
                    </Button>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
