import { inngest } from "../client";
import prisma from "@/lib/prisma";
import { groq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { z } from "zod";
import { kebabCase } from "es-toolkit";
import { addDays } from "date-fns";

const BASE_LEAP_YEAR = 2024; // keeps Feb 29 in cycle

const CATEGORIES = [
  "war",
  "discovery",
  "politics",
  "science",
  "art",
  "sports",
  "technology",
  "medicine",
  "exploration",
  "literature",
  "music",
  "economy",
  "religion",
  "disaster",
  "revolution",
  "invention"
] as const;

const EventSchema = z.object({
  month: z.number().int().min(1).max(12),
  day: z.number().int().min(1).max(31),
  year: z.number().int().positive(),
  title: z.string().min(3).max(200),
  description: z.string().min(20),
  category: z.enum(CATEGORIES),
  tags: z.array(z.string()).default([]),
  sourceUrls: z.array(z.url()).default([])
});
type Category = z.infer<typeof EventSchema>["category"];

/** Get next month/day on an always-leap calendar (2024). */
function nextLeapDate(lastMonth?: number | null, lastDay?: number | null) {
  const start =
    lastMonth && lastDay
      ? new Date(Date.UTC(BASE_LEAP_YEAR, lastMonth - 1, lastDay))
      : new Date(Date.UTC(BASE_LEAP_YEAR, 0, 0)); // Dec 31 → +1 day = Jan 1
  const next = addDays(start, 1);
  return { month: next.getUTCMonth() + 1, day: next.getUTCDate() };
}

export const generatePastEvent = inngest.createFunction(
  { id: "generate-past-event", name: "Generate Past Event (15 min, always-leap)" },
  { cron: "*/15 * * * *" }, // every 5 minutes
  async ({ step }) => {
    // 1️⃣ Get last updated record
    const last = await step.run("last-event", () =>
      prisma.pastEvent.findFirst({
        orderBy: [{ updatedAt: "desc" }],
        select: { month: true, day: true }
      })
    );

    // 2️⃣ Compute next (month, day)
    const { month, day } = nextLeapDate(last?.month, last?.day);

    // 3️⃣ Pick category (round-robin for balance)
    const totalCount = await step.run("total-count", () => prisma.pastEvent.count());
    const category: Category = CATEGORIES[totalCount % CATEGORIES.length];

    // 4️⃣ Generate event via Groq
    const { object } = await step.run("groq-generate", async () => {
      const { object } = await generateObject({
        model: groq("openai/gpt-oss-120b"),
        schema: EventSchema,
        prompt: `You are an expert historical data generator.

Create exactly ONE concise, factual event that happened on **${month}/${day}** 
in the **Common Era (year > 0)**, belonging to the category **"${category}"**.

Requirements:
- The event must be historically accurate or widely documented.
- Choose any valid year between 1 CE and the present.
- Keep the title short and factual (no opinions).
- The description should be 2–3 clear sentences summarizing what happened and its significance.
- Include at least one credible source URL (Wikipedia or a well-known archive).
- Avoid duplication of previous events by varying year and region.
- Respond ONLY with a valid JSON object matching this format:`.trim()
      });
      return { object };
    });

    // 5️⃣ Upsert (idempotent)
    const slug = kebabCase(`${object.title}-${object.year}`);
    const saved = await step.run("save-event", () =>
      prisma.pastEvent.upsert({
        where: {
          month_day_year_slug: {
            month: object.month,
            day: object.day,
            year: object.year,
            slug
          }
        },
        update: {
          description: object.description,
          category: object.category,
          tags: object.tags,
          sourceUrls: object.sourceUrls,
          isPublished: true,
          eventDate: new Date(Date.UTC(object.year, object.month - 1, object.day))
        },
        create: {
          month: object.month,
          day: object.day,
          year: object.year,
          title: object.title,
          slug,
          description: object.description,
          category: object.category,
          tags: object.tags,
          sourceUrls: object.sourceUrls,
          isPublished: true,
          eventDate: new Date(Date.UTC(object.year, object.month - 1, object.day))
        }
      })
    );

    return { month, day, category, id: saved.id, year: saved.year, title: saved.title };
  }
);
