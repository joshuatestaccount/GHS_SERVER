/*
  Warnings:

  - A unique constraint covering the columns `[notificaitonID]` on the table `Applicant` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Applicant" ADD COLUMN     "notificaitonID" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Applicant_notificaitonID_key" ON "Applicant"("notificaitonID");

-- AddForeignKey
ALTER TABLE "Applicant" ADD CONSTRAINT "Applicant_notificaitonID_fkey" FOREIGN KEY ("notificaitonID") REFERENCES "Notification"("notificationID") ON DELETE SET NULL ON UPDATE CASCADE;
