import prisma from "@/lib/prisma";
import { ZodiacSign } from "@/generated/prisma/client";
import { endOfDay, startOfDay } from "date-fns";

export type AllHoroscopesData = Awaited<ReturnType<typeof HoroscopeService.getAllForDate>>;

export abstract class HoroscopeService {
  static async getAllForDate(date: Date | string | undefined) {
    // Default to today if date not provided
    const targetDate = date ? new Date(date) : new Date();

    return prisma.horoscope.findMany({
      where: {
        date: {
          gte: startOfDay(targetDate),
          lte: endOfDay(targetDate)
        }
      },
      orderBy: {
        zodiacSign: "asc"
      }
    });
  }
}
