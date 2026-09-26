export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
] as const;

// Always assume 29 days for February so every date resolves year-agnostic.
const DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] as const;

export function daysInMonth(month: number): number {
  return DAYS_IN_MONTH[month - 1] ?? 31;
}

function ordinal(day: number): string {
  if (day % 100 >= 11 && day % 100 <= 13) return "th";
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

/** Canonical date slug, e.g. `1st-january`, `25th-may`, `21st-december`. */
export function formatHistorySlug(month: number, day: number): string {
  return `${day}${ordinal(day)}-${MONTH_NAMES[month - 1]?.toLowerCase() ?? "january"}`;
}

/** Parse a date slug (`25th-may`, `25-may`, `25th-May` all accepted). */
export function parseHistorySlug(slug: string): { month: number; day: number } | null {
  const match = /^(\d{1,2})(?:st|nd|rd|th)?-([a-z]+)$/i.exec(slug);
  if (!match) return null;

  const day = Number(match[1]);
  const month = MONTH_NAMES.findIndex((name) => name.toLowerCase() === match[2].toLowerCase()) + 1;

  if (month < 1 || day < 1 || day > daysInMonth(month)) return null;
  return { month, day };
}

/** Every valid date slug of the year — used for prerendering and the sitemap. */
export function allHistorySlugs(): string[] {
  const slugs: string[] = [];
  for (let month = 1; month <= 12; month++) {
    for (let day = 1; day <= daysInMonth(month); day++) {
      slugs.push(formatHistorySlug(month, day));
    }
  }
  return slugs;
}
