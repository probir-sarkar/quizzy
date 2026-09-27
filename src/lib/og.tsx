import { readFile } from "node:fs/promises";
import { join } from "node:path";

import type { CSSProperties, ReactNode } from "react";

// ---------------------------------------------------------------------------
// Shared primitives for the OG images (1200×630), following DESIGN.md's
// monochrome editorial system. satori speaks no OKLCH, so the tokens from
// globals.css (light theme) are approximated in hex.
//
// One minimal template for every card: big display title over a short muted
// line, a fixed lime accent, and a footer strip with the brand tile — no
// per-page variation beyond the text itself.
// ---------------------------------------------------------------------------

export const OG_SIZE = { width: 1200, height: 630 };

const INK = "#0a0a0a";
const PAPER = "#fafafa";
const MUTED = "#555555";
const RULE = "rgba(10, 10, 10, 0.35)";

export const POP = {
  violet: "#e9d5ff",
  lime: "#bef264",
  cyan: "#bae6fd",
  rose: "#fecdd3",
  amber: "#fde68a",
  blue: "#c7d2fe"
} as const;

export type PopColor = keyof typeof POP;

// Only the faces actually used, to stay under the 500KB OG bundle limit:
// Archivo 400 (body) / 900 (display), Space Mono 700 (labels) / 400 italic
// (accent voice). Headless shells may resolve cwd elsewhere, so font reads
// are anchored at module load from the repo's src/fonts directory.
const fontsPromise: Promise<
  { name: string; data: Buffer; weight: 400 | 700 | 900; style: "normal" | "italic" }[]
> = Promise.all([
  readFile(join(process.cwd(), "src/fonts/Archivo-Regular.ttf")),
  readFile(join(process.cwd(), "src/fonts/Archivo-Black.ttf")),
  readFile(join(process.cwd(), "src/fonts/SpaceMono-Bold.ttf")),
  readFile(join(process.cwd(), "src/fonts/SpaceMono-Italic.ttf"))
]).then(([archivoRegular, archivoBlack, monoBold, monoItalic]) => [
  { name: "Archivo", data: archivoRegular, weight: 400, style: "normal" as const },
  { name: "Archivo", data: archivoBlack, weight: 900, style: "normal" as const },
  { name: "Space Mono", data: monoBold, weight: 700, style: "normal" as const },
  { name: "Space Mono", data: monoItalic, weight: 400, style: "italic" as const }
]);

export function loadOgFonts() {
  return fontsPromise;
}

const MONO = '"Space Mono"';
const SANS = '"Archivo"';

// The Q mark from src/app/icon.svg: ink tile, pastel pop offset, white Q.
function BrandTile({ size, pop }: { size: number; pop: string }) {
  const offset = Math.round(size * 0.2);
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        flexShrink: 0,
        marginRight: offset,
        display: "flex"
      }}
    >
      <div
        style={{
          position: "absolute",
          left: offset,
          top: offset,
          width: size,
          height: size,
          background: pop
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: size,
          height: size,
          background: INK,
          display: "flex"
        }}
      >
        <div
          style={{
            position: "absolute",
            left: size * 0.155,
            top: size * 0.155,
            width: size * 0.6,
            height: size * 0.6,
            borderRadius: "50%",
            border: `${Math.max(3, size * 0.19)}px solid ${PAPER}`
          }}
        />
        <div
          style={{
            position: "absolute",
            left: size * 0.64,
            top: size * 0.71,
            width: size * 0.32,
            height: size * 0.21,
            background: PAPER,
            transform: "rotate(45deg)"
          }}
        />
      </div>
    </div>
  );
}

const monoLabel = (fontSize: number, extra?: CSSProperties): CSSProperties => ({
  fontFamily: MONO,
  fontWeight: 700,
  fontSize,
  letterSpacing: 3,
  textTransform: "uppercase",
  ...extra
});

type ShellProps = {
  // Right-hand footer label, e.g. "Daily Press" or "Horoscope Desk".
  section: string;
  children: ReactNode;
};

// Paper sheet with a dotted-rule footer strip; content centered above it.
function OgShell({ section, children }: ShellProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: PAPER,
        padding: 56,
        fontFamily: SANS,
        color: INK
      }}
    >
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {children}
      </div>

      <div
        style={{
          borderTop: `3px dashed ${RULE}`,
          paddingTop: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 16,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: MUTED
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <BrandTile size={36} pop={POP.lime} />
          <div style={{ marginLeft: 16 }}>Quiz Zone</div>
        </div>
        <div style={monoLabel(16)}>{section}</div>
      </div>
    </div>
  );
}

// Italic Space Mono accent word inside a display headline (DESIGN.md §5).
const ItalicAccent = ({ children, fontSize }: { children: string; fontSize: number }) => (
  <span
    style={{
      fontFamily: MONO,
      fontStyle: "italic",
      fontWeight: 400,
      fontSize,
      letterSpacing: 0,
      textTransform: "none" as const
    }}
  >
    {children}
  </span>
);

export { ItalicAccent, OgShell, monoLabel };
export const OG_INK = INK;
export const OG_MUTED = MUTED;
