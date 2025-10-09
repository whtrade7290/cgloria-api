/*
  Warnings:

  - Added the required column `extension` to the `columns` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileDate` to the `columns` table without a default value. This is not possible if the table is not empty.
  - Added the required column `filename` to the `columns` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `columns` ADD COLUMN `extension` VARCHAR(191) NOT NULL,
    ADD COLUMN `fileDate` VARCHAR(191) NOT NULL,
    ADD COLUMN `filename` VARCHAR(191) NOT NULL;
