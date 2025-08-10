
'use server';
/**
 * @fileOverview An AI flow for extracting transaction data from PDF text.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ExtractedTransactionSchema = z.object({
  date: z.string().describe("Transaction date in 'YYYY-MM-DD' format."),
  merchant: z.string().describe("Cleaned merchant name (remove prefixes, suffixes, IDs, and keep only readable brand name)."),
  amount: z.number().describe("Transaction amount (positive for purchases, negative for payments/refunds)."),
  category: z.string().describe("One of the master categories provided."),
});

const ExtractedDataSchema = z.object({
  accountType: z.enum(["Bank Account", "Credit Card", "Unknown"]).describe("The type of financial account."),
  bankName: z.string().describe("The name of the bank or financial institution."),
  statementStartDate: z.string().describe("The start date of the statement period in 'YYYY-MM-DD' format."),
  statementEndDate: z.string().describe("The end date of the statement period in 'YYYY-MM-DD' format."),
  transactions: z.array(ExtractedTransactionSchema).describe("An array of extracted transactions."),
  anomalies: z.array(z.any()).describe("Always an empty array."),
});

const ExtractTransactionsInputSchema = z.object({
  pdfText: z.string(),
});

export type ExtractedData = z.infer<typeof ExtractedDataSchema>;
export type ExtractTransactionsInput = z.infer<typeof ExtractTransactionsInputSchema>;

export async function extractTransactions(input: ExtractTransactionsInput): Promise<ExtractedData> {
  const llmResponse = await ai.generate({
    prompt: `You are an expert financial analyst. Your job is to read the provided financial statement text and return a structured JSON object with the extracted account details and transactions. Ignore summaries, marketing text, and anything that is not an actual transaction line.

Your output JSON must include:
- accountType: "Bank Account" | "Credit Card" | "Unknown"
- bankName: string
- statementStartDate: "YYYY-MM-DD"
- statementEndDate: "YYYY-MM-DD"
- transactions: array of objects:
    - date: "YYYY-MM-DD"
    - merchant: cleaned merchant name (remove prefixes, suffixes, IDs, and keep only readable brand name)
    - amount: number (positive for purchases, negative for payments/refunds)
    - category: one of the categories below
- anomalies: always an empty array []

---

**1. Determine Account Type (early exit logic)**
As soon as you find a keyword match, immediately finalize 'accountType' and skip further checks:
- “Credit Card”, “Available Credit”, “Minimum Payment” → 'Credit Card'
- “Checking”, “Savings”, “Deposits”, “Withdrawals” → 'Bank Account'
- Else → 'Unknown'

---

**2. Extract Bank Name and Statement Period**
- Bank name: Look for the institution name (e.g., "Chase", "American Express").
- Statement period:
  - Prefer explicit start and end dates from “Statement Period”, “Activity Period”, or “Billing Cycle”.
  - If only a closing or statement date is present, set 'statementEndDate' to that date and infer 'statementStartDate' as 1 month and 1 day prior.
- Dates must be in "YYYY-MM-DD" format.

---

**3. Extract Transactions with dates**
For each transaction:
- \`date\`: transaction date in "YYYY-MM-DD"
- \`merchant\`: clean name (remove extra codes like "SQ *", ".COM/BILLWA", IDs)
- \`amount\`:
  - Negative for payments, refunds, credits
  - Positive for purchases/debits
- \`category\`: select from the master category list using keyword matches or obvious brand inference.

**Categorization Master List**

Return exactly one of the following categories per transaction:
Payment, Rewards, Groceries, Dining, Entertainment, Shopping, Travel & Transport, Subscriptions, Health, Utilities, Education, Housing & Rent, Insurance, Investments & Savings, Charity & Donations, Government & Taxes, Fees & Charges, Home Improvement & Hardware, Office Supplies, Miscellaneous

**Keyword Triggers**:
**Category Pattern Rules:**

1. **Payment**
   - If description contains: "PAYMENT", "AUTO PAY", "AUTOPAY", "TRANSFER", "ACH PAYMENT", "E-PAY"
   - If it's a refund or credit from the credit card company itself
   - If it involves "CREDIT" and is not from a merchant

2. **Rewards/Redemptions**
   - If description contains: "REDEMPTION", "REWARDS", "CASH BACK", "POINTS"

3. **Groceries**
   - Keywords: "Mart", "Market", "Grocery", "Supermarket", "Trader Joe’s", "Safeway", "Kroger", "Walmart Grocery", "Costco", "Aldi", "Whole Foods"

4. **Dining**
   - Keywords: "Cafe", "Coffee", "Starbucks", "Restaurant", "Diner", "Eatery", "Grill", "Bistro", "Bar", "Chipotle", "Dominos", "McDonald’s", "KFC", "Subway"

5. **Entertainment**
   - Keywords: "Netflix", "Spotify", "YouTube", "Hulu", "Hotstar", "Gaming", "Steam", "Xbox", "PlayStation", "Disney+", "AMC", "Cinema", "Theater"

6. **Shopping**
   - Keywords: "Amazon", "eBay", "Flipkart", "Shein", "Zara", "H&M", "Target", "Walmart", "Best Buy", "Fashion", "Store", "Mall"

7. **Travel & Transport**
   - Keywords: "Uber", "Lyft", "Transit", "Metro", "Subway", "Train", "Flight", "Airlines", "Gas", "Petrol", "Fuel", "Shell", "BP", "Toll", "Taxi", "Parking"

8. **Subscriptions**
   - Keywords: "Subscription", "Recurring", "Monthly", "SaaS", "Dropbox", "Adobe", "Canva", "Notion", "ChatGPT", "VPN", "iCloud", "OneDrive"

9. **Health**
   - Keywords: "Pharmacy", "Hospital", "Clinic", "CVS", "Walgreens", "Doctor", "Dental", "Therapy", "Lab", "Medicine"

10. **Utilities**
    - Keywords: "Electric", "Gas", "Water", "Internet", "Mobile", "T-Mobile", "AT&T", "Verizon", "Spectrum", "Utility", "Bill"

11. **Education**
    - Keywords: "School", "College", "University", "Tuition", "Course", "Udemy", "Coursera", "Learning", "Skill", "Edu"

12. **Miscellaneous**
    - If no category matches and it's not clearly identifiable, assign 'Miscellaneous'

---
Now analyze and return the JSON for the following text:
${input.pdfText}
`,
    output: {
      schema: ExtractedDataSchema,
    },
  });

  return llmResponse.output!;
}
