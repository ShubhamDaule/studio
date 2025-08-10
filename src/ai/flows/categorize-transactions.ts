
'use server';
/**
 * @fileOverview An AI flow for categorizing transaction data from text.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ExtractedTransactionSchema = z.object({
  date: z.string().describe("Transaction date in 'YYYY-MM-DD' format."),
  merchant: z.string().describe("Cleaned merchant name (remove prefixes, suffixes, IDs, and keep only readable brand name)."),
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
  bankName: z.string().optional(),
});

export type CategorizeTransactionsInput = z.infer<typeof CategorizeTransactionsInputSchema>;

const getPrompt = (bankName?: string) => {
    let context = "You are a financial expert AI.";
    if (bankName && bankName !== 'Unknown') {
        context = `You are a financial expert AI specializing in statements from ${bankName}.`;
    }

    return `${context} Based on the merchant name, categorize each transaction into one of these master categories:
Payment, Rewards, Groceries, Dining, Entertainment, Shopping, Travel & Transport, Subscriptions, Health, Utilities, Education, Housing & Rent, Insurance, Investments & Savings, Charity & Donations, Government & Taxes, Fees & Charges, Home Improvement & Hardware, Office Supplies, Miscellaneous.

Return only a JSON array with date, merchant, amount, and category fields. The output should be a valid JSON array of objects.
`;
}


export async function categorizeTransactions(input: CategorizeTransactionsInput): Promise<ExtractedTransaction[]> {
    if (input.rawTransactions.length === 0) {
        return [];
    }
    
    const prompt = getPrompt(input.bankName);

    const llmResponse = await ai.generate({
        prompt: `${prompt}
Transactions:
${JSON.stringify(input.rawTransactions, null, 2)}
`,
        output: {
        schema: CategorizedDataSchema,
        },
    });

    return llmResponse.output!;
}
