
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import type { TransactionFile } from "@/lib/types";
import { Banknote, X, Save, Star, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTiers } from "@/hooks/use-tiers";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import Link from "next/link";


type Props = {
  file: TransactionFile;
  onDelete: () => void;
  onSave: () => void;
};

export function FilePill({ file, onDelete, onSave }: Props) {
  const { isPremium } = useTiers();

  const SaveButton = () => {
    if (file.isSaved) {
        return (
            <div className="flex items-center gap-1 text-xs text-primary font-medium pr-2">
                <CheckCircle className="w-4 h-4" />
                Saved
            </div>
        )
    }

    const saveButton = (
        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={onSave} disabled={!isPremium || file.isSaved}>
            <Save className={cn("w-4 h-4", !isPremium && "text-muted-foreground/50")} />
        </Button>
    );

    if (isPremium) {
        return (
             <Tooltip>
                <TooltipTrigger asChild>{saveButton}</TooltipTrigger>
                <TooltipContent><p>Save transactions (2 tokens)</p></TooltipContent>
            </Tooltip>
        )
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>{saveButton}</TooltipTrigger>
            <TooltipContent>
                <div className="flex flex-col gap-2 p-1 max-w-xs">
                    <p className="font-semibold flex items-center gap-2"><Star className="w-4 h-4 text-yellow-500"/> Premium Feature</p>
                    <p className="text-muted-foreground">Store transactions from this file permanently.</p>
                    <Button asChild size="sm" className="mt-1"><Link href="/pricing">Upgrade to Premium</Link></Button>
                </div>
            </TooltipContent>
        </Tooltip>
    )
  }

  return (
    <div className="flex items-center gap-2 bg-background rounded-full border p-1 pl-3 pr-2 shadow-sm">
        <Banknote className="w-4 h-4 text-muted-foreground" />
        <div className="flex flex-col items-start">
             <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-medium leading-tight">{file.bankName}</span>
                <span className="text-xs text-primary/80 font-medium leading-tight">({file.statementType})</span>
            </div>
            <span className="text-xs text-muted-foreground leading-tight">{file.fileName}</span>
        </div>
        <div className="flex items-center">
            <SaveButton />
             <Tooltip>
                <TooltipTrigger asChild>
                     <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={onDelete}>
                        <X className="w-4 h-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>Remove file and transactions</p></TooltipContent>
            </Tooltip>
        </div>
    </div>
  );
}
