
"use server";
import type { Transaction, QueryResult, Budget } from "@/lib/types";

// The AI-related functions have been removed as per the user's request.
// You can re-implement them here if you wish to add AI features back.

export async function getAIInsights(transactions: Transaction[]) {
  console.log("getAIInsights called, but is disabled.");
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  return { success: false, error: "AI insights are currently disabled." };
}

export async function getAiQueryResponse(query: string, transactions: Transaction[], budgets: Budget[]): Promise<{ result?: QueryResult; error?: string }> {
    console.log("getAiQueryResponse called, but is disabled.");
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    return { error: "Ask AI feature is currently disabled." };
}
