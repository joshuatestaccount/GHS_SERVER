/*
  Warnings:

  - You are about to drop the column `userUserID` on the `Endorse` table. All the data in the column will be lost.
  - Added the required column `createdAt` to the `Endorse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userID` to the `Endorse` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Endorse" DROP CONSTRAINT "Endorse_userUserID_fkey";

-- AlterTable
ALTER TABLE "Endorse" DROP COLUMN "userUserID",
ADD COLUMN     "createdAt" DATE NOT NULL,
ADD COLUMN     "userID" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Endorse" ADD CONSTRAINT "Endorse_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;
