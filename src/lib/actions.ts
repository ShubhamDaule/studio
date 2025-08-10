
"use server";
import { generateInsights } from "@/ai/flows/generate-insights";
import type { Transaction, Tip, QueryResult, Budget } from "@/lib/types";

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
    // This would in reality call a Genkit flow. For now, it returns mock data.
    if (query.toLowerCase().includes("groceries")) {
        return { 
            result: {
                answer: "You spent $422.72 on groceries in October. Your budget was $400.",
                chartData: {
                    type: 'pie',
                    data: [
                        { name: 'Whole Foods', value: 75.50 },
                        { name: 'Target', value: 55.43 },
                        { name: 'Safeway', value: 95.12 },
                        { name: 'Trader Joe\'s', value: 62.10 },
                        { name: 'Walmart', value: 78.32 },
                         { name: 'Costco', value: 450.78 },
                    ]
                }
            }
        };
    }
     return { 
            result: {
                answer: "I can help with that. Here is a breakdown of your spending.",
            }
        };
}
