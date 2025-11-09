import { Metadata } from "next";

export const metadata: Metadata = {
  title: "This Day in History | Quizzy",
  description: "Explore fascinating historical events that happened on this day throughout history.",
};

export default function ThisDayInHistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}