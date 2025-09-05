/**
 * @fileoverview Development entry point for Genkit.
 * This file imports all the defined flows so that they can be discovered and
 * run by the Genkit development server.
 */
import { config } from 'dotenv';
config();

import './flows/generate-insights';
import './flows/extract-transactions';
import './flows/ask-ai-flow';
