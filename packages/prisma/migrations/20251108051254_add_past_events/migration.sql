-- CreateEnum
CREATE TYPE "EventCategory" AS ENUM ('war', 'discovery', 'politics', 'science', 'art', 'sports', 'technology', 'medicine', 'exploration', 'literature', 'music', 'economy', 'religion', 'disaster', 'revolution', 'invention');

-- CreateTable
CREATE TABLE "PastEvent" (
    "id" SERIAL NOT NULL,
    "month" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "EventCategory" NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "sourceUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "metadata" JSONB,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PastEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PastEvent_month_day_idx" ON "PastEvent"("month", "day");

-- CreateIndex
CREATE INDEX "PastEvent_category_idx" ON "PastEvent"("category");

-- CreateIndex
CREATE INDEX "PastEvent_month_day_category_idx" ON "PastEvent"("month", "day", "category");

-- CreateIndex
CREATE UNIQUE INDEX "PastEvent_month_day_year_slug_key" ON "PastEvent"("month", "day", "year", "slug");
