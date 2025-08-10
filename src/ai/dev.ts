import { config } from 'dotenv';
config();

import '@/ai/flows/generate-insights.ts';
import '@/ai/flows/categorize-transactions.ts';
import '@/ai/flows/ask-ai-flow.ts';
