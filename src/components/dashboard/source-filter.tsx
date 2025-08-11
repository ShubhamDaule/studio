
"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Banknote } from "lucide-react";

type SourceFilterProps = {
    sources: string[];
    selectedSource: string;
    onSelectSource: (source: string) => void;
};

export function SourceFilter({ sources, selectedSource, onSelectSource }: SourceFilterProps) {
    if (sources.length <= 1) return null;
    
    return (
        <Select value={selectedSource} onValueChange={onSelectSource}>
            <SelectTrigger className={cn("w-auto h-9 hover:bg-primary/10")}>
                 <div className="flex items-center gap-2">
                    <Banknote className="h-4 w-4" />
                    <SelectValue placeholder="Filter by source..." />
                </div>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {sources.map((source) => (
                    <SelectItem key={source} value={source}>
                        {source}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
