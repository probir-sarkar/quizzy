import { ImageResponse } from "next/og";

import { client } from "@/lib/orpc";
import { OG_INK, OG_MUTED, OG_SIZE, loadOgFonts, OgShell } from "@/lib/og";

export const alt = "Quiz Zone — take the quiz.";
export const size = OG_SIZE;
export const contentType = "image/png";

type Props = {
  params: Promise<{ slug: string }>;
};

function titleFontSize(length: number) {
  if (length <= 24) return 110;
  if (length <= 48) return 86;
  if (length <= 80) return 66;
  return 52;
}

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const post = await client.getQuizMetadata({ slug });

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
    { ...size, fonts: await loadOgFonts() }
  );
}
