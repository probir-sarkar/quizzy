/**
 * Generates additional "this day in history" events with an
 * OpenAI-compatible endpoint (deepseek-v3.2) and inserts them into
 * PastEvent. Idempotent-ish: completed dates are tracked in a progress
 * file, and rows are deduped against existing (month, day, year, slug)
 * plus the titles already stored for that date.
 *
 * Usage:
 *   pnpm exec tsx scripts/generate-history.ts [--per-date 5] [--concurrency 6]
 *                                             [--month 10 --day 4] [--fresh]
 *
 * API credentials are read from an env file with OPENAI_API_KEY /
 * OPENAI_BASE_URL (defaults to ../ai-war-history/.env relative to the
 * repo root; override with OPENAI_ENV_FILE).
 */
import "dotenv/config";
import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { kebabCase } from "es-toolkit";
import { z } from "zod";
import { db, asTimestamp } from "@/lib/prisma";
import { EventCategory } from "@/lib/enums";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const PROGRESS_FILE = join(REPO_ROOT, "scripts", ".history-progress.json");

// ---------- CLI args ----------
function arg(name: string, fallback: string) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}
const PER_DATE = Number(arg("per-date", "5"));
const CONCURRENCY = Math.max(1, Number(arg("concurrency", "6")));
const ONLY_MONTH = arg("month", "") ? Number(arg("month", "")) : null;
const ONLY_DAY = arg("day", "") ? Number(arg("day", "")) : null;
const FRESH = process.argv.includes("--fresh");

// ---------- API credentials ----------
const envFile = process.env.OPENAI_ENV_FILE ?? resolve(REPO_ROOT, "../ai-war-history/.env");
const envRaw = readFileSync(envFile, "utf8");
const env = Object.fromEntries(
  envRaw
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const eq = line.indexOf("=");
      return [line.slice(0, eq).trim(), line.slice(eq + 1).trim().replace(/^"|"$/g, "")];
    })
);
const API_KEY = env.OPENAI_API_KEY ?? process.env.OPENAI_API_KEY;
const BASE_URL = (env.OPENAI_BASE_URL ?? process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1").replace(/\/$/, "");
const MODEL = process.env.OPENAI_MODEL ?? "deepseek-v3.2";
if (!API_KEY) throw new Error(`No OPENAI_API_KEY found in ${envFile}`);

// ---------- Schema ----------
const stringOrArray = z
  .union([z.string(), z.array(z.string())])
  .transform((v) => (Array.isArray(v) ? v : [v]));

const generatedEventSchema = z.object({
  title: z.string().min(10).max(140),
  year: z.number().int().min(1).max(new Date().getUTCFullYear()),
  description: z.string().min(120).max(600),
  category: z.enum(Object.values(EventCategory) as [string, ...string[]]),
  tags: stringOrArray.pipe(z.array(z.string().min(2).max(40)).max(6)).default([]),
  sourceUrls: stringOrArray.pipe(z.array(z.string().url()).max(3)).default([])
});
const generatedResponseSchema = z.object({ events: z.array(generatedEventSchema).min(1).max(12) });

type GeneratedEvent = z.infer<typeof generatedEventSchema> & { category: EventCategory };

// ---------- Calendar ----------
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function allDates(): { month: number; day: number }[] {
  const dates: { month: number; day: number }[] = [];
  for (let m = 1; m <= 12; m++) {
    for (let d = 1; d <= DAYS_IN_MONTH[m - 1]; d++) {
      if (ONLY_MONTH && m !== ONLY_MONTH) continue;
      if (ONLY_DAY && d !== ONLY_DAY) continue;
      dates.push({ month: m, day: d });
    }
  }
  return dates;
}

// ---------- OpenAI-compatible call ----------
async function chatJSON(messages: { role: string; content: string }[], attempt = 1): Promise<unknown> {
  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 1.1,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    })
  });
  if (!res.ok) {
    const body = await res.text();
    if (attempt < 3) {
      await new Promise((r) => setTimeout(r, attempt * 5000));
      return chatJSON(messages, attempt + 1);
    }
    throw new Error(`API ${res.status}: ${body.slice(0, 300)}`);
  }
  const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const content = json.choices?.[0]?.message?.content ?? "";
  const start = content.indexOf("{");
  const end = content.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error(`No JSON in response: ${content.slice(0, 200)}`);
  return JSON.parse(content.slice(start, end + 1));
}

// ---------- Generation for one date ----------
async function generateForDate(
  month: number,
  day: number,
  existing: { title: string; year: number }[]
): Promise<GeneratedEvent[]> {
  const exclusion = existing.length
    ? existing.map((e) => `${e.year}: ${e.title}`).join("\n")
    : "(none recorded yet)";

  const prompt = `You are a rigorous history editor for a "This Day in History" feature.

Today's calendar date: ${MONTH_NAMES[month - 1]} ${day}.

Write ${PER_DATE} historically notable events that occurred on ${MONTH_NAMES[month - 1]} ${day} (any year), EXCLUDING these already-covered events:
${exclusion}

Rules:
- Accuracy first: only include events you are HIGHLY confident occurred on ${MONTH_NAMES[month - 1]} ${day} of that year (exact month AND day). If you are not sure of the exact day, do not include the event — pick a different one.
- Factual, verifiable events only (battles, treaties, discoveries, inventions, disasters, cultural milestones, sports, politics, science, medicine, economy, exploration, literature, music, art, religion, revolutions).
- Globally diverse: not only US/UK/Western Europe; include non-Western events where they genuinely fit.
- Spread the events across different eras (ancient, medieval, early modern, 19th, 20th, 21st century) — do not cluster in one century.
- Do not repeat any excluded event, and do not pick near-duplicates of them.
- title: concise headline, max ~90 characters, plain text (no trailing period).
- description: 2-3 factual sentences, 250-420 characters, starting with "On ${MONTH_NAMES[month - 1]} ${day}, <year>," and explaining what happened and why it mattered.
- category: exactly one of ${Object.values(EventCategory).join(", ")}.
- tags: 3-5 short topical tags.
- sourceUrls: exactly ONE URL — the Wikipedia article about the event, e.g. "https://en.wikipedia.org/wiki/Exact_Article_Name". Never invent an article title; use the real article you are confident exists.

Respond as JSON: {"events": [{"title", "year", "description", "category", "tags", "sourceUrls"}]}`;

  const raw = await chatJSON([
    { role: "system", content: "You are a careful historian. You always respond with valid JSON." },
    { role: "user", content: prompt }
  ]);

  const parsed = generatedResponseSchema.safeParse(raw);
  if (!parsed.success) {
    console.warn(
      `  [${month}/${day}] schema mismatch, skipping (${parsed.error.issues.length} issues): ` +
        parsed.error.issues.slice(0, 5).map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")
    );
    return [];
  }
  return parsed.data.events.map((e) => ({
    ...e,
    category: e.category as EventCategory,
    // Model output is untrusted: keep at most one source URL and only
    // accept English Wikipedia links to avoid hallucinated URLs.
    sourceUrls: e.sourceUrls.filter((u) => /^https:\/\/en\.wikipedia\.org\/wiki\/[^?#]+$/.test(u)).slice(0, 1)
  }));
}

// ---------- Insert ----------
function slugFor(title: string, year: number) {
  return `${kebabCase(title)}-${year}`;
}

async function insertEvent(
  month: number,
  day: number,
  e: GeneratedEvent,
  existingKeys: Set<string>
): Promise<boolean> {
  const slug = slugFor(e.title, e.year);
  const key = `${month}-${day}-${e.year}-${slug}`;
  const titleKey = e.title.toLowerCase().replace(/\W+/g, " ").trim();
  if (existingKeys.has(key) || existingKeys.has(`t:${titleKey}`)) return false;

  const now = asTimestamp(new Date());
  try {
    await db.orm.public.PastEvent.create({
      month,
      day,
      year: e.year,
      title: e.title,
      slug,
      description: e.description,
      category: e.category,
      tags: e.tags,
      sourceUrls: e.sourceUrls,
      isPublished: true,
      createdAt: now,
      updatedAt: now
    });
    existingKeys.add(key);
    existingKeys.add(`t:${titleKey}`);
    return true;
  } catch (err) {
    console.warn(`  insert failed (${month}/${day} ${e.year} "${e.title}"): ${String(err).slice(0, 160)}`);
    return false;
  }
}

// ---------- Progress ----------
type Progress = Record<string, true>;
function loadProgress(): Progress {
  if (FRESH && existsSync(PROGRESS_FILE)) {
    console.log("--fresh: ignoring existing progress file");
    return {};
  }
  if (existsSync(PROGRESS_FILE)) return JSON.parse(readFileSync(PROGRESS_FILE, "utf8"));
  return {};
}
function saveProgress(p: Progress) {
  writeFileSync(PROGRESS_FILE, JSON.stringify(p, null, 2));
}

// ---------- Main ----------
async function main() {
  console.log(`Model ${MODEL} @ ${BASE_URL}, ${PER_DATE} events/date, concurrency ${CONCURRENCY}`);

  const rows = await db.orm.public.PastEvent
    .select("month", "day", "title", "year", "slug")
    .orderBy((e) => e.id.asc())
    .all();

  // Per-date existing titles/years for the exclusion list, plus a global
  // key set (unique-constraint keys and normalized titles) for dedupe.
  const existingByDate = new Map<string, { title: string; year: number }[]>();
  const existingKeys = new Set<string>();
  for (const r of rows) {
    const k = `${r.month}-${r.day}`;
    if (!existingByDate.has(k)) existingByDate.set(k, []);
    existingByDate.get(k)!.push({ title: r.title, year: r.year });
    existingKeys.add(`${r.month}-${r.day}-${r.year}-${r.slug}`);
    existingKeys.add(`t:${r.title.toLowerCase().replace(/\W+/g, " ").trim()}`);
  }

  const progress = loadProgress();
  const dates = allDates().filter(({ month, day }) => !progress[`${month}-${day}`]);
  const skipped = Object.keys(progress).length;
  console.log(`${rows.length} existing events; ${dates.length} dates to generate (${skipped} already done)`);

  let done = 0;
  let inserted = 0;
  const queue = [...dates];

  async function worker(id: number) {
    while (queue.length > 0) {
      const date = queue.shift();
      if (!date) return;
      const { month, day } = date;
      const key = `${month}-${day}`;
      try {
        const events = await generateForDate(month, day, existingByDate.get(key) ?? []);
        let count = 0;
        for (const e of events) {
          if (await insertEvent(month, day, e, existingKeys)) count++;
        }
        inserted += count;
        progress[key] = true;
        if (done % 10 === 0 || count === 0) saveProgress(progress);
        done++;
        const remaining = queue.length;
        console.log(`[w${id}] ${key}: +${count}/${events.length} (inserted ${inserted}, ${done}/${dates.length} dates done, ${remaining} left)`);
      } catch (err) {
        console.error(`[w${id}] ${key} FAILED: ${String(err).slice(0, 300)}`);
        // Leave the date out of progress so a rerun retries it.
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, (_, i) => worker(i + 1)));
  saveProgress(progress);
  console.log(`Done. Inserted ${inserted} new events across ${dates.length} dates.`);
  await db.close();
}

main().catch(async (err) => {
  console.error(err);
  await db.close();
  process.exit(1);
});
