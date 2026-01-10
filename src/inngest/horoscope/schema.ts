import { z } from "zod";

const zodiacSigns = [
  "ARIES",
  "TAURUS",
  "GEMINI",
  "CANCER",
  "LEO",
  "VIRGO",
  "LIBRA",
  "SCORPIO",
  "SAGITTARIUS",
  "CAPRICORN",
  "AQUARIUS",
  "PISCES"
] as const;

export const ZodiacSignEnum = z.enum(zodiacSigns);

// ✅ Schema for a single sign's daily horoscope
const DailyHoroscopeSchema = z.object({
  description: z.string().min(60, "Description must be at least 60 characters long"),
  luckyColor: z.string().optional(),
  luckyNumber: z.number().int().min(1).max(99).optional(),
  mood: z.string().optional()
});

// ✅ Big schema: All 12 signs in one object
export const AllZodiacDailySchema = z.object(
  Object.fromEntries(zodiacSigns.map((sign) => [sign, DailyHoroscopeSchema]))
);
