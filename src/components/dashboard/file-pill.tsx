
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import type { TransactionFile } from "@/lib/types";
import { Banknote, X } from "lucide-react";

type Props = {
  file: TransactionFile;
  onDelete: () => void;
};

export function FilePill({ file, onDelete }: Props) {
  return (
    <div className="flex items-center gap-2 bg-background rounded-full border p-1 pl-3 pr-2 shadow-sm">
        <Banknote className="w-4 h-4 text-muted-foreground" />
        <div className="flex flex-col">
            <span className="text-sm font-medium leading-tight">{file.bankName}</span>
            <span className="text-xs text-muted-foreground leading-tight">{file.fileName}</span>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={onDelete}>
            <X className="w-4 h-4" />
        </Button>
    </div>
  );
}
