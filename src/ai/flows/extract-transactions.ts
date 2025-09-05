
'use server';
/**
 * @fileOverview An AI flow for extracting and categorizing transaction data from PDF text.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { googleAI } from '@genkit-ai/googleai';
import { categoryTriggers } from '@/lib/category-triggers';
import { format, subMonths } from 'date-fns';

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

export type BankName = 'Discover' | 'Amex' | 'Chase' | 'Bank of America' | 'Wells Fargo' | 'Citi' | 'Capital One' | 'U.S. Bank' | 'PNC Bank' | 'TD Bank' | 'Unknown';
export type StatementType = 'Credit Card' | 'Bank Account' | 'Unknown';

export type StatementPeriod = {
    startDate: string; // YYYY-MM-DD
    endDate: string;   // YYYY-MM-DD
};

type StatementInfo = {
  bankName: BankName;
  statementType: StatementType;
  statementPeriod: StatementPeriod | null;
};

// ************************************************************************************
// STEP 2a: Bank, Type & Statement Period Detection (Non-AI)
// This function runs on the server to quickly parse basic details from the raw text.
// It uses keyword and pattern matching to identify the bank and date range without an AI call.
// ************************************************************************************
function detectBankAndStatementType(text: string): StatementInfo {
  const lowerText = text.toLowerCase();

  const bankKeywords: Record<BankName, string[]> = {
    'Chase': ['chase'],
    'Discover': ['discover'],
    'Amex': ['american express', 'amex'],
    'Bank of America': ['bank of america'],
    'Wells Fargo': ['wells fargo'],
    'Citi': ['citi'],
    'Capital One': ['capital one'],
    'U.S. Bank': ['u.s. bank', 'us bank'],
    'PNC Bank': ['pnc bank', 'pnc'],
    'TD Bank': ['td bank'],
    'Unknown': [],
  };

  let maxCount = 0;
  let detectedBank: BankName = 'Unknown';

  for (const bank of Object.keys(bankKeywords) as BankName[]) {
    if (bank === 'Unknown') continue;
    const keywords = bankKeywords[bank];
    const count = keywords.reduce((acc, keyword) => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'g');
        return acc + (lowerText.match(regex) || []).length;
    }, 0);

    if (count > maxCount) {
        maxCount = count;
        detectedBank = bank;
    }
  }
  
  let bankName: BankName = detectedBank;

  let statementType: StatementType = 'Unknown';
  if (['available credit', 'minimum payment', 'credit line', 'card account'].some(k => lowerText.includes(k))) {
    statementType = 'Credit Card';
  } else if (['checking', 'savings', 'deposits'].some(k => lowerText.includes(k))) {
    statementType = 'Bank Account';
  }

  // Statement Period Detection
  let statementPeriod: StatementPeriod | null = null;
  const datePatterns = [
      // Handles formats like: "activity period: Jan 1 - Jan 31, 2024"
      { pattern: /activity period:?\s*(\w+\s\d{1,2})\s*-\s*(\w+\s\d{1,2},\s*\d{4})/i, type: 'start-end' },
      // Handles formats like: "statement period: January 1, 2024 to January 31, 2024"
      { pattern: /statement period:?\s*(\w+\s\d{1,2},\s*\d{4})\s*to\s*(\w+\s\d{1,2},\s*\d{4})/i, type: 'start-end' },
       // Handles Chase format like: "April 24, 2025throughMay 23, 2025"
      { pattern: /(\w+\s\d{1,2},\s*\d{4})\s*through\s*(\w+\s\d{1,2},\s*\d{4})/i, type: 'start-end' },
      // Handles formats like: "January 1, 2024 - January 31, 2024" or "Jun 09, 2025 - Jul 09, 2025"
      { pattern: /(\w+\s\d{1,2},?\s*\d{4})\s*-\s*(\w+\s\d{1,2},?\s*\d{4})/i, type: 'start-end' },
      // Handles formats like: "period from 01/01/2024 to 01/31/2024"
      { pattern: /period from\s*(\d{2}\/\d{2}\/\d{4})\s*to\s*(\d{2}\/\d{2}\/\d{4})/i, type: 'start-end' },
      // Handles formats like: "Billing Period: 06/17/25-07/15/25"
      { pattern: /Billing Period:?\s*(\d{2}\/\d{2}\/\d{2,4})\s*-\s*(\d{2}\/\d{2}\/\d{2,4})/i, type: 'start-end' },
      // Handles Amex format like: "Closing Date 04/06/25"
      { pattern: /closing date\s*(\d{2}\/\d{2}\/\d{2,4})/i, type: 'closing' },
  ];

  for (const { pattern, type } of datePatterns) {
      const match = text.match(pattern);
      if (!match) continue;

      try {
          if (type === 'closing' && match[1]) {
              const endDate = new Date(match[1]);
              if (!isNaN(endDate.getTime())) {
                  const startDate = subMonths(endDate, 1);
                  statementPeriod = {
                      startDate: format(startDate, 'yyyy-MM-dd'),
                      endDate: format(endDate, 'yyyy-MM-dd'),
                  };
                  break;
              }
          } else if (type === 'start-end' && match.length >= 3) {
               // Handle cases where the year might be missing from the start date
              let startStr = match[1];
              const endStr = match[2];
              
              // If the format is MM/DD/YY, it will be parsed correctly.
              // If the format is verbose (Jan 1), we need to ensure the year is present.
              if (/\w+\s\d{1,2},?\s*$/.test(endStr) && !/\d{4}/.test(startStr)) {
                   const endYearMatch = endStr.match(/\d{4}/);
                   const endYear = endYearMatch ? parseInt(endYearMatch[0]) : new Date().getFullYear();
                   startStr += `, ${endYear}`;
              }

              const startDate = new Date(startStr);
              const endDate = new Date(endStr);
              
              if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
                   // Handle cases where the start date might be parsed in the wrong year (e.g. Dec 15 - Jan 14)
                  if (startDate > endDate) {
                      startDate.setFullYear(startDate.getFullYear() - 1);
                  }
                  statementPeriod = {
                      startDate: format(startDate, 'yyyy-MM-dd'),
                      endDate: format(endDate, 'yyyy-MM-dd'),
                  };
                  break; 
              }
          }
      } catch (e) {
          console.warn(`Could not parse date from match: ${match[0]}`);
      }
  }


  return { bankName, statementType, statementPeriod };
}


// ************************************************************************************
// STEP 4a: Pre-processing & Prompt Generation
// This function cleans the extracted text by removing common headers and footers
// based on the detected bank. This reduces noise and token usage for the AI call.
// ************************************************************************************
function preProcessStatementText(bankName: BankName, rawText: string) {
    let text = rawText;
    let preProcessingFailed = false;

    try {
        if (bankName === 'Amex') {
            let startIndex = text.indexOf("Payments and Credits");
            if(startIndex !== -1) text = text.substring(startIndex);
            else preProcessingFailed = true;

            let endIndex = text.indexOf("Total Interest Charged for this Period");
            if(endIndex !== -1) text = text.substring(0, endIndex);
            else preProcessingFailed = true;

        } else if (bankName === 'Discover') {
            let startIndex = text.indexOf("Transactions");
            if(startIndex !== -1) text = text.substring(startIndex);
             else preProcessingFailed = true;

            let endIndex = text.indexOf("Statement Balance is the total");
            if(endIndex !== -1) text = text.substring(0, endIndex);
             else preProcessingFailed = true;
        }
    } catch(e) {
        console.error("Error during pre-processing:", e);
        preProcessingFailed = true;
    }
    
    if (preProcessingFailed) {
        console.warn('Bank-specific pre-processing failed. Falling back to default extraction.');
        return rawText;
    }

    return text;
}


const categoryPromptSection = `
**CRITICAL RULE for Categorization:** Use the following keyword-based rules to determine the category. The merchant name is the primary signal. If a merchant matches keywords from multiple categories, choose the most specific one. If no keywords match, you MUST assign the category "Miscellaneous".

**Category Rules (Keywords are case-insensitive):**
${categoryTriggers.map(c => `- **${c.category}**: Keywords -> [${c.keywords.join(', ')}]`).join('\n')}

**Special Rules:**
- If a merchant contains 'AMAZON' and 'PRIME', categorize it as 'Subscriptions'.
`;


const sharedPrompt = `
Extract transactions from the provided statement text. For each transaction, provide the following fields:
- date: 'YYYY-MM-DD'
- merchant: The merchant name, cleaned of unnecessary details. If a location provides essential context for an ambiguous merchant, add it in brackets. For example: "Starbucks (New York, NY)".
- amount: The transaction amount. Follow the specific rules below for assigning positive or negative values.
- category: Assign a category to each transaction based on the rules below.
- DO NOT pay attention to the running balance column if it exists.

${categoryPromptSection}

Return a clean JSON array of transactions.
`;


const creditCardPrompt = ai.definePrompt({
    name: 'creditCardTransactionExtractor',
    model: googleAI.model('gemini-2.0-flash'),
    input: { schema: z.object({ processedText: z.string() }) },
    output: { schema: ExtractedDataSchema },
    prompt: `You are extracting transactions from a credit card statement.
${sharedPrompt}

**CRITICAL RULE for Transaction Amount:**
- Purchases are POSITIVE numbers.
- Payments to the credit card and refunds/credits are NEGATIVE numbers.

Statement Text:
---
{{{processedText}}}
---
`
});


const bankAccountPrompt = ai.definePrompt({
    name: 'bankAccountTransactionExtractor',
    model: googleAI.model('gemini-2.0-flash'),
    input: { schema: z.object({ processedText: z.string() }) },
    output: { schema: ExtractedDataSchema },
    prompt: `You are extracting transactions from a bank account statement.
${sharedPrompt}

**CRITICAL RULE for Transaction Amount:**
- **Debits** (withdrawals, purchases, payments MADE FROM the account, e.g., "Zelle Payment") MUST be **POSITIVE** numbers.
- **Credits** (deposits, payroll, refunds RECEIVED, e.g., "Direct Deposit") MUST be **NEGATIVE** numbers.

Statement Text:
---
{{{processedText}}}
---
`
});



// ************************************************************************************
// STEP 4b: Main AI Flow Execution
// This is the core function that orchestrates the extraction process.
// ************************************************************************************
export async function extractTransactions(input: ExtractTransactionsInput): Promise<{ bankName: BankName, statementType: StatementType, statementPeriod: StatementPeriod | null, transactions: ExtractedTransaction[], rawText: string, processedText: string }> {
    const { pdfText } = input;

    // First, detect bank, type, and period from the raw text without using AI.
    const bankInfo = detectBankAndStatementType(pdfText);
    
    // Then, pre-process the text to remove unnecessary headers/footers based on the bank.
    const processedText = preProcessStatementText(bankInfo.bankName, pdfText);
    
    // DEBUG: Log the cleaned text that will be sent to the AI model.
    console.log('============= AI INPUT (PROCESSED TEXT) =============');
    console.log(processedText);
    console.log('=====================================================');

    // Choose the appropriate AI prompt (Credit Card vs. Bank Account) based on the detected statement type.
    let llmResponse;
    if (bankInfo.statementType === 'Bank Account') {
        llmResponse = await bankAccountPrompt({ processedText });
    } else {
        // Default to the credit card prompt for 'Credit Card' or 'Unknown' types.
        llmResponse = await creditCardPrompt({ processedText });
    }
    
    const extractedData = llmResponse.output || [];

    // DEBUG: Log the raw JSON output received from the AI.
    console.log('==================== AI OUTPUT ====================');
    console.log(JSON.stringify(extractedData, null, 2));
    console.log('=====================================================');

    // Finally, validate the AI's output to ensure it's in the correct format before returning.
    const validTransactions = extractedData.filter(txn => 
        txn.date && txn.merchant && txn.category && typeof txn.amount === 'number'
    );

    return { 
        bankName: bankInfo.bankName, 
        statementType: bankInfo.statementType, 
        statementPeriod: bankInfo.statementPeriod,
        transactions: validTransactions,
        rawText: pdfText,
        processedText,
    };
}
