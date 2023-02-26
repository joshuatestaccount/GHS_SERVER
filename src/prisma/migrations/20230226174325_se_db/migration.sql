-- AlterTable
ALTER TABLE "Applicant" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP;

-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP;

-- AlterTable
ALTER TABLE "Endorse" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP;

-- AlterTable
ALTER TABLE "Endorsement" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP;

-- AlterTable
ALTER TABLE "JobPost" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP;

-- AlterTable
ALTER TABLE "Notification" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP;

-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "birthday" SET DATA TYPE TIMESTAMP;

-- AlterTable
ALTER TABLE "UploadFile" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP;