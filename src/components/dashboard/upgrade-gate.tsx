
"use client";

import * as React from "react";
import Link from "next/link";
import { useTiers } from "@/hooks/use-tiers";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Lock, Star, Crown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent } from "../ui/card";

type UpgradeGateProps = {
  children: React.ReactNode;
  requiredTier: "Pro" | "Premium";
  type: "tab" | "card";
};

export function UpgradeGate({ children, requiredTier, type }: UpgradeGateProps) {
  const { isPro, isPremium } = useTiers();

  const hasAccess = requiredTier === "Pro" ? isPro : isPremium;

  if (hasAccess) {
    return <>{children}</>;
  }
  
  const childElement = React.Children.only(children) as React.ReactElement;

  if (type === 'tab') {
      return (
        <Tooltip>
            <TooltipTrigger asChild>
                {React.cloneElement(childElement, {
                    className: cn(childElement.props.className, "pointer-events-none opacity-50 flex items-center gap-2"),
                    children: (
                        <>
                            {childElement.props.children}
                            <Lock className="h-4 w-4" />
                        </>
                    )
                })}
            </TooltipTrigger>
            <TooltipContent>
                 <div className="flex flex-col gap-2 p-1 max-w-xs text-center">
                    <p className="font-semibold flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500"/> {requiredTier} Feature
                    </p>
                    <p className="text-muted-foreground text-xs">
                        This feature is only available on the {requiredTier} plan.
                    </p>
                    <Button asChild size="sm" className="mt-1"><Link href="/pricing">Upgrade to {requiredTier}</Link></Button>
                </div>
            </TooltipContent>
        </Tooltip>
      )
  }

  // Card type
  const cardHeader = React.Children.map(childElement.props.children, child => {
    if (React.isValidElement(child) && (child.type as any).displayName === 'CardHeader') {
        return child;
    }
    return null;
  });

  return (
    <Card className="h-full flex flex-col bg-muted/30">
        {cardHeader}
        <CardContent className="flex-1 flex flex-col items-center justify-center text-center p-4">
             <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Crown className="h-6 w-6 text-primary" />
            </div>
            <p className="font-semibold text-lg text-foreground/90">{requiredTier} Feature</p>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs">
                Upgrade to the {requiredTier} plan to unlock this chart.
            </p>
            <Button asChild size="sm" className="btn-gradient-base btn-hover-fade">
                <Link href="/pricing">
                    <Crown className="mr-2 h-4 w-4" />
                    Upgrade to {requiredTier}
                </Link>
            </Button>
        </CardContent>
    </Card>
  );
}
