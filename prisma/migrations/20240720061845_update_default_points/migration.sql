/*
  Warnings:

  - Made the column `withDiary` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `withDiary` INTEGER NOT NULL DEFAULT 10;
