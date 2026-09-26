import HistoryView from "@/components/this-day-in-history/history-view";
import { client } from "@/lib/orpc";

type Props = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export const metadata = {
  title: "This Day in History - Quizzy",
  description:
    "Journey through time and explore remarkable historical events that happened on this day. Wars, discoveries, births of ideas — the archive files them all."
};

export default async function ThisDayInHistoryPage({ searchParams }: Props) {
  const { month, day } = await searchParams;

  // API defaults to today when month/day are omitted.
  return (
    <HistoryView
      month={month ? Number(month) : undefined}
      day={day ? Number(day) : undefined}
    />
  );
}
