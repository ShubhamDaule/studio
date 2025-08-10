
"use server";
import { generateInsights } from "@/ai/flows/generate-insights";
import type { Transaction, QueryResult, Budget } from "@/lib/types";

// The AI-related functions have been removed as per the user's request.
// You can re-implement them here if you wish to add AI features back.

export async function getAIInsights(transactions: Transaction[]) {
  if (!transactions || transactions.length === 0) {
    return { success: false, error: "No transactions to analyze." };
  }

  try {
    const insights = await generateInsights(transactions);
    return { success: true, insights };
  } catch (e: any) {
    console.error("Error getting AI insights:", e);
    return { success: false, error: e.message || "An unknown error occurred." };
  }
}

export async function getAiQueryResponse(query: string, transactions: Transaction[], budgets: Budget[]): Promise<{ result?: QueryResult; error?: string }> {
    console.log("getAiQueryResponse called, but is disabled.");
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    return { error: "Ask AI feature is currently disabled." };
}
