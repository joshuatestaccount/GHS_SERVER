/*
  Warnings:

  - You are about to drop the column `endorsementID` on the `Endorse` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Endorse" DROP CONSTRAINT "Endorse_endorsementID_fkey";

-- AlterTable
ALTER TABLE "Endorse" DROP COLUMN "endorsementID";

-- CreateTable
CREATE TABLE "_EndorseToEndorsement" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_EndorseToEndorsement_AB_unique" ON "_EndorseToEndorsement"("A", "B");

-- CreateIndex
CREATE INDEX "_EndorseToEndorsement_B_index" ON "_EndorseToEndorsement"("B");

-- AddForeignKey
ALTER TABLE "_EndorseToEndorsement" ADD CONSTRAINT "_EndorseToEndorsement_A_fkey" FOREIGN KEY ("A") REFERENCES "Endorse"("endorseID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EndorseToEndorsement" ADD CONSTRAINT "_EndorseToEndorsement_B_fkey" FOREIGN KEY ("B") REFERENCES "Endorsement"("endorsementID") ON DELETE CASCADE ON UPDATE CASCADE;
