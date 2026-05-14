import { ZodiacSign } from "@/generated/prisma/client";

export const ZODIAC_SIGN_INFO = {
  ARIES: {
    symbol: "/zodiac/aries.svg",
    dates: "Mar 21 - Apr 19",
    element: "Fire",
    accentColor: "text-red-600 dark:text-red-400"
  },
  TAURUS: {
    symbol: "/zodiac/taurus.svg",
    dates: "Apr 20 - May 20",
    element: "Earth",
    accentColor: "text-green-600 dark:text-green-400"
  },
  GEMINI: {
    symbol: "/zodiac/gemini.svg",
    dates: "May 21 - Jun 20",
    element: "Air",
    accentColor: "text-yellow-600 dark:text-yellow-400"
  },
  CANCER: {
    symbol: "/zodiac/cancer.svg",
    dates: "Jun 21 - Jul 22",
    element: "Water",
    accentColor: "text-blue-600 dark:text-blue-400"
  },
  LEO: {
    symbol: "/zodiac/leo.svg",
    dates: "Jul 23 - Aug 22",
    element: "Fire",
    accentColor: "text-orange-600 dark:text-orange-400"
  },
  VIRGO: {
    symbol: "/zodiac/virgo.svg",
    dates: "Aug 23 - Sep 22",
    element: "Earth",
    accentColor: "text-emerald-600 dark:text-emerald-400"
  },
  LIBRA: {
    symbol: "/zodiac/libra.svg",
    dates: "Sep 23 - Oct 22",
    element: "Air",
    accentColor: "text-pink-600 dark:text-pink-400"
  },
  SCORPIO: {
    symbol: "/zodiac/scorpio.svg",
    dates: "Oct 23 - Nov 21",
    element: "Water",
    accentColor: "text-purple-600 dark:text-purple-400"
  },
  SAGITTARIUS: {
    symbol: "/zodiac/sagittarius.svg",
    dates: "Nov 22 - Dec 21",
    element: "Fire",
    accentColor: "text-indigo-600 dark:text-indigo-400"
  },
  CAPRICORN: {
    symbol: "/zodiac/capricorn.svg",
    dates: "Dec 22 - Jan 19",
    element: "Earth",
    accentColor: "text-slate-600 dark:text-slate-400"
  },
  AQUARIUS: {
    symbol: "/zodiac/aquarius.svg",
    dates: "Jan 20 - Feb 18",
    element: "Air",
    accentColor: "text-cyan-600 dark:text-cyan-400"
  },
  PISCES: {
    symbol: "/zodiac/pisces.svg",
    dates: "Feb 19 - Mar 20",
    element: "Water",
    accentColor: "text-violet-600 dark:text-violet-400"
  }
} as const;

export type ZodiacSignKey = keyof typeof ZODIAC_SIGN_INFO;

const ELEMENT_COLORS = {
  Fire: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800",
  Earth: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800",
  Air: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  Water: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800"
} as const;

export function getElementColor(element: string): string {
  return ELEMENT_COLORS[element as keyof typeof ELEMENT_COLORS] ?? ELEMENT_COLORS.Air;
}
