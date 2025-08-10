
"use server";
import { generateInsights } from "@/ai/flows/generate-insights";
import { askAi } from "@/ai/flows/ask-ai-flow";
import type { Transaction, QueryResult, Budget } from "@/lib/types";

export async function getAIInsights(transactions: Transaction[]) {
  try {
    const spendingData = JSON.stringify(transactions.map(t => ({...t, amount: t.amount.toFixed(2)})));
    const result = await generateInsights({ spendingData });
    return { success: true, insights: result.insights };
  } catch (error) {
    console.error("Error generating AI insights:", error);
    return { success: false, error: "Failed to generate insights. Please try again." };
  }
}

export async function getAiQueryResponse(query: string, transactions: Transaction[], budgets: Budget[]): Promise<{ result?: QueryResult; error?: string }> {
    try {
        const transactionsJson = JSON.stringify(transactions.map(t => ({...t, amount: t.amount.toFixed(2)})));
        const budgetsJson = JSON.stringify(budgets);

        const result = await askAi({
            query,
            transactions: transactionsJson,
            budgets: budgetsJson,
        });
        
        return { result };

    } catch (e: any) {
        console.error("Error getting AI query response: ", e);
        return { error: e.message || "An unknown error occurred" };
    }
}
