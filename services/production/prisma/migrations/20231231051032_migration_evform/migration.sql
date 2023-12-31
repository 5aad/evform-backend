/*
  Warnings:

  - You are about to drop the `adminuser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `form` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `question` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `response` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `userrole` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "adminuser" DROP CONSTRAINT "adminuser_userrole_fkey";

-- DropForeignKey
ALTER TABLE "form" DROP CONSTRAINT "form_adminuser_fkey";

-- DropForeignKey
ALTER TABLE "question" DROP CONSTRAINT "question_form_fkey";

-- DropForeignKey
ALTER TABLE "response" DROP CONSTRAINT "response_form_fkey";

-- DropForeignKey
ALTER TABLE "response" DROP CONSTRAINT "response_question_fkey";

-- DropTable
DROP TABLE "adminuser";

-- DropTable
DROP TABLE "form";

-- DropTable
DROP TABLE "question";

-- DropTable
DROP TABLE "response";

-- DropTable
DROP TABLE "userrole";

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR,
    "password" VARCHAR,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "role" VARCHAR,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
