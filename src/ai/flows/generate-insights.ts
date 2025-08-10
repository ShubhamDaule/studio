// This file holds the Genkit flow for generating spending insights.
'use server';
/**
 * @fileOverview This file defines a Genkit flow that provides AI-generated insights
 *  based on user spending patterns. It identifies potential areas for saving money
 *  and optimizing the user's budget.
 *
 * - generateInsights - The function to generate insights based on spending data.
 * - GenerateInsightsInput - The input type for the generateInsights function.
 * - GenerateInsightsOutput - The output type for the generateInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the flow
const GenerateInsightsInputSchema = z.object({
  spendingData: z.string().describe('A JSON string containing the user\'s spending data, including categories, amounts, and dates.'),
  financialGoals: z.string().optional().describe('Optional: A description of the user\'s financial goals, e.g., saving for a down payment or paying off debt.'),
});
export type GenerateInsightsInput = z.infer<typeof GenerateInsightsInputSchema>;

// Define the output schema for the flow
const GenerateInsightsOutputSchema = z.object({
  insights: z.string().describe('AI-generated insights and recommendations for optimizing spending and achieving financial goals.'),
});
export type GenerateInsightsOutput = z.infer<typeof GenerateInsightsOutputSchema>;

// Define the prompt for generating insights
const insightsPrompt = ai.definePrompt({
  name: 'insightsPrompt',
  input: {schema: GenerateInsightsInputSchema},
  output: {schema: GenerateInsightsOutputSchema},
  system: `You are a personal finance advisor. Your task is to analyze the user's spending data and provide personalized, actionable insights to help them save money and achieve their financial goals.

**Analysis Guidelines:**
1.  **Review Spending:** Carefully examine the provided spending data, looking for patterns, high-spending categories, and potential areas for reduction.
2.  **Consider Goals:** If financial goals are provided, tailor your advice to help the user reach them.
3.  **Provide Actionable Tips:** Offer specific, practical, and easy-to-understand recommendations. For example, instead of "spend less on food," suggest "try meal prepping to reduce your dining out expenses."
4.  **Tone:** Be encouraging, supportive, and non-judgmental. Your goal is to empower the user, not to criticize them.
5.  **Output Format:** Present the insights in a clear, concise, and easy-to-read format. Use markdown for lists or emphasis where appropriate.`,
  prompt: `Analyze the following financial data and provide insights.

Spending Data:
{{{spendingData}}}

{{#if financialGoals}}
Financial Goals:
{{{financialGoals}}}
{{/if}}
`,
});

// Define the Genkit flow
const generateInsightsFlow = ai.defineFlow(
  {
    name: 'generateInsightsFlow',
    inputSchema: GenerateInsightsInputSchema,
    outputSchema: GenerateInsightsOutputSchema,
  },
  async input => {
    const {output} = await insightsPrompt(input);
    return output!;
  }
);

/**
 * Generates AI-powered insights based on user spending patterns.
 * @param input - The input data containing spending information and financial goals.
 * @returns A promise that resolves to an object containing the generated insights.
 */
export async function generateInsights(input: GenerateInsightsInput): Promise<GenerateInsightsOutput> {
  return generateInsightsFlow(input);
}
