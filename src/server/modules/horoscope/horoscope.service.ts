import { db, asTimestamp } from "@/lib/prisma";
import { endOfDay, startOfDay } from "date-fns";

export type AllHoroscopesData = Awaited<ReturnType<typeof HoroscopeService.getAllForDate>>;

export abstract class HoroscopeService {
  static async getAllForDate(date: Date | string | undefined) {
    // Default to today if date not provided
    const targetDate = date ? new Date(date) : new Date();

    return db.orm.public.Horoscope
      .where((h) => h.date.gte(asTimestamp(startOfDay(targetDate))))
      .where((h) => h.date.lte(asTimestamp(endOfDay(targetDate))))
      .orderBy((h) => h.zodiacSign.asc())
      .all();
  }
}
