import { ImageResponse } from "next/og";
import prisma from "@/lib/prisma";


export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: { slug: string } };

export default async function Image({ params }: Props) {
  const quiz = await prisma.quiz.findUnique({
    where: { slug: params.slug },
    select: { title: true, description: true },
  });

  const title = quiz?.title ?? "Quizzone Quiz";
  const subtitle = quiz?.description ?? "Sharpen your skills with today’s challenge.";
  const GRADIENT_FROM = "#7c3aed";
  const GRADIENT_TO = "#ec4899";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          background: `linear-gradient(90deg, ${GRADIENT_FROM}, ${GRADIENT_TO})`,
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
          textAlign: "center",
        }}
      >
        {/* Icon */}
        <div
          style={{
            display: "flex",
            width: 90,
            height: 90,
            borderRadius: 20,
            background: "rgba(255,255,255,0.12)",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <div style={{ fontSize: 44 }}>📝</div>
        </div>

        {/* Brand name */}
        <div
          style={{
            display: "flex",
            fontSize: 26,
            fontWeight: 700,
            color: "#fdf4ff",
            marginBottom: 12,
            letterSpacing: 0.5,
          }}
        >
          Quiz Zone
        </div>

        {/* Quiz title */}
        <div
          style={{
            display: "flex",
            fontSize: 48,
            fontWeight: 800,
            color: "#fff",
            maxWidth: 960,
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>

        {/* Quiz subtitle */}
        <div
          style={{
            display: "flex",
            marginTop: 16,
            fontSize: 22,
            color: "rgba(255,255,255,0.9)",
            maxWidth: 880,
          }}
        >
          {subtitle}
        </div>

        {/* Badge */}
        <div
          style={{
            display: "flex",
            marginTop: 32,
            padding: "10px 20px",
            borderRadius: 12,
            background: "rgba(255,255,255,0.15)",
            fontSize: 20,
            fontWeight: 700,
            color: "#fff",
          }}
        >
          ✨ New Quiz Every Day
        </div>
      </div>
    ),
    size
  );
}
