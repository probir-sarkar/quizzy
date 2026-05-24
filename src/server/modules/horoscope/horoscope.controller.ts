import { HoroscopeService } from "./horoscope.service";
import { os } from "@orpc/server";
import { z } from "zod";

export const getAllHoroscopesForDate = os
  .input(
    z.object({
      date: z.string().optional()
    })
  )
  .handler(async ({ input: { date } }) => {
    return await HoroscopeService.getAllForDate(date);
  });
