'use server';
/**
 * @fileOverview This file defines a Genkit flow that provides AI-generated tips
 * for saving money based on spending patterns.
 *
 * - generateSpendingTips - The function to generate tips.
 * - GenerateSpendingTipsInput - The input type for the generateSpendingTips function.
 * - GenerateSpendingTipsOutput - The output type for the generateSpendingTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { Icon } from 'lucide-react';

const TipSchema = z.object({
  icon: z.string().describe('A relevant icon name from the lucide-react library (e.g., "ShoppingCart", "UtensilsCrossed").'),
  title: z.string().describe('A short, catchy title for the tip.'),
  description: z.string().describe('A concise, actionable description of the saving tip.'),
});

// Define the input schema for the flow
const GenerateSpendingTipsInputSchema = z.object({
  spendingData: z.string().describe('A JSON string containing the user\'s spending data, including categories, amounts, and dates.'),
});
export type GenerateSpendingTipsInput = z.infer<typeof GenerateSpendingTipsInputSchema>;

// Define the output schema for the flow
const GenerateSpendingTipsOutputSchema = z.object({
  tips: z.array(TipSchema).describe('An array of personalized savings tips based on the user\'s spending data.'),
});
export type GenerateSpendingTipsOutput = z.infer<typeof GenerateSpendingTipsOutputSchema>;

// Define the prompt for generating insights
const tipsPrompt = ai.definePrompt({
  name: 'tipsPrompt',
  input: {schema: GenerateSpendingTipsInputSchema},
  output: {schema: GenerateSpendingTipsOutputSchema},
  system: `You are a helpful financial assistant. Your goal is to provide users with actionable tips to save money based on their spending data. Analyze the provided JSON data and generate 3-5 unique, insightful tips. Each tip should have a relevant icon from the lucide-react library, a title, and a description.`,
  prompt: `Here is the user's spending data: {{{spendingData}}}`,
});

// Define the Genkit flow
const generateSpendingTipsFlow = ai.defineFlow(
  {
    name: 'generateSpendingTipsFlow',
    inputSchema: GenerateSpendingTipsInputSchema,
    outputSchema: GenerateSpendingTipsOutputSchema,
  },
  async input => {
    const {output} = await tipsPrompt(input);
    return output!;
  }
);

/**
 * Generates AI-powered spending tips.
 * @param input - The input data containing spending information.
 * @returns A promise that resolves to an object containing the generated tips.
 */
export async function generateSpendingTips(input: GenerateSpendingTipsInput): Promise<GenerateSpendingTipsOutput> {
  return generateSpendingTipsFlow(input);
}
