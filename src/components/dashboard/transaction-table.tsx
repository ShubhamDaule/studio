
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
import { ArrowUp, ArrowDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTiers } from "@/hooks/use-tiers";
import { format, parseISO } from "date-fns";

interface TransactionTableProps {
  transactions: Transaction[];
  onCategoryChange: (transactionId: string, newCategory: Category) => void;
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
        return format(parseISO(dateString), "PPP");
    } catch {
        return dateString;
    }
  }

  const SortableHeader = ({ column, label, className }: { column: SortableColumn, label: string, className?: string }) => (
    <TableHead className={cn('font-semibold', className)}>
        <Button 
          variant="ghost" 
          onClick={() => handleSort(column)} 
          className="px-2 py-1 h-auto -ml-2 text-foreground font-semibold hover:bg-muted"
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
    <Card>
      <CardHeader>
        <CardTitle>All Transactions</CardTitle>
        <CardDescription>
          Review and re-categorize your transactions as needed. Click headers to sort.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto relative">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-muted/0">
                <SortableHeader column="merchant" label="Merchant" />
                <SortableHeader column="date" label="Date" />
                <SortableHeader column="amount" label="Amount" className="text-right" />
                <TableHead className="text-center font-semibold">Category</TableHead>
                <TableHead className="font-semibold">Source</TableHead>
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
                    <TableCell className="w-[200px]">
                      <Select
                        value={transaction.category as string}
                        onValueChange={(value: string) =>
                          onCategoryChange(transaction.id, value as Category)
                        }
                      >
                        <SelectTrigger className="border-0 bg-transparent shadow-none hover:bg-muted focus:ring-0">
                          <SelectValue>
                            <Badge variant="outline" className="py-1 border-border font-normal text-foreground">
                              <CategoryIcon
                                category={transaction.category}
                                className="mr-2 h-4 w-4"
                              />
                              {transaction.category}
                            </Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {allCategories.map((cat) => (
                            <SelectItem key={cat as string} value={cat as string}>
                              <div className="flex items-center">
                                <CategoryIcon
                                  category={cat}
                                  className="mr-2 h-4 w-4"
                                />
                                {cat}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
