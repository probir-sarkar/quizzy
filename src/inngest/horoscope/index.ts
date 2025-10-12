import { inngest } from "../client";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { addDays, format, startOfDay, differenceInCalendarDays, isValid } from "date-fns";
import { UTCDate } from "@date-fns/utc";
import { AllZodiacDailySchema } from "./schema";
import prisma from "@/lib/prisma";
import { ZodiacSign } from "@/generated/prisma/enums";
import { zai } from "@/lib/ai-models";

const DEFAULT_START_DATE = new UTCDate(2025, 0, 1);
const MAX_GENERATION_DAYS = 30;

export const generateHoroscopeFn = inngest.createFunction(
  { id: "generate-horoscope", retries: 0 },
  [{ event: "manual/generate-horoscope" }, { cron: "*/5 * * * *" }],
  async ({ event, step }) => {
    const nonce = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    let nextDate: Date | null = null;
    if (event.data?.date && isValid(new Date(event.data.date))) {
      nextDate = startOfDay(event.data.date);
    } else {
      // 1) last saved date (one DB call)
      const last = await prisma.horoscope.findFirst({
        orderBy: { date: "desc" },
        select: { date: true }
      });
      const lastSavedDate = last?.date ?? DEFAULT_START_DATE;
      nextDate = startOfDay(addDays(lastSavedDate, 1));

      // 2) guard: don't generate too far ahead
      if (differenceInCalendarDays(nextDate, lastSavedDate) > MAX_GENERATION_DAYS) {
        return {
          ok: true,
          message: `Already generated ${MAX_GENERATION_DAYS} days ahead`,
          lastGenerated: lastSavedDate
        };
      }
    }

    // 3) generate once
    const prompt = `
Generate daily horoscopes for ALL zodiac signs for ${format(nextDate, "yyyy-MM-dd")} (UTC).
Return a JSON object where each key is a zodiac sign (ARIES, TAURUS, ..., PISCES).
Each sign must include:
- description: detailed description (≥30 chars)
- luckyColor (optional)
- luckyNumber (optional integer 1-99)
- mood (optional)
Return only the JSON object. Include nonce: ${nonce}
`.trim();

    const generated = await step.run("generate-horoscope", async () =>
      generateObject({ model: zai("glm-4.5-flash"), prompt, schema: AllZodiacDailySchema })
    );

    // 4) map to DB rows
    const rows = Object.entries(generated.object).map(([sign, data]) => ({
      zodiacSign: sign as ZodiacSign,
      date: nextDate,
      description: data.description,
      luckyColor: data.luckyColor ?? null,
      luckyNumber: data.luckyNumber ?? null,
      mood: data.mood ?? null
    }));

    // 5) batch insert; skipDuplicates prevents multiple inserts when unique constraint exists
    await prisma.horoscope.createMany({ data: rows, skipDuplicates: true });

    return { ok: true, displayDate: format(nextDate, "yyyy-MM-dd"), nonce, payload: event.data };
  }
);
