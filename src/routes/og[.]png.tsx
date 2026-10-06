import ImageResponse from "takumi-js/response";
import { createFileRoute } from "@tanstack/react-router";

import { ItalicAccent, OG_INK, OG_MUTED, OG_SIZE, POP, loadOgFonts, OgShell } from "@/lib/og";

// Root social card (1200×630 PNG), rendered server-side by Takumi.
export const Route = createFileRoute("/og.png")({
  server: {
    handlers: {
      GET: async () =>
        new ImageResponse(
          (
            <OgShell section="Daily Press">
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 28,
                  fontSize: 132,
                  fontWeight: 900,
                  lineHeight: 0.9,
                  letterSpacing: -4,
                  textTransform: "uppercase",
                  color: OG_INK
                }}
              >
                <div
                  style={{
                    display: "flex",
                    borderBottom: `14px solid ${POP.lime}`,
                    paddingBottom: 8
                  }}
                >
                  Know
                </div>
                <div style={{ display: "flex" }}>
                  <ItalicAccent fontSize={104}>it</ItalicAccent>
                </div>
                <div style={{ display: "flex" }}>All?</div>
              </div>

              <div
                style={{
                  marginTop: 40,
                  maxWidth: 880,
                  fontSize: 31,
                  lineHeight: 1.4,
                  color: OG_MUTED
                }}
              >
                Quizzes and this day in history — brain food printed fresh every
                morning.
              </div>
            </OgShell>
          ),
          { ...OG_SIZE, fonts: await loadOgFonts() }
        ),
    },
  },
});
