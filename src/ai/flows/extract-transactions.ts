
'use server';
/**
 * @fileOverview An AI flow for extracting and categorizing transaction data from PDF text.
 * This flow uses a multi-step process:
 * 1. Detects bank and statement type.
 * 2. Pre-processes the text based on the bank.
 * 3. Uses a tailored prompt to extract and categorize transactions.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ExtractedTransactionSchema = z.object({
  date: z.string().describe("Transaction date in 'YYYY-MM-DD' format."),
  merchant: z.string().describe("Cleaned merchant name (remove prefixes, suffixes, IDs, and keep only readable brand name)."),
  amount: z.number().describe("Transaction amount (positive for purchases, negative for payments/refunds)."),
  category: z.string().describe("One of the master categories provided."),
});

const CategorizedDataSchema = z.object({
    transactions: z.array(ExtractedTransactionSchema),
});


export type ExtractedTransaction = z.infer<typeof ExtractedTransactionSchema>;

const ExtractTransactionsInputSchema = z.object({
  pdfText: z.string(),
});

export type ExtractTransactionsInput = z.infer<typeof ExtractTransactionsInputSchema>;

// ************************************************************************************
// STEP 1: Bank & Statement Type Detection
// ************************************************************************************
type StatementInfo = {
  bankName: 'Discover' | 'Amex' | 'Chase' | 'Bank of America' | 'Wells Fargo' | 'Citi' | 'Unknown';
  statementType: 'Credit Card' | 'Bank Account' | 'Unknown';
};

function detectBankAndStatementType(text: string): StatementInfo {
  const lowerText = text.toLowerCase();
  
  let bankName: StatementInfo['bankName'] = 'Unknown';
  if (lowerText.includes('discover')) bankName = 'Discover';
  else if (lowerText.includes('american express') || lowerText.includes('amex')) bankName = 'Amex';
  else if (lowerText.includes('chase')) bankName = 'Chase';
  else if (lowerText.includes('bank of america')) bankName = 'Bank of America';
  else if (lowerText.includes('wells fargo')) bankName = 'Wells Fargo';
  else if (lowerText.includes('citi')) bankName = 'Citi';

  let statementType: StatementInfo['statementType'] = 'Unknown';
  if (['available credit', 'minimum payment', 'credit line'].some(k => lowerText.includes(k))) {
    statementType = 'Credit Card';
  } else if (['checking', 'savings', 'deposits'].some(k => lowerText.includes(k))) {
    statementType = 'Bank Account';
  }

  return { bankName, statementType };
}

// ************************************************************************************
// STEP 2: Pre-processing & Prompt Generation
// ************************************************************************************
function getBankPreProcessing(bankInfo: StatementInfo, rawText: string) {
    let text = rawText;
    let prompt;

    const masterCategories = "Payment, Rewards, Groceries, Dining, Entertainment, Shopping, Travel & Transport, Subscriptions, Health, Utilities, Education, Housing & Rent, Insurance, Investments & Savings, Charity & Donations, Government & Taxes, Fees & Charges, Home Improvement & Hardware, Office Supplies, Miscellaneous";

    const basePrompt = `
You are an expert financial AI. Your task is to extract transactions from the provided text from a bank statement.
For each transaction, extract the following:
- date: Format as 'YYYY-MM-DD'.
- merchant: Clean the merchant name. **CRITICAL**: Ignore surrounding text that is not part of the merchant name.
- amount: Payments, refunds, or credits MUST be negative numbers. Purchases or debits MUST be positive numbers.
- category: Choose from: ${masterCategories}.
  - **Payment Rule**: If the description contains "PAYMENT", "AUTOPAY", "AUTO PAY", or "TRANSFER", categorize it as 'Payment'.
  - **Refund Rule**: If the amount is negative and it's NOT a payment, categorize it based on the merchant's usual category (e.g., a refund from a grocery store is 'Groceries').
  - **Standard Categorization**: For all other transactions, categorize by pattern:
    - **Amazon Prime subscriptions are 'Entertainment'. Other Amazon purchases are 'Shopping'.**
    - Names with “Mart”, “Market”, “Grocery” → 'Groceries'
    - Streaming services (Netflix, Spotify) → 'Entertainment'
    - Coffee shops, restaurants → 'Dining'
    - Ride-sharing, public transport, gas → 'Travel & Transport'
Return a valid JSON object with a "transactions" array.
`;

    if (bankInfo.bankName === 'Amex' && bankInfo.statementType === 'Credit Card') {
        let startIndex = text.indexOf("Payments and Credits");
        if(startIndex !== -1) text = text.substring(startIndex);
        
        let endIndex = text.indexOf("Total Interest Charged for this Period");
        if(endIndex !== -1) text = text.substring(0, endIndex);
        
        prompt = `You are a financial assistant extracting structured transactions from an American Express credit card statement. ${basePrompt}`;
    } else if (bankInfo.bankName === 'Discover' && bankInfo.statementType === 'Credit Card') {
        let startIndex = text.indexOf("Transactions");
        if(startIndex !== -1) text = text.substring(startIndex);
        
        let endIndex = text.indexOf("Statement Balance is the total");
        if(endIndex !== -1) text = text.substring(0, endIndex);

        prompt = `You are a financial assistant extracting structured transactions from a Discover credit card statement. ${basePrompt}`;
    } else {
        // Default prompt for unknown banks
        prompt = `You are a financial assistant extracting structured transactions from a bank statement. ${basePrompt}`;
    }

    return { processedText: text, prompt };
}


// ************************************************************************************
// STEP 3: Main AI Flow
// ************************************************************************************
export async function extractTransactions(input: ExtractTransactionsInput): Promise<ExtractedTransaction[]> {
    const { pdfText } = input;

    // Step 1: Detect bank and type
    const bankInfo = detectBankAndStatementType(pdfText);

    // Step 2: Pre-process text and get tailored prompt
    const { processedText, prompt } = getBankPreProcessing(bankInfo, pdfText);
    
    // Step 3: Call AI with the processed text and tailored prompt
    const llmResponse = await ai.generate({
        prompt: `${prompt}
        
        Here is the statement text to analyze:
        ---
        ${processedText}
        ---
        `,
        output: {
            schema: CategorizedDataSchema,
        },
    });

    return llmResponse.output?.transactions || [];
}
