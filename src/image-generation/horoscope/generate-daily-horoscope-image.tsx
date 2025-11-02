import { getAllHoroscopesForDate } from "@/queries/horoscope";
import { UTCDate } from "@date-fns/utc";
import { format } from "date-fns";
import { getHoroscopeImageKey, uploadToS3 } from "@/lib/s3";
import { horoscopeImage } from "./horoscope-image";

const generateAndSaveHoroscopeImage = async (date: Date): Promise<GeneratedHoroscopeImage[]> => {
  try {
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

        // Create S3 key with date and zodiac sign
        const s3Key = getHoroscopeImageKey(date, horoscope.zodiacSign);
        const formattedDate = format(new UTCDate(date), "yyyy-MM-dd");
        const filename = `${horoscope.zodiacSign.toLowerCase()}-${formattedDate}.png`;

        // Upload image directly to S3
        const uploadSuccess = await uploadToS3(s3Key, buffer, "image/png");

        if (!uploadSuccess) {
          console.warn(`Failed to upload image for ${horoscope.zodiacSign} to S3`);
          continue;
        }

        generatedImages.push({
          zodiacSign: horoscope.zodiacSign,
          s3Key,
          filename,
          date: horoscope.date
        });

        console.log(`Generated and uploaded horoscope image to S3: ${s3Key}`);
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
export { generateAndSaveHoroscopeImage, horoscopeImage };

// Type definition for generated image info
export type GeneratedHoroscopeImage = {
  zodiacSign: string;
  s3Key: string;
  filename: string;
  date: Date;
};
