/*
  Warnings:

  - You are about to drop the column `cohort` on the `withDiaryRoom` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `withDiaryRoom` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `withDiaryRoom` DROP COLUMN `cohort`,
    DROP COLUMN `createdAt`,
    ADD COLUMN `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `roonName` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
