-- AlterTable
ALTER TABLE "Feedback" ADD COLUMN     "applicantID" TEXT;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_applicantID_fkey" FOREIGN KEY ("applicantID") REFERENCES "Applicant"("applicantID") ON DELETE SET NULL ON UPDATE CASCADE;
