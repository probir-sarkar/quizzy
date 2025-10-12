import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const GRADIENT_FROM = "#7c3aed"; // purple
  const GRADIENT_TO = "#ec4899";   // fuchsia

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
            width: 100,
            height: 100,
            borderRadius: 24,
            background: "rgba(255,255,255,0.12)",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <div style={{ fontSize: 48 }}>✨</div>
        </div>

        {/* Brand name */}
        <div
          style={{
            display: "flex",
            fontSize: 28,
            fontWeight: 700,
            color: "#fdf4ff", // soft lilac/white
            marginBottom: 12,
            letterSpacing: 0.5,
          }}
        >
          Quiz Zone
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            fontSize: 56,
            fontWeight: 800,
            color: "#fff",
          }}
        >
          Daily Horoscopes
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: "flex",
            marginTop: 12,
            fontSize: 24,
            color: "rgba(255,255,255,0.9)",
          }}
        >
          Discover what the stars have in store for you today
        </div>

        {/* Badge */}
        <div
          style={{
            display: "flex",
            marginTop: 36,
            padding: "12px 24px",
            borderRadius: 12,
            background: "rgba(255,255,255,0.15)",
            fontSize: 22,
            fontWeight: 700,
            color: "#fff",
          }}
        >
          🌙 All 12 Zodiac Signs
        </div>
      </div>
    ),
    size
  );
}