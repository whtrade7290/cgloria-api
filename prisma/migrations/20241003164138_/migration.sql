/*
  Warnings:

  - Added the required column `creator_name` to the `withDiaryRoom` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `withDiaryRoom` ADD COLUMN `creator_name` VARCHAR(191) NOT NULL;
