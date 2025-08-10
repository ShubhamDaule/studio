
'use server';
/**
 * @fileOverview An AI flow for extracting transaction data from PDF text using bank-specific rules.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const RawTransactionSchema = z.object({
  date: z.string().describe("Transaction date in 'YYYY-MM-DD' format."),
  merchant: z.string().describe("The raw merchant description from the statement."),
  amount: z.number().describe("Transaction amount (positive for purchases, negative for payments/refunds)."),
});

const ExtractedDataSchema = z.array(RawTransactionSchema);

export type RawTransaction = z.infer<typeof RawTransactionSchema>;

const ExtractTransactionsInputSchema = z.object({
  pdfText: z.string(),
});

export type ExtractTransactionsInput = z.infer<typeof ExtractTransactionsInputSchema>;

type BankName = 'Discover' | 'Amex' | 'Chase' | 'Bank of America' | 'Wells Fargo' | 'Citi' | 'Unknown';
type StatementType = 'Credit Card' | 'Bank Account' | 'Unknown';

type StatementInfo = {
  bankName: BankName;
  statementType: StatementType;
};

// ************************************************************************************
// STEP 1: Bank & Statement Type Detection
// ************************************************************************************
function detectBankAndStatementType(text: string): StatementInfo {
  const lowerText = text.toLowerCase();
  
  let bankName: BankName = 'Unknown';
  if (lowerText.includes('discover')) bankName = 'Discover';
  else if (lowerText.includes('american express') || lowerText.includes('amex')) bankName = 'Amex';
  else if (lowerText.includes('chase')) bankName = 'Chase';
  else if (lowerText.includes('bank of america')) bankName = 'Bank of America';
  else if (lowerText.includes('wells fargo')) bankName = 'Wells Fargo';
  else if (lowerText.includes('citi')) bankName = 'Citi';

  let statementType: StatementType = 'Unknown';
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

    const basePrompt = `
You are an expert financial AI. Your task is to extract transactions from the provided text from a bank statement.
For each transaction, extract the following:
- date: Format as 'YYYY-MM-DD'.
- merchant: The raw transaction description.
- amount: Payments, refunds, or credits MUST be negative numbers. Purchases or debits MUST be positive numbers.

Return only a valid JSON array of transaction objects. Do not include categories.
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
export async function extractTransactions(input: ExtractTransactionsInput): Promise<RawTransaction[]> {
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
            schema: ExtractedDataSchema,
        },
    });

    return llmResponse.output || [];
}
