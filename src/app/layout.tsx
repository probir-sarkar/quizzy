import NextTopLoader from "nextjs-toploader";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import { Providers } from "./providers";
import { BASE_URL } from "@/lib/constants";
import "../lib/orpc.server"; // for pre-rendering

// @ts-ignore
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"]
});

export const metadata: Metadata = {
  title: "Quiz Zone – Fun Quizzes, Horoscopes & More",
  description: "Quiz Zone – Your hub for quizzes, horoscopes, and fun knowledge adventures all in one place.",
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: BASE_URL
  },
  openGraph: {
    url: BASE_URL,
    siteName: "Quizzy",
    type: "website"
  }
};
export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" data-scroll-behavior="smooth" suppressHydrationWarning>
      <GoogleTagManager gtmId="G-KMP0FXVWFL" />

      <Providers>
        <body suppressHydrationWarning className={` ${poppins.className} flex min-h-full flex-col antialiased`}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-violet-600 focus:text-white focus:rounded-lg focus:font-medium"
          >
            Skip to main content
          </a>
          <NextTopLoader color="#c800de" showSpinner={false} />
          <div id="main-content" className="flex-1">
            {children}
          </div>
        </body>
      </Providers>
    </html>
  );
}
