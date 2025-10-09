/*
  Warnings:

  - Made the column `content` on table `weekly_bible_verses` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `weekly_bible_verses` MODIFY `content` TEXT NOT NULL;
