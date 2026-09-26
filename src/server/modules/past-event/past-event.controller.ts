import { PastEventService } from "./past-event.service";
import { os } from "@orpc/server";
import { z } from "zod";
import { EventCategory } from "@/lib/enums";
import { isoDate } from "@/server/dto/common";

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
    return await PastEventService.getByMonthDay(month, day);
  });
