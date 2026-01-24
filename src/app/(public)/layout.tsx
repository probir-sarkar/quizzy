import { ThemeProvider } from "@/components/theme-provider";
import { Suspense } from "react";

import Navbar from "@/components/common/navbar";

export default function PublicLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <Navbar />
      <main>{children}</main>
    </ThemeProvider>
  );
}
