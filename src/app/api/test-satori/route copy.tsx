import { ImageResponse } from "next/og";
import { zodiacSigns } from "@/lib/constants";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sign = searchParams.get("sign")?.toUpperCase() || "ARIES";

  const zodiac = zodiacSigns.find((z) => z.name === sign) || zodiacSigns[0];
  const { symbol, name, dates, element } = zodiac;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "600px",
          height: "600px",
          padding: "40px",
          color: "white",
          fontFamily: "sans-serif",
          // Softer, layered gradients to avoid banding
          background: [
            // soft blue glow top-left
            "radial-gradient(60% 55% at 20% 15%, rgba(59,130,246,0.35) 0%, rgba(59,130,246,0.18) 35%, rgba(59,130,246,0.08) 55%, rgba(59,130,246,0.0) 80%)",
            // gentle red accent top-right
            "radial-gradient(55% 50% at 80% 18%, rgba(244,63,94,0.25) 0%, rgba(244,63,94,0.12) 40%, rgba(244,63,94,0.0) 78%)",
            // subtle teal lift bottom-center
            "radial-gradient(70% 60% at 50% 80%, rgba(16,185,129,0.14) 0%, rgba(16,185,129,0.06) 38%, rgba(16,185,129,0.0) 78%)",
            // dark base
            "linear-gradient(180deg, #0b1220 0%, #0a0f1c 100%)",
          ].join(", "),
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "70px",
                height: "70px",
                borderRadius: "16px",
                background:
                  "linear-gradient(180deg, #a78bfa 0%, #7c3aed 100%)",
                marginRight: "16px",
                fontSize: "42px",
              }}
            >
              {symbol}
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "44px",
                  fontWeight: 800,
                  letterSpacing: "0.5px",
                }}
              >
                {name}
              </span>
              <span style={{ fontSize: "22px", color: "#cbd5e1" }}>{dates}</span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px 18px",
              borderRadius: "18px",
              background: "#ef4444",
              fontSize: "20px",
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            {element.icon} {element.name}
          </div>
        </div>

        {/* DESCRIPTION */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "0 12px",
            minHeight: "220px",
          }}
        >
          <p
            style={{
              fontSize: "22px",
              lineHeight: 1.6,
              color: "#e2e8f0",
            }}
          >
            A day of bold beginnings and assertive action for {name}. Your
            natural leadership qualities will shine as you take charge of
            situations that require decisive action.
          </p>
        </div>

        {/* FOOTER BADGES */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            flexWrap: "wrap",
            marginTop: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              padding: "10px 18px",
              borderRadius: "14px",
              background: "#2563eb",
              fontSize: "18px",
            }}
          >
            Lucky Color: Red
          </div>
          <div
            style={{
              display: "flex",
              padding: "10px 18px",
              borderRadius: "14px",
              background: "#7c3aed",
              fontSize: "18px",
            }}
          >
            Lucky Number: 7
          </div>
          <div
            style={{
              display: "flex",
              padding: "10px 18px",
              borderRadius: "14px",
              background: "#059669",
              fontSize: "18px",
            }}
          >
            Mood: Energetic
          </div>
        </div>
      </div>
    ),
    { width: 600, height: 600 }
  );
}
