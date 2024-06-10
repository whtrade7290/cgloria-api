/*
  Warnings:

  - Made the column `title` on table `Sermon` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Sermon` MODIFY `title` VARCHAR(191) NOT NULL;
