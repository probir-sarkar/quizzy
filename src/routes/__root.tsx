import type { ReactNode } from "react";
import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/common/navbar";
import Footer from "@/components/common/footer";
import { TopLoader } from "@/components/common/top-loader";
import { RouteError } from "@/components/common/route-error";
import { RouteNotFound } from "@/components/common/route-not-found";
import { BASE_URL } from "@/lib/constants";

import "@fontsource-variable/archivo";
import "@fontsource-variable/archivo/wght-italic.css";
import "@fontsource/space-mono/400.css";
import "@fontsource/space-mono/400-italic.css";
import "@fontsource/space-mono/700.css";
import "@fontsource/space-mono/700-italic.css";
import "@/globals.css";

/** Same tag @next/third-parties' <GoogleTagManager> injected. */
const GTM_SCRIPT = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','G-KMP0FXVWFL');`;

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Quiz Zone – Fun Quizzes & More" },
      {
        name: "description",
        content: "Quiz Zone – Your hub for quizzes and fun knowledge adventures all in one place."
      },
      { property: "og:image", content: `${BASE_URL}/og.png` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${BASE_URL}/og.png` }
    ],
    links: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
    scripts: [{ children: GTM_SCRIPT }]
  }),
  errorComponent: RouteError,
  notFoundComponent: RouteNotFound,
  component: RootComponent
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <RootDocument>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:border-2 focus:border-foreground focus:bg-foreground focus:px-4 focus:py-2 focus:text-background focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest"
          >
            Skip to main content
          </a>
          <TopLoader />
          <div id="main-content" className="flex-1">
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">
                <Outlet />
              </main>
              <Footer />
            </div>
          </div>
        </ThemeProvider>
      </QueryClientProvider>
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="h-full" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning className="flex min-h-full flex-col antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}
