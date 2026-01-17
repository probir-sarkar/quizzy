import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daily Horoscopes | Quizzy",
  description: "Discover what the stars have in store for you today with our daily horoscopes for all 12 zodiac signs.",
};

export default function HoroscopeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}