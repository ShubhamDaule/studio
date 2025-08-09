
"use client";
import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Lightbulb, TrendingDown, Repeat } from 'lucide-react';
import type { Transaction } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

type Tip = {
  icon: React.ElementType;
  title: string;
  description: string;
};

const generateTips = (transactions: Transaction[]): Tip[] => {
    const tips: Tip[] = [];
    if (transactions.length === 0) return tips;

    // Tip 1: Top Spending Category
    const spendingByCategory: { [key: string]: number } = {};
    transactions.filter(t => t.amount > 0 && t.category !== "Payment" && t.category !== "Investment").forEach(t => {
        spendingByCategory[t.category] = (spendingByCategory[t.category] || 0) + t.amount;
    });

    const topCategory = Object.entries(spendingByCategory).sort(([,a],[,b]) => b - a)[0];
    if (topCategory) {
        tips.push({
            icon: TrendingDown,
            title: `Focus on ${topCategory[0]}`,
            description: `Your highest spending is in ${topCategory[0]}. Look for ways to reduce costs there.`,
        });
    }

    // Tip 2: Recurring Subscriptions
    const potentialSubscriptions = transactions.filter(t => {
        const desc = t.merchant.toLowerCase();
        return ['netflix', 'spotify', 'hulu', 'disney', 'amazon prime'].some(sub => desc.includes(sub));
    });
    if (potentialSubscriptions.length > 0) {
        tips.push({
            icon: Repeat,
            title: 'Review Subscriptions',
            description: 'We noticed a few subscriptions. Are you using all of them?',
        });
    }
    
    // Generic Tip
    tips.push({
        icon: Lightbulb,
        title: 'Set a Budget',
        description: 'Use the budgeting tab to set spending goals and track your progress throughout the month.'
    });

    return tips.slice(0, 3);
};


export const TipsPanel = ({ transactions }: { transactions: Transaction[] }) => {
    const [tips, setTips] = React.useState<Tip[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    
    React.useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            const generated = generateTips(transactions);
            setTips(generated);
            setIsLoading(false);
        }, 500);
    }, [transactions]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Financial Tips</CardTitle>
                <CardDescription>Personalized advice to improve your finances.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                             <div key={i} className="flex items-start gap-4">
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-1/3" />
                                    <Skeleton className="h-4 w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {tips.map((tip, index) => (
                            <div key={index} className="flex items-start gap-4">
                                <div className="bg-primary/10 text-primary p-2 rounded-full">
                                    <tip.icon className="h-4 w-4" />
                                </div>
                                <div>
                                    <h4 className="font-semibold">{tip.title}</h4>
                                    <p className="text-sm text-muted-foreground">{tip.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
