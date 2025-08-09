import type { Category, Transaction } from './types';

const mockFile1 = 'statement-q1.pdf';
const mockFile2 = 'statement-q2.pdf';
const mockFile3 = 'statement-q3.csv';

export const mockCategories: Category[] = [
  'Payment',
  'Rewards',
  'Groceries',
  'Dining',
  'Entertainment',
  'Shopping',
  'Travel & Transport',
  'Subscriptions',
  'Health',
  'Utilities',
  'Education',
  'Housing & Rent',
  'Insurance',
  'Investments & Savings',
  'Charity & Donations',
  'Government & Taxes',
  'Fees & Charges',
  'Home Improvement & Hardware',
  'Office Supplies',
  'Miscellaneous'
];

export const mockTransactions: Transaction[] = [
  // Rent payments
  { id: 'rent-oct', date: '2023-10-01', merchant: 'City Apartments', amount: 1800.00, category: 'Housing & Rent', fileSource: mockFile1 },
  { id: 'rent-nov', date: '2023-11-01', merchant: 'City Apartments', amount: 1800.00, category: 'Housing & Rent', fileSource: mockFile2 },

  // Original Data
  { id: '1', date: '2023-10-01', merchant: 'Whole Foods', amount: 75.50, category: 'Groceries', fileSource: mockFile1 },
  { id: '2', date: '2023-10-02', merchant: 'Netflix', amount: 15.99, category: 'Subscriptions', fileSource: mockFile1 },
  { id: '3', date: '2023-10-03', merchant: 'Starbucks', amount: 5.75, category: 'Dining', fileSource: mockFile1 },
  { id: '4', date: '2023-10-04', merchant: 'Uber', amount: 22.30, category: 'Travel & Transport', fileSource: mockFile1 },
  { id: '5', date: '2023-10-05', merchant: 'Amazon', amount: 120.00, category: 'Shopping', fileSource: mockFile1 },
  { id: '6', date: '2023-10-07', merchant: 'PG&E', amount: 85.00, category: 'Utilities', fileSource: mockFile1 },
  { id: '7', date: '2023-10-10', merchant: 'The Cheesecake Factory', amount: 65.25, category: 'Dining', fileSource: mockFile1 },
  { id: '8', date: '2023-10-12', merchant: 'Target', amount: 55.43, category: 'Shopping', fileSource: mockFile1 },
  { id: '9', date: '2023-10-15', merchant: 'AMC Theatres', amount: 32.50, category: 'Entertainment', fileSource: mockFile1 },
  { id: '10', date: '2023-10-18', merchant: 'United Airlines', amount: 345.80, category: 'Travel & Transport', fileSource: mockFile1 },
  { id: '11', date: '2023-10-20', merchant: 'ExxonMobil', amount: 45.60, category: 'Travel & Transport', fileSource: mockFile1 },
  { id: '12', date: '2023-10-22', merchant: 'H&M', amount: 89.90, category: 'Shopping', fileSource: mockFile1 },
  { id: '13', date: '2023-10-25', merchant: 'Comcast', amount: 70.00, category: 'Utilities', fileSource: mockFile1 },
  { id: '14', date: '2023-10-28', merchant: 'Local Pizzeria', amount: 28.00, category: 'Dining', fileSource: mockFile1 },
  { id: '15', date: '2023-10-30', merchant: 'Safeway', amount: 95.12, category: 'Groceries', fileSource: mockFile1 },
  { id: '16', date: '2023-11-01', merchant: 'Trader Joe\'s', amount: 62.10, category: 'Groceries', fileSource: mockFile2 },
  { id: '17', date: '2023-11-02', merchant: 'Spotify', amount: 10.99, category: 'Subscriptions', fileSource: mockFile2 },
  { id: '18', date: '2023-11-03', merchant: 'Blue Bottle Coffee', amount: 6.50, category: 'Dining', fileSource: mockFile2 },
  { id: '19', date: '2023-11-05', merchant: 'Lyft', amount: 18.75, category: 'Travel & Transport', fileSource: mockFile2 },
  { id: '20', date: '2023-11-06', merchant: 'Best Buy', amount: 250.00, category: 'Shopping', fileSource: mockFile2 },
  { id: '21', date: '2023-11-08', merchant: 'AT&T', amount: 95.00, category: 'Utilities', fileSource: mockFile2 },
  { id: '22', date: '2023-11-11', merchant: 'Local Thai Restaurant', amount: 45.50, category: 'Dining', fileSource: mockFile2 },
  { id: '23', date: '2023-11-14', merchant: 'Walmart', amount: 78.32, category: 'Groceries', fileSource: mockFile2 },
  { id: '24', date: '2023-11-15', merchant: 'ONLINE PAYMENT - THANK YOU', amount: -1500.00, category: 'Payment', fileSource: mockFile2 },
  { id: '25', date: '2023-11-07', merchant: 'Best Buy', amount: -250.00, category: 'Payment', fileSource: mockFile2 },

  // New Anomaly Data
  { id: '26', date: '2023-11-16', merchant: 'Apple Store', amount: 2200.00, category: 'Shopping', fileSource: mockFile3 }, // Large Purchase Rule (> $200)
  { id: '27', date: '2023-11-17', merchant: 'Fancy Steakhouse', amount: 350.00, category: 'Dining', fileSource: mockFile3 }, // Large Purchase Rule (> $150)
  { id: '28', date: '2023-11-18', merchant: 'Water Department', amount: 300.00, category: 'Utilities', fileSource: mockFile3 }, // Category Outlier Rule (compared to PG&E, Comcast, AT&T)
  { id: '29', date: '2023-11-19', merchant: 'Philz Coffee', amount: 8.50, category: 'Dining', fileSource: mockFile3 }, // Potential Duplicate
  { id: '30', date: '2023-11-20', merchant: 'Philz Coffee', amount: 8.50, category: 'Dining', fileSource: mockFile3 }, // Potential Duplicate
  { id: '31', date: '2023-11-21', merchant: 'Costco', amount: 450.78, category: 'Groceries', fileSource: mockFile3 }, // Large Purchase Rule (> $250)
  { id: '32', date: '2023-11-22', merchant: 'Starbucks', amount: 7.25, category: 'Dining', fileSource: mockFile3 }, // Multiple charges
  { id: '33', date: '2023-11-22', merchant: 'Starbucks', amount: 12.50, category: 'Dining', fileSource: mockFile3 }, // Multiple charges
  { id: '34', date: '2023-11-22', merchant: 'Starbucks', amount: 5.00, category: 'Dining', fileSource: mockFile3 }, // Multiple charges
  { id: '35', date: '2023-11-17', merchant: 'Home Depot', amount: 185.40, category: 'Home Improvement & Hardware', fileSource: mockFile3 }, // Back-to-back big transaction
];
