import { zodiacSigns } from "@/lib/constants";
import { getAllHoroscopesForDate, HoroscopeData } from "@/queries/horoscope";
import { UTCDate } from "@date-fns/utc";
import { format } from "date-fns";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { ImageResponse } from "next/og";

// Temp directory for storing generated images
const TEMP_DIR = join(process.cwd(), "temp", "horoscope-images");

// Ensure temp directory exists
const ensureTempDir = async () => {
  try {
    await mkdir(TEMP_DIR, { recursive: true });
  } catch (error) {
    console.error("Failed to create temp directory:", error);
  }
};


const horoscopeImage = (horoscope: HoroscopeData) => {
  if (!horoscope) return null;

  const zodiac = zodiacSigns.find((zodiac) => zodiac.name === horoscope.zodiacSign);
  if (!zodiac) return null;

  const { symbol, name, dates, element } = zodiac;
  const formattedDate = format(new UTCDate(horoscope.date), "MMMM d, yyyy");

      const elementStyles: Record<
    string,
    { chip: string; glow: string; emoji: string }
  > = {
    Fire: { chip: "#fee2e2", glow: "rgba(255,95,64,0.1)", emoji: "🔥" },
    Water: { chip: "#e0f2fe", glow: "rgba(63,131,248,0.1)", emoji: "💧" },
    Earth: { chip: "#dcfce7", glow: "rgba(16,185,129,0.1)", emoji: "🌿" },
    Air: { chip: "#e0f7fa", glow: "rgba(99,179,237,0.1)", emoji: "🌬️" },
  };
  const el = elementStyles[element.name] ?? elementStyles.Air;

  return new ImageResponse(
    (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              width: "600px",
              height: "600px",
              padding: "30px 40px 45px 40px",
              background: [
                `radial-gradient(60% 60% at 15% 85%, rgba(168,85,247,0.10) 0%, rgba(168,85,247,0.04) 40%, rgba(168,85,247,0) 70%)`,
                `radial-gradient(55% 50% at 92% 8%, ${el.glow} 0%, rgba(0,0,0,0) 60%)`,
                `linear-gradient(180deg,#f9fafb 0%, #f1f5f9 100%)`,
              ].join(", "),
              fontFamily: "sans-serif",
              color: "#0f172a",
            }}
          >
            {/* ✨ DAILY HOROSCOPE TITLE */}
            <div
              style={{
                fontSize: "18px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "1.2px",
                color: "#64748b",
                marginBottom: "6px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span>✨</span>
              <span>Daily Horoscope</span>
              <span>✨</span>
            </div>
    
            {/* HEADER */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                marginBottom: "12px",
              }}
            >
              {/* Left: Symbol + Name */}
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "68px",
                    height: "68px",
                    borderRadius: "16px",
                    marginRight: "16px",
                    fontSize: "42px",
                    color: "white",
                    background:
                      "linear-gradient(180deg, #a78bfa 0%, #7c3aed 100%)",
                    boxShadow: "0 4px 16px rgba(124,58,237,0.25)",
                  }}
                >
                  {symbol}
                </div>
    
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      fontSize: "42px",
                      fontWeight: 800,
                      color: "#4338ca",
                    }}
                  >
                    {name}
                  </span>
                  {/* smaller date range */}
                  <span style={{ fontSize: "16px", color: "#64748b" }}>{dates}</span>
                </div>
              </div>
    
              {/* Element tag */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 14px",
                  borderRadius: "12px",
                  background: "#ffffff",
                  boxShadow:
                    "0 2px 6px rgba(2,6,23,0.08), 0 6px 16px rgba(2,6,23,0.05)",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#0f172a",
                }}
              >
                <span>{el.emoji}</span>
                <span>{element.name}</span>
              </div>
            </div>
    
            {/* DATE */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 14px",
                borderRadius: "12px",
                background: "#eef2ff",
                color: "#4338ca",
                fontSize: "16px",
                fontWeight: 600,
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.7), 0 2px 8px rgba(67,56,202,0.1)",
              }}
            >
              <span>📅</span>
              <span>{formattedDate}</span>
            </div>
    
            {/* DESCRIPTION */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "0 20px",
                minHeight: "200px",
                lineHeight: 1.6,
                fontSize: "21px",
                color: "#334155",
              }}
            >
              {horoscope.description}
            </div>
    
            {/* BADGES */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "14px",
                flexWrap: "wrap",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 18px",
                  borderRadius: "14px",
                  fontSize: "18px",
                  color: "white",
                  background: "linear-gradient(180deg,#60a5fa,#3b82f6)",
                  boxShadow:
                    "0 6px 14px rgba(59,130,246,0.25), inset 0 1px 0 rgba(255,255,255,0.4)",
                }}
              >
                🎨 Lucky Color: {horoscope.luckyColor}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 18px",
                  borderRadius: "14px",
                  fontSize: "18px",
                  color: "white",
                  background: "linear-gradient(180deg,#c084fc,#f472b6)",
                  boxShadow:
                    "0 6px 14px rgba(236,72,153,0.25), inset 0 1px 0 rgba(255,255,255,0.4)",
                }}
              >
                🍀 Lucky Number: {horoscope.luckyNumber}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 18px",
                  borderRadius: "14px",
                  fontSize: "18px",
                  color: "#0f172a",
                  background: "linear-gradient(180deg,#fde68a,#fbbf24)",
                  boxShadow:
                    "0 6px 14px rgba(251,191,36,0.25), inset 0 1px 0 rgba(255,255,255,0.55)",
                }}
              >
                ✨ Mood: {horoscope.mood}
              </div>
            </div>
    
            {/* FOOTER */}
            <div
              style={{
                fontSize: "18px",
                color: "#64748b",
                letterSpacing: "0.2px",
              }}
            >
              🌐 quizzone.club/horoscope
            </div>
          </div>
        ),
        { width: 600, height: 600 }
      );
};

// Utility function to clean old temp files (older than specified hours)
const cleanupOldImages = async (hoursOld = 24) => {
  try {
    const { readdir, stat, unlink } = await import("fs/promises");
    const files = await readdir(TEMP_DIR);
    const now = Date.now();
    const maxAge = hoursOld * 60 * 60 * 1000; // Convert hours to milliseconds

    for (const file of files) {
      const filepath = join(TEMP_DIR, file);
      const stats = await stat(filepath);

      if (now - stats.mtime.getTime() > maxAge) {
        await unlink(filepath);
        console.log(`Cleaned up old temp file: ${file}`);
      }
    }
  } catch (error) {
    console.error("Error cleaning up old images:", error);
  }
};

// Utility function to get all temp images for a date
const getTempImagesForDate = async (date: Date) => {
  try {
    const { readdir } = await import("fs/promises");
    const formattedDate = format(new UTCDate(date), "yyyy-MM-dd");
    const files = await readdir(TEMP_DIR);

    return files
      .filter(file => file.includes(formattedDate) && file.endsWith('.png'))
      .map(filename => ({
        filename,
        filepath: join(TEMP_DIR, filename),
        zodiacSign: filename.split(`-${formattedDate}`)[0]
      }));
  } catch (error) {
    console.error("Error getting temp images for date:", error);
    return [];
  }
};

// Utility function to clean temp directory completely
const cleanTempDirectory = async () => {
  try {
    const { readdir, unlink } = await import("fs/promises");
    const files = await readdir(TEMP_DIR);

    for (const file of files) {
      const filepath = join(TEMP_DIR, file);
      await unlink(filepath);
      console.log(`Deleted temp file: ${file}`);
    }
  } catch (error) {
    console.error("Error cleaning temp directory:", error);
  }
};

const generateAndSaveHoroscopeImage = async (date: Date): Promise<GeneratedHoroscopeImage[]> => {
  try {
    // Ensure temp directory exists
    await ensureTempDir();

    // Get all horoscopes for the given date
    const horoscopes = await getAllHoroscopesForDate(date);

    if (!horoscopes || horoscopes.length === 0) {
      console.log("No horoscopes found for date:", date);
      return [];
    }

    const generatedImages: GeneratedHoroscopeImage[] = [];

    for (const horoscope of horoscopes) {
      try {
        // Generate image using the horoscopeImage function
        const imageResponse = horoscopeImage(horoscope);

        if (!imageResponse) {
          console.warn(`Failed to generate image for ${horoscope.zodiacSign}`);
          continue;
        }

        // Convert image response to buffer
        const imageBuffer = await imageResponse.arrayBuffer();
        const buffer = Buffer.from(imageBuffer);

        // Create filename with zodiac sign and date
        const formattedDate = format(new UTCDate(date), "yyyy-MM-dd");
        const filename = `${horoscope.zodiacSign.toLowerCase()}-${formattedDate}.png`;
        const filepath = join(TEMP_DIR, filename);

        // Save image to temp folder
        await writeFile(filepath, buffer);

        generatedImages.push({
          zodiacSign: horoscope.zodiacSign,
          filepath,
          filename,
          date: horoscope.date
        });

        console.log(`Generated and saved horoscope image: ${filename}`);
      } catch (error) {
        console.error(`Error generating image for ${horoscope.zodiacSign}:`, error);
      }
    }

    return generatedImages;
  } catch (error) {
    console.error("Error in generateAndSaveHoroscopeImage:", error);
    return [];
  }
};

// Export all functions for external use
export {
  generateAndSaveHoroscopeImage,
  cleanupOldImages,
  getTempImagesForDate,
  cleanTempDirectory,
  horoscopeImage,
  TEMP_DIR
};

// Type definition for generated image info
export type GeneratedHoroscopeImage = {
  zodiacSign: string;
  filepath: string;
  filename: string;
  date: Date;
};