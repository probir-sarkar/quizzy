-- AlterTable
ALTER TABLE "PastEvent" ADD COLUMN     "eventDate" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "PastEvent_eventDate_idx" ON "PastEvent"("eventDate");
