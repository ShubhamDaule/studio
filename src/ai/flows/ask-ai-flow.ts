
'use server';
/**
 * @fileOverview An AI assistant that answers questions about financial data.
 *
 * - askAi - A function that handles user queries about their finances.
 * - AskAiInput - The input type for the askAi function.
 * - AskAiOutput - The return type for the askAi function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ChartDataSchema = z.object({
  type: z.enum(['pie', 'bar', 'line']).describe("The type of chart to display."),
  data: z.array(z.object({
    name: z.string().describe("The name of the data point (e.g., category name or month)."),
    value: z.number().describe("The value of the data point."),
  })).describe("The data for the chart."),
  title: z.string().describe("A descriptive title for the chart."),
  dataKey: z.string().describe("The key for the data value, should be 'value'."),
  nameKey: z.string().describe("The key for the data name, should be 'name'."),
});

const AskAiOutputSchema = z.object({
  answer: z.string().describe("A clear, concise text-based answer to the user's query."),
  chartData: ChartDataSchema.optional().describe("Chart data to visualize the answer, if explicitly requested."),
});
export type AskAiOutput = z.infer<typeof AskAiOutputSchema>;


const AskAiInputSchema = z.object({
  query: z.string().describe("The user's question about their finances."),
  transactionData: z.string().describe("A JSON string of the user's financial transactions."),
  budgetData: z.string().optional().describe("An optional JSON string of the user's budget allocations."),
  anomalyData: z.string().optional().describe("An optional JSON string of detected spending anomalies."),
});
export type AskAiInput = z.infer<typeof AskAiInputSchema>;


export async function askAi(input: AskAiInput): Promise<AskAiOutput> {
  const llmResponse = await ai.generate({
    prompt: `You are a helpful financial assistant AI. Your task is to answer a user's question based on the provided transaction data and optionally, their budget and spending anomaly data.

**CRITICAL RULE:** You are an AI assistant for analyzing financial data ONLY. You must NEVER, under any circumstances, discuss or suggest changes to the application's code, functions, UI, or any other part of the project. Do not generate or talk about code. Your role is strictly to provide answers based on the financial data provided. If a user asks you to change the application or discuss how it works, politely refuse and state that you can only answer questions about their financial data.

**Instructions:**

1.  **Analyze the User's Query:** Understand what the user is asking. They might ask a direct question ("Total spending in October?"), a comparison ("Compare spending to budget for Groceries?"), a visualization ("Show a pie chart of spending by category"), or a question about anomalies ("Why was this transaction flagged?" or "List my anomalies").

2.  **Analyze the Data:** Parse the provided JSON data to find the information needed. Today's date is ${new Date().toDateString()}.
    -   **Transaction Data:** This is the primary source of financial events.
    -   **Budget Data (If Provided):** Use this to answer any questions related to budgets.
    -   **Anomaly Data (If Provided):** This contains transactions that have been flagged as unusual. Each anomaly has a 'transactionId' and a 'reason'. Use this data to answer questions about suspicious activity.

3.  **Formulate a Text Answer:** ALWAYS provide a clear and concise text-based 'answer' to the user's query.
    - If asked about anomalies, list them and their reasons. You can find the full transaction details by matching the 'transactionId' from the anomaly data to the 'id' in the transaction data.

4.  **Generate Chart Data (ONLY When Necessary):**
    *   You should ONLY generate chart data if the user's query EXPLICITLY asks for a chart, graph, or visualization (e.g., "Show me a pie chart of...", "Draw a graph of...").
    *   For other questions, even if they involve numbers, do NOT generate a chart unless specifically asked. Provide a text answer only.
    *   If you do generate a chart, ensure all fields are correctly populated.
    *   **Chart Type:** Choose the best 'type' ('bar', 'pie', 'line'). Use 'line' for trends over time, 'pie' for proportions, and 'bar' for comparisons.
    *   **Chart Data:** The 'data' array must contain objects with 'name' and 'value' keys.
    *   **Chart Title:** Create a descriptive 'title'.
    *   **Keys:** Set 'dataKey' to "value" and 'nameKey' to "name".

5.  **If the query cannot be answered** or is unrelated to the financial data, provide a polite response explaining that you can only answer questions about the provided transactions and DO NOT generate a chart.

User Query: "${input.query}"

Transaction Data:
${input.transactionData}

${input.budgetData ? `Budget Data:\n${input.budgetData}` : ''}
${input.anomalyData ? `Anomaly Data:\n${input.anomalyData}` : ''}
`,
    output: {
      schema: AskAiOutputSchema,
    },
  });

  return llmResponse.output!;
}


// Personal Finance Advisor & Spending Analyst
// Nature:
// Complex multi-step reasoning—analyzing transactions, detecting patterns, recommending personalized tips, budgeting rules, and habit changes. Output is structured JSON with multiple insights.

// Needs:
// Good reasoning, ability to parse structured JSON input, create nuanced and actionable advice.

// Recommended Model:
// Gemini 2.0 Flash or Gemini 2.0 Flash-Lite

// Why? Balances reasoning quality and cost.

// 2.0 Flash-Lite is cheaper but might be slightly less nuanced. If you want to save cost and don’t need ultra-detailed analysis, go Lite.

// 2.0 Flash is better for richer insights but costs a bit more.

// Avoid:

// Pro models here may be overkill and expensive.

// Gemini 1.5 Flash can be used if cost is critical, but expect some drop in insight quality.