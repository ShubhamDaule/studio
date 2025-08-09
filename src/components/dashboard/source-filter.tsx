
"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Banknote } from "lucide-react";

type SourceFilterProps = {
    files: string[];
    selectedSource: string;
    onSelectSource: (source: string) => void;
};

export function SourceFilter({ files, selectedSource, onSelectSource }: SourceFilterProps) {
    if (files.length <= 1) return null;

    return (
        <Select value={selectedSource} onValueChange={onSelectSource}>
            <SelectTrigger className="w-full sm:w-[240px] h-9">
                 <div className="flex items-center gap-2">
                    <Banknote className="h-4 w-4" />
                    <SelectValue placeholder="Filter by source..." />
                </div>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {files.map((file) => (
                    <SelectItem key={file} value={file}>
                        {file}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
