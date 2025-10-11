-- CreateEnum
CREATE TYPE "ZodiacSign" AS ENUM ('ARIES', 'TAURUS', 'GEMINI', 'CANCER', 'LEO', 'VIRGO', 'LIBRA', 'SCORPIO', 'SAGITTARIUS', 'CAPRICORN', 'AQUARIUS', 'PISCES');

-- CreateTable
CREATE TABLE "Horoscope" (
    "id" SERIAL NOT NULL,
    "zodiacSign" "ZodiacSign" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "luckyColor" TEXT,
    "luckyNumber" INTEGER,
    "mood" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Horoscope_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Horoscope_zodiacSign_date_key" ON "Horoscope"("zodiacSign", "date");
