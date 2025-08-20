
"use server";
import { generateInsights } from "@/ai/flows/generate-insights";
import { extractTransactions } from "@/ai/flows/extract-transactions";
import { askAi } from "@/ai/flows/ask-ai-flow";
import type { Transaction, QueryResult, Budget, ExtractedTransaction, BankName, StatementType, TokenUsage, StatementPeriod } from "@/lib/types";
import { estimateTokens } from "@/lib/tokens";


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
        const input = { transactions };
        const insights = await generateInsights(input);

        const inputTokens = estimateTokens(JSON.stringify(input));
        const outputTokens = estimateTokens(JSON.stringify(insights));
        const usage: TokenUsage = {
            inputTokens,
            outputTokens,
            totalTokens: inputTokens + outputTokens,
        }

        return { success: true, insights, usage };
    } catch (e: any) {
        console.error("Error getting AI insights:", e);
        return { success: false, error: getFriendlyErrorMessage(e) };
    }
}

export async function preAnalyzeTransactions(pdfText: string, fileName: string, skipAi: boolean = false): Promise<{ data?: ExtractedTransaction[]; bankName?: BankName, statementType?: StatementType; statementPeriod?: StatementPeriod | null; error?: string, usage?: TokenUsage }> {
    if (!pdfText) {
        return { error: "No text from PDF to process." };
    }

    try {
        const input = { pdfText };
        const inputTokens = estimateTokens(JSON.stringify(input));
        // Heuristic: Assume output JSON is about 25% the size of the input text
        const estimatedOutputTokens = inputTokens * 0.25;

        if (skipAi) {
            // Just return the estimated token costs without calling the AI
            return { 
                usage: { 
                    inputTokens, 
                    outputTokens: estimatedOutputTokens, 
                    totalTokens: inputTokens + estimatedOutputTokens 
                } 
            };
        }
        
        const { bankName, statementType, statementPeriod, transactions } = await extractTransactions(input);
        
        if (!transactions) {
             return { data: [], bankName, statementType, statementPeriod };
        }

        const actualOutputTokens = estimateTokens(JSON.stringify(transactions));
        const usage: TokenUsage = {
            inputTokens,
            outputTokens: actualOutputTokens,
            totalTokens: inputTokens + actualOutputTokens,
        };
        
        const dataWithMetadata = transactions.map(txn => ({ 
            ...txn, 
            bankName,
            fileSource: fileName 
        }));

        return { data: dataWithMetadata, bankName, statementType, statementPeriod, usage };
    } catch (e: any) {
        console.error("Error pre-analyzing transactions from PDF:", e);
        return { error: getFriendlyErrorMessage(e) };
    }
}


export async function getAiQueryResponse(query: string, transactions: Transaction[], budgets: Budget[]): Promise<{ result?: QueryResult; error?: string, usage?: TokenUsage }> {
    if (!query) {
        return { error: "Please enter a question." };
    }
    if (!transactions || transactions.length === 0) {
        return { error: "No transactions available to analyze." };
    }

    try {
        const input = {
            query,
            transactionData: JSON.stringify(transactions),
            budgetData: JSON.stringify(budgets),
            anomalyData: JSON.stringify([]), // Pass empty array for now
        };
        const result = await askAi(input);

        const inputTokens = estimateTokens(JSON.stringify(input));
        const outputTokens = estimateTokens(JSON.stringify(result));
        const usage: TokenUsage = {
            inputTokens,
            outputTokens,
            totalTokens: inputTokens + outputTokens,
        }

        return { result, usage };
    } catch (e: any) {
        console.error("Error getting AI query response:", e);
        return { error: getFriendlyErrorMessage(e) };
    }
}
