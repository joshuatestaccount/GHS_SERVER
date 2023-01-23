-- AlterTable
ALTER TABLE "Applicant" ADD COLUMN     "screeningScreeningID" TEXT;

-- CreateTable
CREATE TABLE "Screening" (
    "screeningID" TEXT NOT NULL,
    "DateTime" TIMESTAMP NOT NULL,

    CONSTRAINT "Screening_pkey" PRIMARY KEY ("screeningID")
);

-- AddForeignKey
ALTER TABLE "Applicant" ADD CONSTRAINT "Applicant_screeningScreeningID_fkey" FOREIGN KEY ("screeningScreeningID") REFERENCES "Screening"("screeningID") ON DELETE SET NULL ON UPDATE CASCADE;
