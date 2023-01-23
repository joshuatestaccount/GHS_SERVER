/*
  Warnings:

  - You are about to drop the column `screeningScreeningID` on the `Applicant` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Applicant" DROP CONSTRAINT "Applicant_screeningScreeningID_fkey";

-- AlterTable
ALTER TABLE "Applicant" DROP COLUMN "screeningScreeningID";

-- AlterTable
ALTER TABLE "Screening" ADD COLUMN     "applicantID" TEXT,
ADD COLUMN     "userID" TEXT;

-- AddForeignKey
ALTER TABLE "Screening" ADD CONSTRAINT "Screening_applicantID_fkey" FOREIGN KEY ("applicantID") REFERENCES "Applicant"("applicantID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Screening" ADD CONSTRAINT "Screening_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE SET NULL ON UPDATE CASCADE;
