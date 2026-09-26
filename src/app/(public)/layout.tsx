import { Suspense } from "react";
import { ThemeProvider } from "@/components/theme-provider";

import Navbar from "@/components/common/navbar";
import Footer from "@/components/common/footer";

export default function PublicLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="flex min-h-screen flex-col">
        {/* usePathname() in the navbar streams in after the static shell */}
        <Suspense fallback={<div className="fixed inset-x-0 top-0 z-50 h-16 border-b-2 border-foreground bg-background" />}>
          <Navbar />
        </Suspense>
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
