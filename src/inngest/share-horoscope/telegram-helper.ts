import { zodiacSigns } from "@/lib/constants";
import { HoroscopeData } from "@/queries/horoscope";
import { format } from "date-fns";
const BASE_URL = "https://quizzone.club";
export const createIndividualCaption = (
  horoscope: Pick<HoroscopeData, "zodiacSign" | "description" | "luckyColor" | "luckyNumber" | "mood">,
  formattedDate: string
): string => {
  if (!horoscope) return "";
  const emoji = zodiacSigns.filter(({ name }) => name === horoscope.zodiacSign)[0].symbol;
  const lines = [`${emoji} *${horoscope.zodiacSign} - ${formattedDate}*`, "", `_${horoscope.description}_`, ""];

  if (horoscope.luckyColor || horoscope.luckyNumber || horoscope.mood) {
    if (horoscope.luckyColor) lines.push(`🎨 *Lucky Color:* ${horoscope.luckyColor}`);
    if (horoscope.luckyNumber) lines.push(`🎰 *Lucky Number:* ${horoscope.luckyNumber}`);
    if (horoscope.mood) lines.push(`😊 *Mood:* ${horoscope.mood}`);
    lines.push("");
  }

  lines.push(
    `🔮 [Read full horoscope for all signs](${BASE_URL}/horoscope)`,
    "",
    `#${horoscope.zodiacSign.toLowerCase()} #Horoscope #DailyHoroscope #QuizZone`
  );

  return lines.join("\n");
};
