import { ImageResponse } from "next/og";

import {
  ItalicAccent,
  OG_INK,
  OG_MUTED,
  OG_SIZE,
  POP,
  loadOgFonts,
  OgShell
} from "@/lib/og";

export const alt =
  "Quiz Zone horoscope desk — the stars, sorted. Daily readings for all 12 zodiac signs.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <OgShell section="Horoscope Desk">
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 28,
            fontSize: 100,
            fontWeight: 900,
            lineHeight: 0.9,
            letterSpacing: -3,
            textTransform: "uppercase",
            color: OG_INK
          }}
        >
          <div style={{ display: "flex" }}>The</div>
          <div
            style={{
              display: "flex",
              borderBottom: `14px solid ${POP.lime}`,
              paddingBottom: 8
            }}
          >
            Stars,
          </div>
          <div style={{ display: "flex" }}>
            <ItalicAccent fontSize={84}>sorted.</ItalicAccent>
          </div>
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
          What the sky has in store for your sign — a fresh reading for all 12
          zodiac signs, every morning.
        </div>
      </OgShell>
    ),
    { ...size, fonts: await loadOgFonts() }
  );
}
