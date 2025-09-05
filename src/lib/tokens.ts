
// A rough approximation of characters per token.
// The actual count varies by model, but this is a reasonable estimate for cost calculation.
const CHARS_PER_TOKEN = 4;

/**
 * Estimates the number of tokens in a given text string.
 * This is used for client-side cost estimation before sending a request to the AI model.
 * @param {string} text - The text to estimate tokens for.
 * @returns {number} The estimated number of tokens.
 */
export function estimateTokens(text: string): number {
    if (!text) return 0;
    return Math.ceil(text.length / CHARS_PER_TOKEN);
}
