
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

function extractRawTransactions(text: string): Omit<ExtractedTransaction, 'category'>[] {
  const lines = text.split("\n");
  const txnRegex = /^(?:(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})\s+)?(\d{1,2}[\/-]\d{1,2}(?:\s\d{2,4})?)\s+(.+?)\s+([-\$]?\d{1,3}(?:,?\d{3})*\.\d{2}(\s?cr)?)\s*$/gmi;
  
  function normalizeDate(d: string): string | null {
    if (!d) return null;
    const cleanDate = d.replace(/\s+/g, '/').replace(/-/g, '/');
    const parts = cleanDate.split("/");
    if (parts.length < 2) return null;
    let [m, day, y] = parts;
    
    if (!y) {
        y = new Date().getFullYear().toString();
    }
    if (y.length === 2) y = "20" + y;

    if (parseInt(m) > 12 || parseInt(day) > 31) return null;

    return `${y.padStart(4, "20")}-${m.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }
  
  const transactions: Omit<ExtractedTransaction, 'category'>[] = [];
  for (const line of lines) {
    const match = txnRegex.exec(line.trim());
    if (match) {
        // Use the second date group if the first is missing
        const dateStr = match[1] || match[2];
        const date = normalizeDate(dateStr);

        if (!date) continue;

        let merchant = match[3].trim();
        // Remove common prefixes/suffixes
        merchant = merchant.replace(/^(CHECKCARD|PURCHASE|DEBIT)\s+/i, '')
                           .replace(/\s+\d+$/,'') // remove trailing numbers
                           .replace(/\s{2,}/g, ' '); // remove extra spaces

        let amountStr = match[4].replace(/[\$,]/g, '').trim();
        const isCredit = /cr/i.test(amountStr) || amountStr.startsWith('-');
        amountStr = amountStr.replace(/cr/i, '').trim();
        
        let amount = parseFloat(amountStr);
        if (isNaN(amount)) continue;
        
        if (isCredit) {
            amount = -amount;
        }

        transactions.push({ date, merchant, amount });
    }
  }
  return transactions;
}


export async function categorizeTransactions(input: CategorizeTransactionsInput): Promise<ExtractedTransaction[]> {
    const rawTransactions = extractRawTransactions(input.pdfText);

    if (rawTransactions.length === 0) {
        return [];
    }

    const llmResponse = await ai.generate({
        prompt: `You are a financial expert AI. Based on the merchant name, categorize each transaction into one of these master categories:
Payment, Rewards, Groceries, Dining, Entertainment, Shopping, Travel & Transport, Subscriptions, Health, Utilities, Education, Housing & Rent, Insurance, Investments & Savings, Charity & Donations, Government & Taxes, Fees & Charges, Home Improvement & Hardware, Office Supplies, Miscellaneous.

Return only a JSON array with date, merchant, amount, and category fields.

Transactions:
${JSON.stringify(rawTransactions, null, 2)}
`,
        output: {
        schema: CategorizedDataSchema,
        },
    });

    return llmResponse.output!;
}
