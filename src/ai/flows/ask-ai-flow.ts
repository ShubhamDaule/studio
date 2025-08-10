
'use server';

/**
 * @fileOverview An AI agent that can answer questions about financial data and generate charts.
 *
 * - askAi - A function that handles user queries about their transactions.
 * - AskAiInput - The input type for the askAi function.
 * - AskAiOutput - The return type for the askAi function (QueryResult).
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type {QueryResult} from '@/lib/types';

const AskAiInputSchema = z.object({
  query: z.string().describe('The user\'s question about their finances.'),
  transactions: z
    .string()
    .describe(
      'A JSON string of all transaction data. The AI will use this as the primary source of truth.'
    ),
  budgets: z
    .string()
    .describe(
      'A JSON string of the user\'s budgets. This provides context for budget-related questions.'
    ),
});
export type AskAiInput = z.infer<typeof AskAiInputSchema>;

const ChartDataSchema = z.object({
    data: z.array(z.object({
        name: z.string(),
        value: z.number(),
    })),
    type: z.enum(['pie', 'bar']),
});

const AskAiOutputSchema = z.object({
  answer: z
    .string()
    .describe(
      'A conversational, natural language answer to the user\'s query.'
    ),
  chartData: ChartDataSchema.optional().describe(
    'If the user asks for a chart or visualization, provide the data here. Otherwise, leave empty.'
  ),
});
export type AskAiOutput = z.infer<typeof AskAiOutputSchema>;

export async function askAi(input: AskAiInput): Promise<QueryResult> {
  return askAiFlow(input);
}

const prompt = ai.definePrompt({
  name: 'askAiPrompt',
  input: {schema: AskAiInputSchema},
  output: {schema: AskAiOutputSchema},
  system: `You are an expert financial analyst. Your task is to answer questions about a user's spending data and provide visualizations when requested.

**Instructions:**

1.  **Analyze the Data:** Use the provided transaction data as the single source of truth to answer the user's query.
2.  **Answer Concisely:** Provide a clear, natural language answer to the user's question.
3.  **Generate Charts (If Requested):**
    *   If the user explicitly asks for a "chart," "graph," "breakdown," or "visualization," generate the appropriate chart data.
    *   Use a 'pie' chart for categorical breakdowns (e.g., "Show me a chart of my spending by category").
    *   Use a 'bar' chart for comparing amounts across different items (e.g., "What are my top 5 merchants?").
    *   If the request is ambiguous, use your best judgment to select the most appropriate chart type.
    *   If no chart is requested, do not generate one.
4.  **Budget Context:** If budget data is available, use it to answer any budget-related questions.

**User Query:**
"{{{query}}}"

**Data:**
Transactions:
{{{transactions}}}

{{#if budgets}}
Budgets:
{{{budgets}}}
{{/if}}`,
});

const askAiFlow = ai.defineFlow(
  {
    name: 'askAiFlow',
    inputSchema: AskAiInputSchema,
    outputSchema: AskAiOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
