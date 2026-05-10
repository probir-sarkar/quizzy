import NextTopLoader from "nextjs-toploader";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import { Providers } from "./providers";

// @ts-ignore
import "./globals.css";
import Script from "next/script";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"]
});

const baseUrl = process.env.BASE_URL ?? "https://quizzy.probir.dev";

export const metadata: Metadata = {
  title: "Quiz Zone – Fun Quizzes, Horoscopes & More",
  description: "Quiz Zone – Your hub for quizzes, horoscopes, and fun knowledge adventures all in one place.",
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: baseUrl
  },
  openGraph: {
    url: baseUrl,
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
