
'use server';
/**
 * @fileOverview An AI flow for categorizing transaction data from text.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ExtractedTransactionSchema = z.object({
  date: z.string().describe("Transaction date in 'YYYY-MM-DD' format."),
  merchant: z.string().describe("Cleaned merchant name."),
  amount: z.number().describe("Transaction amount (positive for purchases, negative for payments/refunds)."),
  category: z.string().describe("One of the master categories provided."),
});

const CategorizedDataSchema = z.array(ExtractedTransactionSchema);

export type ExtractedTransaction = z.infer<typeof ExtractedTransactionSchema>;
export type RawTransaction = Omit<ExtractedTransaction, 'category'>;

const CategorizeTransactionsInputSchema = z.object({
  rawTransactions: z.array(z.object({
    date: z.string(),
    merchant: z.string(),
    amount: z.number(),
  })),
});

export type CategorizeTransactionsInput = z.infer<typeof CategorizeTransactionsInputSchema>;

export async function categorizeTransactions(input: CategorizeTransactionsInput): Promise<ExtractedTransaction[]> {
    if (input.rawTransactions.length === 0) {
        return [];
    }

    const masterCategories = "Payment, Rewards, Groceries, Dining, Entertainment, Shopping, Travel & Transport, Subscriptions, Health, Utilities, Education, Housing & Rent, Insurance, Investments & Savings, Charity & Donations, Government & Taxes, Fees & Charges, Home Improvement & Hardware, Office Supplies, Miscellaneous";
    
    const prompt = `You are a financial expert AI. Based on the merchant name from the provided JSON, categorize each transaction into one of these master categories:
${masterCategories}.

Return only a valid JSON array of objects, with the 'category' field added to each transaction.
`;

    const llmResponse = await ai.generate({
        prompt: `${prompt}
Transactions JSON:
${JSON.stringify(input.rawTransactions, null, 2)}
`,
        output: {
        schema: CategorizedDataSchema,
        },
    });

    return llmResponse.output!;
}
