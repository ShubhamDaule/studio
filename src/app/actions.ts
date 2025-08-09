"use server";
import { generateInsights } from "@/ai/flows/generate-insights";
import type { Transaction } from "@/lib/types";

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
