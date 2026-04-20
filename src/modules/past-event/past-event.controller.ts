import Elysia, { t } from "elysia";
import { PastEventService } from "./past-event.service";
import { EventCategory } from "@/generated/prisma/client";

const eventCategoryEnum = t.Union(
  (Object.keys(EventCategory) as Array<keyof typeof EventCategory>).map(cat => t.Literal(cat))
);

export const PastEventController = new Elysia({ prefix: "/past-event" })
  .get("/by-month-day", ({ query }) => {
    return PastEventService.getByMonthDay(query.month, query.day);
  }, {
    query: t.Object({
      month: t.Optional(t.Number()),
      day: t.Optional(t.Number())
    })
  })
  .get("/by-category", ({ query }) => {
    return PastEventService.getByCategory(query.category as EventCategory);
  }, {
    query: t.Object({
      category: eventCategoryEnum
    })
  })
  .get("/categories", () => PastEventService.getAllCategories());
