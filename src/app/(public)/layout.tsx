import { ThemeProvider } from "@/components/theme-provider";

import Navbar from "@/components/common/navbar";
import Footer from "@/components/common/footer";
import { Suspense } from "react";

export default function PublicLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <Navbar />
      </ThemeProvider>
      <main className="flex-1">
        <Suspense fallback={null}>
        {children}
        </Suspense></main>
      <Footer />
    </div>
  );
}
