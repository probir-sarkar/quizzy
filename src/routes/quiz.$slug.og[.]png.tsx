import ImageResponse from "takumi-js/response";
import { createFileRoute } from "@tanstack/react-router";

import { client } from "@/lib/orpc";
import { OG_INK, OG_MUTED, OG_SIZE, loadOgFonts, OgShell } from "@/lib/og";

// Per-quiz social card (1200×630 PNG) rendered server-side by Takumi.
export const Route = createFileRoute("/quiz/$slug/og.png")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const post = await client.getQuizMetadata({ slug: params.slug });

        const title = post?.quizPageTitle ?? post?.title ?? "Test your knowledge";
        // Truncate at a word boundary so the ellipsis never orphans a letter.
        const rawDescription = post?.description ?? "";
        const description =
          rawDescription.length > 120
            ? rawDescription.slice(0, 120).replace(/\s+\S*$/, "") + "…"
            : rawDescription;

        return new ImageResponse(
          (
            <OgShell section={post?.category ? `${post.category.name} Quiz` : "Take the Quiz"}>
              <div
                style={{
                  maxWidth: 1020,
                  display: "flex",
                  fontSize: titleFontSize(title.length),
                  fontWeight: 900,
                  lineHeight: 0.95,
                  letterSpacing: -2,
                  textTransform: "uppercase",
                  color: OG_INK
                }}
              >
                {title}
              </div>

              {description ? (
                <div
                  style={{
                    marginTop: 32,
                    maxWidth: 880,
                    fontSize: 27,
                    lineHeight: 1.45,
                    color: OG_MUTED
                  }}
                >
                  {description}
                </div>
              ) : null}
            </OgShell>
          ),
          { ...OG_SIZE, fonts: await loadOgFonts() }
        );
      },
    },
  },
});

function titleFontSize(length: number) {
  if (length <= 24) return 110;
  if (length <= 48) return 86;
  if (length <= 80) return 66;
  return 52;
}
