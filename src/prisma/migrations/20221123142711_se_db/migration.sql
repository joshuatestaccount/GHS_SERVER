/*
  Warnings:

  - You are about to drop the column `notificatioID` on the `JobPost` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[notificationID]` on the table `JobPost` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "JobPost" DROP CONSTRAINT "JobPost_notificatioID_fkey";

-- DropIndex
DROP INDEX "JobPost_notificatioID_key";

-- AlterTable
ALTER TABLE "JobPost" DROP COLUMN "notificatioID",
ADD COLUMN     "notificationID" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "JobPost_notificationID_key" ON "JobPost"("notificationID");

-- AddForeignKey
ALTER TABLE "JobPost" ADD CONSTRAINT "JobPost_notificationID_fkey" FOREIGN KEY ("notificationID") REFERENCES "Notification"("notificationID") ON DELETE CASCADE ON UPDATE CASCADE;
