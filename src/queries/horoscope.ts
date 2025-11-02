import prisma from "@/lib/prisma";
import { ZodiacSign } from "@/generated/prisma/client";
import { endOfDay, startOfDay } from "date-fns";
import { UTCDate } from "@date-fns/utc";

export async function getHoroscopeBySignAndDate(zodiacSign: ZodiacSign, date: Date) {
  return prisma.horoscope.findUnique({
    where: {
      zodiacSign_date: {
        zodiacSign,
        date: date
      }
    }
  });
}

export async function getAllHoroscopesForDate(date: Date) {
  return prisma.horoscope.findMany({
    where: {
      date: {
        gte: startOfDay(date),
        lte: endOfDay(date)
      }
    },
    orderBy: {
      zodiacSign: "asc"
    }
  });
}

export type HoroscopeData = NonNullable<Awaited<ReturnType<typeof getHoroscopeBySignAndDate>>>;
export type AllHoroscopesData = Awaited<ReturnType<typeof getAllHoroscopesForDate>>;
