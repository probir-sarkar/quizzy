// app/opengraph-image.tsx
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// (optional) export const runtime = "edge";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          // Use ONE simple gradient only (supported)
          background: "linear-gradient(135deg, #FAFBFF, #EEF2FF)",
          fontFamily: "Inter, Arial, sans-serif",
          textAlign: "center",
          position: "relative",
          color: "#111827",
        }}
      >
        <div style={{ fontSize: 80, marginBottom: 16 }}>🏆</div>

        {/* Gradient pill (no bg-clip text) */}
        <div
          style={{
            padding: "12px 28px",
            borderRadius: 16,
            background: "linear-gradient(90deg, #7C3AED, #EC4899)",
            color: "white",
            fontSize: 84,
            fontWeight: 800,
            letterSpacing: -1,
            lineHeight: 1.05,
          }}
        >
          QuizMaster
        </div>

        <div
          style={{
            marginTop: 28,
            fontSize: 36,
            fontWeight: 700,
            color: "#374151",
          }}
        >
          Test Your Knowledge
        </div>
        <div style={{ marginTop: 8, fontSize: 24, color: "#6B7280" }}>
          Across Topics You Love
        </div>

        {/* Subtle corner icons */}
        <div style={{ position: "absolute", top: 36, left: 48, fontSize: 44, opacity: 0.7 }}>📚</div>
        <div style={{ position: "absolute", top: 36, right: 48, fontSize: 44, opacity: 0.7 }}>🌍</div>
        <div style={{ position: "absolute", bottom: 36, left: 60, fontSize: 44, opacity: 0.55 }}>🔬</div>
        <div style={{ position: "absolute", bottom: 36, right: 60, fontSize: 44, opacity: 0.55 }}>🎬</div>
      </div>
    ),
    size
  );
}
