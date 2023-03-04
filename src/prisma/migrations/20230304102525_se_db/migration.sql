-- DropForeignKey
ALTER TABLE "JobPost" DROP CONSTRAINT "JobPost_userID_fkey";

-- AddForeignKey
ALTER TABLE "JobPost" ADD CONSTRAINT "JobPost_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE CASCADE ON UPDATE CASCADE;
