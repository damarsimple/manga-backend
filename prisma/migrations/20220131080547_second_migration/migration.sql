/*
  Warnings:

  - You are about to drop the column `genreId` on the `Comic` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Comic" DROP CONSTRAINT "Comic_genreId_fkey";

-- AlterTable
ALTER TABLE "Chapter" ALTER COLUMN "title" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Comic" DROP COLUMN "genreId";

-- CreateTable
CREATE TABLE "_ComicToGenre" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ComicToGenre_AB_unique" ON "_ComicToGenre"("A", "B");

-- CreateIndex
CREATE INDEX "_ComicToGenre_B_index" ON "_ComicToGenre"("B");

-- AddForeignKey
ALTER TABLE "_ComicToGenre" ADD FOREIGN KEY ("A") REFERENCES "Comic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ComicToGenre" ADD FOREIGN KEY ("B") REFERENCES "Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;
