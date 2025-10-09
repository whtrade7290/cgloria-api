/*
  Warnings:

  - The `withDiary` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `withDiary`,
    ADD COLUMN `withDiary` JSON NULL;
