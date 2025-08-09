
"use server";

import { mean } from 'simple-statistics';
import type { Transaction, Anomaly } from '@/lib/types';

function getFriendlyErrorMessage(error: any): string {
    const defaultMessage = 'An unexpected error occurred. Please try again.';
    if (!error || !error.message) {
        return defaultMessage;
    }
    const errorMessage = error.message as string;
    if (errorMessage.includes('429') || errorMessage.toLowerCase().includes('too many requests') || errorMessage.toLowerCase().includes('exceeded your current quota')) {
        return 'The AI service has reached its request limit. Please try again later.';
    }
    if (errorMessage.includes('503') || errorMessage.toLowerCase().includes('overloaded')) {
        return 'The AI service is currently busy. Please wait a moment and try again.';
    }
    return errorMessage || defaultMessage;
}

export async function detectAnomalies(transactions: Transaction[]): Promise<{ anomalies?: Anomaly[]; error?: string }> {
    try {
        if (!transactions || transactions.length === 0) {
            return { anomalies: [] };
        }

        const anomalies: Anomaly[] = [];
        const categoryGroups = new Map<string, Transaction[]>();
        const flaggedIds = new Set<string>();

        // Sort transactions by date for time-based rules
        const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // Group transactions by category and by day for efficient lookup
        const dailyMerchantCounts = new Map<string, Map<string, number>>();
        for (const txn of sortedTransactions) {
            if (txn.amount > 0) { // Only consider spend for category stats
                if (!categoryGroups.has(txn.category)) {
                    categoryGroups.set(txn.category, []);
                }
                categoryGroups.get(txn.category)!.push(txn);
            }
            const dateKey = txn.date;
            if (!dailyMerchantCounts.has(dateKey)) {
                dailyMerchantCounts.set(dateKey, new Map<string, number>());
            }
            const merchantCount = dailyMerchantCounts.get(dateKey)!;
            merchantCount.set(txn.merchant, (merchantCount.get(txn.merchant) || 0) + 1);
        }

        for (let i = 0; i < sortedTransactions.length; i++) {
            const txn = sortedTransactions[i];
            const { id: txnId, amount, category, merchant, date: dateStr } = txn;
            
            if (!txnId || !dateStr || !category) continue;
            if (flaggedIds.has(txnId)) continue;
            
            // Refund Check: Don't flag purchases that have been fully refunded.
            if (amount > 0) {
                const hasMatchingRefund = sortedTransactions.some(otherTxn => 
                    otherTxn.id !== txnId &&
                    otherTxn.merchant === merchant &&
                    Math.abs(otherTxn.amount + amount) < 0.01 // Amounts are opposite
                );
                if (hasMatchingRefund) continue;
            }

            if (amount <= 0) continue; // Only check spending for anomalies, not credits
            
            // Rule 1: Duplicate Detection
            for (let j = i + 1; j < sortedTransactions.length; j++) {
                const otherTxn = sortedTransactions[j];
                const txnDate = new Date(dateStr);
                const otherDate = new Date(otherTxn.date);
                const dayDiff = Math.abs((otherDate.getTime() - txnDate.getTime()) / (1000 * 3600 * 24));

                if (
                    merchant === otherTxn.merchant &&
                    Math.abs(otherTxn.amount - amount) < 0.01 &&
                    dayDiff <= 1 &&
                    !flaggedIds.has(otherTxn.id)
                ) {
                    anomalies.push({ transactionId: otherTxn.id, reason: `Potential duplicate transaction at ${merchant}.` });
                    flaggedIds.add(otherTxn.id);
                }
            }

            // Rule 2: Multiple Charges to Same Merchant in a Day
            const chargesToday = dailyMerchantCounts.get(dateStr)?.get(merchant) || 0;
            if (chargesToday >= 3) {
                 anomalies.push({ transactionId: txnId, reason: `Multiple charges (${chargesToday}) to ${merchant} on the same day.` });
                 flaggedIds.add(txnId);
                 continue;
            }
            
            // Rule 3: Back-to-Back Big Transactions
            if (amount > 100) {
                 for (let j = i + 1; j < sortedTransactions.length; j++) {
                    const nextTxn = sortedTransactions[j];
                    if (nextTxn.amount <= 100 || flaggedIds.has(nextTxn.id) || nextTxn.merchant === merchant) continue;

                    const dayDiff = Math.abs((new Date(nextTxn.date).getTime() - new Date(dateStr).getTime()) / (1000 * 3600 * 24));
                    if (dayDiff <= 1) {
                        anomalies.push({ transactionId: txnId, reason: "Multiple high-value transactions within 24 hours." });
                        flaggedIds.add(txnId);
                        break; // Flag once and move on
                    }
                 }
            }

            // Rule 4: Large Purchase Rule (hardcoded thresholds)
            if (category === 'Shopping' && amount > 200) {
                anomalies.push({ transactionId: txnId, reason: "Large 'Shopping' expense." });
                flaggedIds.add(txnId);
                continue;
            }
            if (category === 'Dining' && amount > 150) {
                anomalies.push({ transactionId: txnId, reason: "Unusually high amount for 'Dining'." });
                flaggedIds.add(txnId);
                continue;
            }
            if (category === 'Groceries' && amount > 250) {
                anomalies.push({ transactionId: txnId, reason: "Unusually high amount for 'Groceries'." });
                flaggedIds.add(txnId);
                continue;
            }
            if (category === 'Travel & Transport' && amount > 300) {
                anomalies.push({ transactionId: txnId, reason: "Large 'Travel & Transport' expense." });
                flaggedIds.add(txnId);
                continue;
            }

            // Rule 5: Category Outlier Rule (statistical)
            const peers = (categoryGroups.get(category) || []).filter(t => t.id !== txnId).map(t => t.amount);
            if (peers.length > 5) { // Only run this check if there's enough data
                const avg = mean(peers);
                if (peers.length > 0 && avg > 0 && amount > 3 * avg) { 
                    anomalies.push({ transactionId: txnId, reason: `Significantly higher than other '${category}' expenses.` });
                    flaggedIds.add(txnId);
                    continue;
                }
            }
        }
        
        // Remove duplicates by transactionId before returning
        return { anomalies: Array.from(new Set(anomalies.map(a => a.transactionId))).map(id => anomalies.find(a => a.transactionId === id)!) };

    } catch (e: any) {
        console.error("Error detecting anomalies:", e);
        return { error: getFriendlyErrorMessage(e) };
    }
}
