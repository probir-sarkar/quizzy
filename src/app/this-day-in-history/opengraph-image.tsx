import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const GRADIENT_FROM = "#1e40af"; // blue
  const GRADIENT_TO = "#7c3aed"; // purple

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
          background: `linear-gradient(135deg, ${GRADIENT_FROM}, ${GRADIENT_TO})`,
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Pattern */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 35px,
              rgba(255,255,255,.1) 35px,
              rgba(255,255,255,.1) 70px
            )`,
          }}
        />

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
            position: "relative",
            zIndex: 1,
          }}
        >
          <div style={{ fontSize: 48 }}>📚</div>
        </div>

        {/* Brand name */}
        <div
          style={{
            display: "flex",
            fontSize: 28,
            fontWeight: 700,
            color: "#f0f9ff", // light blue/white
            marginBottom: 12,
            letterSpacing: 0.5,
            position: "relative",
            zIndex: 1,
          }}
        >
          Quizzy
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            fontSize: 56,
            fontWeight: 800,
            color: "#fff",
            marginBottom: 8,
            position: "relative",
            zIndex: 1,
          }}
        >
          This Day in History
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "rgba(255,255,255,0.9)",
            marginBottom: 24,
            maxWidth: "80%",
            position: "relative",
            zIndex: 1,
          }}
        >
          Explore remarkable historical events that shaped our world
        </div>

        {/* Feature Pills */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 32,
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              padding: "8px 16px",
              borderRadius: 20,
              background: "rgba(255,255,255,0.15)",
              fontSize: 16,
              fontWeight: 600,
              color: "#fff",
              backdropFilter: "blur(10px)",
            }}
          >
            ⚔️ Wars & Conflicts
          </div>
          <div
            style={{
              padding: "8px 16px",
              borderRadius: 20,
              background: "rgba(255,255,255,0.15)",
              fontSize: 16,
              fontWeight: 600,
              color: "#fff",
              backdropFilter: "blur(10px)",
            }}
          >
            🔬 Discoveries
          </div>
          <div
            style={{
              padding: "8px 16px",
              borderRadius: 20,
              background: "rgba(255,255,255,0.15)",
              fontSize: 16,
              fontWeight: 600,
              color: "#fff",
              backdropFilter: "blur(10px)",
            }}
          >
            🎨 Art & Culture
          </div>
        </div>

        {/* Bottom Badge */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            padding: "12px 24px",
            borderRadius: 12,
            background: "rgba(255,255,255,0.1)",
            fontSize: 18,
            fontWeight: 600,
            color: "#fff",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          📅 Journey Through Time
        </div>
      </div>
    ),
    size
  );
}