
"use server";
import { generateInsights } from "@/ai/flows/generate-insights";
import { askAi } from "@/ai/flows/ask-ai-flow";
import { categorizeTransactions as categorizeTransactionsFlow, type RawTransaction } from "@/ai/flows/categorize-transactions";
import type { Transaction, QueryResult, Budget, ExtractedTransaction } from "@/lib/types";


function getFriendlyErrorMessage(error: any): string {
    const defaultMessage = 'An unexpected error occurred. Please try again.';
    if (!error || !error.message) {
        return defaultMessage;
    }
    const errorMessage = error.message as string;
    if (errorMessage.includes('429') || errorMessage.toLowerCase().includes('too many requests') || errorMessage.toLowerCase().includes('exceeded your current quota')) {
        return 'The AI service has reached its request limit. Please try again in a few moments.';
    }
    if (errorMessage.includes('503') || errorMessage.toLowerCase().includes('overloaded')) {
        return 'The AI service is currently busy. Please wait a moment and try again.';
    }
    return errorMessage || defaultMessage;
}


export async function getAIInsights(transactions: Transaction[]) {
  if (!transactions || transactions.length === 0) {
    return { success: false, error: "No transactions to analyze." };
  }

  try {
    const insights = await generateInsights(transactions);
    return { success: true, insights };
  } catch (e: any) {
    console.error("Error getting AI insights:", e);
    return { success: false, error: getFriendlyErrorMessage(e) };
  }
}

export async function getAiQueryResponse(query: string, transactions: Transaction[], budgets: Budget[]): Promise<{ result?: QueryResult; error?: string }> {
    if (!query) {
        return { error: "Please enter a question." };
    }
    if (!transactions || transactions.length === 0) {
        return { error: "No transactions to analyze." };
    }
    
    try {
        const result = await askAi({
            query,
            transactionData: JSON.stringify(transactions),
            budgetData: JSON.stringify(budgets),
        });
        return { result };
    } catch (e: any) {
        console.error("Error getting AI query response:", e);
        return { error: getFriendlyErrorMessage(e) };
    }
}

export async function categorizeTransactions(rawTransactions: RawTransaction[]): Promise<{ data?: ExtractedTransaction[]; error?: string }> {
    if (!rawTransactions || rawTransactions.length === 0) {
        return { error: "No transactions to categorize." };
    }

    try {
        const data = await categorizeTransactionsFlow({ rawTransactions });
        return { data };
    } catch (e: any) {
        console.error("Error extracting transactions from PDF:", e);
        return { error: getFriendlyErrorMessage(e) };
    }
}
