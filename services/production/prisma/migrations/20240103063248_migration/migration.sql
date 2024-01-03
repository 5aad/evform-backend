/*
  Warnings:

  - Added the required column `question_type_id` to the `question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "question" ADD COLUMN     "question_type_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "question_type" (
    "id" SERIAL NOT NULL,
    "label" VARCHAR,

    CONSTRAINT "question_type_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "question_question_type_id_fkey" FOREIGN KEY ("question_type_id") REFERENCES "question_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;
