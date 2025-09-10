
"use client";

import * as React from "react";
import { AnomaliesCard } from "@/components/dashboard/cards/anomalies-card";
import { FinancialCoachCard } from "@/components/dashboard/cards/financial-coach-card";
import { AskAiCard } from "@/components/dashboard/cards/ask-ai-card";
import { useDashboardContext } from "@/context/dashboard-context";
import { useBudgets } from "@/hooks/useBudgets";
import { UpgradeGate } from "@/components/dashboard/upgrade-gate";
import { BrainCircuit } from "lucide-react";

/**
 * Renders the "AI Insights" tab in the dashboard.
 * This tab contains interactive cards that provide AI-driven financial analysis.
 */
export function InsightsTab() {
    // Access data and functionality from the dashboard's main context.
    const { allTransactions, allCategories, filteredTransactions: transactions, dateRange } = useDashboardContext();
    // Get budget data for the current context.
    const { activeBudgets } = useBudgets({allCategories, transactions, dateRange});
    
    // Memoize the calculation of spending transactions to avoid re-computation on every render.
    // Filters out payments and investments to focus on actual spending.
    const spendingTransactions = React.useMemo(() => 
        allTransactions.filter(t => t.amount > 0 && t.category !== "Payment" && t.category !== "Investment"),
    [allTransactions]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 items-start">
            {/* Card for generating high-level financial advice */}
            <FinancialCoachCard transactions={spendingTransactions} />
            {/* Card for detecting unusual spending patterns */}
            <AnomaliesCard transactions={spendingTransactions} />
            {/* Card for asking natural language questions about financial data */}
            <UpgradeGate 
                requiredTier="Pro" 
                type="card"
                title="Ask AI"
                description="Ask questions about your finances in plain English."
                icon={<BrainCircuit className="h-6 w-6" />}
            >
                <AskAiCard transactions={allTransactions} budgets={activeBudgets} />
            </UpgradeGate>
        </div>
    );
}
