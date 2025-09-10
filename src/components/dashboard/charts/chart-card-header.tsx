
"use client";

import * as React from "react";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Expand, type LucideIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type ChartCardHeaderProps = {
    title: string;
    description: string;
    Icon: LucideIcon;
    onExpand?: () => void;
    isExpandable?: boolean;
};

export const ChartCardHeader = ({ title, description, Icon, onExpand, isExpandable = true }: ChartCardHeaderProps) => {
    return (
        <CardHeader>
            <div className="flex items-start justify-between">
                <div>
                    <CardTitle className='flex items-center gap-2 group-hover:text-primary transition-colors'>
                        <Icon className="h-6 w-6" />
                        {title}
                    </CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
                {isExpandable && onExpand && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" onClick={onExpand}>
                                <Expand className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Expand Chart</p>
                        </TooltipContent>
                    </Tooltip>
                )}
            </div>
        </CardHeader>
    );
};
