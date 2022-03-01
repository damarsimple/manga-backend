-- AlterTable
ALTER TABLE "Chapter" ADD COLUMN     "batchs" TEXT;

-- AlterTable
ALTER TABLE "Comic" ADD COLUMN     "viewsDaily" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "viewsHourly" INTEGER NOT NULL DEFAULT 0;
