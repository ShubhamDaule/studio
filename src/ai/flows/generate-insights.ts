
'use server';
/**
 * @fileOverview A financial advice AI agent.
 *
 * - generateInsights - A function that handles the financial advice process.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { Transaction } from '@/lib/types';
import type { icons } from 'lucide-react';
import { googleAI } from '@genkit-ai/googleai';

const InsightSchema = z.object({
  title: z.string().describe('The concise title for the financial tip.'),
  description: z.string().describe('The detailed, actionable description of the financial tip.'),
  icon: z.string().describe('A relevant icon name from the lucide-react library. For example: "PiggyBank", "Wallet", "TrendingDown", "CreditCard".'),
});

const FinancialAdviceOutputSchema = z.object({
  insights: z.array(InsightSchema).describe("An array of 3-5 personalized financial tips."),
});
export type FinancialAdviceOutput = z.infer<typeof FinancialAdviceOutputSchema>;

const FinancialAdviceInputSchema = z.object({
  transactions: z.array(z.object({
    id: z.string(),
    date: z.string(),
    merchant: z.string(),
    amount: z.number(),
    category: z.string(),
    fileSource: z.string(),
  })).describe("A list of the user's financial transactions."),
});

const generateInsightsFlow = ai.defineFlow(
  {
    name: 'generateInsightsFlow',
    inputSchema: FinancialAdviceInputSchema,
    outputSchema: FinancialAdviceOutputSchema,
  },
  async ({ transactions }) => {
    const { output } = await ai.generate({
      model: googleAI.model('gemini-2.0-flash'),
      prompt: `You are a highly experienced personal finance advisor and spending analyst.
Your input is a JSON array of the user’s transactions with details such as date, description, category, and amount.

Your tasks are to:
1.  **Analyze Spending Patterns:** Identify the top 3-5 categories and merchants where the most money is spent.
2.  **Detect Opportunities:** Find recurring subscriptions and non-essential purchases that could be reduced.
3.  **Provide Personalized Tips:** Give the user 3-5 personalized, actionable tips to reduce their financial burden based on their specific data. Each tip should be a separate item in the output array.
4.  **Recommend a Budget:** Suggest a budgeting rule (like 50/30/20) and estimate budget allocations for Needs, Wants, and Savings based on their spending.
5.  **Suggest Habit Changes:** Offer long-term habit and mindset changes for better financial health.

Use the following reference rules to inform your advice:

*** REFERENCE: Popular Budgeting Rules ***
- **50/30/20 Rule (Classic):** 50% for Needs (rent, utilities, groceries), 30% for Wants (dining, hobbies), 20% for Savings & Debt.
- **70/20/10 Rule (Aggressive Saver):** 70% for Needs + Wants, 20% for Savings/Investments, 10% for Debt/Charity.
- **Pay Yourself First:** Treat savings as a non-negotiable bill.

*** REFERENCE: Strategies to Reduce Unwanted Purchases ***
- **24-Hour Rule:** Wait 24 hours before a non-essential purchase.
- **Unsubscribe & Unfollow:** Cut off marketing temptations.
- **Need vs. Want Test:** Ask, "Will this matter in 3 months?"

*** REFERENCE: Rules to Consistently Save Money ***
- **Automate Savings:** Set up automatic transfers after payday.
- **Negotiate Bills:** Call service providers annually to ask for better rates.
- **Buy Quality Over Quantity:** Invest in durable items to save money long-term.

**Output Format:**
- You MUST provide the output in the specified JSON format.
- Each insight should have a clear title, a practical description, and a relevant icon name from the lucide-react library.
- **CRITICAL ICON RULE:** You MUST choose an icon from the following list ONLY: [ "PiggyBank", "Wallet", "TrendingDown", "CreditCard", "Landmark", "Scale", "ShoppingBag", "ReceiptText", "HeartHandshake", "Sparkles", "Target", "BrainCircuit", "Lightbulb" ].
- If no significant spending pattern is detected, provide general money-saving tips and basic budgeting advice in the same format.

Here is the user's transaction data:
${JSON.stringify(transactions, null, 2)}
`,
      output: {
        schema: FinancialAdviceOutputSchema
      }
    });

    return output!;
  }
);

export async function generateInsights(transactions: Transaction[]): Promise<FinancialAdviceOutput> {
  return await generateInsightsFlow({ transactions });
}
