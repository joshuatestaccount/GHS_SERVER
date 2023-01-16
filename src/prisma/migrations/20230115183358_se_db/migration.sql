/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Applicant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Applicant_id_key" ON "Applicant"("id");
