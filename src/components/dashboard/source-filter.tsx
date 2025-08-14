
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
            <SelectTrigger 
                className={cn(
                    "w-auto justify-start text-left font-normal h-9 px-3 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground data-[placeholder]:text-muted-foreground",
                    !selectedSource && "text-muted-foreground"
                )}
                
            >
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
