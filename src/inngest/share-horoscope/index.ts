import { Bot } from "grammy";
import { inngest } from "../client";
import { format } from "date-fns";
import { UTCDate } from "@date-fns/utc";
import { generateAndSaveHoroscopeImage } from "@/image-generation/horoscope/generate-daily-horoscope-image";
import { delay } from "es-toolkit";
import { createIndividualCaption } from "./telegram-helper";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_CHAT = process.env.TELEGRAM_CHANNEL_USERNAME || "@quizzone_club";
const S3_BASE_URL = "https://storage.quizzone.club/quiz-zone/temp";

// Build image URL for a sign/date
const getHoroscopeImageUrl = (date: Date | string, zodiacSign: string): string => {
  const formattedDate = format(date, "yyyy-MM-dd");
  return `${S3_BASE_URL}/${formattedDate}/${zodiacSign.toLowerCase()}.png`;
};

export const shareHoroscope = inngest.createFunction(
  { id: "share-horoscope" },
  [{ event: "horoscope/share" }, { cron: "0 8 * * *" }],
  async ({ step }) => {
    const bot = new Bot(TELEGRAM_BOT_TOKEN);
    const today = new UTCDate();
    const formattedDate = format(today, "MMMM d, yyyy");

    // Ensure images exist
    const generatedImages = await step.run("generate-horoscope-images", async () => {
      return generateAndSaveHoroscopeImage(today);
    });

    // Share each horoscope as an individual Telegram post
    await step.run("share-horoscopes-telegram", async () => {
      for (const horoscope of generatedImages) {
        try {
          const imageUrl = getHoroscopeImageUrl(horoscope.date, horoscope.zodiacSign);
          if (!horoscope.horoscope) return;
          const caption = createIndividualCaption(horoscope.horoscope, formattedDate);
          await bot.api.sendPhoto(TELEGRAM_CHAT, imageUrl, {
            caption,
            parse_mode: "Markdown"
          });

          // Throttle a bit to avoid flood limits
          await delay(2000);
        } catch (err) {
          console.error(`Error sharing ${horoscope.zodiacSign} horoscope:`, err);
        }
      }
    });

    return {
      success: true,
      sharedCount: generatedImages.length,
      generatedImages: generatedImages.length ?? 0,
      message: `Shared ${generatedImages.length} horoscopes for ${formattedDate}`
    };
  }
);
