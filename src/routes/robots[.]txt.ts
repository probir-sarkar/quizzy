import { createFileRoute } from "@tanstack/react-router";

const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin/

Sitemap: https://quizzone.club/sitemap.xml
`;

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () => new Response(robotsTxt, { headers: { "content-type": "text/plain" } }),
    },
  },
});
