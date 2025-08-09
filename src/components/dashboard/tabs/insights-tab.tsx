
"use client";

import * as React from "react";
import type { Transaction, Budget } from "@/lib/types";
import { AnomaliesCard } from "@/components/dashboard/cards/anomalies-card";
import { TipsPanel } from "@/components/dashboard/cards/tips-panel";
import { AskAiCard } from "@/components/dashboard/cards/ask-ai-card";


type InsightsTabProps = {
    allTransactions: Transaction[];
    budgets: Budget[];
};

export function InsightsTab({ allTransactions, budgets }: InsightsTabProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 items-start">
            <AnomaliesCard transactions={allTransactions} />
            <TipsPanel transactions={allTransactions} />
            <AskAiCard transactions={allTransactions} budgets={budgets} />
        </div>
    );
}
