'use server';

/**
 * @fileOverview AI agent to categorize transactions.
 *
 * - categorizeTransaction - A function that categorizes a transaction.
 * - CategorizeTransactionInput - The input type for the categorizeTransaction function.
 * - CategorizeTransactionOutput - The return type for the categorizeTransaction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeTransactionInputSchema = z.object({
  transactionDescription: z
    .string()
    .describe('The description of the transaction.'),
  transactionAmount: z.number().describe('The amount of the transaction.'),
});
export type CategorizeTransactionInput = z.infer<typeof CategorizeTransactionInputSchema>;

const CategorizeTransactionOutputSchema = z.object({
  category: z
    .string()
    .describe(
      'The category of the transaction (e.g., Food, Shopping, Utilities, etc.).'
    ),
  confidence: z
    .number()
    .describe(
      'A number between 0 and 1 indicating the confidence level of the categorization.'
    ),
});
export type CategorizeTransactionOutput = z.infer<typeof CategorizeTransactionOutputSchema>;

export async function categorizeTransaction(
  input: CategorizeTransactionInput
): Promise<CategorizeTransactionOutput> {
  return categorizeTransactionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeTransactionPrompt',
  input: {schema: CategorizeTransactionInputSchema},
  output: {schema: CategorizeTransactionOutputSchema},
  prompt: `You are a personal finance expert. Your goal is to categorize transactions based on their description and amount.

  Transaction Description: {{{transactionDescription}}}
  Transaction Amount: {{{transactionAmount}}}

  Determine the most appropriate category for the transaction. Return a confidence level between 0 and 1.
  Consider these categories: Food, Shopping, Utilities, Entertainment, Travel, Bills, Income, Other.
  If it is income, categorize as income.
  If you are not sure, categorize as Other.
  `,
});

const categorizeTransactionFlow = ai.defineFlow(
  {
    name: 'categorizeTransactionFlow',
    inputSchema: CategorizeTransactionInputSchema,
    outputSchema: CategorizeTransactionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
