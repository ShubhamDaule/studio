
"use client";

import * as React from "react";
import Link from "next/link";
import { useTiers } from "@/hooks/use-tiers";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Lock, Star } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg border">
        {React.cloneElement(childElement, {
            className: cn(childElement.props.className, "blur-lg pointer-events-none opacity-50"),
            disabled: true
        })}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 text-center p-4">
        <div className="flex items-center gap-2 font-semibold text-lg mb-2">
            <Lock className="h-5 w-5 text-primary" />
            <span>{requiredTier}+ Feature</span>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
            Upgrade to the {requiredTier} plan to unlock this chart.
        </p>
        <Button asChild size="sm" className="btn-gradient-base btn-hover-fade">
            <Link href="/pricing">
                <Star className="mr-2 h-4 w-4" />
                Upgrade to {requiredTier}
            </Link>
        </Button>
      </div>
    </div>
  );
}
