/*
  Warnings:

  - Added the required column `content` to the `weekly_bible_verses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `weekly_bible_verses` ADD COLUMN `content` TEXT NOT NULL;
