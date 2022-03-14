/*
  Warnings:

  - The values [TOP,BOTTOM,TOP_COMIC] on the enum `AdsPosition` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AdsPosition_new" AS ENUM ('CHAPTER_BOTTOM', 'CHAPTER_TOP', 'COMIC_RECOMENDATION', 'HOME_TOP_COMIC');
ALTER TABLE "Ads" ALTER COLUMN "position" DROP DEFAULT;
ALTER TABLE "Ads" ALTER COLUMN "position" TYPE "AdsPosition_new" USING ("position"::text::"AdsPosition_new");
ALTER TYPE "AdsPosition" RENAME TO "AdsPosition_old";
ALTER TYPE "AdsPosition_new" RENAME TO "AdsPosition";
DROP TYPE "AdsPosition_old";
COMMIT;

-- AlterTable
ALTER TABLE "Ads" ADD COLUMN     "image" TEXT,
ALTER COLUMN "position" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Chapter" ADD COLUMN     "batchs" TEXT;

-- AlterTable
ALTER TABLE "Comic" ADD COLUMN     "viewsDaily" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "viewsHourly" INTEGER NOT NULL DEFAULT 0;
