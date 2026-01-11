import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { GoogleTagManager } from '@next/third-parties/google'
import { Suspense } from 'react';


// @ts-ignore
import "./globals.css";
import Navbar from "@/components/common/navbar";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"]
});

export const metadata: Metadata = {
  title: "Quiz Zone – Fun Quizzes, Horoscopes & More",
  description: "Quiz Zone – Your hub for quizzes, horoscopes, and fun knowledge adventures all in one place.",
  metadataBase: new URL("https://quizzone.club/"),
};
export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <GoogleTagManager gtmId="G-KMP0FXVWFL" />
      <body className={` ${poppins.className} flex min-h-full flex-col antialiased`}>
        <NextTopLoader color="#c800de" showSpinner={false} />
        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <Navbar />
            <main>{children}</main>
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  );
}
