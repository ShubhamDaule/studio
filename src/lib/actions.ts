
"use server";
import { generateInsights } from "@/ai/flows/generate-insights";
import { askAi } from "@/ai/flows/ask-ai-flow";
import { extractTransactions } from "@/ai/flows/extract-transactions";
import type { Transaction, QueryResult, Budget, ExtractedData } from "@/lib/types";
import pdf from "pdf-parse/lib/pdf-parse";


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

export async function extractTransactionsFromPdf(pdfDataUri: string): Promise<{ data?: ExtractedData; error?: string }> {
    if (!pdfDataUri) {
        return { error: "No PDF data received." };
    }

    try {
        // Convert data URI to buffer
        const buffer = Buffer.from(pdfDataUri.split(',')[1], 'base64');
        const pdfData = await pdf(buffer);
        const data = await extractTransactions({ pdfText: pdfData.text });
        return { data };
    } catch (e: any) {
        console.error("Error extracting transactions from PDF:", e);
        return { error: getFriendlyErrorMessage(e) };
    }
}
