import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
// @ts-ignore
import "./globals.css";
import Navbar from "@/components/common/navbar";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"]
});

export const metadata: Metadata = {
  title: "Quiz Zone – Fun Quizzes, Horoscopes & More",
  description: "Quiz Zone – Your hub for quizzes, horoscopes, and fun knowledge adventures all in one place."
};
export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={` ${poppins.className} flex min-h-full flex-col antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Navbar />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
