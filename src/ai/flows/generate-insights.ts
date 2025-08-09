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

// Define the tool for fetching stock prices
const wiselySpendTool = ai.defineTool({
  name: 'wiselySpendTool',
  description: 'This tool provides advice on how to wisely spend money given their current financial situation.',
  inputSchema: z.object({
    spendingData: z.string().describe('The user\'s recent spending data.'),
    financialGoals: z.string().optional().describe('The user\'s financial goals.'),
  }),
  outputSchema: z.string(),
  run: async (input) => {
    console.log("Running wiselySpendTool with input: ", input);
    return `Based on your spending data, here are some tips on how to wisely spend money: Reduce eating out by 20%, find cheaper gas prices, and negotiate lower cell phone bills`;
  },
});

// Define the prompt for generating insights
const insightsPrompt = ai.definePrompt({
  name: 'insightsPrompt',
  tools: [wiselySpendTool],
  input: {schema: GenerateInsightsInputSchema},
  output: {schema: GenerateInsightsOutputSchema},
  system: `You are a personal finance advisor. Analyze the user's spending data and provide personalized, actionable insights to help them save money and achieve their financial goals. Use the wiselySpendTool to come up with ways to save money.`,
  prompt: `Spending Data: {{{spendingData}}}
Financial Goals: {{{financialGoals}}}`,
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
