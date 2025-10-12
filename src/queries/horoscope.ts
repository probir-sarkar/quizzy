import prisma from "@/lib/prisma";
import { ZodiacSign } from "@/generated/prisma/client";

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
      date: date
    },
    orderBy: {
      zodiacSign: "asc"
    }
  });
}

export async function getTodayHoroscopes() {
  const today = new Date();
  return getAllHoroscopesForDate(today);
}

export type HoroscopeData = Awaited<ReturnType<typeof getHoroscopeBySignAndDate>>;
export type AllHoroscopesData = Awaited<ReturnType<typeof getAllHoroscopesForDate>>;
