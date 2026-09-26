# Quizzy Design Guide

The design system behind the monochrome editorial redesign. Everything on the
site is built from the primitives in this document — if a new UI element can't
be composed from them, reconsider the element before extending the system.

The one-line pitch: **ink on paper, printed with one pastel.** Strict black &
white, hard borders, oversized grotesque type — and the only color on any page
is a handful of pastel offset shadows and tiny functional chips.

---

## 1. Core principles

1. **Monochrome first.** Structure, hierarchy and emphasis come from size,
   weight, borders and spacing — never from color.
2. **Borders do the work color normally does.** A 2px ink border is our
   card edge, divider, button edge and hover state all at once.
3. **Color is an accent, not a palette.** Pastels appear only as pop shadows
   and 10px status chips. If a screenshot of the page looks good in grayscale,
   it's correct.
4. **Type is the interface.** Display sizes are huge on purpose; micro-labels
   are tiny, uppercase and mono. The contrast between the two *is* the look.
5. **Animation tracks, it doesn't perform.** Motion follows scroll (reveals,
   progress, parallax, count-ups). Nothing loops, bounces, or begs for
   attention. Hover states belong to CSS, entrance states to `motion`.

---

## 2. Color tokens

Defined in `src/app/globals.css` as OKLCH CSS variables and mapped to Tailwind
via `@theme inline`. Use the Tailwind semantic classes, never raw values.

| Token | Light | Dark | Tailwind class |
| --- | --- | --- | --- |
| `--background` | paper `oklch(0.985 0 0)` | ink `oklch(0.145 0 0)` | `bg-background` |
| `--foreground` | ink `oklch(0.13 0 0)` | paper `oklch(0.975 0 0)` | `text-foreground`, `border-foreground` |
| `--card` | white | `oklch(0.18 0 0)` | `bg-card` |
| `--muted` / `--muted-foreground` | light gray / mid gray | dark gray / light gray | `text-muted-foreground`, `bg-muted` |
| `--border` / `--input` / `--ring` | full-strength ink | full-strength paper | `border`, `border-input` |

Notes:

- The theme is **inverted ink, not gray-on-gray**. In dark mode borders and
  text are near-white at full strength — never faded to `white/20`.
- `::selection` is inverted (ink background, paper text). Don't override it.
- All `<img>` elements get `grayscale(1) contrast(1.05)` globally (see
  `@layer base` in `globals.css`). Photography and engravings must survive
  this — don't fight the filter.

### The pastel pop palette

The only color on the site. Six tints, defined once per theme:

| Variable | Light (solid pastel) | Dark (ghosted, ~40% alpha) |
| --- | --- | --- |
| `--pop-violet` | `oklch(0.9 0.07 300)` | `oklch(0.72 0.14 300 / 0.45)` |
| `--pop-lime` | `oklch(0.93 0.17 122)` | `oklch(0.8 0.17 122 / 0.4)` |
| `--pop-cyan` | `oklch(0.91 0.08 214)` | `oklch(0.78 0.1 214 / 0.4)` |
| `--pop-rose` | `oklch(0.91 0.06 8)` | `oklch(0.75 0.1 8 / 0.4)` |
| `--pop-amber` | `oklch(0.93 0.11 90)` | `oklch(0.8 0.13 90 / 0.4)` |
| `--pop-blue` | `oklch(0.92 0.06 258)` | `oklch(0.78 0.09 258 / 0.4)` |

Semantics attached to pastels (functional color, kept tiny):

- **lime** — easy / correct / positive
- **amber** — medium
- **rose** — hard / wrong
- violet, cyan, blue — purely decorative pop-shadow rotation

---

## 3. Borders, rules and corners

- **Cards, buttons, inputs, dropdowns:** `border-2 border-foreground`, square
  corners (`--radius: 0rem` site-wide). No rounded corners except pills.
- **Pills (tags, category chips):** `rounded-full border-2 border-foreground`.
- **Dotted rules:** `rule-dotted` utility — a chunky 3px dotted top border at
  35% ink. Use to separate rows in lists/tables and to top-align stat strips.
  ```html
  <div class="rule-dotted pt-6">…</div>
  ```
- **Section seams:** sections are separated by `border-b-2 border-foreground`
  on full-bleed wrappers, not by background changes.
- **Empty/placeholder blocks:** `border-2 border-dashed border-foreground/40`.

---

## 4. Pop shadows

Two utilities in `globals.css`:

```html
<!-- hard offset shadow; the offset defaults to 6px/6px -->
<article class="border-2 border-foreground bg-card shadow-pop
                [--pop:var(--pop-violet)] [--pop-x:6px] [--pop-y:6px]">

<!-- hover interaction: the card slides INTO its shadow, shadow collapses -->
<article class="pop-hover shadow-pop [--pop:var(--pop-lime)] …">
```

Rules:

- Every elevated surface gets a pop color. Cycle through the palette by index
  so grids feel printed, not templated (see `POP_COLORS` in
  `src/components/home-page/quiz-card.tsx`).
- Default offset is 6px for cards, 3–4px for small controls (buttons, social
  squares), 8–10px for hero plates and page-level panels.
- Never stack two pop shadows on nested elements; the innermost interactive
  element owns the shadow.
- `pop-hover` uses the CSS `translate` property (not `transform`) so it never
  fights `motion`'s transforms.

---

## 5. Typography

Loaded in `src/app/layout.tsx` via `next/font`:

- **Archivo** (variable 100–900) — `--font-archivo` → `font-sans`. Everything:
  display, body, UI.
- **Space Mono** (400/700, regular + italic) — `--font-mono-editorial` →
  `font-mono`. Labels, metadata, buttons, timestamps.

### The two voices

| Voice | Recipe | Use for |
| --- | --- | --- |
| **Display** | `font-sans font-black uppercase tracking-tight`, sizes from `text-3xl` up to `text-[10rem]`, `leading-[0.85–0.95]` | Page titles, section titles, giant numbers, footer wordmark |
| **Label** | `font-mono text-[10–11px] font-bold uppercase tracking-[0.18–0.3em] text-muted-foreground` | Kickers, metadata, buttons, chips, table headers |

Recipes and conventions:

- Kickers sit **above** display headings: `Category file — 1,345 entries`.
- Body copy is `font-sans text-sm/base text-muted-foreground` with relaxed
  leading, max-width constrained (`max-w-xl`).
- Italic Space Mono (`font-mono italic`) is the accent voice — used for one
  word inside a display headline (`KNOW <i>it</i> ALL?`, "in history").
- Numbers are `tabular-nums`. Big stats are display-voice numerals with a
  mono label underneath.
- Play with scale, not with new fonts. A hero can be `text-8xl`; a footer
  wordmark can be `text-[19vw]`. Never introduce a third family.
- Emphasis inside display headings: a thick pastel underline
  (`border-b-8 border-lime-300`) under one whole word — never mid-word.

---

## 6. Layout

- Container: `mx-auto max-w-[1400px] px-4 sm:px-6`. Full-bleed bands (hero
  backgrounds, ticker, sticky bars) sit outside it.
- Section rhythm: heroes are `pt-28 md:pt-36` (clears the 64px fixed navbar)
  + `pb-12`; content sections `py-14`–`py-20`; grid gaps `gap-4` (compact
  grids) or `gap-6` (cards).
- Cards are equal-height in grids: `flex h-full flex-col` with the last row
  pushed down by `mt-auto`.
- Timeline/list rows (trending, history): number in a fixed column, content
  fills, dotted rule between rows.

---

## 7. Component patterns

Reference implementations live in the listed files — copy their structure.

- **Quiz card** — `src/components/home-page/quiz-card.tsx`.
  Meta strip (difficulty chip + Q count) under a dotted rule, display title,
  muted description, category pill + reveal-on-hover arrow. Pop shadow cycles
  by index.
- **Numbered index row** — `src/components/home-page/trending-section.tsx`.
  Mono index → display title → mono metadata → bordered arrow square; whole
  row inverts on hover (`hover:bg-foreground`, text flips to background).
- **Buttons** — two flavors, both square and mono-labeled:
  - Primary: `bg-foreground text-background border-2 border-foreground`
  - Secondary: `bg-background`, inverts on hover
  - Both get `pop-hover shadow-pop [--pop:…]` with a small offset.
- **Stat block** — display numeral (optionally `<CountUp />`) over a mono
  uppercase label, usually under a `rule-dotted`.
- **Plate (framed image)** — horoscope/history heroes: rotated bordered
  figure, grayscale image, mono `Fig. N` caption. This is the only imagery
  pattern on the site.
- **Marquee ticker** — `src/components/common/marquee.tsx` (pure CSS, pauses
  on hover). Inverted: `bg-foreground text-background`.
- **Difficulty/element chip** — 10px pastel square with a 1px ink border +
  mono uppercase label (`DifficultyBadge` in quiz-card.tsx). This is the only
  place semantic color touches content.
- **Halftone texture** — `bg-halftone` utility (currentColor dots); use as a
  quiet printerly accent, `text-foreground/40`, small strips only.

---

## 8. Motion

All motion primitives live in `src/components/motion/` and wrap `motion/react`
(framer Motion). Rules:

- **Entrances are scroll-triggered, once.** `<Reveal>` (`y: 28 → 0`, opacity,
  0.7s, ease `[0.16, 1, 0.3, 1]`, `viewport={{ once: true, margin: "-64px" }}`).
  Grids/list use `<Stagger>` + `<StaggerItem>` (`gap: 0.03–0.05`).
- **Scroll-tracking:** `<ScrollProgress />` fixed ink bar; hero parallax via
  `useScroll` + `useTransform` with small distances (≤ 56px). See
  `hero-section.tsx`.
- **Numbers:** `<CountUp />` counts up once when scrolled into view.
- **Hover = CSS** (`pop-hover`, invert transitions, arrow slides). Tap
  feedback = `whileTap={{ scale: 0.98 }}` at most.
- **Ambient:** only the marquee loops, and it's CSS (compositor-cheap,
  `prefers-reduced-motion` disables it).
- Every primitive respects `useReducedMotion()` and renders settled state.
- Don't add: looping animations, scroll-jacking, spring-y bounces, animated
  gradients, spinners beyond the loading screen's ink square.

---

## 9. Dark mode

- `next-themes`, `attribute="class"`, system default
  (`src/app/(public)/layout.tsx`). Toggle: `src/components/common/theme-toggle.tsx`.
- Dark mode is a **negative of the print**, not a dimmed page: paper ↔ ink
  swap at full strength, pastels go translucent (ghosted glow), chips and
  primary buttons keep their light pastel fills with ink text.
- Test every new component in both themes before shipping it. Full-strength
  `border-foreground` is what makes dark mode feel printed rather than gray.

---

## 10. Imagery

- Minimal by design — a photo/engraving appears only as a hero "plate".
- Sources: searched online, downloaded into `public/images/`, committed.
  No remote image domains in `next.config.ts`.
- Always grayscale (global filter), always bordered and captioned
  (`Fig. N — label`), slight rotation + 10px pop shadow.
- Prefer engravings/print textures that already look like paper.

---

## 11. Do / Don't

**Do**

- Compose from tokens: ink borders, dotted rules, pills, pop shadows.
- Keep semantic color to chips (lime/amber/rose) and pop shadows.
- Write metadata as mono kickers; make numbers huge and tabular.
- Verify light **and** dark, mobile **and** desktop.

**Don't**

- No gradients, glows, glassmorphism, rounded cards, or drop shadows
  (`shadow-sm/xl` blur family is gone from the design language).
- No color fills on large surfaces (a full pastel background is as wrong as
  purple gradients were).
- No new fonts; no third icon styles beyond `lucide-react` at small sizes.
- No animation that runs without the user scrolling or hovering.

---

## 12. File map

| What | Where |
| --- | --- |
| Tokens, utilities, keyframes | `src/app/globals.css` |
| Fonts, root shell | `src/app/layout.tsx` |
| Motion primitives | `src/components/motion/` |
| Marquee | `src/components/common/marquee.tsx` |
| Navbar / footer / buttons / CTAs | `src/components/common/` |
| Home page sections | `src/components/home-page/` |
| Quiz page sections | `src/components/quiz-page/` |
| Category components | `src/components/category/`, `src/app/(public)/category/` |
| Horoscope page | `src/app/(public)/horoscope/page.tsx` |
| History page + date picker | `src/app/(public)/this-day-in-history/`, `src/components/this-day-in-history/` |
| Brand icon | `src/app/icon.svg` |
| Image plates | `public/images/` |
