
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Category, Transaction } from "@/lib/types";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "../ui/button";

type TransactionTableProps = {
  transactions: Transaction[];
  onCategoryChange: (transactionId: string, newCategory: Category) => void;
  allCategories: Category[];
  isPro: boolean;
};

export function TransactionTable({ transactions, onCategoryChange, allCategories, isPro }: TransactionTableProps) {
    const [currentPage, setCurrentPage] = React.useState(1);
    const transactionsPerPage = 10;
    
    const paginatedTransactions = transactions.slice(
        (currentPage - 1) * transactionsPerPage,
        currentPage * transactionsPerPage
    );
    
    const totalPages = Math.ceil(transactions.length / transactionsPerPage);

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Transactions</CardTitle>
        <CardDescription>A detailed list of your recent transactions.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Merchant</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {paginatedTransactions.map((t) => (
                <TableRow key={t.id}>
                    <TableCell className="whitespace-nowrap">{format(new Date(t.date), "PPP")}</TableCell>
                    <TableCell className="font-medium">{t.merchant}</TableCell>
                    <TableCell>
                      {isPro ? (
                        <Select
                            value={t.category}
                            onValueChange={(newCategory: Category) => onCategoryChange(t.id, newCategory)}
                        >
                            <SelectTrigger className="w-auto sm:w-40 h-8 text-xs sm:text-sm">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {allCategories.map(cat => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                      ) : (
                        t.category
                      )}
                    </TableCell>
                    <TableCell className={`text-right font-medium whitespace-nowrap ${t.amount < 0 ? 'text-green-600' : ''}`}>
                    {t.amount < 0 ? `-$${Math.abs(t.amount).toFixed(2)}` : `$${t.amount.toFixed(2)}`}
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </div>
         <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Showing {Math.min(transactions.length, (currentPage - 1) * transactionsPerPage + 1)}-{Math.min(transactions.length, currentPage * transactionsPerPage)} of {transactions.length} transactions.
          </p>
          <div className="flex gap-2">
            <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
            >
                Previous
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
            >
                Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
