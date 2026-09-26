import { os } from "@orpc/server";
import { z } from "zod";
import { db } from "@/lib/prisma";
import { EventCategory } from "@/lib/enums";
import { isoDate } from "./common";

const pastEventRowSchema = z.object({
  id: z.number(),
  month: z.number(),
  day: z.number(),
  year: z.number(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  category: z.enum(EventCategory),
  tags: z.array(z.string()),
  sourceUrls: z.array(z.string()),
  metadata: z.unknown(),
  isPublished: z.boolean(),
  createdAt: isoDate,
  updatedAt: isoDate,
  eventDate: isoDate.nullable()
});

async function getByMonthDay(month?: number, day?: number) {
  // Default to today's date if not provided
  const today = new Date();
  const selectedMonth = month ?? today.getMonth() + 1; // JavaScript months are 0-indexed
  const selectedDay = day ?? today.getDate();

  try {
    const rows = await db.orm.public.PastEvent
      .where({ month: selectedMonth, day: selectedDay, isPublished: true })
      .orderBy([(e) => e.year.asc(), (e) => e.title.asc()])
      .all()

    const events = rows.map((event) => ({
      ...event,
      tags: [...(event.tags ?? [])],
      sourceUrls: [...(event.sourceUrls ?? [])]
    }))

    return { events, month: selectedMonth, day: selectedDay }
  } catch (error) {
    console.error('Error fetching past events:', error)
    return { events: [], month: selectedMonth, day: selectedDay }
  }
}

export const getPastEventsByMonthDay = os
  .input(
    z.object({
      month: z.number().optional(),
      day: z.number().optional()
    })
  )
  .output(
    z.object({
      events: z.array(pastEventRowSchema),
      month: z.number(),
      day: z.number()
    })
  )
  .handler(async ({ input: { month, day } }) => {
    return await getByMonthDay(month, day);
  });
