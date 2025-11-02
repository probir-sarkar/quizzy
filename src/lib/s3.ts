import { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectsCommand } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!
  }
});

const BUCKET_NAME = "quiz-zone";
const TEMP_FOLDER = "temp";

// Upload file to S3
export const uploadToS3 = async (key: string, buffer: Buffer, contentType: string = "image/png") => {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType
    });

    await s3Client.send(command);
    console.log(`Successfully uploaded ${key} to S3`);
    return true;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    return false;
  }
};

// Get S3 key for horoscope image
export const getHoroscopeImageKey = (date: Date, zodiacSign: string): string => {
  const formattedDate = new Date(date).toISOString().split("T")[0]; // yyyy-MM-dd format
  return `${TEMP_FOLDER}/${formattedDate}/${zodiacSign.toLowerCase()}.png`;
};
