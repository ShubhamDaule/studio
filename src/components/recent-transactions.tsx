import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Transaction } from "@/lib/types"
import { cn } from "@/lib/utils"

type RecentTransactionsProps = {
  data: Transaction[];
};

export const categoryColors: Record<Transaction['category'], string> = {
  'Food': 'bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30',
  'Shopping': 'bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30',
  'Utilities': 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30',
  'Entertainment': 'bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-500/30',
  'Travel': 'bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-500/30',
  'Health': 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30',
  'Income': 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
  'Other': 'bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-500/30',
};

export default function RecentTransactions({ data }: RecentTransactionsProps) {
  const recent = [...data]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your 5 most recent transactions.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead className="text-center">Category</TableHead>
              <TableHead className="hidden text-right sm:table-cell">Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recent.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.description}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className={cn("font-normal", categoryColors[transaction.category])}>
                    {transaction.category}
                  </Badge>
                </TableCell>
                <TableCell className="hidden text-right sm:table-cell">{new Date(transaction.date).toLocaleDateString()}</TableCell>
                <TableCell className={cn(
                  "text-right font-semibold",
                  transaction.amount > 0 ? "text-emerald-600" : "text-slate-800 dark:text-slate-300"
                )}>
                  {transaction.amount > 0 ? `+` : `-`}$ {Math.abs(transaction.amount).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
