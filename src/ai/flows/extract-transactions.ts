
'use server';
/**
 * @fileOverview An AI flow for extracting and categorizing transaction data from PDF text.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { googleAI } from '@genkit-ai/googleai';
import { categoryTriggers } from '@/lib/category-triggers';

const ExtractedTransactionSchema = z.object({
  date: z.string().describe("Transaction date in 'YYYY-MM-DD' format."),
  merchant: z.string().describe("The raw merchant description from the statement."),
  amount: z.number().describe("Transaction amount (positive for purchases, negative for payments/refunds)."),
  category: z.string().describe("The assigned category for the transaction."),
});

const ExtractedDataSchema = z.array(ExtractedTransactionSchema);

export type ExtractedTransaction = z.infer<typeof ExtractedTransactionSchema>;
export type RawTransaction = Omit<ExtractedTransaction, 'category'>;


const ExtractTransactionsInputSchema = z.object({
  pdfText: z.string(),
});

export type ExtractTransactionsInput = z.infer<typeof ExtractTransactionsInputSchema>;

export type BankName = 'Discover' | 'Amex' | 'Chase' | 'Bank of America' | 'Wells Fargo' | 'Citi' | 'Unknown';
export type StatementType = 'Credit Card' | 'Bank Account' | 'Unknown';

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
  if (lowerText.includes('chase')) bankName = 'Chase';
  else if (lowerText.includes('discover')) bankName = 'Discover';
  else if (lowerText.includes('american express') || lowerText.includes('amex')) bankName = 'Amex';
  else if (lowerText.includes('bank of america')) bankName = 'Bank of America';
  else if (lowerText.includes('wells fargo')) bankName = 'Wells Fargo';
  else if (lowerText.includes('citi')) bankName = 'Citi';

  let statementType: StatementType = 'Unknown';
  if (['available credit', 'minimum payment', 'credit line', 'card account'].some(k => lowerText.includes(k))) {
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

    // Define amount instructions based on statement type
    const amountInstruction = bankInfo.statementType === 'Bank Account'
        ? "Bank account debits (withdrawals/purchases) should be POSITIVE numbers. Bank account credits (deposits) should be NEGATIVE numbers. Reverse the sign if necessary."
        : "Purchases are POSITIVE numbers. Payments and credits are NEGATIVE numbers.";

    const basePrompt = `
Extract transactions from the provided statement text. For each transaction, provide the following fields:
- date: 'YYYY-MM-DD'
- merchant: The merchant name, cleaned of unnecessary details. If a location provides essential context for an ambiguous merchant, add it in brackets. For example: "Starbucks (New York, NY)".
- amount: ${amountInstruction}
- category: Assign a category to each transaction based on the rules below.

**CRITICAL RULE:** Use the following keyword-based rules to determine the category. The merchant name is the primary signal. If a merchant matches keywords from multiple categories, choose the most specific one. If no keywords match, you MUST assign the category "Miscellaneous".

**Category Rules (Keywords are case-insensitive):**
${categoryTriggers.map(c => `- **${c.category}**: Keywords -> [${c.keywords.join(', ')}]`).join('\n')}

**Special Rules:**
- If a merchant contains 'AMAZON' and 'PRIME', categorize it as 'Subscriptions'.

Return a clean JSON array of transactions.
`;
    let preProcessingFailed = false;

    try {
        if (bankInfo.bankName === 'Amex' && bankInfo.statementType === 'Credit Card') {
            let startIndex = text.indexOf("Payments and Credits");
            if(startIndex !== -1) text = text.substring(startIndex);
            else preProcessingFailed = true;

            let endIndex = text.indexOf("Total Interest Charged for this Period");
            if(endIndex !== -1) text = text.substring(0, endIndex);
            else preProcessingFailed = true;

            prompt = `Source: American Express Credit Card Statement. ${basePrompt}`;
        } else if (bankInfo.bankName === 'Discover' && bankInfo.statementType === 'Credit Card') {
            let startIndex = text.indexOf("Transactions");
            if(startIndex !== -1) text = text.substring(startIndex);
             else preProcessingFailed = true;

            let endIndex = text.indexOf("Statement Balance is the total");
            if(endIndex !== -1) text = text.substring(0, endIndex);
             else preProcessingFailed = true;

            prompt = `Source: Discover Credit Card Statement. ${basePrompt}`;
        } else if (bankInfo.statementType === 'Bank Account') {
             prompt = `Source: Bank Account Statement. ${basePrompt}`;
        } else {
            // Default prompt for unknown banks or types
            prompt = `Source: Bank Statement. ${basePrompt}`;
        }
    } catch(e) {
        console.error("Error during pre-processing:", e);
        preProcessingFailed = true;
    }
    
    if (preProcessingFailed) {
        console.warn('Bank-specific pre-processing failed. Falling back to default extraction.');
        return { processedText: rawText, prompt: `Source: Bank Statement. ${basePrompt}` };
    }


    return { processedText: text, prompt };
}

// ************************************************************************************
// STEP 3: Main AI Flow
// ************************************************************************************
export async function extractTransactions(input: ExtractTransactionsInput): Promise<{ bankName: BankName, statementType: StatementType, transactions: ExtractedTransaction[] }> {
    const { pdfText } = input;

    // Step 1: Detect bank and type
    const bankInfo = detectBankAndStatementType(pdfText);
    console.log('======== BANK DETECTION ========');
    console.log(`Detected Bank: ${bankInfo.bankName}, Type: ${bankInfo.statementType}`);
    console.log('==============================\n');


    // Step 2: Pre-process text and get tailored prompt
    const { processedText, prompt } = getBankPreProcessing(bankInfo, pdfText);
    console.log('======== PRE-PROCESSED TEXT FOR AI ========');
    console.log(processedText.substring(0, 500) + '...'); // Log first 500 chars
    console.log('=========================================\n');
    
    // Step 3: Call AI with the processed text and tailored prompt
    const llmResponse = await ai.generate({
        model: googleAI.model('gemini-1.5-flash'),
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


    return { bankName: bankInfo.bankName, statementType: bankInfo.statementType, transactions: extractedData };
}
