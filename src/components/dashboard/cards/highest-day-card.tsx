
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";
import { format } from 'date-fns';
import { parseISO } from 'date-fns';

interface HighestDayCardProps {
    day: { date: string; total: number } | null;
    onClick: () => void;
}

export function HighestDayCard({ day, onClick }: HighestDayCardProps) {
    const [formattedDate, setFormattedDate] = React.useState<string | null>(null);
    
    React.useEffect(() => {
        if (day?.date) {
            try {
                const date = parseISO(day.date);
                if (!isNaN(date.getTime())) {
                    setFormattedDate(format(date, "MMMM do, yyyy"));
                } else {
                    setFormattedDate('Invalid Date');
                }
            } catch (error) {
                console.error("Invalid date provided to HighestDayCard:", day.date);
                setFormattedDate('Invalid Date');
            }
        }
    }, [day]);

    return (
        <Card className="card-interactive group" onClick={onClick}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">Highest Spending Day</CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {day ? (
                    <>
                        <div className="text-2xl font-bold text-primary">
                            {day.total.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                            })}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            on {formattedDate || '...'}
                        </p>
                    </>
                ) : (
                    <div className="text-2xl font-bold text-primary">$0.00</div>
                )}
            </CardContent>
        </Card>
    );
}
