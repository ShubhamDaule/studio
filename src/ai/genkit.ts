/**
 * @fileoverview Genkit Initialization
 * This file initializes the Genkit AI instance and configures the plugins.
 * It exports a single `ai` object that is used throughout the application
 * to define and run AI flows, prompts, and tools.
 */
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Initialize Genkit with the Google AI plugin.
// This `ai` object serves as the central point for all Genkit functionality.
export const ai = genkit({
  plugins: [googleAI()],
});
