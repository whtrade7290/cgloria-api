/*
  Warnings:

  - You are about to drop the column `name` on the `withDiaryRoom` table. All the data in the column will be lost.
  - Added the required column `cohort` to the `withDiaryRoom` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `withDiaryRoom` DROP COLUMN `name`,
    ADD COLUMN `cohort` VARCHAR(191) NOT NULL;
