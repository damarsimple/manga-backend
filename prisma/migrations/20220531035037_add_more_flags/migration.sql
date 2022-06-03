-- AlterTable
ALTER TABLE "Chapter" ADD COLUMN     "missing" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "needOptimize" BOOLEAN NOT NULL DEFAULT false;
