
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

const CategorizeTransactionsInputSchema = z.object({
  pdfText: z.string(),
});

export type CategorizeTransactionsInput = z.infer<typeof CategorizeTransactionsInputSchema>;

// This function attempts to extract transactions from raw text using regex.
// It's a best-effort approach and may need refinement based on statement formats.
function extractRawTransactions(text: string): Omit<ExtractedTransaction, 'category'>[] {
    const lines = text.split('\n');
    const transactions: Omit<ExtractedTransaction, 'category'>[] = [];
    
    // Regex to capture common transaction formats. This is complex and might need adjustment.
    // Groups: 1:Date, 2:Description/Merchant, 3:Amount
    const transactionRegex = /(\d{1,2}\/\d{1,2}\/\d{2,4})\s+(.+?)\s+([-\$]?\d{1,3}(?:,?\d{3})*\.\d{2})/;

    function normalizeDate(dateStr: string): string {
        const d = new Date(dateStr);
        // Handle invalid dates if necessary
        return d.toISOString().split('T')[0];
    }

    for (const line of lines) {
        const match = transactionRegex.exec(line.trim());
        if (match) {
            const date = normalizeDate(match[1]);
            const merchant = match[2].trim().replace(/\s\s+/g, ' '); // Clean up spaces
            const amountStr = match[3].replace(/[\$,]/g, '');
            const amount = parseFloat(amountStr);

            if (!isNaN(amount)) {
                transactions.push({ date, merchant, amount });
            }
        }
    }
    return transactions;
}


export async function categorizeTransactions(input: CategorizeTransactionsInput): Promise<ExtractedTransaction[]> {
    const rawTransactions = extractRawTransactions(input.pdfText);

    if (rawTransactions.length === 0) {
        // If regex fails, we send the whole text to the AI as a fallback.
         const fallbackResult = await ai.generate({
            prompt: `You are an expert financial analyst. Your job is to read the provided financial statement text and return a structured JSON object with the extracted transactions. Ignore summaries, marketing text, and anything that is not an actual transaction line.
            Your output JSON must be an array of transaction objects with these fields: date, merchant, amount, category.
            Use the master category list provided.
            
            **Categorization Master List**: Payment, Rewards, Groceries, Dining, Entertainment, Shopping, Travel & Transport, Subscriptions, Health, Utilities, Education, Housing & Rent, Insurance, Investments & Savings, Charity & Donations, Government & Taxes, Fees & Charges, Home Improvement & Hardware, Office Supplies, Miscellaneous

            Analyze and return the JSON for the following text:
            ${input.pdfText}`,
            output: {
                schema: CategorizedDataSchema,
            },
        });
        return fallbackResult.output!;
    }

    const llmResponse = await ai.generate({
        prompt: `You are a financial expert AI. Based on the merchant name, categorize each transaction into one of these master categories:
Payment, Rewards, Groceries, Dining, Entertainment, Shopping, Travel & Transport, Subscriptions, Health, Utilities, Education, Housing & Rent, Insurance, Investments & Savings, Charity & Donations, Government & Taxes, Fees & Charges, Home Improvement & Hardware, Office Supplies, Miscellaneous.

Return only a JSON array with date, merchant, amount, and category fields. The output should be a valid JSON array of objects.

Transactions:
${JSON.stringify(rawTransactions, null, 2)}
`,
        output: {
        schema: CategorizedDataSchema,
        },
    });

    return llmResponse.output!;
}
