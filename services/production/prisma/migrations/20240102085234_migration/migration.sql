/*
  Warnings:

  - You are about to drop the column `name` on the `form` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "form" DROP COLUMN "name",
ADD COLUMN     "title" VARCHAR;

-- CreateTable
CREATE TABLE "option" (
    "id" SERIAL NOT NULL,
    "label" VARCHAR NOT NULL,
    "value" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,

    CONSTRAINT "option_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "option" ADD CONSTRAINT "option_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
