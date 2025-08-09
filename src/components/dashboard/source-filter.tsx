
"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type SourceFilterProps = {
    files: string[];
    selectedSource: string;
    onSelectSource: (source: string) => void;
};

export function SourceFilter({ files, selectedSource, onSelectSource }: SourceFilterProps) {
    if (files.length <= 1) return null;

    return (
        <Select value={selectedSource} onValueChange={onSelectSource}>
            <SelectTrigger className="w-full sm:w-[180px] h-9">
                <SelectValue placeholder="Filter by source..." />
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
