
const CHARS_PER_TOKEN = 4;

/**
 * Estimates the number of tokens in a given text.
 * @param text The text to estimate tokens for.
 * @returns The estimated number of tokens.
 */
export function estimateTokens(text: string): number {
    if (!text) return 0;
    return Math.ceil(text.length / CHARS_PER_TOKEN);
}
