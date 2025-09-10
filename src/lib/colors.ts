
// A consistent, accessible color palette for charts.
export const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(200, 70%, 50%)",
  "hsl(300, 70%, 50%)",
  "hsl(50, 70%, 50%)",
  "hsl(170, 70%, 40%)",
  "hsl(0, 70%, 60%)",
];

// A cache to store mappings from a string (like a category name) to a color.
const colorCache = new Map<string, string>();
let colorIndex = 0;

/**
 * Gets a consistent color for a given string identifier (e.g., category, merchant).
 * If the identifier has been seen before, it returns the same color.
 * If it's a new identifier, it assigns the next available color from the palette.
 * @param {string} id - The unique identifier for the data point (e.g., "Groceries").
 * @returns {string} The assigned hex color string.
 */
export const getStableColor = (id: string): string => {
  if (colorCache.has(id)) {
    return colorCache.get(id)!;
  }

  const color = CHART_COLORS[colorIndex % CHART_COLORS.length];
  colorCache.set(id, color);
  colorIndex++;
  
  return color;
};

/**
 * Resets the color cache. This can be useful if you need to re-initialize colors,
 * for example, when the entire dataset changes.
 */
export const resetColorCache = () => {
    colorCache.clear();
    colorIndex = 0;
}
