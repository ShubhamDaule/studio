
"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

type HighestDay = {
    date: string;
    total: number;
} | null;

export function HighestDayCard({ day, onClick }: { day: HighestDay, onClick: () => void }) {
  return (
    <Card className="cursor-pointer hover:bg-muted/50" onClick={onClick}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Highest Spending Day</CardTitle>
        <Calendar className="h-4 w-4 text-muted-foreground" />
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
                    on {format(new Date(day.date), "PPP")}
                </p>
            </>
        ) : (
            <p className="text-sm text-muted-foreground pt-2">No spending data.</p>
        )}
      </CardContent>
    </Card>
  );
}
