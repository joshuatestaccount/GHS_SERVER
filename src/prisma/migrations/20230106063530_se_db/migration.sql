/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Logs` table. All the data in the column will be lost.
  - Added the required column `title` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Logs" DROP COLUMN "updatedAt",
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP;

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "title" TEXT NOT NULL;
