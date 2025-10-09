/*
  Warnings:

  - Added the required column `contents` to the `sermons` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `sermons` ADD COLUMN `contents` VARCHAR(191) NOT NULL;
