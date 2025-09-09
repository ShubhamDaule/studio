
"use client";

import * as React from "react";
import Link from "next/link";
import { useTiers } from "@/hooks/use-tiers";
import { cn } from "@/lib/utils";
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
    <div className="relative w-full h-full overflow-hidden rounded-lg">
        {React.cloneElement(childElement, {
            className: cn(childElement.props.className, "blur-md pointer-events-none opacity-50"),
            disabled: true
        })}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/40 text-center p-4">
        <div className="p-4 bg-background/80 backdrop-blur-sm rounded-lg shadow-lg flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 font-semibold">
                 <Lock className="h-5 w-5 text-primary" />
                 <span>{requiredTier}+ Feature</span>
            </div>
            <p className="text-sm text-muted-foreground">
                This feature is only available on the {requiredTier} plan.
            </p>
            <Button asChild size="sm" className="mt-1 w-full btn-gradient-base btn-hover-fade">
                <Link href="/pricing">
                    <Star className="mr-2 h-4 w-4" />
                    Upgrade to {requiredTier}
                </Link>
            </Button>
        </div>
      </div>
    </div>
  );
}
