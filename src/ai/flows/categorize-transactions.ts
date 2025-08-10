
/**
 * @fileOverview A deterministic function for categorizing transactions based on keyword matching.
 */
import type { RawTransaction, ExtractedTransaction } from './extract-transactions';

const categoryTriggers = [
    { category: "Payment", keywords: ["PAYMENT", "AUTO PAY", "AUTOPAY", "TRANSFER", "ACH PAYMENT", "E-PAY", "DIRECT DEBIT", "CREDIT PAYMENT"] },
    { category: "Rewards", keywords: ["REDEMPTION", "REWARDS", "CASH BACK", "POINTS", "LOYALTY CREDIT"] },
    { category: "Groceries", keywords: ["MART", "MARKET", "GROCERY", "SUPERMARKET", "TRADER JOE", "SAFEWAY", "KROGER", "WALMART GROCERY", "COSTCO", "ALDI", "WHOLE FOODS", "GROCERS", "DOLLAR TREE"] },
    { category: "Dining", keywords: ["CAFE", "COFFEE", "STARBUCKS", "RESTAURANT", "DINER", "EATERY", "GRILL", "BISTRO", "BAR", "CHIPOTLE", "DOMINOS", "MCDONALD", "KFC", "SUBWAY"] },
    { category: "Entertainment", keywords: ["NETFLIX", "SPOTIFY", "YOUTUBE", "HULU", "HOTSTAR", "GAMING", "STEAM", "XBOX", "PLAYSTATION", "DISNEY+", "AMC", "CINEMA", "THEATER"] },
    { category: "Shopping", keywords: ["AMAZON", "EBAY", "FLIPKART", "SHEIN", "ZARA", "H&M", "TARGET", "BEST BUY", "FASHION", "STORE", "MALL", "WALMART"] },
    { category: "Travel & Transport", keywords: ["UBER", "LYFT", "TRANSIT", "METRO", "SUBWAY", "TRAIN", "FLIGHT", "AIRLINE", "GAS", "PETROL", "FUEL", "SHELL", "BP", "TOLL", "TAXI", "PARKING"] },
    { category: "Subscriptions", keywords: ["SUBSCRIPTION", "RECURRING", "MONTHLY", "SAAS", "DROPBOX", "ADOBE", "CANVA", "NOTION", "CHATGPT", "VPN", "ICLOUD", "ONEDRIVE"] },
    { category: "Health", keywords: ["PHARMACY", "HOSPITAL", "CLINIC", "CVS", "WALGREENS", "DOCTOR", "DENTAL", "THERAPY", "LAB", "MEDICINE"] },
    { category: "Utilities", keywords: ["ELECTRIC", "GAS BILL", "WATER", "INTERNET", "MOBILE", "T-MOBILE", "AT&T", "VERIZON", "SPECTRUM", "UTILITY", "BILL"] },
    { category: "Education", keywords: ["SCHOOL", "COLLEGE", "UNIVERSITY", "TUITION", "COURSE", "UDEMY", "COURSERA", "LEARNING", "SKILL", "EDU"] },
    { category: "Housing & Rent", keywords: ["RENT", "MORTGAGE", "PROPERTY MANAGEMENT", "LANDLORD", "LEASE", "ZILLOW"] },
    { category: "Insurance", keywords: ["INSURANCE", "GEICO", "STATE FARM", "ALLIANZ", "PROGRESSIVE", "AETNA", "CIGNA", "BLUE CROSS"] },
    { category: "Investments & Savings", keywords: ["INVESTMENT", "MUTUAL FUND", "ETF", "STOCK", "BROKERAGE", "ROBINHOOD", "FIDELITY", "VANGUARD", "DEPOSIT", "TRANSFER TO SAVINGS"] },
    { category: "Charity & Donations", keywords: ["DONATION", "CHARITY", "FUND", "NONPROFIT", "GOFUNDME"] },
    { category: "Government & Taxes", keywords: ["IRS", "TAX", "GOVT", "DMV", "LICENSE", "REGISTRATION", "PASSPORT", "COURT"] },
    { category: "Fees & Charges", keywords: ["FEE", "CHARGE", "LATE FEE", "OVERDRAFT", "PENALTY"] },
    { category: "Home Improvement & Hardware", keywords: ["DEPOT", "HOME DEPOT", "LOWE'S", "ACE HARDWARE", "MENARDS", "B&Q", "TRUE VALUE", "BUILDERS", "TOOL", "HARDWARE", "DIY"] },
    { category: "Office Supplies", keywords: ["OFFICE DEPOT", "STAPLES", "OFFICEMAX", "STATIONERY", "PAPER", "PRINTER", "INK", "OFFICE SUPPLY"] },
];

export function categorizeTransactions(rawTransactions: RawTransaction[]): ExtractedTransaction[] {
  return rawTransactions.map(txn => {
    const merchantUpper = txn.merchant.toUpperCase();
    
    // Find first category where any keyword matches merchant text
    const matchedCategory = categoryTriggers.find(trigger =>
      trigger.keywords.some(keyword => merchantUpper.includes(keyword))
    );
    
    // Special rule for Amazon
    if (merchantUpper.includes('AMAZON') && merchantUpper.includes('PRIME')) {
        return { ...txn, category: 'Subscriptions' }
    }

    return {
      ...txn,
      category: matchedCategory ? matchedCategory.category : "Miscellaneous",
    };
  });
}
