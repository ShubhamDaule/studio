
"use client";
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from 'lucide-react';
import type { Budget, BudgetOverride, Category, Transaction } from "@/lib/types";
import { Label } from "@/components/ui/label";

type Props = {
    defaultBudgets: Budget[];
    activeBudgets: Budget[];
    onMultipleBudgetChange: (budgets: Budget[]) => void;
    transactions: Transaction[];
    onTransactionsUpdate: (transactions: Transaction[]) => void;
    onIncomeDetailsChange: (details: any) => void;
    availableMonths: string[];
    onSetBudgetOverride: (override: BudgetOverride) => void;
    allCategories: Category[];
    setAllCategories: (categories: Category[]) => void;
    budgetOverrides: BudgetOverride[];
    onDeleteBudgetOverride: (month: string, category: Category) => void;
};

export function BudgetingTab({
    defaultBudgets,
    activeBudgets,
    onMultipleBudgetChange,
    availableMonths,
    onSetBudgetOverride,
    allCategories,
    budgetOverrides,
    onDeleteBudgetOverride
}: Props) {
    const [localBudgets, setLocalBudgets] = React.useState(defaultBudgets);
    const [selectedMonth, setSelectedMonth] = React.useState(availableMonths[0] || "");

    React.useEffect(() => {
        setLocalBudgets(defaultBudgets);
    }, [defaultBudgets]);

    const handleBudgetChange = (category: Category, amount: number) => {
        const newBudgets = localBudgets.map(b => 
            b.category === category ? { ...b, amount } : b
        );
        const budgetExists = newBudgets.some(b => b.category === category);
        if (!budgetExists) {
            newBudgets.push({ category, amount });
        }
        setLocalBudgets(newBudgets);
    };

    const handleSaveDefaults = () => {
        onMultipleBudgetChange(localBudgets);
    };

    const handleOverrideChange = (category: Category, amount: string) => {
        if (selectedMonth && !isNaN(parseFloat(amount))) {
            onSetBudgetOverride({
                month: selectedMonth,
                category,
                amount: parseFloat(amount)
            });
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle>Monthly Budgets</CardTitle>
                    <CardDescription>
                        Set your default monthly budget for each category. These can be overridden for specific months.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Category</TableHead>
                                <TableHead className="text-right">Budget Amount ($)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {allCategories.filter(c => c !== 'Payment' && c !== 'Investment' && c !== 'Cash').map(category => (
                                <TableRow key={category}>
                                    <TableCell>{category}</TableCell>
                                    <TableCell className="text-right">
                                        <Input
                                            type="number"
                                            className="w-32 ml-auto"
                                            value={localBudgets.find(b => b.category === category)?.amount || ''}
                                            onChange={(e) => handleBudgetChange(category, parseFloat(e.target.value) || 0)}
                                            placeholder="0.00"
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Button onClick={handleSaveDefaults} className="mt-4">Save Default Budgets</Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Budget Overrides</CardTitle>
                    <CardDescription>
                        Set a specific budget for a category in a single month.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a month" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableMonths.map(month => (
                                    <SelectItem key={month} value={month}>{month}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                            {allCategories.filter(c => c !== 'Payment' && c !== 'Investment' && c !== 'Cash').map(category => {
                                const override = budgetOverrides.find(o => o.month === selectedMonth && o.category === category);
                                return (
                                <div key={category} className="flex items-center gap-2">
                                    <Label className="flex-1">{category}</Label>
                                    <Input
                                        type="number"
                                        placeholder="Override amount"
                                        className="w-32"
                                        value={override?.amount || ""}
                                        onChange={(e) => handleOverrideChange(category, e.target.value)}
                                    />
                                    {override && (
                                        <Button variant="ghost" size="icon" onClick={() => onDeleteBudgetOverride(selectedMonth, category)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            )})}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
