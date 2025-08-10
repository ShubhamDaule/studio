
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

export type BankName = 'Discover' | 'Amex' | 'Chase' | 'Bank of America' | 'Wells Fargo' | 'Citi' | 'Unknown';
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
Extract transactions from statement text.
Required fields:
- date: 'YYYY-MM-DD'
- merchant: Raw merchant name.
- amount: Purchases are positive, payments/credits are negative.
Return only a JSON array of transactions. Do not add categories.
`;

    if (bankInfo.bankName === 'Amex' && bankInfo.statementType === 'Credit Card') {
        let startIndex = text.indexOf("Payments and Credits");
        if(startIndex !== -1) text = text.substring(startIndex);
        
        let endIndex = text.indexOf("Total Interest Charged for this Period");
        if(endIndex !== -1) text = text.substring(0, endIndex);
        
        prompt = `Source: American Express Credit Card Statement. ${basePrompt}`;
    } else if (bankInfo.bankName === 'Discover' && bankInfo.statementType === 'Credit Card') {
        let startIndex = text.indexOf("Transactions");
        if(startIndex !== -1) text = text.substring(startIndex);
        
        let endIndex = text.indexOf("Statement Balance is the total");
        if(endIndex !== -1) text = text.substring(0, endIndex);

        prompt = `Source: Discover Credit Card Statement. ${basePrompt}`;
    } else {
        // Default prompt for unknown banks
        prompt = `Source: Bank Statement. ${basePrompt}`;
    }

    return { processedText: text, prompt };
}

// ************************************************************************************
// STEP 3: Main AI Flow
// ************************************************************************************
export async function extractTransactions(input: ExtractTransactionsInput): Promise<{ bankName: BankName, transactions: RawTransaction[] }> {
    const { pdfText } = input;

    // Step 1: Detect bank and type
    const bankInfo = detectBankAndStatementType(pdfText);
    console.log('======== BANK DETECTION ========');
    console.log(`Detected Bank: ${bankInfo.bankName}, Type: ${bankInfo.statementType}`);
    console.log('==============================\n');


    // Step 2: Pre-process text and get tailored prompt
    const { processedText, prompt } = getBankPreProcessing(bankInfo, pdfText);
    console.log('======== PRE-PROCESSED TEXT FOR AI ========');
    console.log(processedText);
    console.log('=========================================\n');
    
    // Step 3: Call AI with the processed text and tailored prompt
    const llmResponse = await ai.generate({
        prompt: `${prompt}
        
        Statement Text:
        ---
        ${processedText}
        ---
        `,
        output: {
            schema: ExtractedDataSchema,
        },
    });
    
    const extractedData = llmResponse.output || [];
    console.log('======== AI EXTRACTION OUTPUT ========');
    console.log(JSON.stringify(extractedData, null, 2));
    console.log('====================================\n');


    return { bankName: bankInfo.bankName, transactions: extractedData };
}

