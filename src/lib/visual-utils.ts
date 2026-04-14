/**
 * Visual utility functions for consistent styling across the app
 */

// Gradient definitions for cards and UI elements
export const CARD_GRADIENTS = [
  "from-violet-500 to-fuchsia-600",
  "from-blue-500 to-cyan-600",
  "from-green-500 to-emerald-600",
  "from-yellow-500 to-amber-600",
  "from-red-500 to-rose-600",
  "from-pink-500 to-fuchsia-600"
] as const;

// Shine colors for themed effects
export const LIGHT_SHINE_COLORS = [
  "#FF6B6B", // red-pink
  "#FFD93D", // yellow
  "#6BCB77", // green
  "#4D96FF", // blue
  "#9D4EDD"  // purple
] as const;

export const DARK_SHINE_COLORS = [
  "#FF9F1C", // orange
  "#2EC4B6", // teal
  "#E71D36", // red
  "#FFBF69", // peach
  "#A29BFE"  // soft purple
] as const;

/**
 * Get gradient class name for a given index
 */
export function getCardGradient(index: number): string {
  return CARD_GRADIENTS[index % CARD_GRADIENTS.length];
}

/**
 * Get shine colors based on theme
 */
export function getShineColors(isDark: boolean) {
  return isDark ? DARK_SHINE_COLORS : LIGHT_SHINE_COLORS;
}
