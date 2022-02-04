/*
  Warnings:

  - Added the required column `type` to the `Comic` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comic" ADD COLUMN     "type" TEXT NOT NULL;
