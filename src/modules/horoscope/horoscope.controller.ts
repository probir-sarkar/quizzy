import Elysia from "elysia";
import { HoroscopeService } from "./horoscope.service";

type GetBySignAndDateParams = {
  query: {
    sign: ZodiacSign;
    date: string;
  };
};

type GetAllForDateParams = {
  query: {
    date: string;
  };
};

import { ZodiacSign } from "@/generated/prisma/client";

export const HoroscopeController = new Elysia({ prefix: "/horoscope" })
  .get("/by-sign-date", ({ query }) => {
    const { sign, date } = query as GetBySignAndDateParams["query"];
    return HoroscopeService.getBySignAndDate(sign, new Date(date));
  })
  .get("/all-for-date", ({ query }) => {
    const { date } = query as GetAllForDateParams["query"];
    return HoroscopeService.getAllForDate(new Date(date));
  });
