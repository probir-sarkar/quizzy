import { HoroscopeService } from "./horoscope.service";
import { os } from "@orpc/server";
import { z } from "zod";
import { ZodiacSign } from "@/lib/enums";
import { isoDate } from "@/server/dto/common";

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

export const getAllHoroscopesForDate = os
  .input(
    z.object({
      date: z.string().optional()
    })
  )
  .output(z.array(horoscopeRowSchema))
  .handler(async ({ input: { date } }) => {
    return await HoroscopeService.getAllForDate(date);
  });
