/*
  Warnings:

  - Made the column `content` on table `sermons` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `sermons` MODIFY `content` VARCHAR(191) NOT NULL;
