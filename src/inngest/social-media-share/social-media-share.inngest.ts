import { Bot } from "grammy";
import { inngest } from "../client";
import prisma from "@/lib/prisma";
import { format } from "date-fns";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_CHAT = process.env.TELEGRAM_CHANNEL_USERNAME || "@quizzone_club";
const BASE_URL = "https://quizzone.club";

// Initialize once
const bot = new Bot(TELEGRAM_BOT_TOKEN);

export const socialMediaShare = inngest.createFunction(
  { id: "social-media-share" },
  { event: "quiz/social-media-share" },
  async ({ step }) => {
    const pastDay = new Date();
    pastDay.setDate(pastDay.getDate() - 1);

    const all = await step.run("yesterday-quizzes", () =>
      prisma.quiz.findMany({
        where: { createdAt: { gt: pastDay } },
        orderBy: { createdAt: "desc" },
        select: { id: true, title: true, slug: true }
      })
    );

    if (!all.length) return;

    const latest5 = all.slice(0, 7);
    const moreCount = all.length - latest5.length;

    const dateStr = format(new Date(), "MMM d, yyyy");
    const lines: string[] = [
      "🎉 *New Quizzes Just Dropped!* 🎉",
      "",
      `*📅 ${dateStr}*`,
      "",
      "Here are today's top brain teasers:",
      "",
      ...latest5.map((q, i) => `${i + 1}. 🔥 [${q.title}](${BASE_URL}/quiz/${q.slug})`)
    ];

    if (moreCount > 0) {
      lines.push(
        "",
        `➕ *${moreCount} more quizzes* published yesterday!`,
        "",
        "🚀 *Don't miss out!* Test your knowledge now:"
      );
    }

    lines.push("", `👉 [Play all quizzes](${BASE_URL})`, "", "#QuizZone #BrainTeasers #DailyChallenge");
    const message = lines.join("\n");

    await step.run("send-to-telegram", () =>
      bot.api.sendMessage(TELEGRAM_CHAT, message, {
        parse_mode: "Markdown",
        link_preview_options: { is_disabled: true }
      })
    );
  }
);
