import { createFileRoute, notFound } from "@tanstack/react-router";
import HistoryView from "@/components/this-day-in-history/history-view";
import { HomeSkeleton } from "@/components/route-fallbacks/home-skeleton";
import { MONTH_NAMES, formatHistorySlug, parseHistorySlug } from "@/lib/history-utils";
import { BASE_URL } from "@/lib/constants";
import { client } from "@/lib/orpc";

export const Route = createFileRoute("/this-day-in-history/$slug")({
  loader: async ({ params }) => {
    const date = parseHistorySlug(params.slug);

    if (!date) throw notFound();

    const response = await client.getPastEventsByMonthDay({ month: date.month, day: date.day });
    return { ...date, response };
  },
  pendingComponent: HomeSkeleton,
  head: ({ loaderData }) => {
    if (!loaderData) return {};

    const formatted = `${loaderData.day} ${MONTH_NAMES[loaderData.month - 1]}`;
    const title = `${formatted} in History — Events On This Day | Quizzy`;
    const description = `Discover the remarkable historical events, discoveries and milestones filed for ${formatted}. What happened on this day, straight from the Quizzy archive.`;
    // Lenient aliases (e.g. `25-may`) canonicalize to the suffixed slug.
    const canonical = `${BASE_URL}/this-day-in-history/${formatHistorySlug(loaderData.month, loaderData.day)}`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: canonical },
        { property: "og:site_name", content: "Quizzy" },
        { property: "og:type", content: "website" }
      ],
      links: [{ rel: "canonical", href: canonical }]
    };
  },
  component: HistoryDatePage
});

function HistoryDatePage() {
  const { month, day, response } = Route.useLoaderData();

  return <HistoryView response={response} month={month} day={day} />;
}
