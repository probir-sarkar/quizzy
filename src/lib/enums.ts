// Database enum values mirrored from prisma8/contract.prisma (native_enum).
// Kept as const objects so both type and runtime usages (Object.values, member
// access) work the same way the generated Prisma 7 enums did.
export const QuizDifficulty = {
  easy: "easy",
  medium: "medium",
  hard: "hard"
} as const;

export type QuizDifficulty = (typeof QuizDifficulty)[keyof typeof QuizDifficulty];

export const ZodiacSign = {
  ARIES: "ARIES",
  TAURUS: "TAURUS",
  GEMINI: "GEMINI",
  CANCER: "CANCER",
  LEO: "LEO",
  VIRGO: "VIRGO",
  LIBRA: "LIBRA",
  SCORPIO: "SCORPIO",
  SAGITTARIUS: "SAGITTARIUS",
  CAPRICORN: "CAPRICORN",
  AQUARIUS: "AQUARIUS",
  PISCES: "PISCES"
} as const;

export type ZodiacSign = (typeof ZodiacSign)[keyof typeof ZodiacSign];

export const EventCategory = {
  war: "war",
  discovery: "discovery",
  politics: "politics",
  science: "science",
  art: "art",
  sports: "sports",
  technology: "technology",
  medicine: "medicine",
  exploration: "exploration",
  literature: "literature",
  music: "music",
  economy: "economy",
  religion: "religion",
  disaster: "disaster",
  revolution: "revolution",
  invention: "invention"
} as const;

export type EventCategory = (typeof EventCategory)[keyof typeof EventCategory];
