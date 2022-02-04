/*
  Warnings:

  - You are about to drop the column `views_week` on the `Comic` table. All the data in the column will be lost.
  - Added the required column `thumb` to the `Comic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbWide` to the `Comic` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comic" DROP COLUMN "views_week",
ADD COLUMN     "thumb" TEXT NOT NULL,
ADD COLUMN     "thumbWide" TEXT NOT NULL,
ADD COLUMN     "viewsWeek" INTEGER NOT NULL DEFAULT 0;
