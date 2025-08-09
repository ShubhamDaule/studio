
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type StatsCardProps = {
  title: string;
  value: string;
  icon: ReactNode;
  description?: string;
  onClick?: () => void;
};

export default function StatsCard({ title, value, icon, description, onClick }: StatsCardProps) {
  return (
    <Card 
        onClick={onClick} 
        className={cn(
            "transition-smooth", 
            onClick && "card-interactive"
        )}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
}
