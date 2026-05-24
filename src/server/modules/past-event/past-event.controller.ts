import { PastEventService } from "./past-event.service";
import { os } from "@orpc/server";
import { z } from "zod";

export const getPastEventsByMonthDay = os
  .input(
    z.object({
      month: z.number().optional(),
      day: z.number().optional()
    })
  )
  .handler(async ({ input: { month, day } }) => {
    return await PastEventService.getByMonthDay(month, day);
  });
