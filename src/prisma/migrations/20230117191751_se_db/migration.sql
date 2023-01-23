-- CreateTable
CREATE TABLE "OTP" (
    "OTPID" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL,
    "expiredAt" TIMESTAMP NOT NULL,

    CONSTRAINT "OTP_pkey" PRIMARY KEY ("OTPID")
);
