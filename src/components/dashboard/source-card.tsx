
"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { FinancialSource } from "@/lib/types";
import { Banknote, FileText, Trash } from "lucide-react";
import { Badge } from "../ui/badge";

type Props = {
  source: FinancialSource;
  onDelete: () => void;
};

export function SourceCard({ source, onDelete }: Props) {
  return (
    <Card className="flex flex-col group card-interactive">
      <CardHeader className="flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
            <Banknote className="w-5 h-5 text-primary" />
            {source.name}
        </CardTitle>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={onDelete}>
            <Trash className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <Badge variant="secondary">{source.type}</Badge>
        <CardDescription className="mt-2 text-xs flex items-center gap-1">
            <FileText className="w-3 h-3" />
            {source.fileNames.length} file(s) uploaded
        </CardDescription>
      </CardContent>
    </Card>
  );
}
