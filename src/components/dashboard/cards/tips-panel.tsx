
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { getSpendingTips } from "@/lib/actions";
import type { Transaction, Tip } from "@/lib/types";
import { Lightbulb, Sparkles, icons, type LucideIcon, ListChecks } from "lucide-react";
import { useTiers } from "@/hooks/use-tiers";
import { FinancialCoach } from "../../characters/financial-coach";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TipsPanelProps {
  transactions: Transaction[];
}

const TipCard = ({ tip }: { tip: Tip }) => {
    const Icon = (icons as Record<string, LucideIcon>)[tip.icon] || Lightbulb;
    return (
        <Card className="bg-background/70 backdrop-blur-sm h-full flex flex-col">
            <CardHeader className="flex flex-row items-center gap-4">
                <Icon className="w-8 h-8 text-primary" />
                <CardTitle>{tip.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground">{tip.description}</p>
            </CardContent>
        </Card>
    );
};


export function TipsPanel({ transactions }: TipsPanelProps) {
  const [tips, setTips] = React.useState<Tip[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();
  const { isPro } = useTiers();

  const handleGenerateTips = React.useCallback(async () => {
    if (!isPro) {
        toast({
            title: "Pro Feature",
            description: "Personalized AI tips are a Pro feature. Please upgrade to use.",
            variant: "destructive",
        });
        return;
    }

    if (transactions.length === 0) {
      setTips([{
        icon: 'Smile',
        title: "No data yet!",
        description: "No transactions to analyze. Upload a statement to get started."
      }]);
      return;
    }

    setIsLoading(true);
    setTips([]);
    const result = await getSpendingTips(transactions);
    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
      setTips([]);
    } else {
      setTips(result.tips || []);
      if (!result.tips || result.tips.length === 0) {
        toast({
            title: "No specific tips could be generated at this time."
        });
      }
    }
    setIsLoading(false);
  }, [transactions, toast, isPro]);
  
  // When transactions change, clear tips
  React.useEffect(() => {
    setTips([]);
  }, [transactions]);


  return (
    <Card className="h-full flex flex-col overflow-hidden bg-muted/20 card-interactive group">
      <CardHeader className="z-10">
        <div className="flex items-center gap-3">
          <div className="w-20 h-20">
             <FinancialCoach />
          </div>
          <div>
            <CardTitle className="text-xl group-hover:text-primary transition-colors">Financial Coach</CardTitle>
            <p className="text-sm text-muted-foreground">
              {isPro ? "AI-powered savings tips just for you." : "Unlock AI savings tips with Pro."}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center items-center text-center">
        {isLoading ? (
          <div className="w-full max-w-sm p-4">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ) : tips.length > 0 ? (
          <Carousel className="w-full max-w-sm" opts={{loop: true}}>
            <CarouselContent>
              {tips.map((tip, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <TipCard tip={tip} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {tips.length > 1 && (
                <>
                    <CarouselPrevious className="-left-4" />
                    <CarouselNext className="-right-4" />
                </>
            )}
          </Carousel>
        ) : (
          <div className="flex flex-col items-center gap-2">
            {isPro ? (
                <>
                    <Lightbulb className="w-10 h-10 text-primary" />
                    <p className="font-semibold">Ready for your insights?</p>
                    <p className="text-sm text-muted-foreground max-w-xs">Click the button below to have your Financial Coach analyze your spending.</p>
                </>
            ) : (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="text-center cursor-help">
                                <Sparkles className="w-10 h-10 text-primary mx-auto" />
                                <p className="font-semibold mt-2">Unlock AI-Powered Insights</p>
                                <p className="text-sm text-muted-foreground max-w-xs">Upgrade to Pro to get personalized tips from your Financial Coach.</p>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className="p-0 max-w-sm" side="top" align="center">
                            <div className="space-y-3 p-2">
                                <p className="text-center font-bold text-lg text-primary">Unlock Pro Features!</p>
                                <ul className="list-none space-y-2 text-sm text-foreground text-left">
                                    <li className="flex items-start gap-2">
                                        <ListChecks className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                        <span>Advanced date filtering and detailed analytics charts.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <ListChecks className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                        <span>Full budgeting suite to set, track, and manage your financial goals.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <ListChecks className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                        <span>Export all your cleaned and categorized transaction data to CSV.</span>
                                    </li>
                                </ul>
                            </div>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="z-10">
        <Button
          onClick={() => handleGenerateTips()}
          disabled={isLoading || !isPro}
          className="w-full"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          {isLoading ? "Analyzing..." : "Ask the Coach"}
        </Button>
      </CardFooter>
    </Card>
  );
}
