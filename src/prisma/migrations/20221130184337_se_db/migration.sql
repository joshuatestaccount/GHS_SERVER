-- CreateEnum
CREATE TYPE "Role" AS ENUM ('administrator', 'recruiter', 'moderator', 'manager', 'employer');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('inProgress', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "applicantStatus" AS ENUM ('waiting', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "notificationStatus" AS ENUM ('read', 'unread');

-- CreateEnum
CREATE TYPE "endorseStatus" AS ENUM ('waiting', 'rejected', 'approved');

-- CreateTable
CREATE TABLE "User" (
    "userID" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" DATE NOT NULL,
    "updatedAt" DATE NOT NULL,
    "companyID" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userID")
);

-- CreateTable
CREATE TABLE "Logs" (
    "logsID" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "modifiedBy" TEXT NOT NULL,
    "createdAt" DATE NOT NULL,
    "updatedAt" DATE NOT NULL,

    CONSTRAINT "Logs_pkey" PRIMARY KEY ("logsID")
);

-- CreateTable
CREATE TABLE "Notification" (
    "notificationID" TEXT NOT NULL,
    "notificationStatus" "notificationStatus" NOT NULL DEFAULT 'unread',
    "createdAt" DATE NOT NULL,
    "userID" TEXT,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("notificationID")
);

-- CreateTable
CREATE TABLE "Profile" (
    "profileID" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "birthday" DATE,
    "endorsementID" TEXT,
    "applicantID" TEXT,
    "userID" TEXT,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("profileID")
);

-- CreateTable
CREATE TABLE "Address" (
    "addressID" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "zipcode" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "profileID" TEXT,
    "companyDetailsID" TEXT,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("addressID")
);

-- CreateTable
CREATE TABLE "Company" (
    "companyID" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("companyID")
);

-- CreateTable
CREATE TABLE "CompanyDetails" (
    "companyDetailsID" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "mission" TEXT,
    "vision" TEXT,
    "companyID" TEXT,

    CONSTRAINT "CompanyDetails_pkey" PRIMARY KEY ("companyDetailsID")
);

-- CreateTable
CREATE TABLE "Comment" (
    "commentID" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "createdAt" DATE NOT NULL,
    "updatedAt" DATE NOT NULL,
    "endorsementID" TEXT,
    "userID" TEXT,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("commentID")
);

-- CreateTable
CREATE TABLE "Endorsement" (
    "endorsementID" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "Status" TEXT NOT NULL,
    "createdAt" DATE NOT NULL,
    "updatedAt" DATE NOT NULL,
    "userID" TEXT,
    "companyID" TEXT,

    CONSTRAINT "Endorsement_pkey" PRIMARY KEY ("endorsementID")
);

-- CreateTable
CREATE TABLE "Endorse" (
    "endorseID" TEXT NOT NULL,
    "endorseStatus" "endorseStatus" NOT NULL DEFAULT 'waiting',
    "userUserID" TEXT NOT NULL,
    "companyID" TEXT,
    "endorsementID" TEXT,

    CONSTRAINT "Endorse_pkey" PRIMARY KEY ("endorseID")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "feedbackID" TEXT NOT NULL,
    "feedback" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "endorseID" TEXT,
    "userID" TEXT,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("feedbackID")
);

-- CreateTable
CREATE TABLE "Interviewer" (
    "interviewerID" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "userID" TEXT NOT NULL,

    CONSTRAINT "Interviewer_pkey" PRIMARY KEY ("interviewerID")
);

-- CreateTable
CREATE TABLE "Applicant" (
    "applicantID" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" DATE NOT NULL,
    "updatedAt" DATE NOT NULL,
    "status" "applicantStatus" NOT NULL DEFAULT 'waiting',
    "jobPostID" TEXT NOT NULL,
    "interviewerID" TEXT,

    CONSTRAINT "Applicant_pkey" PRIMARY KEY ("applicantID")
);

-- CreateTable
CREATE TABLE "UploadFile" (
    "uploadFileID" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "video" TEXT NOT NULL,
    "createdAt" DATE NOT NULL,
    "applicantID" TEXT,

    CONSTRAINT "UploadFile_pkey" PRIMARY KEY ("uploadFileID")
);

-- CreateTable
CREATE TABLE "JobPost" (
    "jobPostID" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "qualification" TEXT NOT NULL,
    "responsibilities" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL,
    "createdAt" DATE NOT NULL,
    "updatedAt" DATE NOT NULL,
    "companyID" TEXT NOT NULL,
    "notificationID" TEXT,
    "userID" TEXT NOT NULL,

    CONSTRAINT "JobPost_pkey" PRIMARY KEY ("jobPostID")
);

-- CreateTable
CREATE TABLE "JobDetails" (
    "jobDetailsID" TEXT NOT NULL,
    "location" TEXT[],
    "jobType" TEXT[],
    "workType" TEXT[],
    "category" TEXT NOT NULL,
    "salary" TEXT NOT NULL,
    "jobPostID" TEXT,

    CONSTRAINT "JobDetails_pkey" PRIMARY KEY ("jobDetailsID")
);

-- CreateTable
CREATE TABLE "_LogsToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_endorsementID_key" ON "Profile"("endorsementID");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_applicantID_key" ON "Profile"("applicantID");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userID_key" ON "Profile"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "Address_profileID_key" ON "Address"("profileID");

-- CreateIndex
CREATE UNIQUE INDEX "Address_companyDetailsID_key" ON "Address"("companyDetailsID");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyDetails_companyID_key" ON "CompanyDetails"("companyID");

-- CreateIndex
CREATE UNIQUE INDEX "Comment_endorsementID_key" ON "Comment"("endorsementID");

-- CreateIndex
CREATE UNIQUE INDEX "Comment_userID_key" ON "Comment"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "Feedback_endorseID_key" ON "Feedback"("endorseID");

-- CreateIndex
CREATE UNIQUE INDEX "Feedback_userID_key" ON "Feedback"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "Applicant_interviewerID_key" ON "Applicant"("interviewerID");

-- CreateIndex
CREATE UNIQUE INDEX "UploadFile_applicantID_key" ON "UploadFile"("applicantID");

-- CreateIndex
CREATE UNIQUE INDEX "JobPost_notificationID_key" ON "JobPost"("notificationID");

-- CreateIndex
CREATE UNIQUE INDEX "JobDetails_jobPostID_key" ON "JobDetails"("jobPostID");

-- CreateIndex
CREATE UNIQUE INDEX "_LogsToUser_AB_unique" ON "_LogsToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_LogsToUser_B_index" ON "_LogsToUser"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyID_fkey" FOREIGN KEY ("companyID") REFERENCES "Company"("companyID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_applicantID_fkey" FOREIGN KEY ("applicantID") REFERENCES "Applicant"("applicantID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_endorsementID_fkey" FOREIGN KEY ("endorsementID") REFERENCES "Endorsement"("endorsementID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_companyDetailsID_fkey" FOREIGN KEY ("companyDetailsID") REFERENCES "CompanyDetails"("companyDetailsID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_profileID_fkey" FOREIGN KEY ("profileID") REFERENCES "Profile"("profileID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyDetails" ADD CONSTRAINT "CompanyDetails_companyID_fkey" FOREIGN KEY ("companyID") REFERENCES "Company"("companyID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_endorsementID_fkey" FOREIGN KEY ("endorsementID") REFERENCES "Endorsement"("endorsementID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Endorsement" ADD CONSTRAINT "Endorsement_companyID_fkey" FOREIGN KEY ("companyID") REFERENCES "Company"("companyID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Endorsement" ADD CONSTRAINT "Endorsement_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Endorse" ADD CONSTRAINT "Endorse_userUserID_fkey" FOREIGN KEY ("userUserID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Endorse" ADD CONSTRAINT "Endorse_companyID_fkey" FOREIGN KEY ("companyID") REFERENCES "Company"("companyID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Endorse" ADD CONSTRAINT "Endorse_endorsementID_fkey" FOREIGN KEY ("endorsementID") REFERENCES "Endorsement"("endorsementID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_endorseID_fkey" FOREIGN KEY ("endorseID") REFERENCES "Endorse"("endorseID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interviewer" ADD CONSTRAINT "Interviewer_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Applicant" ADD CONSTRAINT "Applicant_interviewerID_fkey" FOREIGN KEY ("interviewerID") REFERENCES "Interviewer"("interviewerID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Applicant" ADD CONSTRAINT "Applicant_jobPostID_fkey" FOREIGN KEY ("jobPostID") REFERENCES "JobPost"("jobPostID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UploadFile" ADD CONSTRAINT "UploadFile_applicantID_fkey" FOREIGN KEY ("applicantID") REFERENCES "Applicant"("applicantID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobPost" ADD CONSTRAINT "JobPost_companyID_fkey" FOREIGN KEY ("companyID") REFERENCES "Company"("companyID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobPost" ADD CONSTRAINT "JobPost_notificationID_fkey" FOREIGN KEY ("notificationID") REFERENCES "Notification"("notificationID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobPost" ADD CONSTRAINT "JobPost_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobDetails" ADD CONSTRAINT "JobDetails_jobPostID_fkey" FOREIGN KEY ("jobPostID") REFERENCES "JobPost"("jobPostID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LogsToUser" ADD CONSTRAINT "_LogsToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Logs"("logsID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LogsToUser" ADD CONSTRAINT "_LogsToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("userID") ON DELETE CASCADE ON UPDATE CASCADE;
