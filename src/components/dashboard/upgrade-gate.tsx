
"use client";

import * as React from "react";
import Link from "next/link";
import { useTiers } from "@/hooks/use-tiers";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Lock, Star } from "lucide-react";

type UpgradeGateProps = {
  children: React.ReactNode;
  requiredTier: "Pro" | "Premium";
};

export function UpgradeGate({ children, requiredTier }: UpgradeGateProps) {
  const { isPro, isPremium } = useTiers();

  const hasAccess = requiredTier === "Pro" ? isPro : isPremium;

  if (hasAccess) {
    return <>{children}</>;
  }
  
  const childElement = React.Children.only(children) as React.ReactElement;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="relative w-full h-full">
            {React.cloneElement(childElement, {
                className: cn(childElement.props.className, "blur-sm pointer-events-none opacity-60"),
                disabled: true
            })}
          <div className="absolute inset-0 flex items-center justify-center bg-background/30 rounded-lg">
            <Lock className="h-6 w-6 text-foreground/80" />
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent>
         <div className="flex flex-col items-center gap-2 p-1 max-w-xs">
            <p className="font-semibold flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> 
                {requiredTier}+ Feature
            </p>
            <p className="text-muted-foreground text-center">
                This feature is available for {requiredTier} and higher plans.
            </p>
            <Button asChild size="sm" className="mt-1 w-full btn-gradient-base btn-hover-fade">
                <Link href="/pricing">Upgrade to {requiredTier}</Link>
            </Button>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
