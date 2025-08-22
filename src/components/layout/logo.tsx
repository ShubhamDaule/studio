
"use client";

import { BarChart3 } from "lucide-react";

export function Logo() {
    return (
        <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="hidden sm:inline-block text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent whitespace-nowrap">
                MySpendWise
            </span>
        </div>
    );
}
