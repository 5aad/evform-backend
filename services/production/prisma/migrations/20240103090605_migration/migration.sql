/*
  Warnings:

  - You are about to drop the column `value` on the `option` table. All the data in the column will be lost.
  - You are about to drop the `_response_to_option` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_response_to_option" DROP CONSTRAINT "_response_to_option_A_fkey";

-- DropForeignKey
ALTER TABLE "_response_to_option" DROP CONSTRAINT "_response_to_option_B_fkey";

-- AlterTable
ALTER TABLE "option" DROP COLUMN "value";

-- DropTable
DROP TABLE "_response_to_option";

-- CreateTable
CREATE TABLE "has_response_option" (
    "id" SERIAL NOT NULL,
    "option_id" INTEGER NOT NULL,
    "response_id" INTEGER NOT NULL,

    CONSTRAINT "has_response_option_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "has_response_option" ADD CONSTRAINT "has_response_option_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "option"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "has_response_option" ADD CONSTRAINT "has_response_option_response_id_fkey" FOREIGN KEY ("response_id") REFERENCES "response"("id") ON DELETE CASCADE ON UPDATE CASCADE;
