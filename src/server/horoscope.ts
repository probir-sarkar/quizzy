import { os } from "@orpc/server";
import { z } from "zod";
import { db, asTimestamp } from "@/lib/prisma";
import { endOfDay, startOfDay } from "date-fns";
import { ZodiacSign } from "@/lib/enums";
import { isoDate } from "./common";

const horoscopeRowSchema = z.object({
  id: z.number(),
  zodiacSign: z.enum(ZodiacSign),
  date: isoDate,
  description: z.string(),
  luckyColor: z.string().nullable(),
  luckyNumber: z.number().nullable(),
  mood: z.string().nullable(),
  createdAt: isoDate,
  updatedAt: isoDate
});

async function getAllForDate(date: Date | string | undefined) {
  // Default to today if date not provided
  const targetDate = date ? new Date(date) : new Date();

  return db.orm.public.Horoscope
    .where((h) => h.date.gte(asTimestamp(startOfDay(targetDate))))
    .where((h) => h.date.lte(asTimestamp(endOfDay(targetDate))))
    .orderBy((h) => h.zodiacSign.asc())
    .all();
}

export const getAllHoroscopesForDate = os
  .input(
    z.object({
      date: z.string().optional()
    })
  )
  .output(z.array(horoscopeRowSchema))
  .handler(async ({ input: { date } }) => {
    return await getAllForDate(date);
  });
