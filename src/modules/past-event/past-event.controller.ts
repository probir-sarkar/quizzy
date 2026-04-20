import Elysia from "elysia";
import { PastEventService } from "./past-event.service";

type GetByMonthDayParams = {
  query: {
    month: number;
    day: number;
  };
};

type GetByCategoryParams = {
  query: {
    category: string;
  };
};

export const PastEventController = new Elysia({ prefix: "/past-event" })
  .get("/by-month-day", ({ query }) => {
    const { month, day } = query as GetByMonthDayParams["query"];
    return PastEventService.getByMonthDay(month, day);
  })
  .get("/by-category", ({ query }) => {
    const { category } = query as GetByCategoryParams["query"];
    return PastEventService.getByCategory(category as any);
  })
  .get("/categories", () => PastEventService.getAllCategories());
