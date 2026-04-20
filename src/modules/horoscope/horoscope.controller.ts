import Elysia, { t } from "elysia";
import { HoroscopeService } from "./horoscope.service";
import { ZodiacSign } from "@/generated/prisma/client";

const zodiacSignEnum = t.Union(
  (Object.keys(ZodiacSign) as Array<keyof typeof ZodiacSign>).map(sign => t.Literal(sign))
);

export const HoroscopeController = new Elysia({ prefix: "/horoscope" })
  .get("/by-sign-date", ({ query }) => {
    return HoroscopeService.getBySignAndDate(query.sign, query.date);
  }, {
    query: t.Object({
      sign: zodiacSignEnum,
      date: t.Optional(t.String())
    })
  })
  .get("/all-for-date", ({ query }) => {
    return HoroscopeService.getAllForDate(query.date);
  }, {
    query: t.Object({
      date: t.Optional(t.String())
    })
  });
