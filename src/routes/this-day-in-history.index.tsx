import { createFileRoute } from "@tanstack/react-router";
import HistoryView from "@/components/this-day-in-history/history-view";
import { HomeSkeleton } from "@/components/route-fallbacks/home-skeleton";
import { BASE_URL } from "@/lib/constants";
import { client } from "@/lib/orpc";

/** Lenient `?month=&day=` validation — bad values fall back to "today" (API default). */
function validateSearch(search: Record<string, unknown>) {
  const month = Number(search.month);
  const day = Number(search.day);
  const parsed: { month?: number; day?: number } = {};

  if (search.month !== undefined && Number.isInteger(month) && month >= 1 && month <= 12) parsed.month = month;
  if (search.day !== undefined && Number.isInteger(day) && day >= 1 && day <= 31) parsed.day = day;

  return parsed;
}

export const Route = createFileRoute("/this-day-in-history/")({
  validateSearch,
  loaderDeps: ({ search: { month, day } }) => ({ month, day }),
  // API defaults to today when month/day are omitted.
  loader: ({ deps }) => client.getPastEventsByMonthDay({ month: deps.month, day: deps.day }),
  pendingComponent: HomeSkeleton,
  head: () => ({
    meta: [
      { title: "This Day in History - Quizzy" },
      {
        name: "description",
        content:
          "Journey through time and explore remarkable historical events that happened on this day. Wars, discoveries, births of ideas — the archive files them all."
      },
      { property: "og:site_name", content: "Quizzy" },
      { property: "og:type", content: "website" }
    ],
    links: [{ rel: "canonical", href: `${BASE_URL}/this-day-in-history` }]
  }),
  component: ThisDayInHistoryPage
});

function ThisDayInHistoryPage() {
  const response = Route.useLoaderData();
  const { month, day } = Route.useSearch();

  return <HistoryView response={response} month={month} day={day} />;
}
