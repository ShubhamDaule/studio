
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import type { Transaction } from "@/lib/types";
import { format } from "date-fns";
import { parseISO } from "date-fns";

interface HighestTransactionCardProps {
    transaction: Transaction | null;
    onClick: () => void;
}

export function HighestTransactionCard({ transaction, onClick }: HighestTransactionCardProps) {
    const [formattedDate, setFormattedDate] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (transaction?.date) {
             try {
                const date = parseISO(transaction.date);
                if (!isNaN(date.getTime())) {
                    setFormattedDate(format(date, "MMM dd, yyyy"));
                } else {
                    setFormattedDate('Invalid Date');
                }
            } catch (error) {
                console.error("Invalid date provided to HighestTransactionCard:", transaction.date);
                setFormattedDate('Invalid Date');
            }
        }
    }, [transaction]);


    return (
        <Card className="card-interactive group" onClick={onClick}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">Highest Single Transaction</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {transaction ? (
                    <>
                        <div className="text-2xl font-bold text-primary">
                            {transaction.amount.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                            })}
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                            to {transaction.merchant} on {formattedDate || '...'}
                        </p>
                    </>
                ) : (
                    <div className="text-2xl font-bold text-primary">$0.00</div>
                )}
            </CardContent>
        </Card>
    );
}
