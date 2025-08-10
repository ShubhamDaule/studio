
"use client";

import * as React from "react";
import type { Transaction, Budget } from "@/lib/types";
import { AnomaliesCard } from "@/components/dashboard/cards/anomalies-card";
import { FinancialCoachCard } from "@/components/dashboard/cards/financial-coach-card";
import { AskAiCard } from "../cards/ask-ai-card";


type InsightsTabProps = {
    allTransactions: Transaction[];
    budgets: Budget[];
};

export function InsightsTab({ allTransactions, budgets }: InsightsTabProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 items-start">
            <FinancialCoachCard transactions={allTransactions} />
            <AnomaliesCard transactions={allTransactions} />
            <AskAiCard transactions={allTransactions} budgets={budgets} />
        </div>
    );
}
