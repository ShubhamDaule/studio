
"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Transaction, Anomaly } from "@/lib/types";
import { Sparkles, Wand2, Loader2 } from "lucide-react";
import { CategoryIcon } from "../../icons";
import { detectAnomalies } from "@/lib/analytics";
import { AnomalyDetective } from "../../characters/anomaly-detective";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useTiers, calculateAppTokens } from "@/hooks/use-tiers";
import { estimateTokens } from "@/lib/tokens";

interface AnomaliesCardProps {
  transactions: Transaction[];
}

const AnomalyItem = ({ anomaly, transaction }: { anomaly: Anomaly; transaction: Transaction | undefined }) => {
  if (!transaction) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
  };

  return (
    <Card className="bg-background/70 backdrop-blur-sm h-full flex flex-col">
        <CardHeader className="flex flex-row items-center gap-4">
            <CategoryIcon category={transaction.category} className="h-8 w-8 text-primary" />
            <CardTitle>{transaction.merchant}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 space-y-2">
            <div className="flex justify-between items-baseline">
                <span className="text-sm text-muted-foreground">{transaction.date}</span>
                <span className="font-bold text-lg text-primary">{formatCurrency(transaction.amount)}</span>
            </div>
            <p className="text-sm text-amber-700 dark:text-amber-500 pt-2 italic">
            &ldquo;{anomaly.reason}&rdquo;
            </p>
        </CardContent>
    </Card>
  );
};

export function AnomaliesCard({ transactions }: AnomaliesCardProps) {
  const { toast } = useToast();
  const { consumeTokens, tokenBalance } = useTiers();
  const [anomalies, setAnomalies] = React.useState<Anomaly[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    // Clear anomalies when transactions change
    setAnomalies([]);
  }, [transactions]);
  
  const estimatedTokens = React.useMemo(() => {
    const apiTokens = estimateTokens(JSON.stringify(transactions));
    return calculateAppTokens(apiTokens);
  }, [transactions]);

  const handleScan = async () => {
    if (tokenBalance < estimatedTokens) {
        toast({
            variant: "destructive",
            title: "Insufficient Tokens",
            description: `You need at least ${estimatedTokens.toFixed(1)} token(s) to use the Anomaly Detective.`,
        });
        return;
    }
    setIsLoading(true);
    toast({
      title: "Scanning for Anomalies",
      description: "The detective is on the case, analyzing your transactions...",
    });

    // This is a client-side "action", so token consumption is handled here.
    const apiTokens = estimateTokens(JSON.stringify(transactions));
    if(!consumeTokens(apiTokens)) {
        setIsLoading(false);
        return;
    }

    const result = await detectAnomalies(transactions);

    if (result.error || !result.anomalies) {
      toast({
        title: "Scan Failed",
        description: result.error || "An unknown error occurred.",
        variant: "destructive",
      });
      setAnomalies([]);
    } else {
      setAnomalies(result.anomalies);
      toast({
        title: "Scan Complete!",
        description: `Found ${result.anomalies.length} potential unusual transaction(s) for you to review.`,
      });
    }
    setIsLoading(false);
  };
  
  const transactionMap = React.useMemo(() => 
    new Map(transactions.map(t => [t.id, t])),
  [transactions]);

  return (
    <Card className="h-full flex flex-col overflow-hidden card-interactive group">
      <CardHeader className="z-10">
        <div className="flex items-center gap-3">
            <div className="w-20 h-20">
             <AnomalyDetective />
          </div>
            <div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">Anomaly Detective</CardTitle>
                <CardDescription>
                Use AI-powered statistical analysis to find unusual spending.
                </CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center items-center text-center">
        {isLoading ? (
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        ) : anomalies.length > 0 ? (
          <Carousel className="w-full max-w-sm" opts={{loop: true}}>
            <CarouselContent>
              {anomalies.map((anomaly) => (
                 <CarouselItem key={anomaly.transactionId}>
                  <div className="p-1">
                    <AnomalyItem
                        key={anomaly.transactionId}
                        anomaly={anomaly}
                        transaction={transactionMap.get(anomaly.transactionId)}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
             {anomalies.length > 1 && (
                <>
                    <CarouselPrevious className="-left-4" />
                    <CarouselNext className="-right-4" />
                </>
            )}
          </Carousel>
        ) : (
             <div className="flex flex-col items-center gap-2">
                <Wand2 className="w-10 h-10 text-primary" />
                <p className="font-semibold">Ready for inspection</p>
                <p className="text-sm text-muted-foreground max-w-xs">Click the button below to have the Detective inspect your spending.</p>
            </div>
        )}
      </CardContent>
       <CardFooter className="z-10">
        <Button
          onClick={handleScan}
          disabled={isLoading || transactions.length === 0}
          className="w-full"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          {isLoading ? "Analyzing..." : `Ask the Detective (${estimatedTokens.toFixed(1)} Token${estimatedTokens > 1 ? 's' : ''})`}
        </Button>
      </CardFooter>
    </Card>
  );
}
