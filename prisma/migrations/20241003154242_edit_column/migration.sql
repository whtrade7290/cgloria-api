/*
  Warnings:

  - You are about to drop the column `roonName` on the `withDiaryRoom` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `withDiaryRoom` DROP COLUMN `roonName`,
    ADD COLUMN `roomName` VARCHAR(191) NOT NULL DEFAULT '';
