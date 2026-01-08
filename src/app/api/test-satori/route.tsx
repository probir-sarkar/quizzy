import { NextResponse } from "next/server";
import { generateAndSaveHoroscopeImage } from "@/image-generation/horoscope/generate-daily-horoscope-image";
import { format } from "date-fns";
import { UTCDate } from "@date-fns/utc";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date");

    // Use provided date or default to today
    const targetDate = dateParam ? new Date(dateParam) : new UTCDate();

    // Validate date
    if (isNaN(targetDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format. Use ISO date string like '2024-01-15'" },
        { status: 400 }
      );
    }

    console.log(`Generating horoscope images for: ${format(targetDate, "yyyy-MM-dd")}`);

    // Generate and save horoscope images
    const generatedImages = await generateAndSaveHoroscopeImage(targetDate);

    if (!generatedImages || generatedImages.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No horoscope images generated. Check if horoscopes exist for the given date.",
        date: format(targetDate, "yyyy-MM-dd"),
        images: []
      });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully generated ${generatedImages.length} horoscope images`,
      date: format(targetDate, "yyyy-MM-dd"),
      images: generatedImages.map(img => ({
        zodiacSign: img.zodiacSign,
        filename: img.filename,
        date: format(img.date, "yyyy-MM-dd")
      }))
    });

  } catch (error) {
    console.error("Error in test-satori route:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
