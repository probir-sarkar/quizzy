import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HistoryView from "@/components/this-day-in-history/history-view";
import {
  MONTH_NAMES,
  allHistorySlugs,
  formatHistorySlug,
  parseHistorySlug
} from "@/lib/history-utils";
import { BASE_URL } from "@/lib/constants";

type Props = {
  params: Promise<{ slug: string }>;
};

/** Every date of the year prerenders as its own SEO page (366 slugs). */
export function generateStaticParams() {
  return allHistorySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const date = parseHistorySlug(slug);

  if (!date) return {};

  const formatted = `${date.day} ${MONTH_NAMES[date.month - 1]}`;
  const title = `${formatted} in History — Events On This Day | Quizzy`;
  const description = `Discover the remarkable historical events, discoveries and milestones filed for ${formatted}. What happened on this day, straight from the Quizzy archive.`;

  return {
    title,
    description,
    alternates: {
      // Lenient aliases (e.g. `25-may`) canonicalize to the suffixed slug.
      canonical: `${BASE_URL}/this-day-in-history/${formatHistorySlug(date.month, date.day)}`
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/this-day-in-history/${formatHistorySlug(date.month, date.day)}`,
      siteName: "Quizzy",
      type: "website"
    }
  };
}

export default async function HistoryDatePage({ params }: Props) {
  const { slug } = await params;
  const date = parseHistorySlug(slug);

  if (!date) notFound();

  return <HistoryView month={date.month} day={date.day} />;
}
