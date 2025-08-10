
"use server";
import { generateInsights } from "@/ai/flows/generate-insights";
import { categorizeTransactions } from "@/ai/flows/categorize-transactions";
import { extractTransactions, type RawTransaction } from "@/ai/flows/extract-transactions";
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

export async function extractAndCategorizeTransactions(pdfText: string): Promise<{ data?: ExtractedTransaction[]; error?: string }> {
    if (!pdfText) {
        return { error: "No text from PDF to process." };
    }

    try {
        // Step 1: Extract raw transactions using the AI flow
        const rawTransactions: RawTransaction[] = await extractTransactions({ pdfText });
        if (!rawTransactions || rawTransactions.length === 0) {
            return { data: [] };
        }
        
        // Step 2: Categorize the extracted transactions using deterministic keyword logic
        const categorizedData = categorizeTransactions(rawTransactions);

        return { data: categorizedData };
    } catch (e: any) {
        console.error("Error extracting and categorizing transactions from PDF:", e);
        return { error: getFriendlyErrorMessage(e) };
    }
}
