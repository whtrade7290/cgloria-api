/*
  Warnings:

  - You are about to alter the column `creator` on the `withDiaryRoom` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `withDiaryRoom` MODIFY `creator` INTEGER NOT NULL;
