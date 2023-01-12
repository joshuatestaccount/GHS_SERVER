/*
  Warnings:

  - You are about to drop the column `endorsementID` on the `Profile` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_endorsementID_fkey";

-- DropIndex
DROP INDEX "Profile_endorsementID_key";

-- AlterTable
ALTER TABLE "Applicant" ADD COLUMN     "endorsementID" TEXT;

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "endorsementID";

-- AddForeignKey
ALTER TABLE "Applicant" ADD CONSTRAINT "Applicant_endorsementID_fkey" FOREIGN KEY ("endorsementID") REFERENCES "Endorsement"("endorsementID") ON DELETE CASCADE ON UPDATE CASCADE;
