'use server';

/**
 * @fileOverview AI agent to categorize transactions.
 *
 * - categorizeTransaction - A function that categorizes a transaction.
 * - CategorizeTransactionInput - The input type for the categorizeTransaction function.
 * - CategorizeTransactionOutput - The return type for the categorizeTransaction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeTransactionInputSchema = z.object({
  transactionDescription: z
    .string()
    .describe('The description of the transaction.'),
  transactionAmount: z.number().describe('The amount of the transaction.'),
});
export type CategorizeTransactionInput = z.infer<typeof CategorizeTransactionInputSchema>;

const CategorizeTransactionOutputSchema = z.object({
  category: z
    .string()
    .describe(
      'The category of the transaction (e.g., Food, Shopping, Utilities, etc.).'
    ),
  confidence: z
    .number()
    .describe(
      'A number between 0 and 1 indicating the confidence level of the categorization.'
    ),
});
export type CategorizeTransactionOutput = z.infer<typeof CategorizeTransactionOutputSchema>;

export async function categorizeTransaction(
  input: CategorizeTransactionInput
): Promise<CategorizeTransactionOutput> {
  return categorizeTransactionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeTransactionPrompt',
  input: {schema: CategorizeTransactionInputSchema},
  output: {schema: CategorizeTransactionOutputSchema},
  prompt: `You are an expert financial assistant. Your task is to assign each transaction to the most appropriate category based on its merchant name and context. Use the following rules to infer the category.

Transaction Description: {{{transactionDescription}}}
Transaction Amount: {{{transactionAmount}}}

**Category Pattern Rules:**

1.  **Payment**
    *   If description contains: "PAYMENT", "AUTO PAY", "AUTOPAY", "TRANSFER", "ACH PAYMENT", "E-PAY", "DIRECT DEBIT", "CREDIT PAYMENT"
    *   If it's a refund or credit from the credit card company itself
    *   If it involves "CREDIT" and is not from a merchant

2.  **Rewards**
    *   If description contains: "REDEMPTION", "REWARDS", "CASH BACK", "POINTS", "LOYALTY CREDIT"

3.  **Groceries**
    *   Keywords: "Mart", "Market", "Grocery", "Supermarket", "Trader Joe", "Safeway", "Kroger", "Walmart Grocery", "Costco", "Aldi", "Whole Foods"

4.  **Dining**
    *   Keywords: "Cafe", "Coffee", "Starbucks", "Restaurant", "Diner", "Eatery", "Grill", "Bistro", "Bar", "Chipotle", "Dominos", "McDonald", "KFC", "Subway"

5.  **Entertainment**
    *   Keywords: "Netflix", "Spotify", "YouTube", "Hulu", "Hotstar", "Gaming", "Steam", "Xbox", "PlayStation", "Disney+", "AMC", "Cinema", "Theater"

6.  **Shopping**
    *   Keywords: "Amazon", "eBay", "Flipkart", "Shein", "Zara", "H&M", "Target", "Best Buy", "Fashion", "Store", "Mall", "Walmart" (non-grocery purchases)

7.  **Travel & Transport**
    *   Keywords: "Uber", "Lyft", "Transit", "Metro", "Subway", "Train", "Flight", "Airline", "Gas", "Petrol", "Fuel", "Shell", "BP", "Toll", "Taxi", "Parking"

8.  **Subscriptions**
    *   Keywords: "Subscription", "Recurring", "Monthly", "SaaS", "Dropbox", "Adobe", "Canva", "Notion", "ChatGPT", "VPN", "iCloud", "OneDrive"

9.  **Health**
    *   Keywords: "Pharmacy", "Hospital", "Clinic", "CVS", "Walgreens", "Doctor", "Dental", "Therapy", "Lab", "Medicine"

10. **Utilities**
    *   Keywords: "Electric", "Gas Bill", "Water", "Internet", "Mobile", "T-Mobile", "AT&T", "Verizon", "Spectrum", "Utility", "Bill"

11. **Education**
    *   Keywords: "School", "College", "University", "Tuition", "Course", "Udemy", "Coursera", "Learning", "Skill", "Edu"

12. **Housing & Rent**
    *   Keywords: "Rent", "Mortgage", "Property Management", "Landlord", "Lease", "Zillow"

13. **Insurance**
    *   Keywords: "Insurance", "Geico", "State Farm", "Allianz", "Progressive", "Aetna", "Cigna", "Blue Cross"

14. **Investments & Savings**
    *   Keywords: "Investment", "Mutual Fund", "ETF", "Stock", "Brokerage", "Robinhood", "Fidelity", "Vanguard", "Deposit", "Transfer to Savings"

15. **Charity & Donations**
    *   Keywords: "Donation", "Charity", "Fund", "Nonprofit", "GoFundMe"

16. **Government & Taxes**
    *   Keywords: "IRS", "Tax", "Govt", "DMV", "License", "Registration", "Passport", "Court"

17. **Fees & Charges**
    *   Keywords: "Fee", "Charge", "Late Fee", "Overdraft", "Penalty"

18. **Hardware**
    *   Keywords: "Depot", "Home Depot", "Lowe's", "Ace Hardware", "Menards", "B&Q", "True Value", "Builders", "Tool", "Hardware", "DIY"

19. **Office Supplies**
    *   Keywords: "Office Depot", "Staples", "OfficeMax", "Stationery", "Paper", "Printer", "Ink", "Office Supply"

20. **Miscellaneous**
    *   If no category matches and it's not clearly identifiable, assign 'Miscellaneous'

---

### ⚠️ Additional Rules:
*   If the transaction amount is negative:
    *   Use "Payment" or "Refund" logic. If it is a refund, categorize it based on the **original merchant category**.
*   Use fuzzy matching or brand recognition if keywords are unclear.
*   If you are not sure, categorize as Miscellaneous.
*   Return a confidence level between 0 and 1.
`,
});

const categorizeTransactionFlow = ai.defineFlow(
  {
    name: 'categorizeTransactionFlow',
    inputSchema: CategorizeTransactionInputSchema,
    outputSchema: CategorizeTransactionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
